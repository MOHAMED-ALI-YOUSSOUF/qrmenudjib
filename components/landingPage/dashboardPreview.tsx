"use client";
import Image from "next/image";
import { ContainerScroll } from "../ui/container-scroll-animation";

type PreviewItem = {
  title: string;
  imageLight: string;
  imageDark: string;
};

interface DashboardPreviewProps {
  items: PreviewItem[];
}

export function DashboardPreview({ items }: DashboardPreviewProps) {
  return (
    <div className="flex flex-col  overflow-hidden">
      {items.map((item, i) => (
        <ContainerScroll
          key={i}
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white mb-5">
                Aperçu du <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  {item.title}
                </span>
              </h1>
            </>
          }
        >
          {/* Image Light Mode */}
          <Image
            src={item.imageLight}
            alt={`${item.title} Light`}
            priority={i === 0}
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top block dark:hidden"
            draggable={false}
          />
          {/* Image Dark Mode */}
          <Image
            src={item.imageDark}
            alt={`${item.title} Dark`}
            priority={i === 0}
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top hidden dark:block"
            draggable={false}
          />
        </ContainerScroll>
      ))}
    </div>
  );
}
