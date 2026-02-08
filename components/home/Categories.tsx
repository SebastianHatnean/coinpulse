import { fetcher } from "@/lib/quingecko.actions";
import React from "react";
import DataTable from "../DataTable";
import Image from "next/image";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown } from "lucide-react";
import { TrendingUp } from "lucide-react";

const Categories = async () => {
  const categories = await fetcher<Category[]>("/coins/categories");

  const columns: DataTableColumn<Category>[] = [
    {
      header: "Top Categories",
      cellClassName: "category-cell",
      cell: (category) => category.name,
    },
    {
      header: "Top Gainers",
      cellClassName: "top-gainers-cell",
      cell: (category) =>
        category.top_3_coins.map((coin) => (
          <Image src={coin} alt={coin} key={coin} width={28} height={28} className="rounded-full" />
        )),
    },
    {
      header: "24h Change",
      cellClassName: "change-header-cell",
      cell: (category) => {
        const item = category.market_cap_change_24h;
        const isTrendingUp = item > 0;
        return (
          <div className={cn("change-cell", isTrendingUp ? "text-green-500" : "text-red-500")}>
            <p className="flex items-center gap-1">
              {formatPercentage(item)}
              {isTrendingUp ? (
                <TrendingUp width={16} height={16} />
              ) : (
                <TrendingDown width={16} height={16} />
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: "Market Cap",
      cellClassName: "market-cap-cell",
      cell: (category) => formatCurrency(category.market_cap),
    },
    {
      header: "24h Volume",
      cellClassName: "volume-cell",
      cell: (category) => formatCurrency(category.volume_24h),
    },
  ];
  return (
    <div id="categories" className="custom-scrollbar">
      <h4>Categories</h4>
      <DataTable
        data={categories?.slice(0, 10)}
        columns={columns}
        rowKey={(_, index) => index}
        tableClassName="mt-3 categories-table"
        headerClassName="py-3!"
        bodyRowClassName="py-2!"
      />
    </div>
  );
};

export default Categories;
