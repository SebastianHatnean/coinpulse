import React from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

interface NewsProps {
  articles: NewsArticle[];
  coinName?: string;
}

const News: React.FC<NewsProps> = ({ articles, coinName }) => {
  if (articles.length === 0) {
    return (
      <div className="news-section">
        <h4 className="text-2xl font-bold">Latest News</h4>
        <p>No news available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="details">
      <h4 className="text-2xl font-bold">{"Latest Crypto News"}</h4>
      <ul className="details-grid">
        {articles.map((article, index) => (
          <li
            key={index}
            className="text-base bg-dark-500 px-5 py-6 rounded-lg flex flex-col gap-3"
          >
            <p className="label">{article.source.name}</p>
            <Link
              href={article.url}
              className="text-green-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="link flex items-center gap-1">
                <span>{article.title}</span>
                <ArrowUpRightIcon size={16} />
              </div>
            </Link>
            <p className="text-sm text-gray-400">
              {new Date(article.publishedAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;
