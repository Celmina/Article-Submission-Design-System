import { useEffect, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

type CityAutocompleteProps = {
  selectedCountry: string;
  value: string;
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
};

type CityApiItem = {
  name?: string;
  country?: string;
  admin1?: string;
};

export default function CityAutocomplete({
  selectedCountry,
  value,
  onChange,
  label = 'City',
  required = false,
  error = false,
  helperText = ' ',
}: CityAutocompleteProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = value.trim();

    if (!selectedCountry.trim()) {
      setOptions([]);
      setLoading(false);
      return;
    }

    if (query.length < 2) {
      setOptions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
      )}&count=100&language=en&format=json`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => {
        const results: CityApiItem[] = Array.isArray(data?.results) ? data.results : [];

        const filtered = results.filter(
          (item) =>
            (item.country || '').trim().toLowerCase() ===
            selectedCountry.trim().toLowerCase()
        );

        const names = filtered.map((item) =>
          item.admin1 ? `${item.name}, ${item.admin1}` : item.name || ''
        );

        setOptions([...new Set(names.filter(Boolean))].slice(0, 50));
      })
      .catch((err: unknown) => {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          console.error('City fetch error:', err);
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
      disabled={!selectedCountry}
      noOptionsText={
        !selectedCountry
          ? 'Select country first'
          : value.trim().length < 2
            ? 'Type at least 2 letters'
            : 'No cities found'
      }
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          size="small"
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          placeholder={selectedCountry ? 'Start typing city...' : 'Select country first'}
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