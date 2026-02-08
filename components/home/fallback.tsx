import React from "react";
import DataTable from "@/components/DataTable";

const SKELETON_ROW_COUNT = 6;

type SkeletonRow = { id: number };

const skeletonData: SkeletonRow[] = Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => ({
  id: i,
}));

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image skeleton" />
        <div className="info">
          <div className="header-line-sm skeleton" />
          <div className="header-line-lg skeleton" />
        </div>
      </div>
      <div className="chart">
        <div className="chart-skeleton skeleton" />
      </div>
    </div>
  );
};

const trendingFallbackColumns: DataTableColumn<SkeletonRow>[] = [
  {
    header: "Name",
    cellClassName: "name-cell",
    cell: () => (
      <div className="name-link">
        <div className="name-image skeleton animate-pulse" />
        <div className="name-line skeleton rounded animate-pulse" />
      </div>
    ),
  },
  {
    header: "24h Change",
    cellClassName: "change-cell",
    cell: () => <div className="change-line skeleton rounded animate-pulse" />,
  },
  {
    header: "Price",
    cellClassName: "price-cell",
    cell: () => <div className="price-line skeleton rounded animate-pulse" />,
  },
];

const CATEGORIES_SKELETON_ROW_COUNT = 10;

const categoriesSkeletonData: SkeletonRow[] = Array.from(
  { length: CATEGORIES_SKELETON_ROW_COUNT },
  (_, i) => ({ id: i })
);

const categoriesFallbackColumns: DataTableColumn<SkeletonRow>[] = [
  {
    header: "Top Categories",
    cellClassName: "category-cell",
    cell: () => <div className="name-line skeleton rounded animate-pulse w-32" />,
  },
  {
    header: "Top Gainers",
    cellClassName: "top-gainers-cell",
    cell: () => (
      <div className="flex gap-1">
        <div className="w-7 h-7 rounded-full skeleton animate-pulse" />
        <div className="w-7 h-7 rounded-full skeleton animate-pulse" />
        <div className="w-7 h-7 rounded-full skeleton animate-pulse" />
      </div>
    ),
  },
  {
    header: "24h Change",
    cellClassName: "change-header-cell",
    cell: () => <div className="change-line skeleton rounded animate-pulse w-16" />,
  },
  {
    header: "Market Cap",
    cellClassName: "market-cap-cell",
    cell: () => <div className="price-line skeleton rounded animate-pulse w-20" />,
  },
  {
    header: "24h Volume",
    cellClassName: "volume-cell",
    cell: () => <div className="price-line skeleton rounded animate-pulse w-20" />,
  },
];

export function TrendingCoinsFallback() {
  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        data={skeletonData}
        columns={trendingFallbackColumns}
        rowKey={(row) => row.id}
        tableClassName="trending-coins-table"
        headerClassName="py-3!"
        bodyRowClassName="py-2!"
      />
    </div>
  );
}

export function CategoriesFallback() {
  return (
    <div id="categories" className="custom-scrollbar">
      <h4>Categories</h4>
      <DataTable
        data={categoriesSkeletonData}
        columns={categoriesFallbackColumns}
        rowKey={(row) => row.id}
        tableClassName="mt-3 categories-table"
        headerClassName="py-3!"
        bodyRowClassName="py-2!"
      />
    </div>
  );
}
