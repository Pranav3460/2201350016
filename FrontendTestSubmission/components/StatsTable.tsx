'use client';

import { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Typography,
  CircularProgress,
  Grid
} from '@mui/material';
import { isExpired } from '@/lib/urlService';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { UrlEntry, ClickEvent } from '@/types';

interface Props {
  stats: UrlEntry[];
  loading?: boolean;
}

function Row({ url }: { url: UrlEntry }) {
  const [open, setOpen] = useState(false);
  const clicks = url.clicks || [];

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {`${window.location.origin}/${url.shortcode}`}
        </TableCell>
        <TableCell>{url.originalUrl}</TableCell>
        <TableCell>{new Date(url.createdAt).toLocaleString()}</TableCell>
        <TableCell>{new Date(url.expiresAt).toLocaleString()}</TableCell>
        <TableCell align="right">{clicks.length}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Click History
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Referrer</TableCell>
                    <TableCell>Country</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clicks.map((click: ClickEvent, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{click.referrer}</TableCell>
                      <TableCell>{click.country}</TableCell>
                    </TableRow>
                  ))}
                  {clicks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No clicks recorded yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function StatsTable({ stats, loading = false }: Props) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (stats.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No URLs have been shortened yet</Typography>
      </Paper>
    );
  }

  const totalClicks = stats.reduce((sum, url) => sum + (url.clicks?.length || 0), 0);
  const activeUrls = stats.filter(url => !isExpired(new Date(url.expiresAt))).length;

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{stats.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total URLs</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{activeUrls}</Typography>
              <Typography variant="body2" color="text.secondary">Active URLs</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{totalClicks}</Typography>
              <Typography variant="body2" color="text.secondary">Total Clicks</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell align="right">Total Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((url) => (
              <Row key={url.shortcode} url={url} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
