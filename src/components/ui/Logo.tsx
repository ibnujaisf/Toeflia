import Image from "next/image";

export default function Logo({ className = "w-auto h-16" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Toeflia Logo"
      width={150}
      height={150}
      // dark:invert akan mengubah PNG hitam transparan menjadi putih di mode gelap!
      className={`dark:invert transition-all duration-300 ${className}`}
    />
  );
}
