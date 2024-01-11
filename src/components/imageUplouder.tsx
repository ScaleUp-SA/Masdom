import React, { useEffect, useState } from "react";
import {
  CldImage,
  CldUploadButton,
  CldUploadWidgetResults,
  getCldVideoUrl,
} from "next-cloudinary";

import { Button } from "./ui/button";
import { Files } from "./listingCarsForm";
import { CarsImages, CarsVideos } from "@prisma/client";
import { MdClose } from "react-icons/md";

export default function ImageUplouder({
  filesHandler,
  images,
  videos,
}: {
  filesHandler: (files: Files) => void;
  images?: CarsImages[];
  videos?: CarsVideos[];
}) {
  const [imageInfo, setImageInfo] = useState<{
    public_id: string[];
    thumbnail_url: string[];
    video_id: string[];
  }>({
    public_id: [],
    thumbnail_url: [],
    video_id: [],
  });

  const [videoUrl, setVideoUrl] = useState<string[]>([]);
  const [showMediaPopup, setShowMediaPopup] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [videoSorce, setVideoSorce] = useState<string[] | undefined>([]);

  const handleImageUpload = (res: CldUploadWidgetResults) => {
    if (typeof res.info === "object" && "resource_type" in res.info) {
      if (res.info.resource_type === "video") {
        setImageInfo((prev) => ({
          ...prev,
          video_id: [...prev.video_id, (res.info as any).public_id as string],
        }));
        setVideoUrl((prev) => [
          ...prev,
          getCldVideoUrl({
            width: 960,
            height: 600,
            src: (res.info as any).public_id as string,
          }),
        ]);
        // filesHandler(videoUrl);
      } else {
        setImageInfo((prev) => ({
          ...prev,
          public_id: [...prev.public_id, (res.info as any).public_id as string],
          thumbnail_url: [
            ...prev.thumbnail_url,
            (res.info as any).thumbnail_url as string,
          ],
        }));
        // filesHandler(imageInfo);
      }
    }
  };

  const handleMediaClick = (media: string) => {
    setSelectedMedia(media);
    setShowMediaPopup(true);
  };

  const closeMediaPopup = () => {
    setSelectedMedia(null);
    setShowMediaPopup(false);
  };

  useEffect(() => {
    filesHandler(imageInfo);
  }, [imageInfo]);

  useEffect(() => {
    const sorce = videos?.map((video) =>
      getCldVideoUrl({
        width: 960,
        height: 600,
        src: video.links as string,
      })
    );
    setVideoSorce(sorce);
  }, [videos]);

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-center mb-8">
        <Button asChild>
          <CldUploadButton
            uploadPreset="v6svhohp"
            onUpload={handleImageUpload}
            options={{ multiple: true }}
            onAbort={(data) => {
              console.log(data);
            }}
          >
            تحميل ملفاتك
          </CldUploadButton>
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6 items-start justify-start  max-lg:grid-cols-3 max-sm:grid-cols-2">
        {images &&
          images.map((image, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg shadow-lg bg-white relative group cursor-pointer h-fit w-fit z-0"
              onClick={() => handleMediaClick(image.links)}
            >
              <CldImage
                alt="image"
                src={image.links}
                width={250}
                height={200}
                className="object-cover obj sm:rounded-lg w-[250px] h-[200px] max-md:object-contain"
              />
              <span className="absolute bottom-0 bg-black text-white py-1 px-2 w-full opacity-0 transition-opacity duration-300 group-hover:opacity-90">
                صورة {index + 1}
              </span>
            </div>
          ))}

        {videoSorce &&
          videoSorce.map((url, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg w-[max-content] shadow-lg bg-white relative group cursor-pointer flex justify-center items-center z-0 "
              onClick={() => handleMediaClick(url)}
            >
              <video
                width="200"
                height="200"
                controls
                className="object-cover w-[200px] max-md:w-[150px] h-[150px] max-md:object-contain"
              >
                <source src={url} type="video/mp4" />
                Sorry, your browser doesn`&apos;`t support videos.
              </video>
              <span className="absolute bottom-0 bg-white text-black py-1 px-2 w-full opacity-0 transition-opacity duration-300 group-hover:opacity-90">
                فيديو {index + 1}
              </span>
            </div>
          ))}

        <div>
          {imageInfo.thumbnail_url &&
            imageInfo.thumbnail_url.map((image, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg shadow-lg bg-white relative group cursor-pointer h-fit -z-0"
                onClick={() => handleMediaClick(image)}
              >
                <CldImage
                  alt="image"
                  src={image}
                  width={200}
                  height={200}
                  className="object-contain sm:rounded-lg w-[200px] h-[200px] "
                />
                <span className="absolute bottom-0 bg-black text-white py-1 px-2 w-full opacity-0 transition-opacity duration-300 group-hover:opacity-90">
                  صورة {index + 1}
                </span>
              </div>
            ))}
        </div>

        <div>
          {videoUrl.map((url, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg shadow-lg bg-black relative group cursor-pointer flex justify-center items-center -z-0 "
              onClick={() => handleMediaClick(url)}
            >
              <video
                width="200"
                height="200"
                controls
                className="object-contain  w-[200px] h-[150px]"
              >
                <source src={url} type="video/mp4" />
                Sorry, your browser doesn`&apos;`t support videos.
              </video>
              <span className="absolute bottom-0 bg-white text-black py-1 px-2 w-full opacity-0 transition-opacity duration-300 group-hover:opacity-90">
                فيديو {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showMediaPopup && (
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-75 flex justify-center items-center">
          <div className="max-w-4xl w-full">
            {selectedMedia && selectedMedia.includes(".mp4") ? (
              <video width="100%" height="auto" controls>
                <source src={selectedMedia} type="video/mp4" />
                Sorry, your browser doesn`&apos;`t support videos.
              </video>
            ) : (
              <CldImage
                src={selectedMedia!}
                alt="Full size"
                fill={true}
                quality={100}
                className="max-w-full max-h-screen"
              />
            )}
            <button
              onClick={closeMediaPopup}
              className="absolute top-4 right-4 p-2 text-2xl"
            >
              <MdClose />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
