import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNoteBySlug, formatDate, getAllNotes } from "@/lib/notes";
import NoteArticleJsonLd from "@/components/NoteArticleJsonLd";
import NoteTemplate from "@/components/NoteTemplate";
import MinimalHeader from "@/components/MinimalHeader";
import RelatedNotes from "@/components/RelatedNotes";
import {
  SITE_URL,
  absoluteUrl,
  noteMetaDescription,
} from "@/lib/site";

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
  const featuredImageUrl = absoluteUrl(note.featuredImage);
  const description = noteMetaDescription(note);
  const authorName = note.author ?? "Yaw Antwi-Owusu";
  const twitterHandle =
    process.env.NEXT_PUBLIC_TWITTER_SITE ||
    process.env.NEXT_PUBLIC_TWITTER_HANDLE;

  return {
    title: `${note.title} | Notes`,
    description,
    keywords: [
      note.category,
      "Ghana",
      "Yaw Antwi Owusu",
      "Yaw Antwi-Owusu",
      "notes",
      "essay",
    ],
    authors: [{ name: authorName, url: SITE_URL }],
    creator: authorName,
    publisher: "Yaw Antwi-Owusu",
    robots: { index: true, follow: true },
    openGraph: {
      title: note.title,
      description,
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
      modifiedTime: note.datePublished,
      authors: [authorName],
      section: note.category,
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description,
      images: [featuredImageUrl],
      ...(twitterHandle
        ? { site: twitterHandle, creator: twitterHandle }
        : {}),
    },
    alternates: {
      canonical: url,
    },
    category: note.category,
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
  const shareUrl = `${SITE_URL}/${note.slug}`;
  const shareSummary = noteMetaDescription(note);
  const authorName = note.author ?? "Yaw Antwi-Owusu";

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <NoteArticleJsonLd
        title={note.title}
        description={shareSummary}
        url={shareUrl}
        featuredImagePath={note.featuredImage}
        datePublished={note.datePublished}
        authorName={authorName}
        category={note.category}
      />
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
            shareUrl={shareUrl}
            shareSummary={shareSummary}
          />
          {otherNotes.length > 0 && <RelatedNotes notes={otherNotes} />}
        </div>
      </div>
    </main>
  );
}
