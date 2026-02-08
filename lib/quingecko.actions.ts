'use server';
 import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;
 
if (!BASE_URL) throw new Error('Could not find a base URL');
if (!API_KEY) throw new Error('Could not find a api KEY');
 
export async function fetcher<T>(
    endpoint: string,
    params?: QueryParams,
    revalidate = 60,
): Promise<T> {
    const url = qs.stringifyUrl({
        url: `${BASE_URL}/${endpoint}`,
        query: params,
    }, { skipNull: true, skipEmptyString: true });

    const response = await fetch(url, {
        headers: {
            'x-cg-demo-api-key': API_KEY,
            'Content-Type': 'application/json',
        } as Record<string, string>,
        next: {
            revalidate,
        },
    });

    if (!response.ok) {
        const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({ error: 'Failed to fetch data' }));
        throw new Error(`API ERROR: ${response.status} ${response.statusText} - ${errorBody.error}`);
    }

    return response.json() as Promise<T>;
}

