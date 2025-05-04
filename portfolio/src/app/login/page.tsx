'use client'; // This tells Next.js to render this page on the client side (needed for interactive auth)

import { Auth } from '@supabase/auth-ui-react'; // Import Supabase's prebuilt Auth UI component
import { ThemeSupa } from '@supabase/auth-ui-shared'; // Import a theme for the Auth UI
import { supabase } from '../../../lib/supabaseClient'; // Import your Supabase client

export default function LoginPage() {
  return (
    <main className="p-8 max-w-md mx-auto">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6">Login or Sign Up</h1>
      {/* Supabase Auth UI component */}
      <Auth
        supabaseClient={supabase} // Pass your Supabase client to the Auth UI
        appearance={{ theme: ThemeSupa }} // Use the "Supa" theme for styling
        theme="dark" // Set the theme to dark mode
        providers={['google']} // Enable Google login (optional, can remove if not enabled in Supabase)
      />
    </main>
  );
}
