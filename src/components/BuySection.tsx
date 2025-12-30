'use client';
import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { ICO_ADDRESS, USDT_ADDRESS, ICO_ABI, USDT_ABI } from '@/src/constants';

export default function BuySection() {
  const { isConnected } = useAccount();
  const ETH_RATE = 1000; 
  const USDT_RATE = 100; 

  const [usdtAmount, setUsdtAmount] = useState(''); 
  const [ethAmount, setEthAmount] = useState('');
  
  const [showToast, setShowToast] = useState(false);
  const [txHash, setTxHash] = useState<string>(''); 

  // MUA ETH 
  const { 
    data: hashBuyETH, 
    writeContract: writeBuyETH, 
    isPending: isSigningETH 
  } = useWriteContract();

  const { 
    isLoading: isConfirmingETH, 
    isSuccess: isBuyETHSuccess 
  } = useWaitForTransactionReceipt({ hash: hashBuyETH });

  // APPROVE USDT
  const { 
    data: hashApprove, 
    writeContract: writeApprove, 
    isPending: isSigningApprove 
  } = useWriteContract();
  
  const { 
    isLoading: isConfirmingApprove, 
    isSuccess: isApproved 
  } = useWaitForTransactionReceipt({ hash: hashApprove });

  // MUA USDT
  const { 
    data: hashBuyUSDT, 
    writeContract: writeBuyUSDT, 
    isPending: isSigningBuyUSDT 
  } = useWriteContract();

  const { 
    isLoading: isConfirmingBuyUSDT, 
    isSuccess: isBuyUSDTSuccess 
  } = useWaitForTransactionReceipt({ hash: hashBuyUSDT });

  const isGlobalBusy = 
    isSigningETH || isConfirmingETH || 
    isSigningApprove || isConfirmingApprove || 
    isSigningBuyUSDT || isConfirmingBuyUSDT

  useEffect(() => {
    if (isBuyETHSuccess || isBuyUSDTSuccess) {
      const timer = setTimeout(() => {
        setTxHash(hashBuyETH || hashBuyUSDT || '');
        setShowToast(true);
        setEthAmount('');
        setUsdtAmount('');
      }, 0);

      const hideTimer = setTimeout(() => {
        setShowToast(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [isBuyETHSuccess, isBuyUSDTSuccess, hashBuyETH, hashBuyUSDT]);

  const handleBuyETH = () => {
    if (!ethAmount) return;
    writeBuyETH({
      address: ICO_ADDRESS as `0x${string}`,
      abi: ICO_ABI,
      functionName: 'buyTokenByETH',
      value: parseEther(ethAmount), 
    });
  };

  const handleApproveUSDT = () => {
    if (!usdtAmount) return;
    writeApprove({
      address: USDT_ADDRESS as `0x${string}`,
      abi: USDT_ABI, 
      functionName: 'approve',
      args: [ICO_ADDRESS as `0x${string}`, parseEther(usdtAmount)],
    });
  };

  const handleBuyUSDT = () => {
    if (!usdtAmount) return;
    writeBuyUSDT({
      address: ICO_ADDRESS as `0x${string}`,
      abi: ICO_ABI,
      functionName: 'buyTokenByUSDT',
      args: [parseEther(usdtAmount)], 
    });
  };

  if (!isConnected) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl relative">
        
        <div className={`bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col gap-4 transition-opacity ${isGlobalBusy && !isSigningETH && !isConfirmingETH ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex justify-between items-center">
              <h3 className="text-orange-500 font-bold text-xl">Buy with ETH</h3>
              <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded">Rate: 1 ETH = {ETH_RATE} FLP</span>
          </div>
          <input 
              type="number" placeholder="Ex: 0.1" value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              disabled={isGlobalBusy}
              className="bg-slate-800 text-white p-4 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 border border-slate-600 font-mono text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="bg-black/30 p-4 rounded-lg text-center border border-dashed border-gray-600">
              <span className="text-gray-400 text-sm">You receive:</span>
              <div className="text-3xl font-bold text-white mt-1">
                  {ethAmount ? (Number(ethAmount) * ETH_RATE).toLocaleString() : '0'} <span className="text-orange-500 text-lg">FLP</span>
              </div>
          </div>
          
          <button 
            // KHÓA NÚT NẾU CHƯA NHẬP SỐ
            disabled={isGlobalBusy || !ethAmount}
            onClick={handleBuyETH}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
          >
            {isSigningETH ? 'Check Wallet...' : isConfirmingETH ? 'Processing...' : 'BUY NOW'}
          </button>
        </div>

        {/*CỘT USDT*/}
        <div className={`bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col gap-4 transition-opacity ${isGlobalBusy && !isSigningApprove && !isConfirmingApprove && !isSigningBuyUSDT && !isConfirmingBuyUSDT ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex justify-between items-center">
              <h3 className="text-blue-500 font-bold text-xl">Buy with USDT</h3>
              <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">Rate: 1 USDT = {USDT_RATE} FLP</span>
          </div>
          <input 
              type="number" placeholder="Ex: 100" value={usdtAmount}
              onChange={(e) => setUsdtAmount(e.target.value)}
              // KHÓA INPUT NẾU ĐANG BẬN
              disabled={isGlobalBusy}
              className="bg-slate-800 text-white p-4 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600 font-mono text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="bg-black/30 p-4 rounded-lg text-center border border-dashed border-gray-600">
              <span className="text-gray-400 text-sm">You receive:</span>
              <div className="text-3xl font-bold text-white mt-1">
                  {usdtAmount ? (Number(usdtAmount) * USDT_RATE).toLocaleString() : '0'} <span className="text-blue-500 text-lg">FLP</span>
              </div>
          </div>

          {!isApproved ? (
              <button 
                  // KHÓA NÚT NẾU ĐANG BẬN
                  disabled={isGlobalBusy || !usdtAmount}
                  onClick={handleApproveUSDT}
                  className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isSigningApprove ? 'Check Wallet...' : isConfirmingApprove ? 'Approving...' : 'Approve USDT'}
              </button>
          ) : (
              <button 
                  // KHÓA NÚT NẾU ĐANG BẬN
                  disabled={isGlobalBusy}
                  onClick={handleBuyUSDT}
                  className="bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isSigningBuyUSDT ? 'Check Wallet...' : isConfirmingBuyUSDT ? 'Buying...' : 'CONFIRM BUY'}
              </button>
          )}
        </div>
      </div>

      {/*TOAST*/}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 animate-[slideIn_0.5s_ease-out]">
          <div className="bg-slate-800 border-l-4 border-green-500 text-white p-4 rounded shadow-2xl flex items-start gap-3 min-w-[300px]">
            <div className="text-green-400 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm uppercase tracking-wide">Transaction Successful</h4>
              <p className="text-xs text-gray-400 mt-1">You have successfully purchased FLP Token.</p>
              <a 
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-xs mt-2 inline-block hover:underline flex items-center gap-1"
              >
                View on Etherscan
              </a>
            </div>
            <button onClick={() => setShowToast(false)} className="text-gray-500 hover:text-white">✕</button>
          </div>
        </div>
      )}
    </>
  );
}