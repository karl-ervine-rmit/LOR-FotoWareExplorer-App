import { Button } from '@/components/ui/button';
import { EyeOff } from 'lucide-react';

interface CulturallySensitiveMaskProps {
  onReveal: () => void;
  variant?: 'card' | 'detail';
}

export function CulturallySensitiveMask({ onReveal, variant = 'card' }: CulturallySensitiveMaskProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4 z-50">
      <EyeOff className="w-12 h-12 mb-4" />
      <h3 className="text-lg font-semibold mb-2">Culturally Sensitive Content</h3>
      <p className="text-sm text-center mb-4">
        This content has been flagged as culturally sensitive. Please review before proceeding.
      </p>
      <Button
        onClick={onReveal}
        variant="secondary"
        className="w-full max-w-xs"
      >
        {variant === 'card' ? 'View Content' : 'Reveal Content'}
      </Button>
    </div>
  );
}