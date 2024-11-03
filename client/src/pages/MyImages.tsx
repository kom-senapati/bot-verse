import BotsLoading from "@/components/BotsLoading";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { fetchData, publishObj } from "@/lib/queries";
import { imageSrc } from "@/lib/utils";
import { useDeleteChatbotModal } from "@/stores/modal-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Flag, Heart, Send, Trash2 } from "lucide-react";
import { useMemo } from "react";

export default function MyImagesPage() {
  const { loading, user } = useAuth();
  const qc = useQueryClient();
  const deleteModal = useDeleteChatbotModal();

  const {
    data: imagesData,
    isLoading: imagesLoading,
    error: imagesError,
  } = useQuery({
    queryKey: ["my_images"],
    queryFn: () => fetchData({ queues: ["my_images"], uid: user?.id }),
    enabled: !!user,
  });

  const publishMutation = useMutation({
    mutationFn: publishObj,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my_images"] }),
  });
  // Calculate analytics data
  const { totalLikes, totalReports, topRankedImage } = useMemo(() => {
    if (!imagesData?.my_images?.length) {
      return { totalLikes: 0, totalReports: 0, topRankedImage: null };
    }
    const totalLikes = imagesData.my_images.reduce(
      (sum, image) => sum + image.likes,
      0
    );
    const totalReports = imagesData.my_images.reduce(
      (sum, image) => sum + image.reports,
      0
    );
    const topRankedImage = imagesData.my_images.reduce((topImage, image) =>
      image.likes > (topImage?.likes || 0) ? image : topImage
    );
    return { totalLikes, totalReports, topRankedImage };
  }, [imagesData]);

  if (user == null || loading) {
    return (
      <div className="flex items-center justify-center w-screen min-h-screen">
        <div className="grid grid-flow-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3 w-full">
          <BotsLoading />
        </div>
      </div>
    );
  }
  return (
    <div>
      <Navbar />

      <div className="min-h-screen container mt-4 w-full flex flex-col items-center">
        <Card className="w-full mb-6 max-w-3xl">
          <CardHeader className="p-4">
            <h3 className="text-xl font-semibold">Image Analytics</h3>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="font-medium">Total Likes:</span>
              <span>{totalLikes}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Flag className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Total Reports:</span>
              <span>{totalReports}</span>
            </div>
            {topRankedImage && (
              <div className="flex items-center space-x-2 col-span-2 md:col-span-1">
                <span className="font-medium">Top Image:</span>
                <img
                  src={imageSrc(topRankedImage.prompt)}
                  alt={topRankedImage.prompt}
                  className="w-12 h-12 rounded-full"
                />
                <span>{topRankedImage.likes} Likes</span>
              </div>
            )}
          </CardContent>
        </Card>
        <h2 className="text-2xl font-semibold mb-6 p-3">My Images</h2>
        <div className="grid grid-flow-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3 w-full">
          {imagesLoading ? (
            <BotsLoading />
          ) : imagesError ? (
            <div className="col-span-1 text-red-500 text-center">
              {imagesError?.message}
            </div>
          ) : imagesData && imagesData.my_images!.length > 0 ? (
            imagesData.my_images!.map((image) => (
              <Card className="w-full max-w-sm mx-auto overflow-hidden h-fit">
                <CardHeader className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={imageSrc(image.prompt)}
                      alt={image.prompt}
                      className="rounded-t-lg"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {image.prompt}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div className="flex space-x-4">
                    <div className="flex justify-center items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      <span>{image.likes}</span>
                    </div>
                    <div className="flex justify-center items-center">
                      <Flag className="h-4 w-4 mr-2" />
                      <span>{image.reports}</span>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant={image.public ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        publishMutation.mutate({
                          id: image.id,
                          obj: "image",
                        })
                      }
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {image.public ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      variant="destructive" // Use a destructive variant for delete
                      size="icon"
                      className="rounded-full"
                      onClick={() =>
                        deleteModal.onOpen({
                          id: image.id,
                          obj: "image",
                          queryKeys: ["my_images"],
                        })
                      }
                    >
                      <Trash2 className="h-2 w-2" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-1 text-center">No Images available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
