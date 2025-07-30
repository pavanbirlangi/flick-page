
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Profile } from '@/lib/schema'

// Import your templates
import { BasicTemplate } from './templates/BasicTemplate' // Assuming you create this file for the default template
import { AxisTemplate } from './templates/AxisTemplate'

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

  // Conditional Rendering Logic
  switch (profile.template) {
    case 'axis':
      return <AxisTemplate profile={profile} />;
    case 'basic':
    default:
      return <BasicTemplate profile={profile} />;
  }
}