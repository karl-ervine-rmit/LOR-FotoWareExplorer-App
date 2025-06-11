import { ReactNode } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

export default function ArchivesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto">
      <Breadcrumbs />
      <div className="mt-4">{children}</div>
    </div>
  );
}