'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SupabaseContext = createContext<SupabaseClient | null>(null);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { getToken, userId } = useAuth();
  const [supabase, setSupabase] = useState<SupabaseClient>(() => 
    createClient(supabaseUrl, supabaseAnonKey)
  );

  useEffect(() => {
    let isMounted = true;

    async function updateClient() {
      if (!userId) {
        // Fallback to anonymous client if signed out
        if (isMounted) {
          setSupabase(createClient(supabaseUrl, supabaseAnonKey));
        }
        return;
      }

      try {
        // Retrieve the Supabase JWT token from Clerk
        const token = await getToken({ template: 'supabase' });
        
        if (isMounted) {
          if (token) {
            setSupabase(
              createClient(supabaseUrl, supabaseAnonKey, {
                global: {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              })
            );
          } else {
            setSupabase(createClient(supabaseUrl, supabaseAnonKey));
          }
        }
      } catch (err) {
        console.error('Failed to get Supabase token from Clerk:', err);
      }
    }

    updateClient();

    return () => {
      isMounted = false;
    };
  }, [userId, getToken]);

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

/**
 * Hook to retrieve the active Supabase client.
 * Uses the authenticated Clerk context if signed in, or the anonymous client if signed out.
 */
export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
