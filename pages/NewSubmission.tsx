import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Card, TextField, Button, Box, Grid, Divider, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { COUNTRIES } from '../utils/countries';
import UniversityAutocomplete from '../components/UniversityAutocomplete';
import CityAutocomplete from '../components/CityAutocomplete';

const JOURNALS = [
  'Artificial Intelligence (ISSN: 0004-3702)',
  'Journal of Artificial Intelligence Research (ISSN: 1076-9757)',
  'IEEE Transactions on Artificial Intelligence (ISSN: 2691-4581)',
  'ACM Transactions on Intelligent Systems and Technology (ISSN: 2157-6904)',
  'Artificial Intelligence Review (ISSN: 0269-2821)',
  'Machine Learning (ISSN: 0885-6125)',
  'Neural Networks (ISSN: 0893-6080)',
  'Pattern Recognition (ISSN: 0031-3203)',
  'Information Sciences (ISSN: 0020-0255)',
  'Knowledge-Based Systems (ISSN: 0950-7051)',
  'IEEE Transactions on Pattern Analysis and Machine Intelligence (ISSN: 0162-8828)',
  'IEEE Transactions on Neural Networks and Learning Systems (ISSN: 2162-237X)',
  'IEEE Transactions on Knowledge and Data Engineering (ISSN: 1041-4347)',
  'ACM Computing Surveys (ISSN: 0360-0300)',
  'ACM Transactions on Interactive Intelligent Systems (ISSN: 2160-6455)'
];

const DEGREE_POSITIONS = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
  'Senior Lecturer',
  'Researcher',
  'Senior Researcher',
  'PhD Student',
  'Doctoral Candidate',
  'Postdoctoral Researcher'
];

const FACULTIES = [
  'Faculty of Engineering',
  'Faculty of Computer Science',
  'Faculty of Information Technology',
  'Faculty of Mathematics',
  'Faculty of Natural Sciences',
  'Faculty of Business and Economics'
];

const DEPARTMENTS = [
  'Department of Artificial Intelligence',
  'Department of Information Systems',
  'Department of Computer Science',
  'Department of Software Engineering',
  'Department of Data Science',
  'Department of Cybersecurity'
];

const EMPTY_COAUTHOR = {
  first_name: '',
  last_name: '',
  email: '',
  orcid: '',
  researcher_id: '',
  degree_position: '',
  faculty: '',
  department: '',
  university: ''
};

