'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import StatsTable from '@/components/StatsTable';
import { UrlEntry } from '@/types';
import { Logger } from '@/lib/logger';

export default function StatsPage() {
  const [stats, setStats] = useState<UrlEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        Logger.error('stats.page', 'Error fetching stats', { error });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Statistics
        </Typography>
        <StatsTable stats={stats} loading={loading} />
      </Box>
    </Container>
  );
}
