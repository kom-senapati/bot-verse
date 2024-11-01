import BotsLoading from "@/components/BotsLoading";
import { ChatbotCard } from "@/components/ChatbotCard";
import { ImageCard } from "@/components/ImageCard";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchData } from "@/lib/queries";
import { chatbotCategories } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
// Function to shuffle an array
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

export default function HubPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const {
    data: botsData,
    isLoading: botsLoading,
    error: botsError,
  } = useQuery({
    queryKey: ["public_bots"],
    queryFn: () => fetchData({ queues: ["public_bots"] }),
  });

  const {
    data: imagesData,
    isLoading: imagesLoading,
    error: imagesError,
  } = useQuery({
    queryKey: ["public_images"],
    queryFn: () => fetchData({ queues: ["public_images"] }),
  });

  // Combine and shuffle bots and images
  const combinedData = [];
  if (botsData?.public_bots) {
    combinedData.push(
      ...botsData.public_bots.map((bot) => ({ type: "bot", data: bot }))
    );
  }
  if (imagesData?.public_images) {
    combinedData.push(
      ...imagesData.public_images.map((image) => ({
        type: "image",
        data: image,
      }))
    );
  }

  const shuffledData = shuffleArray(combinedData);
  const filteredData = shuffledData.filter((item) => {
    const matchesSearchTerm = item.data.latest_version.prompt
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      item.data.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearchTerm && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <div className="bg-light dark:bg-dark p-6 rounded-lg mt-4 w-full flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-6 p-3">
          Chatbots and AI Images Hub
        </h2>
        {/* Search Bar and Category Filter */}
        <div className="flex gap-4 mb-6 w-full max-w-2xl">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={selectedCategory}
            onValueChange={(v) => setSelectedCategory(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {["All", ...chatbotCategories].map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[minmax(300px, auto)]">
          {botsLoading || imagesLoading ? (
            <BotsLoading />
          ) : botsError || imagesError ? (
            <div className="col-span-1 text-red-500 text-center">
              {botsError?.message || imagesError?.message}
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={`card-${item.type}_${item.data.id}`}>
                {item.type === "bot" ? (
                  <ChatbotCard
                    key={item.data.prompt}
                    chatbot={item.data}
                    queryKeys={["public_bots"]}
                  />
                ) : (
                  <ImageCard key={item.data.prompt} image={item.data} />
                )}
              </div>
            ))
          ) : (
            <div className="col-span-1 text-center">
              No bots or images available.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
