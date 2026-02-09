"use server";
import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error("Could not find a base URL");
if (!API_KEY) throw new Error("Could not find a api KEY");

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipNull: true, skipEmptyString: true }
  );

  const response = await fetch(url, {
    headers: {
      "x-cg-demo-api-key": API_KEY,
      "Content-Type": "application/json",
    } as Record<string, string>,
    next: {
      revalidate,
    },
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText} `);
  }

  return response.json();
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null
): Promise<PoolData> {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: "",
  };

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`
      );
      return poolData.data?.[0] ?? fallback;
    } catch (error) {
      console.error("Error fetching pool data:", error);
      return fallback;
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>("/onchain/search/pools", { query: id });

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  // Step 1: Fetch the list of matching coins from the Search API
  const searchData = await fetcher<{ coins: any[] }>("/search", { query });

  // Extract the IDs of the top 10 results
  const topCoins = searchData.coins.slice(0, 10);

  if (topCoins.length === 0) return [];

  const ids = topCoins.map((coin) => coin.id).join(",");

  // Step 2: Fetch the market data (price, change) for those specific IDs
  const marketData = await fetcher<any[]>("/coins/markets", {
    vs_currency: "usd",
    ids: ids,
  });

  // Create a map for faster lookup (O(1)) instead of looping repeatedly
  const marketDataMap = new Map(marketData.map((coin) => [coin.id, coin]));

  // Step 3: Merge the two datasets
  return topCoins.map((coin) => {
    const market = marketDataMap.get(coin.id);

    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      thumb: coin.thumb,
      // We manually construct the 'data' object to match what the SearchItem component expects
      data: {
        price_change_percentage_24h: market?.price_change_percentage_24h ?? 0,
      },
    } as unknown as SearchCoin;
  });
}
