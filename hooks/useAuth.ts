'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
  level: number;
  xp: number;
  streak: number;
  subscriptionTier: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth: Initializing session check');
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session fetch error:', error);
          setIsLoading(false);
          return;
        }

        console.log('useAuth: Session fetched:', session);
        if (session?.user) {
          const { data: stats, error: statsError } = await supabase
            .from('user_stats')
            .select('first_name, last_name, profile_image_url, level, xp, streak, subscription_tier')
            .eq('user_id', session.user.id)
            .single();

          if (statsError) {
            console.error('User stats fetch error:', statsError);
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              firstName: stats.first_name || '',
              lastName: stats.last_name || '',
              profileImageUrl: stats.profile_image_url || null,
              level: stats.level || 1,
              xp: stats.xp || 0,
              streak: stats.streak || 0,
              subscriptionTier: stats.subscription_tier || 'free',
            });
            setIsAuthenticated(true);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Auth fetch error:', error);
        setIsLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('useAuth: Auth state change:', event, session);
      if (event === 'SIGNED_IN' && session?.user) {
        supabase
          .from('user_stats')
          .select('first_name, last_name, profile_image_url, level, xp, streak, subscription_tier')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: stats, error: statsError }) => {
            if (statsError) {
              console.error('User stats fetch error:', statsError);
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                firstName: stats.first_name || '',
                lastName: stats.last_name || '',
                profileImageUrl: stats.profile_image_url || null,
                level: stats.level || 1,
                xp: stats.xp || 0,
                streak: stats.streak || 0,
                subscriptionTier: stats.subscription_tier || 'free',
              });
              setIsAuthenticated(true);
            }
            setIsLoading(false);
          });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { user, isAuthenticated, isLoading, logout };
}