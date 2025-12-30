'use client';
import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { parseEther, type Address } from 'viem'; 
import { MARKETPLACE_ADDRESS, MARKETPLACE_ABI, HERO_ADDRESS, HERO_ABI } from '@/src/constants';
import NFTCard from '@/src/components/NFTCard';

// Menu Cửa hàng (Chỉ cần Hero Type và Giá)
const STORE_ITEMS = Array.from({ length: 8 }, (_, i) => ({
  heroType: i + 1,
  price: "10"
}));

interface ListedItem {
    author: Address;
    price: bigint;
    tokenId: bigint;
}

export default function MarketplacePage() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'store' | 'market' | 'inventory'>('store');

  const { data: listedNfts } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getListedNft',
    query: { refetchInterval: 3000 }
  });

  const { data: myNftIds } = useReadContract({
    address: HERO_ADDRESS,
    abi: HERO_ABI,
    functionName: 'listTokenIds',
    args: address ? [address] : undefined,
    query: { 
        enabled: !!address && activeTab === 'inventory',
        refetchInterval: 3000,
    }
  });

  const marketItems = (listedNfts as unknown as ListedItem[]) || [];
  const inventoryItems = (myNftIds as unknown as bigint[]) || [];

  return (
    <div className="container mx-auto p-8 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500 uppercase tracking-widest">
        NFT Marketplace
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => setActiveTab('store')} className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'store' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Tạo sản phẩm</button>
        <button onClick={() => setActiveTab('market')} className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'market' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Chợ Mua Bán</button>
        <button onClick={() => setActiveTab('inventory')} className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'inventory' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Túi đồ</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* TAB CỬA HÀNG */}
        {activeTab === 'store' && (
          STORE_ITEMS.map((item) => (
            <NFTCard
              key={`store_${item.heroType}`}
              heroType={BigInt(item.heroType)}
              price={parseEther(item.price)}
              isStoreItem={true}
              isOwner={false}
            />
          ))
        )}

        {/* TAB CHỢ */}
        {activeTab === 'market' && (
            marketItems.length > 0 ? (
                marketItems.map((item) => (
                    <NFTCard
                        key={`market_${item.tokenId}`}
                        tokenId={item.tokenId}
                        price={item.price}
                        seller={item.author}
                        isOwner={false}
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-20 text-gray-500 italic">Chưa có ai đăng bán NFT nào.</div>
            )
        )}

        {/* TAB TÚI ĐỒ */}
        {activeTab === 'inventory' && (
            !address ? (
                <div className="col-span-full text-center py-20 text-yellow-500">Vui lòng kết nối ví.</div>
            ) : inventoryItems.length > 0 ? (
                inventoryItems.map((id) => (
                    <NFTCard
                        key={`inv_${id}`}
                        tokenId={id}
                        isOwner={true}
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-20 text-gray-500 italic">Túi đồ trống.</div>
            )
        )}
      </div>
    </div>
  );
}