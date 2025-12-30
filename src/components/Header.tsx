'use client';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 text-white border-b border-gray-800">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-yellow-500">My Ecosystem</h1>
        
        {/* Menu điều hướng */}
        <nav className="flex gap-4">
          <Link 
            href="/" 
            className={`hover:text-yellow-400 ${pathname === '/' ? 'text-yellow-400 font-bold' : ''}`}
          >
            ICO Presale
          </Link>
          <Link 
            href="/marketplace" 
            className={`hover:text-yellow-400 ${pathname === '/marketplace' ? 'text-yellow-400 font-bold' : ''}`}
          >
            NFT Market
          </Link>
        </nav>
      </div>

      <ConnectButton />
    </header>
  );
}