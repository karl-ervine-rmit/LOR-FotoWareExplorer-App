'use client';
// Page for a single archive, listing albums and assets
// TODO: Implement archive detail UI and data fetching

import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { AssetCard, AssetFlag } from '@/components/common/AssetCard';
import { EyeOff, Info, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const mockTaxonomy = [
  {
    label: 'Subject',
    values: [
      { value: 'Art and Design', count: 12 },
      { value: 'Critical Writing', count: 8 },
      { value: 'Reflective Writing', count: 5 },
      { value: 'Propositional Writing', count: 3 },
      { value: 'Photography', count: 7 },
      { value: 'Sculpture', count: 2 },
      { value: 'Painting', count: 4 },
      { value: 'Digital Media', count: 6 },
      { value: 'Performance', count: 1 },
      { value: 'Installation', count: 2 },
    ],
  },
  {
    label: 'Type',
    values: [
      { value: 'Essay', count: 10 },
      { value: 'Artist Statement', count: 6 },
      { value: 'Portfolio', count: 4 },
      { value: 'Resource', count: 9 },
      { value: 'Case Study', count: 2 },
      { value: 'Review', count: 3 },
    ],
  },
  {
    label: 'Level',
    values: [
      { value: 'Undergraduate', count: 15 },
      { value: 'Postgraduate', count: 7 },
      { value: 'VET', count: 2 },
    ],
  },
  {
    label: 'Year',
    values: [
      { value: '2024', count: 8 },
      { value: '2023', count: 6 },
      { value: '2022', count: 5 },
      { value: '2021', count: 3 },
      { value: '2020', count: 2 },
    ],
  },
  {
    label: 'Tags',
    values: [
      { value: 'Sustainability', count: 4 },
      { value: 'Innovation', count: 3 },
      { value: 'Collaboration', count: 2 },
      { value: 'Research', count: 5 },
      { value: 'Community', count: 1 },
      { value: 'Technology', count: 2 },
      { value: 'Culture', count: 2 },
      { value: 'Practice', count: 3 },
      { value: 'Theory', count: 2 },
      { value: 'History', count: 1 },
      { value: 'Future', count: 1 },
    ],
  },
];

export default function ArchiveDetailPage() {
  const params = useParams();
  const archiveId = params?.archiveId || 'unknown';
  // Placeholder data
  const assets = [
    {
      id: 'a1',
      name: 'Farmhouse_at_Kelvin_A._Lewis_farm_in_Creeds_13.jpg',
      imageUrl: '/images/Farmhouse_at_Kelvin_A._Lewis_farm_in_Creeds_13.jpg',
      isCulturallySensitive: true,
      isSuperseded: false,
      isFeatured: true,
      type: 'image',
      date: '2024-06-01',
      meta: { title: 'Farmhouse at Kelvin Lewis Farm with a Very Long Title That Should Span Over Three Lines for Alignment Testing Purposes', type: 'Image', date: '2024-06-01' },
    },
    {
      id: 'a2',
      name: 'Landscape_Arnisee-region.jpg',
      imageUrl: '/images/Landscape_Arnisee-region.jpg',
      isCulturallySensitive: false,
      isSuperseded: true,
      isFeatured: false,
      type: 'image',
      date: '2023-12-15',
      meta: { title: 'Arnisee Region Landscape', type: 'Image', date: '2023-12-15' },
    },
    {
      id: 'a3',
      name: 'Censorshiplolcat_(censored).jpg',
      imageUrl: '/images/Censorshiplolcat_(censored).jpg',
      isCulturallySensitive: true,
      isSuperseded: true,
      isFeatured: false,
      type: 'image',
      date: '2022-09-10',
      meta: { title: 'Censored Cat Meme', type: 'Image', date: '2022-09-10' },
    },
    {
      id: 'a4',
      name: 'Large_cloud_over_Mexican_landscape.jpg',
      imageUrl: '/images/Large_cloud_over_Mexican_landscape.jpg',
      isCulturallySensitive: false,
      isSuperseded: false,
      isFeatured: true,
      type: 'image',
      date: '2024-01-20',
      meta: { title: 'Cloud Over Mexican Landscape', type: 'Image', date: '2024-01-20' },
    },
    {
      id: 'a5',
      name: 'Hosta_two-tone_3.jpg',
      imageUrl: '/images/Hosta_two-tone_3.jpg',
      isCulturallySensitive: false,
      isSuperseded: false,
      isFeatured: false,
      type: 'image',
      date: '2021-05-05',
      meta: { title: 'Two-tone Hosta Plant', type: 'Image', date: '2021-05-05' },
    },
    {
      id: 'a6',
      name: 'Man_enjoying_ketchup_chips.jpg',
      imageUrl: '/images/Man_enjoying_ketchup_chips.jpg',
      isCulturallySensitive: false,
      isSuperseded: true,
      isFeatured: true,
      type: 'image',
      date: '2023-03-12',
      meta: { title: 'Man Enjoying Ketchup Chips', type: 'Image', date: '2023-03-12' },
    },
    {
      id: 'a7',
      name: 'Passion_Vine_NBG_LR.jpg',
      imageUrl: '/images/Passion_Vine_NBG_LR.jpg',
      isCulturallySensitive: true,
      isSuperseded: false,
      isFeatured: false,
      type: 'image',
      date: '2024-07-01',
      meta: { title: 'Passion Vine Flower', type: 'Image', date: '2024-07-01' },
    },
    {
      id: 'a8',
      name: 'Pyrus_pyrifolia_fruit_on_tree_PS_2z_LR.jpg',
      imageUrl: '/images/Pyrus_pyrifolia_fruit_on_tree_PS_2z_LR.jpg',
      isCulturallySensitive: true,
      isSuperseded: false,
      isFeatured: false,
      type: 'image',
      date: '2024-07-02',
      meta: { title: 'Asian Pear Fruit on Tree', type: 'Image', date: '2024-07-02' },
    },
  ];

  // For mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // For taxonomy search
  const [search, setSearch] = useState('');
  // For show more state per group
  const [showMore, setShowMore] = useState<{ [label: string]: boolean }>({});
  // For auto-expanding accordions on search
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  // For ARIA live region
  const [ariaMessage, setAriaMessage] = useState('');
  // Ref for search input (focus management)
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Simulated loading state for taxonomy
  const [loading, setLoading] = useState(true);
  // Filter selection state
  const [selectedFilters, setSelectedFilters] = useState<{ [group: string]: Set<string> }>({});
  // Culturally sensitive content toggle (default: false)
  const [showCulturallySensitive, setShowCulturallySensitive] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('showCulturallySensitive');
      return stored === 'true';
    }
    return false;
  });

  // Simulate loading taxonomy from API
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filtered taxonomy based on search
  const filteredTaxonomy = mockTaxonomy.map((group) => {
    const filteredValues = group.values.filter((v) =>
      v.value.toLowerCase().includes(search.toLowerCase())
    );
    return { ...group, values: filteredValues };
  });
  const visibleGroups = filteredTaxonomy.filter(group => group.values.length > 0);
  const totalVisibleValues = visibleGroups.reduce((acc, group) => acc + group.values.length, 0);

  // Auto-expand accordions on search
  useEffect(() => {
    if (search) {
      setOpenGroups(visibleGroups.map(g => g.label));
    } else {
      setOpenGroups([]);
    }
  }, [search, filteredTaxonomy.length]);

  // ARIA live region message
  useEffect(() => {
    if (search) {
      setAriaMessage(`${visibleGroups.length} group${visibleGroups.length !== 1 ? 's' : ''} and ${totalVisibleValues} value${totalVisibleValues !== 1 ? 's' : ''} match your search.`);
    } else {
      setAriaMessage('');
    }
  }, [search, visibleGroups, totalVisibleValues]);

  // Focus search input when sidebar opens on mobile
  useEffect(() => {
    if (sidebarOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [sidebarOpen]);

  // Helper to highlight search matches
  function highlightMatch(text: string, query: string) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-200 text-foreground rounded px-0.5">{part}</mark> : part
    );
  }

  // Handle filter selection
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
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Sidebar */}
        <aside
          className={`w-full md:w-64 shrink-0 md:sticky md:top-8 z-10 ${
            sidebarOpen ? "" : "hidden md:block"
          }`}
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
                  {/* TODO: Replace with real archive description from API */}
                  This is a placeholder description for the archive. It provides an overview of the collection, its purpose, and any relevant details for users browsing the assets below.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-6">
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