export default function NewSubmission() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Journal
    journal_title: '',
    // Article
    title: '',
    abstract: '',
    keywords: '',
    comments: '',

    // Primary Author
    first_name: '',
    last_name: '',
    email: '',
    webpage: '',
    researcher_id: '',
    orcid: '',

    // Affiliation
    degree_position: '',
    faculty: '',
    department: '',
    university: '',
    country: '',
    city: '',
  });



  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const [coAuthors, setCoAuthors] = useState<any[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any) => {
    if (e.target.name === 'keywords') {
      const parts = e.target.value.split(',');
      if (parts.length > 10) return;
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCoAuthorChange = (index: number, field: string, value: string) => {
    const updated = [...coAuthors];
    updated[index] = { ...updated[index], [field]: value };
    setCoAuthors(updated);
  };

  const addCoAuthor = () => setCoAuthors([...coAuthors, { ...EMPTY_COAUTHOR }]);
  const removeCoAuthor = (index: number) => {
    setCoAuthors(coAuthors.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!articleFile) return alert('Please attach the Article manuscript.');
    if (!coverLetterFile) return alert('Please attach the Cover Letter.');

    setIsSubmitting(true);

    try {
      const kwArray = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k)
        .slice(0, 10);

      const authors = [
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          webpage: formData.webpage,
          researcher_id: formData.researcher_id,
          orcid: formData.orcid,
          degree_position: formData.degree_position,
          faculty: formData.faculty,
          department: formData.department,
          university: formData.university,
          country: formData.country,
          city: formData.city,
          is_primary: true,
          author_order: 1
        },
        ...coAuthors
          .filter(c => c.first_name || c.last_name || c.email)
          .map((c, idx) => ({
            first_name: c.first_name,
            last_name: c.last_name,
            email: c.email,
            orcid: c.orcid,
            researcher_id: c.researcher_id,
            degree_position: c.degree_position,
            faculty: c.faculty,
            department: c.department,
            university: c.university,
            is_primary: false,
            author_order: idx + 2
          }))
      ];

      const newSubmission = {
        id: Date.now(),
        journal_title: formData.journal_title,
        title: formData.title,
        abstract: formData.abstract,
        comments: formData.comments,
        keywords: kwArray,
        authors,
        article_file_name: articleFile?.name || '',
        cover_letter_file_name: coverLetterFile?.name || '',
        created_at: new Date().toISOString()
      };

      const existingSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      existingSubmissions.push(newSubmission);
      localStorage.setItem('submissions', JSON.stringify(existingSubmissions));

      navigate(`/success/${newSubmission.id}`);
    } catch (err) {
      console.error('SUBMISSION ERROR:', err);
      alert('Failed to save submission locally.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ pb: 6, pt: 2, maxWidth: 1000, mx: 'auto' }}>
      <form onSubmit={handleSubmit}>

        {/* ── Page Title ── */}
        <Typography variant="h4" fontWeight="700" textAlign="center" sx={{ mb: 0.5 }}>
          New Article Submission
        </Typography>

        <Card sx={{ p: { xs: 2, md: 2 }, mt: 2 }}>

          {/* ════════════════════════════════════════════════
               SECTION 1 — Journal Selection
             ════════════════════════════════════════════════ */}
          <Typography variant="h6" fontWeight="700" textAlign="center" sx={{ mb: 2 }}>
            Journal Selection
          </Typography>

          <Autocomplete
            options={JOURNALS}
            value={formData.journal_title}
            onChange={(_, newVal) => setFormData(prev => ({ ...prev, journal_title: newVal || '' }))}
            renderInput={(params) => <TextField {...params} label="Journal Title" required />}
            sx={{ mb: 1 }}
          />
          <Typography variant="caption" color="textSecondary" sx={{ mb: 0 }}>
            Search active journals
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* ════════════════════════════════════════════════
               SECTION 2 — Author – Correspondent Personal Information
             ════════════════════════════════════════════════ */}
          <Typography variant="h6" fontWeight="700" textAlign="center" sx={{ mb: 3 }}>
            Author – Correspondent Personal Information
          </Typography>

          {/* Contact Information Block */}
          <Typography variant="subtitle2" color="primary" textAlign="center" sx={{ mb: 2 }}>
            Contact Information Block
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </Grid>
          </Grid>

          {/* Professional Occupation Block */}
          <Typography variant="subtitle2" color="primary" textAlign="center" sx={{ mb: 2 }}>
            Professional Occupation Block
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                freeSolo
                options={DEGREE_POSITIONS}
                value={formData.degree_position}
                onChange={(_, newVal) =>
                  setFormData(prev => ({ ...prev, degree_position: newVal || '' }))
                }
                inputValue={formData.degree_position}
                onInputChange={(_, newInputValue) =>
                  setFormData(prev => ({ ...prev, degree_position: newInputValue }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Degree and Position" required />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                freeSolo
                options={FACULTIES}
                value={formData.faculty}
                onChange={(_, newVal) =>
                  setFormData(prev => ({ ...prev, faculty: newVal || '' }))
                }
                inputValue={formData.faculty}
                onInputChange={(_, newInputValue) =>
                  setFormData(prev => ({ ...prev, faculty: newInputValue }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Faculty" required />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                freeSolo
                options={DEPARTMENTS}
                value={formData.department}
                onChange={(_, newVal) =>
                  setFormData(prev => ({ ...prev, department: newVal || '' }))
                }
                inputValue={formData.department}
                onInputChange={(_, newInputValue) =>
                  setFormData(prev => ({ ...prev, department: newInputValue }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Department" required />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <UniversityAutocomplete
                value={formData.university}
                onChange={(val) => setFormData(prev => ({ ...prev, university: val }))}
                required
              />
            </Grid>
          </Grid>

          {/* Business Address Block */}
          <Typography variant="subtitle2" color="primary" textAlign="center" sx={{ mb: 2 }}>
            Business Address Block
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                options={COUNTRIES}
                value={formData.country}
                onChange={(_, newVal) => setFormData(prev => ({ ...prev, country: newVal || '', city: '' }))}
                renderInput={(params) => <TextField {...params} label="Country" required />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CityAutocomplete
                selectedCountry={formData.country}
                value={formData.city}
                onChange={(val) => setFormData(prev => ({ ...prev, city: val }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Personal Webpage URL" name="webpage" value={formData.webpage} onChange={handleChange} />
            </Grid>
          </Grid>

          {/* ID's Block */}
          <Typography variant="subtitle2" color="primary" textAlign="center" sx={{ mb: 2 }}>
            ID's Block
          </Typography>
          <Grid container spacing={3} sx={{ mb: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Researcher ID" name="researcher_id" value={formData.researcher_id} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="ORCID iD" name="orcid" value={formData.orcid} onChange={handleChange} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* ════════════════════════════════════════════════
               SECTION 3 — Co-Authors
             ════════════════════════════════════════════════ */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
              Co-Authors
            </Typography>

            {coAuthors.length === 0 && (
              <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={addCoAuthor}>
                Add Co-author
              </Button>
            )}
          </Box>

          {coAuthors.map((author, index) => (
            <Box key={index} sx={{ mb: 3, p: 3, border: '1px solid rgba(0,0,0,0.12)', borderRadius: '12px', backgroundColor: '#fafafa' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" sx={{ mb: 0 }}>
                  Collaborator #{index + 1}
                </Typography>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => removeCoAuthor(index)}
                >
                  Remove Co-author
                </Button>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth size="small" label="First Name" value={author.first_name} onChange={(e) => handleCoAuthorChange(index, 'first_name', e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth size="small" label="Last Name" value={author.last_name} onChange={(e) => handleCoAuthorChange(index, 'last_name', e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth size="small" label="Email" type="email" value={author.email} onChange={(e) => handleCoAuthorChange(index, 'email', e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth size="small" label="ORCID" value={author.orcid} onChange={(e) => handleCoAuthorChange(index, 'orcid', e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth size="small" label="Researcher ID" value={author.researcher_id} onChange={(e) => handleCoAuthorChange(index, 'researcher_id', e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    freeSolo
                    options={DEGREE_POSITIONS}
                    value={author.degree_position}
                    onChange={(_, newVal) =>
                      handleCoAuthorChange(index, 'degree_position', newVal || '')
                    }
                    inputValue={author.degree_position}
                    onInputChange={(_, newInputValue) =>
                      handleCoAuthorChange(index, 'degree_position', newInputValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Degree and Position" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    freeSolo
                    options={FACULTIES}
                    value={author.faculty}
                    onChange={(_, newVal) =>
                      handleCoAuthorChange(index, 'faculty', newVal || '')
                    }
                    inputValue={author.faculty}
                    onInputChange={(_, newInputValue) =>
                      handleCoAuthorChange(index, 'faculty', newInputValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Faculty" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    freeSolo
                    options={DEPARTMENTS}
                    value={author.department}
                    onChange={(_, newVal) =>
                      handleCoAuthorChange(index, 'department', newVal || '')
                    }
                    inputValue={author.department}
                    onInputChange={(_, newInputValue) =>
                      handleCoAuthorChange(index, 'department', newInputValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Department" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <UniversityAutocomplete
                    value={author.university}
                    onChange={(val) => handleCoAuthorChange(index, 'university', val)}
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
          {coAuthors.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={addCoAuthor}>
                Add Co-author
              </Button>
            </Box>
          )}
          <Divider sx={{ my: 4 }} />

          {/* ════════════════════════════════════════════════
               SECTION 4 — Article Details
             ════════════════════════════════════════════════ */}
          <Typography variant="h6" fontWeight="700" textAlign="center" sx={{ mb: 3 }}>
            Article Details
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField fullWidth label="Article Title" name="title" value={formData.title} onChange={handleChange} required />

            <Box>
              <TextField fullWidth label="Article Abstract (Max 2000 chars)" name="abstract" value={formData.abstract} onChange={handleChange} required multiline rows={4} slotProps={{ htmlInput: { maxLength: 2000 } }} />
              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                {formData.abstract.length}/2000
              </Typography>
            </Box>

            <TextField fullWidth label="Key words (Limited to 10 words, comma separated)" name="keywords" value={formData.keywords} onChange={handleChange} />

            {/* File Upload Row */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1, fontWeight: 600 }}>
                    Attach Article* (Word, PDF)
                  </Typography>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setArticleFile(e.target.files ? e.target.files[0] : null)}
                    required
                    style={{ color: '#7b809a', maxWidth: '100%', fontSize: '0.8rem' }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1, fontWeight: 600 }}>
                    Attach Cover Letter* (PDF)
                  </Typography>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setCoverLetterFile(e.target.files ? e.target.files[0] : null)}
                    required
                    style={{ color: '#7b809a', maxWidth: '100%', fontSize: '0.8rem' }}
                  />
                </Box>
              </Grid>
            </Grid>

            <TextField fullWidth label="Comment to Submission" name="comments" value={formData.comments} onChange={handleChange} multiline rows={2} />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* ── Submit ── */}
          <Box display="flex" justifyContent="center">
            <Button disabled={isSubmitting} variant="contained" color="primary" size="large" type="submit" sx={{ px: 8, py: 1.5, fontSize: '1rem' }}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>

        </Card>
      </form>
    </Box>
  );
}
