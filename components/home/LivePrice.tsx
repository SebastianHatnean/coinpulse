"use client"; // <--- This magic line enables Hooks

import { useCoinGeckoWebSocket } from "@/hooks/useCoinGeckoWebSocket";
import { formatCurrency } from "@/lib/utils";

const LivePrice = ({
  initialPrice,
  coinId,
  poolId,
}: {
  initialPrice: number;
  coinId: string;
  poolId: string;
}) => {
  // 1. EXECUTE THE HOOK HERE
  const { price, isConnected } = useCoinGeckoWebSocket({
    coinId: coinId,
    poolId: poolId,
  });

  // 2. Decide what to show
  // If we have a live WebSocket price, use it. Otherwise, use the initial server price.
  const currentPrice = price?.price ?? initialPrice;

  return (
    <div className="flex flex-col">
      <h1>{formatCurrency(currentPrice)}</h1>

      {/* Visual Debugger - Delete this later */}
      <span className={`text-xs ${isConnected ? "text-green-500" : "text-gray-500"}`}>
        {isConnected ? "● Live via Binance" : "○ Static Data"}
      </span>
    </div>
  );
};

export default LivePrice;
