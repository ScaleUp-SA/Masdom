"use client";

import React, { useState } from "react";
import {
  CldImage,
  CldUploadButton,
  CldUploadWidgetResults,
  getCldVideoUrl,
} from "next-cloudinary";

import { Button } from "./ui/button";
export default function ImageUplouder() {
  const [imageInfo, setImageInfo] = useState<{
    info: { public_id: string[]; thumbnail_url: string[]; video_id: string[] };
  }>({
    info: {
      public_id: [],
      thumbnail_url: [],
      video_id: [],
    },
  });
  const [videoUrl, setVideoUrl] = useState<string[]>([]);
  // const url = getCldVideoUrl({
  //   width: 960,
  //   height: 600,
  //   src: imageInfo.info.video_id,
  // });

  const getVideoUrls = () => {
    imageInfo.info.video_id.map((url) => {
      const videoUrl = getCldVideoUrl({
        width: 960,
        height: 600,
        src: url,
      });

      setVideoUrl((prev) => {
        return [...prev, videoUrl];
      });
    });
  };

  console.log(imageInfo);
  console.log(videoUrl);

  return (
    <div className="">
      <div className=" w-full flex justify-center my-16">
        <Button asChild>
          <CldUploadButton
            uploadPreset="masdom"
            onUpload={(res: CldUploadWidgetResults) => {
              if (typeof res.info === "object" && "resource_type" in res.info) {
                if (res.info.resource_type === "video") {
                  console.log(res);

                  setImageInfo((prev) => ({
                    ...prev,
                    info: {
                      ...prev.info,
                      video_id: [
                        ...prev.info.video_id,
                        (res.info as any).public_id as string,
                      ],
                    },
                  }));
                  getVideoUrls();
                } else {
                  setImageInfo((prev) => ({
                    ...prev,
                    info: {
                      ...prev.info,
                      public_id: [
                        ...prev.info.public_id,
                        (res.info as any).public_id as string,
                      ],
                      thumbnail_url: [
                        ...prev.info.thumbnail_url,
                        (res.info as any).thumbnail_url as string,
                      ],
                    },
                  }));
                }
                console.log(res.info.resource_type);
              }
            }}
          >
            تحميل ملفاتك
          </CldUploadButton>
        </Button>
      </div>

      <div>
        <div className=" flex flex-col justify-center items-center">
          {imageInfo.info.public_id.length !== 0 ? (
            <h5 className=" font-bold text-4xl py-10 text-[#04214c]"> صور </h5>
          ) : (
            ""
          )}
          <div className="flex justify-evenly w-full">
            {imageInfo?.info?.thumbnail_url.map((image, index) => (
              <div key={index} className=" rounded-lg overflow-hidden">
                <CldImage alt={"image"} src={image} width={200} height={200} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          {imageInfo.info.video_id.length !== 0 ? (
            <h5 className=" font-bold text-4xl py-10 text-[#04214c]">
              {" "}
              الفيديوهات{" "}
            </h5>
          ) : (
            ""
          )}
          <div className="flex justify-evenly w-full">
            {videoUrl.map((url, idx) => {
              return (
                <div key={idx}>
                  <video width="300" height="300" controls>
                    <source src={url} type="video/mp4" />
                    Sorry, your browser doesn`&apos;`t support videos.
                  </video>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
