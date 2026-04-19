
import { useParams, Link } from 'react-router-dom';
import { Typography, Paper, Button, Box } from '@mui/material';

export default function SubmissionSuccess() {
  const { id } = useParams();

  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" color="success.main" gutterBottom>
        Success!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your article has been successfully submitted.
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Submission ID: <strong>{id}</strong>
      </Typography>

      <Box mt={4}>
        <Button variant="contained" component={Link} to="/">
          Submit Another Article
        </Button>
      </Box>
    </Paper>
  );
}
