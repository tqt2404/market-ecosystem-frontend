'use client';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { USDT_ADDRESS, FLP_ADDRESS } from '@/src/constants'; 

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  
  const ethBalance = useBalance({ address });
  const usdtBalance = useBalance({
    address,
    token: USDT_ADDRESS as `0x${string}`,
  });
  const flpBalance = useBalance({
    address,
    token: FLP_ADDRESS as `0x${string}`,
  });

  return (
    <div className="w-full max-w-2xl p-6 bg-slate-900 rounded-xl shadow-lg mb-6 border border-slate-700">
      <div className="flex justify-center mb-6">
        <ConnectButton />
      </div>
      
      {isConnected && (
        <div className="space-y-4 text-sm">
          <div className="bg-slate-800 p-3 rounded-lg flex justify-between items-center">
             <span className="text-gray-400">Wallet:</span>
             <span className="text-yellow-400 font-mono">{address?.slice(0,6)}...{address?.slice(-4)}</span>
          </div>

          {/* Hàng hiển thị 3 loại tài sản */}
          <div className="grid grid-cols-3 gap-4 text-center">
             <div className="bg-slate-800 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">ETH</p>
                <p className="font-bold text-white text-lg">{Number(ethBalance.data?.formatted).toFixed(4)}</p>
             </div>
             <div className="bg-slate-800 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">USDT</p>
                <p className="font-bold text-blue-400 text-lg">{Number(usdtBalance.data?.formatted).toFixed(2)}</p>
             </div>
             {/* Ô hiển thị FLP Token mới */}
             <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg shadow-inner">
                <p className="text-gray-100 text-xs">FLP Owned</p>
                <p className="font-bold text-white text-lg">{Number(flpBalance.data?.formatted).toFixed(0)}</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}