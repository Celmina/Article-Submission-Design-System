import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

interface UniversityAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
}

export default function UniversityAutocomplete({ value, onChange, label = "University", required = false }: UniversityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (inputValue.length < 3) {
      setOptions(value ? [value] : []);
      return undefined;
    }

    setLoading(true);
    // Connect to global hipolabs university search public API
    fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(inputValue)}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          const names = data.map((item: any) => item.name);
          const uniqueNames = Array.from(new Set<string>(names)).slice(0, 50); // limit to 50
          setOptions(uniqueNames);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [inputValue, value]);

  return (
    <Autocomplete
      freeSolo
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
