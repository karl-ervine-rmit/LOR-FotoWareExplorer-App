import { EyeOff, Info, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { AssetFlag } from '@/lib/data/types';

interface AssetFlagsProps {
  flags: AssetFlag[];
}

const iconMap: Record<string, React.ReactNode> = {
  EyeOff: <EyeOff className="h-4 w-4" />,
  Info: <Info className="h-4 w-4" />,
  Star: <Star className="h-4 w-4" />
};

export function AssetFlags({ flags }: AssetFlagsProps) {
  if (!flags.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {flags.map((flag, index) => (
        <Badge
          key={index}
          variant={flag.type === 'cultural' ? 'destructive' : 'secondary'}
          className="flex items-center gap-1"
        >
          {iconMap[flag.icon]}
          {flag.label}
        </Badge>
      ))}
    </div>
  );
}