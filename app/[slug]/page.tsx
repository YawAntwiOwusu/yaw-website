import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNoteBySlug, formatDate, getAllNotes } from "@/lib/notes";
import NoteTemplate from "@/components/NoteTemplate";
import MinimalHeader from "@/components/MinimalHeader";
import RelatedNotes from "@/components/RelatedNotes";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yawantwiowusu.com";

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    return {
      title: "Note Not Found",
    };
  }

  const url = `${SITE_URL}/${note.slug}`;
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

function getReadTimeMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function NoteArticlePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  const formattedDate = formatDate(note.datePublished);
  const readTime = getReadTimeMinutes(note.content);
  const otherNotes = getAllNotes().filter((n) => n.slug !== note.slug).slice(0, 4);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <MinimalHeader />
      <div className="flex-1 page-padding py-16 md:py-24">
        <div className="page-container">
          <NoteTemplate
            title={note.title}
            category={note.category}
            datePublished={formattedDate}
            content={note.content}
            featuredImage={note.featuredImage}
            author={note.author}
            readTimeMinutes={readTime}
          />
          {otherNotes.length > 0 && <RelatedNotes notes={otherNotes} />}
        </div>
      </div>
    </main>
  );
}
