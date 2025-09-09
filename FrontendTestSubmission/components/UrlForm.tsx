'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Grid,
  Alert,
  Paper,
  Typography,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { ShortenRequest } from '@/types';
import { isValidUrl } from '@/lib/urlService';

interface Props {
  onUrlsShortened: (urls: any[]) => void;
}

export default function UrlForm({ onUrlsShortened }: Props) {
  interface FormData {
    url: string;
    validityMinutes: string;
    shortcode: string;
    urlError?: string;
    shortcodeError?: string;
    validityError?: string;
  }

  const [forms, setForms] = useState<FormData[]>([{ url: '', validityMinutes: '30', shortcode: '' }]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [usedShortcodes, setUsedShortcodes] = useState<Set<string>>(new Set());

  const addForm = () => {
    if (forms.length < 5) {
      setForms([...forms, { url: '', validityMinutes: '30', shortcode: '' }]);
    }
  };

  const removeForm = (index: number) => {
    setForms(forms.filter((_, i) => i !== index));
  };

  const validateForm = (form: FormData, index: number): boolean => {
    const newForms = [...forms];
    let isValid = true;

    // Validate URL
    if (!form.url) {
      newForms[index].urlError = 'URL is required';
      isValid = false;
    } else if (!isValidUrl(form.url)) {
      newForms[index].urlError = 'Invalid URL format';
      isValid = false;
    } else {
      newForms[index].urlError = undefined;
    }

    // Validate shortcode
    if (form.shortcode) {
      if (!/^[a-zA-Z0-9]{4,12}$/.test(form.shortcode)) {
        newForms[index].shortcodeError = 'Shortcode must be 4-12 alphanumeric characters';
        isValid = false;
      } else if (usedShortcodes.has(form.shortcode)) {
        newForms[index].shortcodeError = 'This shortcode is already in use';
        isValid = false;
      } else {
        newForms[index].shortcodeError = undefined;
      }
    } else {
      newForms[index].shortcodeError = undefined;
    }

    // Validate validity minutes
    const minutes = parseInt(form.validityMinutes);
    if (isNaN(minutes) || minutes < 1) {
      newForms[index].validityError = 'Must be a positive number';
      isValid = false;
    } else {
      newForms[index].validityError = undefined;
    }

    setForms(newForms);
    return isValid;
  };

  const updateForm = (index: number, field: string, value: string) => {
    const newForms = [...forms];
    newForms[index] = { ...newForms[index], [field]: value };
    setForms(newForms);
    
    // Validate on blur
    validateForm(newForms[index], index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate inputs
    for (const form of forms) {
      if (!form.url) {
        setError('All URL fields are required');
        return;
      }
      if (!isValidUrl(form.url)) {
        setError('Please enter valid URLs');
        return;
      }
      if (form.shortcode && !/^[a-zA-Z0-9]{4,12}$/.test(form.shortcode)) {
        setError('Shortcodes must be 4-12 alphanumeric characters');
        return;
      }
      const minutes = parseInt(form.validityMinutes);
      if (isNaN(minutes) || minutes < 1) {
        setError('Validity minutes must be positive integers');
        return;
      }
    }

    try {
      const requests: ShortenRequest[] = forms.map(form => ({
        url: form.url,
        validityMinutes: parseInt(form.validityMinutes),
        shortcode: form.shortcode || undefined
      }));

      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requests)
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URLs');
      }

      const data = await response.json();
      onUrlsShortened(data);
      setSuccess(true);
      setForms([{ url: '', validityMinutes: '30', shortcode: '' }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to shorten URLs');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Shorten up to 5 URLs at once
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter the URLs you want to shorten. Each URL can have an optional custom shortcode and validity period.
        </Typography>
      </Box>
      
      <form onSubmit={handleSubmit}>
        {forms.map((form, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="URL to Shorten"
                value={form.url}
                onChange={(e) => updateForm(index, 'url', e.target.value)}
                onBlur={() => validateForm(form, index)}
                error={Boolean(form.urlError)}
                helperText={form.urlError}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                required
                label="Validity (minutes)"
                type="number"
                value={form.validityMinutes}
                onChange={(e) => updateForm(index, 'validityMinutes', e.target.value)}
                onBlur={() => validateForm(form, index)}
                error={Boolean(form.validityError)}
                helperText={form.validityError}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Time in minutes until the URL expires">
                      <InfoIcon color="action" sx={{ ml: 1 }} />
                    </Tooltip>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Custom Shortcode (optional)"
                value={form.shortcode}
                onChange={(e) => updateForm(index, 'shortcode', e.target.value)}
                onBlur={() => validateForm(form, index)}
                error={Boolean(form.shortcodeError)}
                helperText={form.shortcodeError || '4-12 alphanumeric characters'}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              {forms.length > 1 && (
                <IconButton 
                  onClick={() => removeForm(index)} 
                  color="error"
                  size="large"
                  sx={{ mt: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}

        <Box sx={{ mb: 2 }}>
          {forms.length < 5 && (
            <Button
              startIcon={<AddIcon />}
              onClick={addForm}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Add URL
            </Button>
          )}
          <Button type="submit" variant="contained">
            Shorten URLs
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            URLs shortened successfully!
          </Alert>
        )}
      </form>
    </Paper>
  );
}
