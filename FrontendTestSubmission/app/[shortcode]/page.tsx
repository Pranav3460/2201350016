import { redirect } from 'next/navigation';
import { store } from '@/lib/store';
import { isExpired } from '@/lib/urlService';
import { Logger } from '@/lib/logger';
import { Box, Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

interface Props {
  params: {
    shortcode: string;
  };
}

export default function ShortCodePage({ params }: Props) {
  const { shortcode } = params;
  const url = store.getUrl(shortcode);

  if (!url) {
    Logger.info('shortcode.page', 'Shortcode not found', { shortcode });
    return (
      <Container maxWidth="sm">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            URL Not Found
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            The requested short URL does not exist.
          </Typography>
          <Button component={Link} href="/shortener" variant="contained">
            Create New Short URL
          </Button>
        </Box>
      </Container>
    );
  }

  if (isExpired(url.expiresAt)) {
    Logger.info('shortcode.page', 'URL expired', { shortcode });
    return (
      <Container maxWidth="sm">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            URL Expired
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            This short URL has expired.
          </Typography>
          <Button component={Link} href="/shortener" variant="contained">
            Create New Short URL
          </Button>
        </Box>
      </Container>
    );
  }

  Logger.info('shortcode.page', 'Redirecting to original URL', {
    shortcode,
    originalUrl: url.originalUrl
  });

  redirect(url.originalUrl);
}
