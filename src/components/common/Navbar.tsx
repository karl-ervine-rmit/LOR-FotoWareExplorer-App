import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-2xl font-bold hover:text-primary transition-colors">
              LOR
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/archives" className="text-sm hover:text-primary transition-colors">Archives</Link>
              <Link href="/albums" className="text-sm hover:text-primary transition-colors">Albums</Link>
              <Link href="/featured" className="text-sm hover:text-primary transition-colors">Featured</Link>
              <Link href="/about" className="text-sm hover:text-primary transition-colors">About</Link>
            </div>
          </div>
          <div className="md:hidden">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 w-10 hover:bg-accent hover:text-accent-foreground"
              aria-label="Open menu"
              aria-expanded="false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu h-6 w-6"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}