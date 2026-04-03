"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Project } from "@/types/project";

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [imgError, setImgError] = useState(false);
  const isExternal = !project.internal;
  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};

  return (
    <Link
      href={project.href}
      className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50"
      {...linkProps}
    >
      <div
        className="rounded-2xl p-0 transition-[background-color,padding] duration-200 ease-out
          group-hover:bg-[#f2f2f2] group-hover:p-4
          group-focus-within:bg-[#f2f2f2] group-focus-within:p-4"
      >
        <div
          className="relative w-full max-w-full bg-neutral-100 rounded-2xl overflow-hidden aspect-[4/3]"
          style={{ aspectRatio: "4 / 3" }}
        >
          {!imgError ? (
            <Image
              src={project.image}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm px-4">
              {project.title}
            </div>
          )}
          {isExternal && (
            <span
              className="pointer-events-none absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
              aria-hidden
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </span>
          )}
        </div>
        <div className="mt-3 md:mt-4">
          <h3 className="font-semibold text-neutral-900 text-base md:text-lg text-balance transition-colors duration-200 group-hover:text-blue-600 group-focus-visible:text-blue-600">
            {project.title}
          </h3>
          <p className="text-sm text-neutral-500 mt-2">
            {project.category} • {project.year}
          </p>
        </div>
      </div>
      {project.description && (
        <p className="mt-3 hidden text-sm text-neutral-400 leading-relaxed line-clamp-2 group-hover:block group-focus-within:block">
          {project.description}
        </p>
      )}
    </Link>
  );
}
