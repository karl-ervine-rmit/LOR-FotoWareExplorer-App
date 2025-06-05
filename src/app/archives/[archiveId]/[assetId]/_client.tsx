"use client";
import Script from "next/script";
import UniversalEmbed from "@/components/common/UniversalEmbed";

interface Asset {
  id: string;
  name: string;
  type: string;
  src: string;
  meta: Record<string, string>;
  isCulturallySensitive?: boolean;
}

interface AssetDetailClientProps {
  archiveId: string;
  asset: Asset;
}

const SUPPORTED_EMBED_TYPES = [
  "image",
  "video",
  "youtube",
  "vimeo",
  "pdf",
  "audio",
  "epub",
  "document",
  "code",
  "iframe",
  "fallback",
] as const;
type EmbedType = (typeof SUPPORTED_EMBED_TYPES)[number];

function isEmbedType(type: string): type is EmbedType {
  return (SUPPORTED_EMBED_TYPES as readonly string[]).includes(type);
}

export default function AssetDetailClient({
  archiveId,
  asset,
}: AssetDetailClientProps) {
  // Determine embed type from asset meta/type
  const rawType = (asset.meta?.type || asset.type || "").toLowerCase();
  const embedType: EmbedType = isEmbedType(rawType) ? rawType : "fallback";
  const isCulturallySensitive = asset.isCulturallySensitive ?? false;

  // Schema.org LearningResource JSON-LD
  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: asset.meta?.title || asset.name,
    description: asset.meta?.description || "",
    url: `/archives/${archiveId}/${asset.id}`,
    image: asset.src,
    inLanguage: "en-AU",
    identifier: asset.id,
    learningResourceType:
      embedType.charAt(0).toUpperCase() + embedType.slice(1),
  };

  return (
    <>
      <Script id="schema-learning-resource" type="application/ld+json">
        {JSON.stringify(schema)}
      </Script>
      <h1 className="text-2xl font-bold mb-4">
        Asset: {asset.meta?.title || asset.name}
      </h1>
      <UniversalEmbed
        type={embedType}
        src={asset.src}
        title={asset.meta?.title || asset.name}
        width="100%"
        height={400}
        fallback={undefined}
        isCulturallySensitive={isCulturallySensitive}
        showCulturallySensitive={(() => {
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem("showCulturallySensitive");
            return stored === "true";
          }
          return false;
        })()}
      />
      <p>Type: {embedType}</p>
      <p>ID: {asset.id}</p>
      <p>Archive: {archiveId}</p>
    </>
  );
}
