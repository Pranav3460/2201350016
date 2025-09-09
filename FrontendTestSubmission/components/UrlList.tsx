'use client';

import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  Tooltip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { UrlEntry } from '@/types';

interface Props {
  urls: UrlEntry[];
}

export default function UrlList({ urls }: Props) {
  const copyToClipboard = (shortcode: string) => {
    const shortUrl = `${window.location.origin}/${shortcode}`;
    navigator.clipboard.writeText(shortUrl);
  };

  if (urls.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No shortened URLs yet</Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <List>
        {urls.map((url) => (
          <ListItem
            key={url.shortcode}
            secondaryAction={
              <Tooltip title="Copy short URL">
                <IconButton
                  edge="end"
                  aria-label="copy"
                  onClick={() => copyToClipboard(url.shortcode)}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemText
              primary={`${window.location.origin}/${url.shortcode}`}
              secondary={`Original: ${url.originalUrl}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
