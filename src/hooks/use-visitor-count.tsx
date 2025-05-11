import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Get environment variables with fallbacks
const ENABLE_VISITOR_COUNTER = import.meta.env.VITE_ENABLE_VISITOR_COUNTER !== 'false';
const HEARTBEAT_INTERVAL = parseInt(import.meta.env.VITE_VISITOR_HEARTBEAT_INTERVAL || '30000', 10);

// Define the visitor session type
interface VisitorSession {
  id: string;
  created_at: string;
  last_seen: string;
}

/**
 * Custom hook to track and display real-time visitor count
 * Uses Supabase's real-time subscriptions to keep the count updated
 */
export function useVisitorCount() {
  const [visitorCount, setVisitorCount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If visitor counter is disabled, return early
    if (!ENABLE_VISITOR_COUNTER) {
      setVisitorCount(1);
      setIsLoading(false);
      return;
    }

    let sessionId: string | null = null;
    let heartbeatInterval: number | null = null;
    let subscription: any = null;

    // Initialize visitor tracking
    const initVisitorTracking = async () => {
      try {
        setIsLoading(true);

        // Get or create a session ID from localStorage
        sessionId = localStorage.getItem('visitor_session_id');
        if (!sessionId) {
          sessionId = uuidv4();
          localStorage.setItem('visitor_session_id', sessionId);
        }

        // Create or update the visitor session in Supabase
        const { error: upsertError } = await supabase
          .from('visitor_sessions')
          .upsert({
            id: sessionId,
            last_seen: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });

        if (upsertError) {
          console.error('Error updating visitor session:', upsertError);
          setError('Failed to update visitor session');
        }

        // Get the initial count of active visitors
        await fetchVisitorCount();

        // Set up real-time subscription to visitor_sessions table
        subscription = supabase
          .channel('visitor_count_changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'visitor_sessions'
          }, () => {
            // When any change happens to the visitor_sessions table, update the count
            fetchVisitorCount();
          })
          .subscribe();

        // Set up heartbeat to update the last_seen timestamp
        heartbeatInterval = window.setInterval(async () => {
          if (sessionId) {
            const { error: heartbeatError } = await supabase
              .from('visitor_sessions')
              .update({ last_seen: new Date().toISOString() })
              .eq('id', sessionId);

            if (heartbeatError) {
              console.error('Error updating heartbeat:', heartbeatError);
            }
          }
        }, HEARTBEAT_INTERVAL); // Update based on environment variable

        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing visitor tracking:', err);
        setError('Failed to initialize visitor tracking');
        setIsLoading(false);
      }
    };

    // Fetch the current visitor count
    const fetchVisitorCount = async () => {
      try {
        // Get sessions active in the last 2 minutes
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
        const { data, error: countError, count } = await supabase
          .from('visitor_sessions')
          .select('*', { count: 'exact' })
          .gte('last_seen', twoMinutesAgo);

        if (countError) {
          console.error('Error fetching visitor count:', countError);
          setError('Failed to fetch visitor count');
        } else {
          setVisitorCount(count || 1); // Default to 1 if count is null
        }
      } catch (err) {
        console.error('Error fetching visitor count:', err);
        setError('Failed to fetch visitor count');
      }
    };

    // Initialize tracking
    initVisitorTracking();

    // Cleanup function
    return () => {
      // Remove the session when the user leaves
      if (sessionId) {
        supabase
          .from('visitor_sessions')
          .delete()
          .eq('id', sessionId)
          .then(({ error }) => {
            if (error) {
              console.error('Error removing visitor session:', error);
            }
          });
      }

      // Clear the heartbeat interval
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }

      // Unsubscribe from real-time updates
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  return { visitorCount, isLoading, error };
}
