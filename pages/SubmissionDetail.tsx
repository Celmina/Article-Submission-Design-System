import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper, Chip, Divider, Box, Grid } from '@mui/material';
import { format } from 'date-fns';

export default function SubmissionDetail() {
  const { id } = useParams();
  const [sub, setSub] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      const foundSubmission = savedSubmissions.find((item: any) => String(item.id) === String(id));
      setSub(foundSubmission || null);
    } catch (err) {
      console.error('Failed to load submission detail from localStorage:', err);
      setSub(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!sub) return <Typography>Submission not found.</Typography>;

  const primaryAuthor =
    Array.isArray(sub.authors) && sub.authors.length > 0 ? sub.authors[0] : null;

  const coAuthors =
    Array.isArray(sub.authors) && sub.authors.length > 1 ? sub.authors.slice(1) : [];

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {sub.title || '-'}
      </Typography>

      <Box mb={2}>
        <Chip label={sub.phase || 'New Submission'} />
        <Chip
          label={sub.status || 'Pending Review'}
          color="primary"
          variant="outlined"
          sx={{ ml: 1 }}
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Submission ID
          </Typography>
          <Typography>{sub.id}</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Submitted
          </Typography>
          <Typography>
            {sub.created_at ? format(new Date(sub.created_at), 'PPP pp') : '-'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Journal
          </Typography>
          <Typography>{sub.journal_title || '-'}</Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Abstract
          </Typography>
          <Typography>{sub.abstract || '-'}</Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Keywords
          </Typography>
          <Typography>
            {Array.isArray(sub.keywords) ? sub.keywords.join(', ') : '-'}
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" mt={3}>
        Primary Author
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {primaryAuthor ? (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Name
            </Typography>
            <Typography>
              {primaryAuthor.first_name || ''} {primaryAuthor.last_name || ''}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography>{primaryAuthor.email || '-'}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Degree and Position
            </Typography>
            <Typography>{primaryAuthor.degree_position || '-'}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Faculty
            </Typography>
            <Typography>{primaryAuthor.faculty || '-'}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Department
            </Typography>
            <Typography>{primaryAuthor.department || '-'}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              University
            </Typography>
            <Typography>{primaryAuthor.university || '-'}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Country
            </Typography>
            <Typography>{primaryAuthor.country || '-'}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              City
            </Typography>
            <Typography>{primaryAuthor.city || '-'}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              ORCID
            </Typography>
            <Typography>{primaryAuthor.orcid || '-'}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Researcher ID
            </Typography>
            <Typography>{primaryAuthor.researcher_id || '-'}</Typography>
          </Grid>
        </Grid>
      ) : (
        <Typography sx={{ mb: 3 }}>No primary author data.</Typography>
      )}

      <Typography variant="h6" mt={3}>
        Co-Authors
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {coAuthors.length === 0 ? (
        <Typography>No co-authors.</Typography>
      ) : (
        coAuthors.map((author: any, index: number) => (
          <Box
            key={index}
            sx={{ mb: 2, p: 2, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 2 }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Co-Author #{index + 1}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Name
                </Typography>
                <Typography>
                  {author.first_name || ''} {author.last_name || ''}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography>{author.email || '-'}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Degree and Position
                </Typography>
                <Typography>{author.degree_position || '-'}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Faculty
                </Typography>
                <Typography>{author.faculty || '-'}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Department
                </Typography>
                <Typography>{author.department || '-'}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  University
                </Typography>
                <Typography>{author.university || '-'}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  ORCID
                </Typography>
                <Typography>{author.orcid || '-'}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Researcher ID
                </Typography>
                <Typography>{author.researcher_id || '-'}</Typography>
              </Grid>
            </Grid>
          </Box>
        ))
      )}

      <Typography variant="h6" mt={3}>
        Files
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Article File
          </Typography>
          <Typography>{sub.article_file_name || '-'}</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Cover Letter File
          </Typography>
          <Typography>{sub.cover_letter_file_name || '-'}</Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" mt={3}>
        Comment to Submission
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography>{sub.comments || '-'}</Typography>
    </Paper>
  );
}