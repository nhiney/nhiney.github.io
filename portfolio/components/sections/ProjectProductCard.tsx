"use client";

import { motion } from "framer-motion";
import { ExternalLink, ShieldCheck, Target, User } from "lucide-react";
import { GithubIcon } from "@/components/widgets/Icons";
import { Post } from "@/types";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useRef, useState } from "react";

export const ProjectProductCard = ({ project }: { project: Post }) => {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setRotate({ x: rotateX, y: rotateY });
  };

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group relative flex flex-col bg-secondary/20 border border-border/50 rounded-[2.5rem] overflow-hidden transition-all hover:bg-secondary/30 hover:border-primary/50 glass-card"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Project Image Header */}
      <div className="relative h-64 w-full overflow-hidden border-b border-border/50">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-background flex items-center justify-center">
            <GithubIcon size={48} className="opacity-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>
      <div className="p-8 md:p-10 space-y-8 flex-1 flex flex-col">
        {/* Title & Tags */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {project.tags?.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className={cn(
                  "text-[10px] uppercase tracking-widest border-primary/20",
                  tag.toLowerCase().includes("flutter") && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                  tag.toLowerCase().includes("laravel") && "bg-red-500/10 text-red-400 border-red-500/20",
                  tag.toLowerCase().includes("security") && "bg-purple-500/10 text-purple-400 border-purple-500/20",
                  tag.toLowerCase().includes("python") && "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                )}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
        </div>

        {/* Problem Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Target size={14} className="text-primary" />
            {t("projects.problem")}
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed italic">
            &ldquo;{project.problem || project.description}&rdquo;
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <User size={12} />
              {t("projects.role")}
            </div>
            <div className="text-xs font-semibold text-zinc-300">
              {project.role || "Lead Developer"}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <ShieldCheck size={12} />
              {t("projects.impact")}
            </div>
            <div className="text-xs font-semibold text-zinc-300">
              {project.impact || "Functional System"}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-8 mt-auto flex items-center justify-between">
          <div className="flex gap-4">
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                className="p-3 rounded-full bg-background/50 text-foreground border border-border hover:text-primary hover:border-primary/50 transition-all"
              >
                <GithubIcon size={20} />
              </Link>
            )}
            {project.demo && project.demo !== "#" && (
              <Link
                href={project.demo}
                target="_blank"
                className="p-3 rounded-full bg-background/50 text-foreground border border-border hover:text-primary hover:border-primary/50 transition-all"
              >
                <ExternalLink size={20} />
              </Link>
            )}
          </div>
          
          <Link
            href={`/projects/${project.slug}`}
            className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1"
          >
            {t("projects.study_case")}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
