import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Paper, TextField, Button, Box, Divider, Grid } from '@mui/material';
import { api } from '../services/api';

export default function AuthorRevision() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sub, setSub] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [article, setArticle] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  useEffect(() => {
    api.get(`/submissions/${id}`).then(res => {
      setSub(res.data);
      setTitle(res.data.title);
      setAbstract(res.data.abstract);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('abstract', abstract);
      if (article) formData.append('article', article);
      if (cover) formData.append('cover_letter', cover);

      await api.patch(`/submissions/${id}/revision`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/success/${id}`);
    } catch (error) {
      console.error(error);
      alert('Error submitting revision. Please check if the submission is in "Author Revision Required" status.');
    }
  };

  if (!sub) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Author Revision: {sub.title}</Typography>
      
      <Box mb={4} p={2} bgcolor="#fff3e0" borderRadius={1}>
        <Typography variant="subtitle1" color="error" gutterBottom>Revision Requests from Editor:</Typography>
        <ul style={{ margin: 0 }}>
          {sub.notes?.filter((n: any) => n.note_type === 'Revision Required').map((n: any) => (
            <li key={n.id}>{n.note_text}</li>
          ))}
        </ul>
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Title (Update if needed)" value={title} onChange={e => setTitle(e.target.value)} required margin="normal" />
        <TextField fullWidth label="Abstract (Update if needed)" multiline rows={4} value={abstract} onChange={e => setAbstract(e.target.value)} required margin="normal" />

        <Box my={3}>
          <Typography variant="h6">Updated Files</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" gutterBottom>New Article File</Typography>
              <input type="file" onChange={e => setArticle(e.target.files?.[0] || null)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" gutterBottom>New Cover Letter</Typography>
              <input type="file" onChange={e => setCover(e.target.files?.[0] || null)} />
            </Grid>
          </Grid>
        </Box>

        <Box mt={4} textAlign="center">
          <Button type="submit" variant="contained" color="secondary" size="large">Resubmit Article</Button>
        </Box>
      </form>
    </Paper>
  );
}
