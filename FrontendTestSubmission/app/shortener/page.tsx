'use client';

import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import UrlForm from '@/components/UrlForm';
import UrlList from '@/components/UrlList';
import { UrlEntry } from '@/types';

export default function ShortenerPage() {
  const [shortenedUrls, setShortenedUrls] = useState<UrlEntry[]>([]);

  const handleUrlsShortened = (urls: UrlEntry[]) => {
    setShortenedUrls(prev => [...urls, ...prev]);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shorten URLs
        </Typography>
        <UrlForm onUrlsShortened={handleUrlsShortened} />
        <Box sx={{ mt: 4 }}>
          <UrlList urls={shortenedUrls} />
        </Box>
      </Box>
    </Container>
  );
}
