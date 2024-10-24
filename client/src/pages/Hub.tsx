import { ChatbotCard } from "@/components/ChatbotCard";
import { ImageCard } from "@/components/ImageCard";
import Navbar from "@/components/Navbar";
import { fetchData } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

export default function HubPage() {
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

  return (
    <>
      <Navbar />
      <div className="bg-light dark:bg-dark p-6 rounded-lg mt-4 w-full flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-6 p-3">
          Chatbots and AI Images Hub
        </h2>
        <div className="grid grid-flow-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3 w-full">
          {botsLoading || imagesLoading ? (
            <div className="col-span-1 text-center">Loading...</div>
          ) : botsError || imagesError ? (
            <div className="col-span-1 text-red-500 text-center">
              {botsError?.message || imagesError?.message}
            </div>
          ) : shuffledData.length > 0 ? (
            shuffledData.map((item) => (
              <div key={item.data.id} className="mb-4">
                {item.type === "bot" ? (
                  <ChatbotCard
                    chatbot={item.data}
                    queryKeys={["public_bots"]}
                  />
                ) : (
                  <ImageCard image={item.data} queryKeys={["public_images"]} />
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
