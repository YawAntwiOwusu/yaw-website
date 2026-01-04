import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNoteBySlug, formatDate } from "@/lib/notes";
import NoteTemplate from "@/components/NoteTemplate";
import Header from "@/components/Header";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yawantwiowusu.com";

interface NotePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const note = getNoteBySlug(params.slug);

  if (!note) {
    return {
      title: "Note Not Found",
    };
  }

  const url = `${SITE_URL}/notes/${note.slug}`;
  const featuredImageUrl = note.featuredImage.startsWith("http")
    ? note.featuredImage
    : `${SITE_URL}${note.featuredImage}`;

  return {
    title: `${note.title} | Notes`,
    description: note.excerpt || note.title,
    openGraph: {
      title: note.title,
      description: note.excerpt || note.title,
      url,
      siteName: "Yaw Antwi-Owusu",
      images: [
        {
          url: featuredImageUrl,
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: note.datePublished,
      authors: ["Yaw Antwi-Owusu"],
      section: note.category,
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.excerpt || note.title,
      images: [featuredImageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function NotePage({ params }: NotePageProps) {
  const note = getNoteBySlug(params.slug);

  if (!note) {
    notFound();
  }

  const url = `${SITE_URL}/notes/${note.slug}`;
  const formattedDate = formatDate(note.datePublished);

  return (
    <main className="min-h-screen bg-[#02001A] flex flex-col">
      <Header />
      <div className="flex-1 page-padding py-16 md:py-24">
        <div className="page-container">
          <NoteTemplate
            title={note.title}
            category={note.category}
            datePublished={formattedDate}
            datePublishedISO={note.datePublished}
            url={url}
            content={note.content}
            featuredImage={note.featuredImage}
          />
        </div>
      </div>
    </main>
  );
}

