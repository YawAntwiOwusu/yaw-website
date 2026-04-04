import { SITE_URL, absoluteUrl } from "@/lib/site";
import type { NoteCategory } from "@/types/note";

interface NoteArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  featuredImagePath: string;
  datePublished: string;
  authorName: string;
  category: NoteCategory;
}

export default function NoteArticleJsonLd({
  title,
  description,
  url,
  featuredImagePath,
  datePublished,
  authorName,
  category,
}: NoteArticleJsonLdProps) {
  const imageUrl = absoluteUrl(featuredImagePath);
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [imageUrl],
    datePublished: `${datePublished}T12:00:00.000Z`,
    author: {
      "@type": "Person",
      name: authorName,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Yaw Antwi-Owusu",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: category,
    inLanguage: "en",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
