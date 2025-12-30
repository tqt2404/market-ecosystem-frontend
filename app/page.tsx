import Image from "next/image";
import Dashboard from "@/src/components/Dashboard";
import BuySection from "@/src/components/BuySection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-950 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-10 flex-col">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4 text-center">
          FLP Token Sale
        </h1>
        <p className="text-gray-400 text-center text-lg">
          Sở hữu FLP Token ngay hôm nay với giá ưu đãi
        </p>
      </div>

      {/* Khu vực chính: Dashboard & Mua bán */}
      <div className="flex flex-col gap-8 items-center w-full max-w-2xl">
        <Dashboard />
        <BuySection />
      </div>

      {/* Footer nhỏ */}
      <div className="mt-20 text-gray-500 text-sm">
        <p>Powered by Next.js 15 & Wagmi</p>
      </div>
    </main>
  );
}