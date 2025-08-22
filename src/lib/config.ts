// Environment configuration
export const config = {
  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  
  // Site configuration
  site: {
    // Production domain
    production: 'https://flavorr.in',
    // Development domain
    development: 'http://localhost:3000',
  },
  
  // Get current environment
  get isDevelopment() {
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    }
    return process.env.NODE_ENV === 'development'
  },
  
  // Get current site URL
  get currentSiteUrl() {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return this.isDevelopment ? this.site.development : this.site.production
  },
  
  // Get auth redirect URL
  get authRedirectUrl() {
    return `${this.currentSiteUrl}/auth/callback`
  }
}
