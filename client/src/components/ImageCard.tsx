import { imageSrc } from "@/lib/utils";
import { LikeAndReport } from "./LikeAndReport";
import { Download } from "lucide-react";

export function ImageCard({
  image,
  queryKeys,
}: {
  image: ImageGen;
  queryKeys: string[];
}) {
  return (
    <>
      <div className="min-w-80 bg-light dark:bg-dark p-6 rounded-lg transition-all drop-shadow hover:shadow border border-lighter dark:border-darker flex flex-col justify-between">
        <img
          className="rounded-md"
          src={imageSrc(image.prompt)}
          alt={image.prompt}
        />
        <p className="text-center mt-2">"{image.prompt.substring(0, 100)}"</p>
        <div className="flex justify-between mt-2">
          <a
            type="button"
            className="rounded-full text-blue-500 hover:text-blue-600 transition duration-300 p-2 hover:bg-blue-100 dark:hover:bg-blue-800/20 like-btn"
            title="Download"
            download
            target="_blank"
            href={imageSrc(image.prompt)}
          >
            <Download />
          </a>
          <LikeAndReport
            id={image.id}
            likes={image.likes}
            reports={image.reports}
            type="image"
            queryKeys={queryKeys}
          />
        </div>
      </div>
    </>
  );
}
