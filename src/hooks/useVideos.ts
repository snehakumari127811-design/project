import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Video } from '../types/database';

export function useVideos(orderBy: 'created_at' | 'views' = 'created_at', limit = 20) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order(orderBy, { ascending: false })
          .limit(limit);

        if (error) throw error;
        setVideos(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [orderBy, limit]);

  return { videos, loading, error };
}

export function useRandomVideos(count = 12) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRandomVideos() {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .limit(100);

        if (error) throw error;

        const shuffled = (data || []).sort(() => Math.random() - 0.5);
        setVideos(shuffled.slice(0, count));
      } catch (err) {
        console.error('Error fetching random videos:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRandomVideos();
  }, [count]);

  return { videos, loading };
}
