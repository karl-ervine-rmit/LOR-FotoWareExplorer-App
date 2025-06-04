import StatsCards from '../components/common/StatsCards';
import QuickActions from '../components/common/QuickActions';
import { getArchives } from '../lib/fotoware-client';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const archives = await getArchives();
  // Placeholder values for stats
  const assetsCount = 0;
  const recentCount = 0;

  return (
    <div className="space-y-6">
      <section className="text-center py-12 border-b">
        <h1 className="text-4xl font-bold mb-4">FotoWare Digital Asset Library</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover, browse, and manage your digital assets with powerful search and preview capabilities.
        </p>
        {/* Search bar placeholder */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative w-full">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              <input
                type="text"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 pr-20 h-11"
                placeholder="Search for images, videos, documents..."
                aria-label="Search assets"
                aria-controls="search-results-listbox"
                aria-expanded="false"
                aria-haspopup="listbox"
                role="combobox"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1"></div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-6"
              disabled
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shuffle h-4 w-4 mr-2"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"></path><path d="m18 2 4 4-4 4"></path><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"></path><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"></path><path d="m18 14 4 4-4 4"></path></svg>
              I&apos;m Feeling Lucky
            </button>
          </div>
        </div>
      </section>

      {/* Alert for missing API credentials */}
      <section className="mb-8">
        <div role="alert" className="relative w-full rounded-lg border p-4 bg-background text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert h-4 w-4 absolute left-4 top-4 text-foreground"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
          <div className="text-sm pl-7">FotoWare API credentials are required to load archives and assets. The application is ready but needs your FotoWare server URL and API token to display data.</div>
        </div>
      </section>

      <StatsCards archivesCount={archives.length} assetsCount={assetsCount} recentCount={recentCount} />
      <QuickActions />

      {/* Archives section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Archives</h2>
          <Link href="/archives" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-2 h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Link>
        </div>
        {archives.length === 0 ? (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive h-12 w-12 text-muted-foreground mx-auto mb-4"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path></svg>
            <h3 className="text-lg font-semibold mb-2">No Archives Found</h3>
            <p className="text-muted-foreground mb-4">No digital asset archives are currently available.</p>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search mr-2 h-4 w-4"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              Check FotoWare Connection
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {archives.map((archive) => (
              <li key={archive.id} className="border rounded-lg p-6 bg-white dark:bg-gray-900 shadow hover:shadow-lg transition">
                <Link href={`/archives/${archive.id}`} className="block focus:outline-none focus:ring-2 focus:ring-primary">
                  <h2 className="text-xl font-semibold mb-2">{archive.name}</h2>
                  {archive.description && <p className="text-gray-500 dark:text-gray-400">{archive.description}</p>}
                  <span className="inline-block mt-4 text-primary underline">View archive</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
