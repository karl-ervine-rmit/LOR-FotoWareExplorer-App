import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
      </div>
    </div>
  );
}