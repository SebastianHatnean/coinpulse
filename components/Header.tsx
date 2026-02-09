"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SearchModal } from "./SearchModal";

const Header = ({ trendingCoins }: { trendingCoins: any[] }) => {
  const pathname = usePathname();
  return (
    <header>
      <div className="main-container inner">
        <Link href="/">
          <Image src="/logo.svg" alt="CoinPulse Logo" width={132} height={40} />
        </Link>

        <nav>
          <Link
            href="/"
            className={cn("nav-link", { "is-active": pathname === "/", "is-home": true })}
          >
            <p>Home</p>
          </Link>
          <SearchModal initialTrendingCoins={trendingCoins} />
          <Link href="/coins" className={cn("nav-link", { "is-active": pathname === "/coins" })}>
            <p>All coins</p>
          </Link>
        </nav>
      </div>
    </header>
  );
};
export default Header;
