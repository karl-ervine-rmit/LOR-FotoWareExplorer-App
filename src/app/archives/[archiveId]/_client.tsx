'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { AssetCard, AssetFlag } from '@/components/common/AssetCard';
import { EyeOff, Info, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import Script from "next/script";

// You may want to type Asset more strictly
interface Asset {
  id: string;
  name: string;
  imageUrl: string;
  isCulturallySensitive: boolean;
  isSuperseded: boolean;
  isFeatured: boolean;
  type: string;
  date: string;
  meta: Record<string, string>;
}

interface ArchiveDetailClientProps {
  archiveId: string;
  assets: Asset[];
}

export default function ArchiveDetailClient({ archiveId, assets }: ArchiveDetailClientProps) {
  // Example taxonomy and state logic (can be replaced with real data)
  const mockTaxonomy = [
    { label: 'Subject', values: [
      { value: 'Art and Design', count: 12 },
      { value: 'Science', count: 9 },
      { value: 'History', count: 7 },
      { value: 'Mathematics', count: 5 },
      { value: 'Technology', count: 8 },
      { value: 'Geography', count: 6 },
      { value: 'Health and Physical Education', count: 4 },
      { value: 'Languages', count: 3 },
      { value: 'Civics and Citizenship', count: 2 },
      { value: 'Economics and Business', count: 3 },
      { value: 'Music', count: 6 },
      { value: 'Drama', count: 2 },
      { value: 'Media Arts', count: 1 },
      { value: 'English', count: 10 },
      { value: 'Aboriginal and Torres Strait Islander Histories and Cultures', count: 2 },
    ] },
    { label: 'Type', values: [
      { value: 'Essay', count: 10 },
      { value: 'Photograph', count: 14 },
      { value: 'Document', count: 8 },
      { value: 'Audio', count: 5 },
      { value: 'Video', count: 7 },
      { value: 'Map', count: 3 },
      { value: 'Poster', count: 2 },
      { value: 'Infographic', count: 4 },
      { value: 'Interview', count: 2 },
      { value: 'Report', count: 6 },
      { value: 'Lesson Plan', count: 3 },
      { value: 'Resource Pack', count: 1 },
    ] },
    { label: 'Level', values: [
      { value: 'Undergraduate', count: 15 },
      { value: 'Postgraduate', count: 7 },
      { value: 'Primary', count: 8 },
      { value: 'Secondary', count: 12 },
      { value: 'Early Childhood', count: 4 },
      { value: 'Vocational', count: 3 },
      { value: 'Professional Development', count: 2 },
    ] },
    { label: 'Year', values: [
      { value: '2024', count: 8 },
      { value: '2023', count: 10 },
      { value: '2022', count: 6 },
      { value: '2021', count: 5 },
      { value: '2020', count: 3 },
      { value: '2019', count: 2 },
      { value: '2018', count: 1 },
    ] },
    { label: 'Tags', values: [
      { value: 'Sustainability', count: 4 },
      { value: 'Innovation', count: 3 },
      { value: 'Heritage', count: 2 },
      { value: 'STEM', count: 5 },
      { value: 'Inclusion', count: 2 },
      { value: 'Digital Literacy', count: 3 },
      { value: 'Critical Thinking', count: 4 },
      { value: 'First Nations', count: 2 },
      { value: 'Environment', count: 3 },
      { value: 'Community', count: 2 },
      { value: 'Leadership', count: 1 },
      { value: 'Creativity', count: 2 },
      { value: 'Collaboration', count: 2 },
    ] },
  ];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showMore, setShowMore] = useState<{ [label: string]: boolean }>({});
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [ariaMessage, setAriaMessage] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<{ [group: string]: Set<string> }>({});
  const [showCulturallySensitive, setShowCulturallySensitive] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('showCulturallySensitive');
      return stored === 'true';
    }
    return false;
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredTaxonomy = mockTaxonomy.map((group) => {
    const filteredValues = group.values.filter((v) =>
      v.value.toLowerCase().includes(search.toLowerCase())
    );
    return { ...group, values: filteredValues };
  });
  const visibleGroups = filteredTaxonomy.filter(group => group.values.length > 0);
  const totalVisibleValues = visibleGroups.reduce((acc, group) => acc + group.values.length, 0);

  useEffect(() => {
    if (search) {
      setOpenGroups(visibleGroups.map(g => g.label));
    } else {
      setOpenGroups([]);
    }
  }, [search, filteredTaxonomy.length]);

  useEffect(() => {
    if (search) {
      setAriaMessage(`${visibleGroups.length} group${visibleGroups.length !== 1 ? 's' : ''} and ${totalVisibleValues} value${totalVisibleValues !== 1 ? 's' : ''} match your search.`);
    } else {
      setAriaMessage('');
    }
  }, [search, visibleGroups, totalVisibleValues]);

  useEffect(() => {
    if (sidebarOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [sidebarOpen]);

  function highlightMatch(text: string, query: string) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-200 text-foreground rounded px-0.5">{part}</mark> : part
    );
  }

  function toggleFilter(group: string, value: string) {
    setSelectedFilters((prev) => {
      const groupSet = new Set(prev[group] || []);
      if (groupSet.has(value)) {
        groupSet.delete(value);
      } else {
        groupSet.add(value);
      }
      return { ...prev, [group]: groupSet };
    });
  }
  function clearAllFilters() {
    setSelectedFilters({});
  }
  function isFilterSelected(group: string, value: string) {
    return selectedFilters[group]?.has(value);
  }

  useEffect(() => {
    localStorage.setItem('showCulturallySensitive', showCulturallySensitive.toString());
  }, [showCulturallySensitive]);

  return (
    <>
      <Script id="schema-collection" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Archive: ${archiveId} | FotoWare Explorer`,
          description: "Browse a curated collection of learning resources in this archive. All content uses Australian spelling and meets accessibility standards.",
          url: `https://your-site.com/archives/${archiveId}`,
          image: "https://your-site.com/images/og-default.jpg",
          inLanguage: "en-AU",
          hasPart: assets.slice(0, 2).map(asset => ({
            "@type": "LearningResource",
            name: asset.meta?.title || asset.name,
            url: `https://your-site.com/archives/${archiveId}/asset/${asset.id}`
          }))
        })}
      </Script>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Sidebar */}
        <aside
          className={`w-full md:w-64 shrink-0 md:sticky md:top-8 z-10 ${sidebarOpen ? "" : "hidden md:block"}`}
          aria-label="Taxonomy sidebar"
        >
          <Card className="h-full bg-muted/40 border-border">
            <CardContent className="p-0">
              <ScrollArea className="h-[420px] md:h-[calc(100vh-4rem)] p-4">
                <h2 className="text-lg font-semibold mb-4">Taxonomy</h2>
                {/* Culturally sensitive toggle */}
                <div className="mb-4">
                  <label className="flex items-center gap-2">
                    <Switch
                      checked={showCulturallySensitive}
                      onCheckedChange={setShowCulturallySensitive}
                      aria-label="Show culturally sensitive content"
                    />
                    <span>Show culturally sensitive content</span>
                  </label>
                  <div className="text-xs text-muted-foreground mt-1">
                    Some content may be culturally sensitive or distressing. By default, it is hidden for your safety and respect.
                  </div>
                </div>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-9 w-full" />
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        {[...Array(4)].map((_, j) => (
                          <Skeleton key={j} className="h-8 w-full rounded-md" />
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="relative mb-4">
                      <Input
                        ref={searchInputRef}
                        placeholder="Search taxonomy..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pr-10"
                        aria-label="Search taxonomy"
                        aria-describedby="taxonomy-search-clear"
                      />
                      {search && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                          onClick={() => setSearch("")}
                          aria-label="Clear search"
                          id="taxonomy-search-clear"
                        >
                          <span aria-hidden>×</span>
                        </Button>
                      )}
                    </div>
                    {/* Active filters summary */}
                    {Object.keys(selectedFilters).some(
                      (g) => selectedFilters[g].size > 0
                    ) && (
                      <div className="mb-4 flex flex-wrap gap-2 items-center">
                        <span className="text-xs text-muted-foreground">
                          Active filters:
                        </span>
                        {Object.entries(selectedFilters).flatMap(
                          ([group, values]) =>
                            Array.from(values).map((value) => (
                              <Badge
                                key={group + value}
                                variant="default"
                                className="flex items-center gap-1"
                              >
                                <span className="font-medium">{value}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 ml-1"
                                  aria-label={`Remove filter ${value}`}
                                  onClick={() => toggleFilter(group, value)}
                                >
                                  <span aria-hidden>×</span>
                                </Button>
                              </Badge>
                            ))
                        )}
                        <Button
                          variant="link"
                          size="sm"
                          className="ml-2 text-xs"
                          onClick={clearAllFilters}
                          aria-label="Clear all filters"
                        >
                          Clear all
                        </Button>
                      </div>
                    )}
                    <div
                      aria-live="polite"
                      aria-atomic="true"
                      className="sr-only"
                    >
                      {ariaMessage}
                    </div>
                    <Accordion
                      type="multiple"
                      className="w-full"
                      value={openGroups}
                      onValueChange={setOpenGroups}
                    >
                      {visibleGroups.map((group) => (
                        <AccordionItem value={group.label} key={group.label}>
                          <AccordionTrigger className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {group.label}
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-1">
                              {(showMore[group.label]
                                ? group.values
                                : group.values.slice(0, 8)
                              ).map((v) => (
                                <li key={v.value}>
                                  <label
                                    className={cn(
                                      "flex items-center gap-2 w-full cursor-pointer rounded-md px-2 py-2 transition-colors",
                                      "hover:bg-accent",
                                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                      isFilterSelected(group.label, v.value) &&
                                        "bg-accent/60 font-semibold"
                                    )}
                                  >
                                    <Checkbox
                                      checked={isFilterSelected(
                                        group.label,
                                        v.value
                                      )}
                                      onCheckedChange={() =>
                                        toggleFilter(group.label, v.value)
                                      }
                                      aria-label={v.value}
                                      className="shrink-0"
                                    />
                                    <span className="flex-1 text-sm">
                                      {highlightMatch(v.value, search)}
                                    </span>
                                    <Badge
                                      variant="secondary"
                                      className="ml-2 min-w-[2rem] justify-center"
                                    >
                                      {v.count}
                                    </Badge>
                                  </label>
                                </li>
                              ))}
                              {group.values.length > 8 && (
                                <li>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="w-full justify-start px-2 py-1 text-xs mt-1"
                                    onClick={() =>
                                      setShowMore((prev) => ({
                                        ...prev,
                                        [group.label]: !prev[group.label],
                                      }))
                                    }
                                    aria-expanded={!!showMore[group.label]}
                                    aria-label={
                                      showMore[group.label]
                                        ? `Show less ${group.label}`
                                        : `Show all ${group.values.length} ${group.label}`
                                    }
                                  >
                                    {showMore[group.label]
                                      ? "Show less"
                                      : `Show all (${group.values.length})`}
                                  </Button>
                                </li>
                              )}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>
        {/* Mobile sidebar toggle button */}
        <div className="md:hidden mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-expanded={sidebarOpen}
            aria-controls="taxonomy-sidebar"
          >
            {sidebarOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
        {/* Main content */}
        <main className="flex-1">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold leading-tight mb-2">Archive: {archiveId}</h1>
                <p className="text-muted-foreground text-base mb-0">
                  This is a placeholder description for the archive. It provides an overview of the collection, its purpose, and any relevant details for users browsing the assets below.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-y-6 gap-x-6">
                {assets.map((asset) => {
                  const flags: AssetFlag[] = [
                    asset.isCulturallySensitive && {
                      type: 'cultural',
                      label: 'Culturally sensitive content',
                      icon: <EyeOff className="h-4 w-4 text-yellow-500" />,
                    },
                    asset.isSuperseded && {
                      type: 'superseded',
                      label: 'This asset has been superseded',
                      icon: <Info className="h-4 w-4 text-red-500" />,
                    },
                    asset.isFeatured && {
                      type: 'featured',
                      label: 'Featured asset',
                      icon: <Star className="h-4 w-4 text-blue-500" />,
                    },
                  ].filter(Boolean) as AssetFlag[];
                  return (
                    <AssetCard
                      key={asset.id}
                      imageUrl={asset.imageUrl}
                      href={`/archives/${archiveId}/${asset.id}`}
                      isCulturallySensitive={asset.isCulturallySensitive}
                      showCulturallySensitive={showCulturallySensitive}
                      flags={flags}
                      meta={asset.meta}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}