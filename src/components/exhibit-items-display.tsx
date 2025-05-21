"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Music, Search, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ExhibitItem = {
  ownerId: string;
  itemNumber: string;
  language: string;
  title: string;
  description: string;
  audioUrl: string | null;
};

interface ExhibitItemsDisplayProps {
  items: ExhibitItem[];
}

export function ExhibitItemsDisplay({ items }: ExhibitItemsDisplayProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Get unique languages for the filter dropdown
  const languages = Array.from(new Set(items.map((item) => item.language)));

  // Filter items based on search term and language filter
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLanguage =
      languageFilter === "all" || item.language === languageFilter;

    return matchesSearch && matchesLanguage;
  });

  // Handle audio playback
  const toggleAudio = (itemNumber: string, audioUrl: string | null) => {
    if (!audioUrl) return;

    if (currentlyPlaying === itemNumber) {
      const audioElement = document.getElementById(
        `audio-${itemNumber}`
      ) as HTMLAudioElement;
      if (audioElement.paused) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
    } else {
      // Stop currently playing audio if any
      if (currentlyPlaying) {
        const currentAudio = document.getElementById(
          `audio-${currentlyPlaying}`
        ) as HTMLAudioElement;
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }

      // Play new audio
      const newAudio = document.getElementById(
        `audio-${itemNumber}`
      ) as HTMLAudioElement;
      if (newAudio) {
        newAudio.play();
        setCurrentlyPlaying(itemNumber);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Exhibit Items</h2>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Tag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No items found</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filter to find what you are looking
            for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Link
              key={`${item.ownerId}-${item.itemNumber}-${item.language}`}
              href={`/${item.ownerId}/${item.itemNumber}`}
            >
              <Card
                key={`${item.ownerId}-${item.itemNumber}-${item.language}`}
                className="overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <Badge variant="outline" className="mb-2">
                      {item.language.toUpperCase()}
                    </Badge>
                    <Badge variant="secondary" className="mb-2">
                      #{item.itemNumber}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {item.description}
                  </p>
                </CardContent>
                {item.audioUrl && (
                  <CardFooter className="flex justify-between pt-3 border-t">
                    <button
                      onClick={() =>
                        toggleAudio(item.itemNumber, item.audioUrl)
                      }
                      className={cn(
                        "flex items-center gap-2 text-sm",
                        currentlyPlaying === item.itemNumber
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      <Music className="h-4 w-4" />
                      {currentlyPlaying === item.itemNumber
                        ? "Playing Audio"
                        : "Play Audio"}
                    </button>
                    <audio
                      id={`audio-${item.itemNumber}`}
                      src={item.audioUrl}
                      onEnded={() => setCurrentlyPlaying(null)}
                      className="hidden"
                    />
                  </CardFooter>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        Showing {filteredItems.length} of {items.length} items
      </div>
    </div>
  );
}
