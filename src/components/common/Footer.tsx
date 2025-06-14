export default function Footer() {
  return (
    <footer className="border-t bg-muted/50" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} RMIT University Library. All rights reserved.</p>
          <p className="mt-2">Developed by RMIT Library Digital Learning</p>
        </div>
      </div>
    </footer>
  );
}