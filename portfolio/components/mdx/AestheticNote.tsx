import React from "react";
import Image from "next/image";

interface AestheticNoteProps {
  imageName?: string;
  children: React.ReactNode;
}

export function AestheticNote({ imageName, children }: AestheticNoteProps) {
  return (
    <div className="aesthetic-note relative my-10 overflow-hidden rounded-md px-6 py-8 shadow-sm sm:px-10 sm:py-10">
      {imageName && (
        <>
          <Image
            src={`/images/books/dac-nhan-tam/${imageName}`}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-background/80" />
        </>
      )}
      <div className="aesthetic-note-body relative mx-auto max-w-[34rem] text-center font-serif text-[1.08rem] font-medium italic leading-relaxed text-[var(--ink)] sm:text-xl">
        {children}
      </div>
    </div>
  );
}
