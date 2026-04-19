import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Box,
  Grid,
  Divider,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { format } from 'date-fns';

export default function SubmissionList() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      setSubmissions(savedSubmissions);
    } catch (err) {
      console.error('Failed to load local submissions:', err);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const pending = submissions.filter((s: any) =>
    (s.status || 'Pending').includes('Review') || (s.status || 'Pending').includes('Pending')
  ).length;

  const revisions = submissions.filter((s: any) =>
    (s.status || '').includes('Revision')
  ).length;

  const published = submissions.filter((s: any) =>
    (s.status || '') === 'Published'
  ).length;

  return (
    <Box sx={{ pb: 3 }}>
      <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
        {[
          {
            title: 'Total Submissions',
            value: submissions.length,
            icon: <ArticleIcon sx={{ color: '#fff' }} />,
            bg: 'linear-gradient(195deg, #42424a, #191919)',
            desc: 'Saved locally',
          },
          {
            title: 'Pending Reviews',
            value: pending,
            icon: <PendingActionsIcon sx={{ color: '#fff' }} />,
            bg: 'linear-gradient(195deg, #49a3f1, #1A73E8)',
            desc: 'Default local status',
          },
          {
            title: 'Active Revisions',
            value: revisions,
            icon: <AutorenewIcon sx={{ color: '#fff' }} />,
            bg: 'linear-gradient(195deg, #66BB6A, #43A047)',
            desc: 'Local demo data',
          },
          {
            title: 'Published',
            value: published,
            icon: <AssignmentTurnedInIcon sx={{ color: '#fff' }} />,
            bg: 'linear-gradient(195deg, #EC407A, #D81B60)',
            desc: 'Successfully closed',
          },
        ].map((stat, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card sx={{ height: '100%' }}>
              <Box display="flex" justifyContent="space-between" pt={1} px={2}>
                <Box
                  sx={{
                    background: stat.bg,
                    borderRadius: '12px',
                    width: '64px',
                    height: '64px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(64,64,64,.4)',
                    mt: -3,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box textAlign="right" lineHeight={1.25}>
                  <Typography
                    variant="button"
                    fontWeight="400"
                    color="textSecondary"
                    textTransform="capitalize"
                  >
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" color="textPrimary" sx={{ mt: 0.5 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mx: 2, mb: 1, mt: 2 }} />
              <Box pb={2} px={2}>
                <Typography
                  component="p"
                  variant="button"
                  color="textSecondary"
                  sx={{ fontSize: '0.875rem', fontWeight: 300, textTransform: 'none' }}
                >
                  {stat.desc}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mx: 'auto', overflow: 'visible' }}>
        <Box
          sx={{
            mx: 2,
            mt: -3,
            py: 2.5,
            px: 2,
            background: 'linear-gradient(195deg, #EC407A, #D81B60)',
            borderRadius: '12px',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(233,30,99,.4)',
          }}
        >
          <Typography variant="h6" color="#ffffff" sx={{ m: 0 }}>
            Authors Submissions Table
          </Typography>
        </Box>

        <Box sx={{ p: 3, pt: 1, overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {['ID', 'Title', 'Authors', 'Journal', 'Phase', 'Status', 'Submitted'].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      color: '#7b809a',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      opacity: 0.7,
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #f0f2f5',
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>Loading...</TableCell>
                </TableRow>
              ) : submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>No submissions saved locally yet.</TableCell>
                </TableRow>
              ) : (
                submissions.map((sub: any) => {
                  const authorNames = Array.isArray(sub.authors)
                    ? sub.authors
                      .map((author: any) => `${author.first_name || ''} ${author.last_name || ''}`.trim())
                      .filter(Boolean)
                      .join(', ')
                    : '';

                  const createdDate = sub.created_at || sub.createdAt;
                  const status = sub.status || 'Pending';
                  const phase = sub.phase || 'New Submission';

                  return (
                    <TableRow key={sub.id}>
                      <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1px solid #f0f2f5' }}>
                        <Link
                          to={`/internal/${sub.id}`}
                          style={{
                            color: '#1A73E8',
                            textDecoration: 'underline',
                            fontWeight: 600,
                          }}
                        >
                          {sub.id}
                        </Link>
                      </TableCell>

                      <TableCell
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          borderBottom: '1px solid #f0f2f5',
                          color: '#344767',
                        }}
                      >
                        {sub.title}
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1px solid #f0f2f5' }}>
                        {authorNames || '-'}
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1px solid #f0f2f5' }}>
                        {sub.journal_title || '-'}
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1px solid #f0f2f5' }}>
                        {phase}
                      </TableCell>

                      <TableCell sx={{ borderBottom: '1px solid #f0f2f5' }}>
                        <Chip
                          label={status}
                          size="small"
                          sx={{ fontSize: '0.75rem', fontWeight: 600, borderRadius: '8px' }}
                          color={status.includes('Revision') ? 'warning' : 'success'}
                        />
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1px solid #f0f2f5' }}>
                        {createdDate ? format(new Date(createdDate), 'MMM d, yyyy') : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}