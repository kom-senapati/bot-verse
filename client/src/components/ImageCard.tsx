import { imageSrc } from "@/lib/utils";
import { Download, Flag, Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeAndReport } from "@/lib/queries";
import { useTranslation } from "react-i18next";

export function ImageCard({
  image,
  queryKeys,
}: {
  image: ImageGen;
  queryKeys: string[];
}) {
  const qc = useQueryClient();
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationFn: likeAndReport,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys }),
  });

  return (
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
        <p className="text-sm text-muted-foreground mb-4">{image.prompt}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
            onClick={() =>
              mutation.mutate({
                action: "like",
                id: image.id,
                type: "image",
              })
            }
          >
            <Heart className={`h-4 w-4`} />
            <span>{image.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
            onClick={() =>
              mutation.mutate({
                action: "report",
                id: image.id,
                type: "image",
              })
            }
          >
            <Flag className="h-4 w-4 mr-2" />
            <span>{image.reports}</span>
          </Button>
        </div>
        <a
          title="Download"
          download
          target="_blank"
          href={imageSrc(image.prompt)}
        >
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t("download")}
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
