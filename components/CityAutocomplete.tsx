import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

interface CityAutocompleteProps {
  value: string;
  selectedCountry?: string;
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
}

export default function CityAutocomplete({ value, selectedCountry, onChange, label = "City", required = false }: CityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (inputValue.length < 1) {
      setOptions([]);
      return undefined;
    }

    setLoading(true);

    // Connect to Open-Meteo Global Geocoding API
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputValue)}&count=100&language=en&format=json`)
      .then((res) => res.json())
      .then((data) => {
        console.log('INPUT:', inputValue);
        console.log('SELECTED COUNTRY:', selectedCountry);
        console.log('API RESULTS:', data.results);
        if (active) {
          if (data.results) {
            let filteredResults = data.results;
            if (selectedCountry) {
              const selected = selectedCountry.toLowerCase().trim();

              filteredResults = filteredResults.filter((item: any) => {
                console.log('CITY:', item.name, '| API COUNTRY:', item.country, '| SELECTED:', selectedCountry);

                const apiCountry = item.country?.toLowerCase().trim();
                return apiCountry === selected;
              });
            }
            console.log('FILTERED RESULTS:', filteredResults);

            const names = filteredResults.map((item: any) => {
              if (item.admin1) return `${item.name}, ${item.admin1}`;
              return item.name;
            });
            const uniqueNames = Array.from(new Set<string>(names));
            setOptions(uniqueNames);
          } else {
            setOptions([]);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [inputValue, value, selectedCountry]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
        onChange(newInputValue);
      }}
      value={value}
      onChange={(_, newValue) => onChange(newValue || '')}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
