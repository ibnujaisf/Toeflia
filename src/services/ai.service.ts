import { GoogleGenerativeAI } from "@google/generative-ai";
import { TOEFLIA_SYSTEM_PROMPT, TOEFLIA_GENERATOR_PROMPT } from "@/lib/prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const aiService = {
  async evaluateTest(moduleTitle: string, score: number, totalQuestions: number, questions: any[]) {
    const wrongQuestions = questions.filter((q: any) => !q.isCorrect);
    
    let promptContent = "Here are the test results for the user:\n\n";
    promptContent += `Module: ${moduleTitle}\n`;
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

    promptContent += `\nPlease provide the evaluation based on the system instructions. Return the output STRICTLY as a JSON object matching this structure: { "aiSummary": "...", "tips": ["...", "..."], "explanations": [{ "questionNumber": 1, "explanation": "..." }] }. Do not include any markdown backticks like \`\`\`json.\n`;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: TOEFLIA_SYSTEM_PROMPT,
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
    
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: TOEFLIA_GENERATOR_PROMPT,
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
