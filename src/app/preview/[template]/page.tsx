import { notFound } from 'next/navigation';
import { mockProfile } from '@/lib/mockData';
import { BasicTemplate } from '@/app/[username]/templates/BasicTemplate';
import { AxisTemplate } from '@/app/[username]/templates/AxisTemplate';
import EclipseTemplate from '@/app/[username]/templates/EclipseTemplate';

export const dynamic = 'force-dynamic';

interface PreviewPageProps {
  params: Promise<{ template: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { template } = await params;
  
  // Create a mock profile with the selected template
  const previewProfile = {
    ...mockProfile,
    template: template as 'basic' | 'axis' | 'eclipse'
  };

  // Validate template parameter
  if (!['basic', 'axis', 'eclipse'].includes(template)) {
    notFound();
  }

  // Render the appropriate template
  switch (template) {
    case 'basic':
      return <BasicTemplate profile={previewProfile} />;
    case 'axis':
      return <AxisTemplate profile={previewProfile} />;
    case 'eclipse':
      return <EclipseTemplate profile={previewProfile} />;
    default:
      notFound();
  }
}
