import { GoogleGenerativeAI } from "@google/generative-ai";
import * as Prompts from "@/lib/prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const aiService = {
  async evaluateTest(moduleId: string, score: number, totalQuestions: number, questions: any[]) {
    const wrongQuestions = questions.filter((q: any) => !q.isCorrect);
    
    let promptContent = "Here are the test results for the user:\n\n";
    promptContent += `Score: ${score} out of ${totalQuestions}\n\n`;
    
    if (wrongQuestions.length > 0) {
      promptContent += "The user answered the following questions INCORRECTLY:\n";
      wrongQuestions.forEach((q: any) => {
        promptContent += `\nQuestion ${q.id}: ${q.text}\n`;
        promptContent += `Options: ${JSON.stringify(q.options)}\n`;
        promptContent += `User's Answer (Index): ${q.userAnswer}\n`;
        promptContent += `Correct Answer (Index): ${q.correctAnswer}\n`;
      });
    } else {
      promptContent += "The user answered ALL questions correctly. Perfect score!\n";
    }

    promptContent += `\nPlease provide the evaluation based on the system instructions. Return the output STRICTLY as a JSON object matching the required structure. Do not include any markdown backticks like \`\`\`json.\n`;

    // Select the appropriate evaluator prompt
    let systemPrompt = Prompts.EVAL_STRUCTURE_PROMPT;
    if (moduleId === "listening") systemPrompt = Prompts.EVAL_LISTENING_PROMPT;
    if (moduleId === "reading") systemPrompt = Prompts.EVAL_READING_PROMPT;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent(promptContent);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  async generateQuestions(module: string) {
    const promptContent = `Tolong buatkan 10 soal untuk modul: "${module}". Ikuti aturan komposisi untuk modul ini secara ketat. Return HANYA JSON array.`;
    
    // Select the appropriate generator prompt
    let systemPrompt = Prompts.GENERATE_STRUCTURE_PROMPT;
    if (module === "listening") systemPrompt = Prompts.GENERATE_LISTENING_PROMPT;
    if (module === "reading") systemPrompt = Prompts.GENERATE_READING_PROMPT;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    
    const result = await model.generateContent(promptContent);
    const responseText = result.response.text();
    
    console.log("Gemini generateQuestions Response:", responseText);

    try {
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Failed to parse Gemini Questions JSON:", error);
      throw new Error("Invalid JSON format from AI");
    }
  },

  async chatWithTutor(message: string, contextData: string) {
    const systemPrompt = `Anda adalah Toeflia Tutor. Anda membantu user memahami kesalahan mereka pada tes TOEFL. Gunakan konteks data tes berikut untuk menjawab: ${contextData}. Berikan penjelasan yang mendukung, ramah, dan edukatif. Jika user bertanya tentang spesifik nomor pertanyaan, rujuk kembali pada konteks. Usahakan ringkas.`;
    
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: systemPrompt,
    });
    
    const result = await model.generateContent(message);
    return result.response.text();
  }
};
