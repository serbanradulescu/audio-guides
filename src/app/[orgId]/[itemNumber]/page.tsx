"use client";

import { getExhibitItemById } from "@/lib/exhibitItems";
import { QRCodeCanvas } from "qrcode.react";
import { use } from "react";
import useSWR from "swr";

export default function ItemPage({
  params: rawParams,
}: {
  params: Promise<{ orgId: string; itemNumber: string }>;
}) {
  const { orgId, itemNumber } = use(rawParams);
  const { data: item, isLoading } = useSWR(
    ["exhibitItem", orgId, itemNumber],
    () => getExhibitItemById(itemNumber) // Assuming "en" is the default language
  );

  // Generate the full URL using the path
  const currentUrl = `https://audio-guides-navy.vercel.app/visit/${orgId}/en/${itemNumber}`; // <-- replace with actual domain if needed

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button
        onClick={() => window.history.back()}
        className="absolute top-8 left-8 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium shadow"
      >
        ← Back
      </button>
      {/* ✅ QR Code */}
      <QRCodeCanvas value={currentUrl} size={160} />

      <h1 className="text-2xl font-bold">{item && item[0]?.title}</h1>
      <p>{item && item[0]?.description}</p>
    </div>
  );
}
