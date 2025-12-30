'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther, formatEther, type Address } from 'viem';
import { 
  HERO_ADDRESS, HERO_ABI, 
  MARKETPLACE_ADDRESS, MARKETPLACE_ABI,
  FLP_ADDRESS, FLP_ABI    
} from '@/src/constants';

interface NFTCardProps {
  tokenId?: bigint;      
  heroType?: bigint;     
  price?: bigint;        
  seller?: Address;      
  isOwner: boolean;
  isStoreItem?: boolean;
}

export default function NFTCard({ tokenId, heroType, price, seller, isOwner, isStoreItem }: NFTCardProps) {
  const { address: userAddress } = useAccount();
  const [metadata, setMetadata] = useState<{ name?: string; image?: string } | null>(null);
  const [listPrice, setListPrice] = useState('');

  const { writeContract, data: hash, error: writeError } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const getSafeImageUrl = (url?: string) => {
    if (!url) return "";
    return url.replace("http://localhost:3000", "").replace("/public", "");
  };

  // 1. Lấy dữ liệu quyền hạn
  const { data: isApproved } = useReadContract({
    address: HERO_ADDRESS,
    abi: HERO_ABI,
    functionName: 'isApprovedForAll',
    args: userAddress ? [userAddress, MARKETPLACE_ADDRESS] : undefined,
    query: { enabled: !!userAddress && isOwner && price === undefined && !isStoreItem }
  });

  const { data: allowance } = useReadContract({
    address: FLP_ADDRESS,
    abi: FLP_ABI,
    functionName: 'allowance',
    args: userAddress ? [userAddress, MARKETPLACE_ADDRESS] : undefined,
    query: { enabled: !!userAddress && price !== undefined && !isStoreItem, refetchInterval: 2000 }
  });

  const isAllowanceSufficient = allowance !== undefined && price !== undefined && allowance >= price;

  //LOGIC FETCH METADATA
useEffect(() => {
  let fetchUrl = ''
  const identifier = isStoreItem ? heroType : tokenId;

  if (identifier !== undefined) {
    fetchUrl = `/metadata/type_${identifier.toString()}.json`;
    
    console.log(`Đang tải dữ liệu từ: ${fetchUrl}`);

    fetch(fetchUrl)
      .then(res => {
        if (!res.ok) throw new Error(`Không thấy file: ${fetchUrl}`);
        return res.json();
      })
      .then(data => setMetadata(data))
      .catch(err => {
        console.error("Lỗi fetch Metadata:", err.message);
        // Fallback hiển thị để không bị Loading mãi
        setMetadata({ 
          name: isStoreItem ? "Hero Mẫu" : `Hero #${tokenId}`, 
          image: undefined 
        });
      });
  }
}, [isStoreItem, heroType, tokenId]); 

  // --- 3. ACTIONS ---
  const handleMint = () => {
    if (heroType === undefined || !userAddress) return;
    writeContract({ address: HERO_ADDRESS, abi: HERO_ABI, functionName: 'mint', args: [userAddress, heroType] });
  };

  const handleApproveToken = () => {
    if (price === undefined) return;
    writeContract({ address: FLP_ADDRESS, abi: FLP_ABI, functionName: 'approve', args: [MARKETPLACE_ADDRESS, price] });
  };

  const handleBuy = () => {
    if (price === undefined || tokenId === undefined) return;
    writeContract({ address: MARKETPLACE_ADDRESS, abi: MARKETPLACE_ABI, functionName: 'buyNft', args: [tokenId, price] });
  };

  const handleList = () => {
    if (!listPrice || tokenId === undefined) return alert("Vui lòng nhập giá!");
    writeContract({ address: MARKETPLACE_ADDRESS, abi: MARKETPLACE_ABI, functionName: 'listNft', args: [tokenId, parseEther(listPrice)] });
  };

  const handleUnlist = () => {
    if (tokenId === undefined) return;
    writeContract({ address: MARKETPLACE_ADDRESS, abi: MARKETPLACE_ABI, functionName: 'unlistNft', args: [tokenId] });
  };

  const handleApproveNFT = () => {
    writeContract({ address: HERO_ADDRESS, abi: HERO_ABI, functionName: 'setApprovalForAll', args: [MARKETPLACE_ADDRESS as Address, true] });
  };

  const isSeller = seller && userAddress && seller.toLowerCase() === userAddress.toLowerCase();

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:shadow-2xl hover:border-blue-500 transition-all duration-300 flex flex-col">
      <div className="h-48 overflow-hidden bg-gray-800 relative group w-full">
        {metadata?.image ? (
          <Image 
            src={getSafeImageUrl(metadata.image)} 
            alt="NFT Image" fill sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-800 p-4 text-center">
             <span className="text-2xl mb-2">🖼️</span>
             <span className="text-xs text-gray-400 font-mono">ID: {tokenId?.toString() || heroType?.toString()}</span>
          </div>
        )}
        
        {!isStoreItem && tokenId !== undefined && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm border border-gray-600 z-10">
            #{tokenId.toString()}
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white truncate mb-1">
            {metadata?.name || (isStoreItem ? `Hero Type ${heroType}` : `Hero #${tokenId}`)}
          </h3>
          {price !== undefined && (
            <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg mt-2">
                <span className="text-gray-400 text-xs uppercase font-bold">Price</span>
                <span className="text-yellow-400 font-bold">{formatEther(price)} FLP</span>
            </div>
          )}
        </div>

        {writeError && (
          <div className="mt-2 text-red-400 text-xs bg-red-900/20 p-2 rounded break-words border border-red-900">
            {writeError.message.split('\n')[0]}
          </div>
        )}

        <div className="mt-4">
          {isStoreItem ? (
            <button onClick={handleMint} disabled={isConfirming} className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-2 rounded-lg disabled:opacity-50">
              {isConfirming ? 'Minting...' : 'Mint'}
            </button>
          ) : price !== undefined ? (
            isSeller ? (
              <button onClick={handleUnlist} disabled={isConfirming} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg disabled:opacity-50">
                {isConfirming ? 'Unlisting...' : 'Hủy Bán'}
              </button>
            ) : (
              !isAllowanceSufficient ? (
                <button onClick={handleApproveToken} disabled={isConfirming} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg disabled:opacity-50">
                    {isConfirming ? 'Approving...' : `Approve FLP`}
                </button>
              ) : (
                <button onClick={handleBuy} disabled={isConfirming} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg disabled:opacity-50">
                    {isConfirming ? 'Buying...' : 'Mua Ngay'}
                </button>
              )
            )
          ) : (
            isOwner && (
              isApproved ? (
                <div className="flex gap-2">
                  <input type="number" step="1" placeholder="Giá FLP" className="w-1/2 px-3 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm" onChange={(e) => setListPrice(e.target.value)} />
                  <button onClick={handleList} disabled={isConfirming} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 rounded-lg text-sm">
                    {isConfirming ? '...' : 'Đăng Bán'}
                  </button>
                </div>
              ) : (
                <button onClick={handleApproveNFT} disabled={isConfirming} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg disabled:opacity-50">
                  {isConfirming ? 'Approving...' : 'Cấp Quyền Bán'}
                </button>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}