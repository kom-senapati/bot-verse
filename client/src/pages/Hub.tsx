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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const filteredBotsData = botsData?.public_bots?.filter((item) => {
    const matchesSearchTerm = item.latest_version.prompt
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearchTerm && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <div className="bg-light dark:bg-dark p-6 rounded-lg mt-4 w-full flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-6 p-3">
          Chatbots and AI Images Hub
        </h2>

        <Tabs defaultValue="chatbots">
          <div className="flex space-x-2">
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
            <TabsList>
              <TabsTrigger value="chatbots">Chatbots</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chatbots">
            <div className="grid grid-flow-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-h-screen">
              {botsLoading ? (
                <BotsLoading />
              ) : botsError ? (
                <div className="col-span-1 text-red-500 text-center">
                  {botsError?.message}
                </div>
              ) : botsData && botsData.public_bots!.length > 0 ? (
                filteredBotsData?.map((item) => (
                  <ChatbotCard
                    chatbot={item}
                    queryKeys={["user_bots"]}
                    key={item.latest_version.name}
                  />
                ))
              ) : (
                <div className="col-span-1 text-center">No bots available.</div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="images">
            <div className="grid grid-flow-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-h-screen">
              {imagesLoading ? (
                <BotsLoading />
              ) : imagesError ? (
                <div className="col-span-1 text-red-500 text-center">
                  {imagesError?.message}
                </div>
              ) : imagesData && imagesData.public_images!.length > 0 ? (
                imagesData.public_images!.map((item) => (
                  <ImageCard image={item} key={item.prompt} />
                ))
              ) : (
                <div className="col-span-1 text-center">
                  No Images available.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[minmax(300px, auto)]">
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
        </div> */}
      </div>
    </>
  );
}
