"use server";
import { unstable_noStore as noStore } from "next/cache";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export async function getNews(coin?: string): Promise<NewsArticle[]> {
  noStore();
  if (!NEWS_API_KEY) {
    console.error("News API key is not configured.");
    return [];
  }

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.append("q", coin ? `${coin} cryptocurrency` : "cryptocurrency");
  url.searchParams.append("sortBy", "publishedAt");
  url.searchParams.append("language", "en");
  url.searchParams.append("apiKey", NEWS_API_KEY);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error("Failed to fetch news, status:", response.status);
      const errorBody = await response.json();
      console.error("Error details:", errorBody);
      return [];
    }
    const data: NewsAPIResponse = await response.json();
    return data.articles.slice(0, 5);
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
