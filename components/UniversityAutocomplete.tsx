import { useEffect, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

type UniversityAutocompleteProps = {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
  selectedCountry?: string;
  error?: boolean;
  helperText?: string;
};

type UniversityApiItem = {
  name?: string;
};

export default function UniversityAutocomplete({
  value,
  onChange,
  label = 'University',
  required = false,
  selectedCountry = '',
  error = false,
  helperText = ' ',
}: UniversityAutocompleteProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = value.trim();

    if (query.length < 2) {
      setOptions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({ name: query });

    if (selectedCountry.trim()) {
      params.append('country', selectedCountry.trim());
    }

    setLoading(true);

    fetch(`https://universities.hipolabs.com/search?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: UniversityApiItem[]) => {
        const names = Array.isArray(data)
          ? data.map((item) => item.name || '').filter(Boolean)
          : [];

        setOptions([...new Set(names)].slice(0, 50));
      })
      .catch((err: unknown) => {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          console.error('University fetch error:', err);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [value, selectedCountry]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      inputValue={value}
      onInputChange={(_, newInputValue) => onChange(newInputValue)}
      onChange={(_, newValue) => onChange(typeof newValue === 'string' ? newValue : '')}
      loading={loading}
      noOptionsText={value.trim().length < 2 ? 'Type at least 2 letters' : 'No universities found'}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          size="small"
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}