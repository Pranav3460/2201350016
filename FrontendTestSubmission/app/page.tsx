import { Container, Typography, Box, Button, Stack } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          URL Shortener
        </Typography>
        <Stack spacing={2} direction="row" justifyContent="center" sx={{ mt: 4 }}>
          <Button 
            component={Link} 
            href="/shortener" 
            variant="contained" 
            size="large"
          >
            Shorten URLs
          </Button>
          <Button 
            component={Link} 
            href="/stats" 
            variant="outlined" 
            size="large"
          >
            View Stats
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
