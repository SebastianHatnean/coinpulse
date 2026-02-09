"use client";

import { Separator } from "@/components/ui/separator";
import CandleStickChart from "./CandleStickChart";
import { useCoinGeckoWebSocket } from "@/hooks/useCoinGeckoWebSocket";
import DataTable from "@/components/DataTable";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { useState, useEffect } from "react";
import CoinHeader from "@/components/CoinHeader";

const LiveDataWrapper = ({ children, coinId, poolId, coin, coinOHLCData }: LiveDataProps) => {
  const [liveInterval, setLiveInterval] = useState<"1s" | "1m">("1s");
  const [hasMounted, setHasMounted] = useState(false);
  const { trades, ohlcv, price } = useCoinGeckoWebSocket({ coinId, poolId, liveInterval });

  useEffect(() => setHasMounted(true), []);

  // Use server price until after hydration so server and client first paint match
  const displayPrice = hasMounted ? (price?.usd ?? coin.market_data.current_price.usd) : coin.market_data.current_price.usd;
  const displayChange24h = hasMounted
    ? (price?.change24h ?? coin.market_data.price_change_percentage_24h_in_currency.usd)
    : coin.market_data.price_change_percentage_24h_in_currency.usd;

  const tradeColumns: DataTableColumn<Trade>[] = [
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (trade) => (trade.price ? formatCurrency(trade.price) : "-"),
    },
    {
      header: "Amount",
      cellClassName: "amount-cell",
      cell: (trade) => trade.amount?.toFixed(4) ?? "-",
    },
    {
      header: "Value",
      cellClassName: "value-cell",
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : "-"),
    },
    {
      header: "Buy/Sell",
      cellClassName: "type-cell",
      cell: (trade) => (
        <span className={trade.type === "buy" ? "text-green-500" : "text-red-500"}>
          {trade.type === "buy" ? "Buy" : "Sell"}
        </span>
      ),
    },
    {
      header: "Time",
      cellClassName: "time-cell",
      cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : "-"),
    },
  ];

  return (
    <section id="live-data-wrapper">
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={displayPrice}
        livePriceChangePercentage24h={displayChange24h}
        priceChangePercentage30d={coin.market_data.price_change_percentage_30d_in_currency.usd}
        priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
      />
      <Separator className="divider" />

      <div className="trend">
        <CandleStickChart
          coinId={coinId}
          data={coinOHLCData}
          liveOhlcv={ohlcv}
          mode="live"
          initialPeriod="daily"
          liveInterval={liveInterval}
          setLiveInterval={setLiveInterval}
        >
          <h4>Trend Overview</h4>
        </CandleStickChart>
      </div>

      <Separator className="divider" />

      {tradeColumns && (
        <div className="trades">
          <h4>Recent Trades</h4>

          <DataTable
            columns={tradeColumns}
            data={trades}
            rowKey={(_, index) => index}
            tableClassName="trades-table"
          />
        </div>
      )}
    </section>
  );
};

export default LiveDataWrapper;
