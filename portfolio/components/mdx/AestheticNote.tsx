import React from "react";
import Image from "next/image";

interface AestheticNoteProps {
  imageName?: string;
  children: React.ReactNode;
}

export function AestheticNote({ imageName = "note_custom.png", children }: AestheticNoteProps) {
  return (
    <div className="relative w-full my-10 aspect-[1018/676] overflow-hidden rounded-lg drop-shadow-xl">
      <Image 
        src={`/images/books/dac-nhan-tam/${imageName}`}
        alt="Aesthetic Note Paper"
        fill
        className="object-cover pointer-events-none"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center p-12 md:p-24 text-center text-slate-800 rotate-[-1deg] text-xl md:text-2xl font-medium leading-relaxed italic">
        {children}
      </div>
    </div>
  );
}
