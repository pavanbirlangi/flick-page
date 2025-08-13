
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Profile } from '@/lib/schema'

// Import your templates
import { BasicTemplate } from './templates/BasicTemplate' // Assuming you create this file for the default template
import { AxisTemplate } from './templates/AxisTemplate'
import EclipseTemplate from './templates/EclipseTemplate'

export const dynamic = 'force-dynamic'

async function getProfile(username: string): Promise<Profile> {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
  
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('*') // This already selects the new 'plan' column
    .eq('username', username)
    .single();

  if (error || !profile) {
    notFound();
  }

  return profile as Profile;
}

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfile(username);

  // Debug logging
  console.log('Profile template:', profile.template);
  console.log('Profile template type:', typeof profile.template);
  console.log('Profile data:', profile);
  console.log('Available template options:', ['basic', 'axis', 'eclipse']);

  // Ensure template is a valid value
  const validTemplate = profile.template && ['basic', 'axis', 'eclipse'].includes(profile.template) 
    ? profile.template 
    : 'basic';

  console.log('Using template:', validTemplate);

  // Conditional Rendering Logic
  switch (validTemplate) {
    case 'axis':
      console.log('Rendering Axis template');
      return <AxisTemplate profile={profile} />;
    case 'eclipse':
      console.log('Rendering Eclipse template');
      return <EclipseTemplate profile={profile} />;
    case 'basic':
    default:
      console.log('Rendering Basic template (default)');
      return <BasicTemplate profile={profile} />;
  }
}