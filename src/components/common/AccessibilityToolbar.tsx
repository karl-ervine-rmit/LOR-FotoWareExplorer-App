"use client";
import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Settings, TextCursorInput, Moon, Sun, Contrast, Type, X, Info, Zap, ZapOff } from 'lucide-react';

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    isReducedMotion,
    toggleReducedMotion,
    highContrast,
    toggleHighContrast,
    dyslexicFont,
    toggleDyslexicFont,
  } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
  ];

  const currentTheme = themeOptions.find(option => option.value === theme);

  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = "accessibility-toolbar-title";
  // Focus trap: keep focus inside the popup when open
  useEffect(() => {
    const currentCardRef = cardRef.current;
    if (isOpen && currentCardRef) {
      const focusable = currentCardRef.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      function handleKey(e: KeyboardEvent) {
        if (e.key === 'Escape') setIsOpen(false);
        if (e.key === 'Tab' && focusable.length > 0) {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
      currentCardRef.addEventListener('keydown', handleKey);
      // Focus the first element
      first?.focus();
      return () => currentCardRef?.removeEventListener('keydown', handleKey);
    }
  }, [isOpen]);

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          {/* Only show the trigger button when the popup is closed */}
          {!isOpen && (
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-background border-2"
                aria-label="Open accessibility options"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </CollapsibleTrigger>
          )}

          <CollapsibleContent>
            <Card
              ref={cardRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="mt-4 w-80 shadow-xl bg-card text-card-foreground border border-border"
            >
              <CardHeader className="pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5" />
                  <CardTitle id={titleId} className="flex items-center gap-2 text-lg">
                    Accessibility Options
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-auto"
                  aria-label="Close accessibility options"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* ARIA live region for state changes */}
                <div aria-live="polite" className="sr-only" id="accessibility-toolbar-live">
                  {highContrast ? 'High contrast active.' : ''}
                  {isReducedMotion ? 'Reduced motion active.' : ''}
                  {dyslexicFont ? 'Dyslexic font active.' : ''}
                </div>

                {/* Font Size Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="font-size" className="flex items-center gap-2 font-medium">
                      <TextCursorInput className="h-4 w-4" />
                      Text Size
                    </Label>
                    <span className="text-sm text-muted-foreground font-mono">
                      {fontSize}%
                    </span>
                  </div>
                  <Slider
                    id="font-size"
                    min={80}
                    max={200}
                    step={10}
                    value={[fontSize]}
                    onValueChange={([value]) => setFontSize(value)}
                    className="w-full"
                    aria-label={`Adjust text size, currently ${fontSize}%`}
                    aria-valuemin={80}
                    aria-valuemax={200}
                    aria-valuenow={fontSize}
                    aria-valuetext={`${fontSize}% of normal size`}
                    aria-describedby="font-size-description"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>80%</span>
                    <span>100%</span>
                    <span>200%</span>
                  </div>
                  <div className="sr-only" id="font-size-description">
                    Use arrow keys to adjust text size from 80% to 200%. Current size is {fontSize}%.
                  </div>
                </div>

                {/* Theme Selection */}
                <div className="space-y-3">
                  <Label htmlFor="theme" className="flex items-center gap-2 font-medium">
                    {currentTheme?.icon}
                    Colour Theme
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Select
                          value={theme}
                          onValueChange={(value) => setTheme(value as 'light' | 'dark')}
                          disabled={highContrast}
                        >
                          <SelectTrigger className="w-full" disabled={highContrast}>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            {themeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  {option.icon}
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TooltipTrigger>
                    {highContrast && (
                      <TooltipContent side="left" className="max-w-xs">
                        <p>Theme selection is disabled while high contrast mode is active.</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>

                {/* Motion Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="reduced-motion" className="flex items-center gap-2 font-medium cursor-pointer">
                        {isReducedMotion ? <ZapOff className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                        Reduce Motion
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-3 w-3" />
                            <span className="sr-only">Information about reduce motion</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p>Reduces animations and transitions for users sensitive to motion</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch
                      id="reduced-motion"
                      checked={isReducedMotion}
                      onCheckedChange={toggleReducedMotion}
                      aria-describedby="reduced-motion-description"
                    />
                  </div>
                  <p id="reduced-motion-description" className="text-xs text-muted-foreground">
                    {isReducedMotion ? 'Animations disabled' : 'Animations enabled'}
                  </p>
                </div>

                {/* High Contrast Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="high-contrast" className="flex items-center gap-2 font-medium cursor-pointer">
                        <Contrast className="h-4 w-4" />
                        High Contrast
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-3 w-3" />
                            <span className="sr-only">Information about high contrast</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p>Increases contrast for better visibility and readability</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch
                      id="high-contrast"
                      checked={highContrast}
                      onCheckedChange={toggleHighContrast}
                      aria-describedby="high-contrast-description"
                    />
                  </div>
                  <p id="high-contrast-description" className="text-xs text-muted-foreground">
                    {highContrast ? 'High contrast active' : 'Standard contrast'}
                  </p>
                </div>

                {/* Dyslexic Font Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="dyslexic-font" className="flex items-center gap-2 font-medium cursor-pointer">
                        <Type className="h-4 w-4" />
                        Dyslexic Font
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-3 w-3" />
                            <span className="sr-only">Information about dyslexic font</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p>Uses OpenDyslexic font designed to improve readability for people with dyslexia</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch
                      id="dyslexic-font"
                      checked={dyslexicFont}
                      onCheckedChange={toggleDyslexicFont}
                      aria-describedby="dyslexic-font-description"
                    />
                  </div>
                  <p id="dyslexic-font-description" className="text-xs text-muted-foreground">
                    {dyslexicFont ? 'OpenDyslexic font active' : 'Standard font'}
                  </p>
                </div>

                {/* Reset to Defaults */}
                <div className="pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setTheme('light');
                      setFontSize(100);
                      if (isReducedMotion) toggleReducedMotion();
                      if (highContrast) toggleHighContrast();
                      if (dyslexicFont) toggleDyslexicFont();
                    }}
                  >
                    Reset to Defaults
                  </Button>
                </div>

              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </TooltipProvider>
  );
}