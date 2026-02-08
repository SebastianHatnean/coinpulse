import Converter from "@/components/Converter";
import LiveDataWrapper from "@/components/LiveDataWrapper";
import { fetcher, getPools } from "@/lib/quingecko.actions";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = async ({ params }: NextPageProps) => {
  const { id } = await params;
  const [coinData, coinOHLCData] = await Promise.all([
    fetcher<CoinDetailsData>(`/coins/${id}`, {
      dex_pair_format: "contract_address",
    }),
    fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
      vs_currency: "usd",
      days: 1,
      precision: "full",
    }),
  ]);
  const platform = coinData.asset_platform_id
    ? coinData.detail_platforms?.[coinData.asset_platform_id]
    : null;
  const network = platform?.geckoterminal_url.split("/")[3] || null;
  const contractAddress = platform?.contract_address || null;
  const pool = await getPools(id, network, contractAddress);
  const coinDetails = [
    {
      label: "Market Cap",
      value: formatCurrency(coinData.market_data.market_cap.usd),
    },
    {
      label: "Market Cap Rank",
      value: `#${coinData.market_cap_rank}`,
    },
    {
      label: "Total Volume",
      value: formatCurrency(coinData.market_data.total_volume.usd),
    },
    {
      label: "Website",
      value: "-",
      link: coinData.links.homepage[0],
      linkText: "Visit Website",
    },
    {
      label: "Explorer",
      value: "-",
      link: coinData.links.blockchain_site[0],
      linkText: "Visit Explorer",
    },
    {
      label: "Community",
      value: "-",
      link: coinData.links.subreddit_url,
      linkText: "Visit Community",
    },
  ];

  return (
    <main id="coin-details-page">
      <section className="primary">
        <LiveDataWrapper coinId={id} poolId={pool.id} coin={coinData} coinOHLCData={coinOHLCData}>
          <h4>Exchange Listings</h4>
        </LiveDataWrapper>
      </section>

      <section className="secondary">
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image.small}
          priceList={coinData.market_data.current_price}
        />
        <div className="details">
          <h4 className="text-2xl font-bold">Coin Details</h4>
          <ul className="details-grid">
            {coinDetails.map(({ label, value, link = null, linkText = null }, index) => (
              <li
                key={index}
                className="text-base bg-dark-500 px-5 py-6 rounded-lg flex flex-col gap-3"
              >
                <p className="label">{label}</p>

                {link ? (
                  <div className="link flex items-center gap-1">
                    <Link
                      href={link}
                      className="text-green-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {linkText || label}
                    </Link>
                    <ArrowUpRightIcon size={16} />
                  </div>
                ) : (
                  <p className="text-base font-medium">{value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
        <p> Top Gainers & Losers</p>
      </section>
    </main>
  );
};

export default page;
