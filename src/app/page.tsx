"use client";

import { getExhibitItems } from "@/lib/exhibitItems";
import useSWR from "swr";
import { useOrganization } from "@clerk/nextjs";

export default function Home() {
  const { organization, isLoaded } = useOrganization();

  const { data: items } = useSWR(
    isLoaded && organization ? ["exhibitItems", organization.id] : null,
    getExhibitItems
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {isLoaded && !organization && (
          <div className="text-center">
            <p className="mb-4 text-lg font-medium">
              Please use the menu to create an exhibition or join an existing
              one.
            </p>
          </div>
        )}
        {isLoaded && organization && (
          <div className="text-center">
            <p className="mb-4 text-lg font-medium">
              Welcome to the {organization.name} exhibition!
            </p>
          </div>
        )}
        {items && items.length > 0 && organization && (
          <div className="text-center">
            <p className="mb-4 text-lg font-medium">
              Here are your exhibition items:
            </p>
            <ul>
              {items.map((item) => (
                <li key={item.itemNumber}>
                  <a
                    href={`/${organization.id}/${item.itemNumber}`}
                    className="text-blue-600 hover:underline"
                  >
                    {item.itemNumber} {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* You can render other main content below if needed */}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Footer content */}
      </footer>
    </div>
  );
}
