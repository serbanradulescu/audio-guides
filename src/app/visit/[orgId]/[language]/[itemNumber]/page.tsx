"use client";

import { visitExhibitItemById } from "@/lib/exhibitItems";
import { use } from "react";
import useSWR from "swr";

export default function ItemPage({
  params: rawParams,
}: {
  params: Promise<{ orgId: string; language: string; itemNumber: string }>;
}) {
  const { orgId, language, itemNumber } = use(rawParams);
  const { data: item, isLoading } = useSWR(
    ["exhibitItem", orgId, itemNumber],
    () => visitExhibitItemById(itemNumber, orgId, language)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* ✅ QR Code */}

      <h1 className="text-2xl font-bold">{item && item.title}</h1>
      <p>{item && item.description}</p>
    </div>
  );
}
