import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
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
  'ACM Transactions on Interactive Intelligent Systems (ISSN: 2160-6455)',
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
  'Postdoctoral Researcher',
];

const FACULTIES = [
  'Faculty of Engineering',
  'Faculty of Computer Science',
  'Faculty of Information Technology',
  'Faculty of Mathematics',
  'Faculty of Natural Sciences',
  'Faculty of Business and Economics',
];

const DEPARTMENTS = [
  'Department of Artificial Intelligence',
  'Department of Information Systems',
  'Department of Computer Science',
  'Department of Software Engineering',
  'Department of Data Science',
  'Department of Cybersecurity',
];

type FormDataState = {
  journal_title: string;
  title: string;
  abstract: string;
  keywords: string;
  comments: string;

  first_name: string;
  last_name: string;
  email: string;
  webpage: string;
  researcher_id: string;
  orcid: string;

  degree_position: string;
  faculty: string;
  department: string;
  university: string;
  country: string;
  city: string;

  consent_original: boolean;
  consent_authors: boolean;
  consent_privacy: boolean;
};

type CoAuthor = {
  first_name: string;
  last_name: string;
  email: string;
  orcid: string;
  researcher_id: string;
  degree_position: string;
  faculty: string;
  department: string;
  university: string;
  country: string;
  city: string;
};

type Errors = Partial<Record<string, string>>;

const EMPTY_FORM: FormDataState = {
  journal_title: '',
  title: '',
  abstract: '',
  keywords: '',
  comments: '',

  first_name: '',
  last_name: '',
  email: '',
  webpage: '',
  researcher_id: '',
  orcid: '',

  degree_position: '',
  faculty: '',
  department: '',
  university: '',
  country: '',
  city: '',

  consent_original: false,
  consent_authors: false,
  consent_privacy: false,
};

const EMPTY_COAUTHOR: CoAuthor = {
  first_name: '',
  last_name: '',
  email: '',
  orcid: '',
  researcher_id: '',
  degree_position: '',
  faculty: '',
  department: '',
  university: '',
  country: '',
  city: '',
};

const DRAFT_STORAGE_KEY = 'newSubmissionDraft';

function generateId() {
  return String(Date.now());
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function SuggestionField({
  label,
  value,
  onChange,
  options,
  required = false,
  error = false,
  helperText = ' ',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  error?: boolean;
  helperText?: string;
}) {
  return (
    <Autocomplete
      freeSolo
      options={options}
      inputValue={value}
      onInputChange={(_, newInputValue) => onChange(newInputValue)}
      onChange={(_, newValue) => onChange(typeof newValue === 'string' ? newValue : '')}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          size="small"
          label={label}
          required={required}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
}

export default function NewSubmission() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataState>(EMPTY_FORM);
  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([]);
  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [supplementaryFiles, setSupplementaryFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [banner, setBanner] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (parsed?.formData) {
        setFormData({ ...EMPTY_FORM, ...parsed.formData });
      }
      if (Array.isArray(parsed?.coAuthors)) {
        setCoAuthors(parsed.coAuthors);
      }
      setBanner({
        type: 'info',
        text: 'Draft restored. Files need to be uploaded again.',
      });
    } catch {
      // ignore bad draft
    }
  }, []);

  const keywordCount = useMemo(() => {
    return formData.keywords
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean).length;
  }, [formData.keywords]);

  const abstractLength = formData.abstract.length;

  const updateField = <K extends keyof FormDataState>(key: K, value: FormDataState[K]) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'country') {
        next.city = '';
      }
      return next;
    });

    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      if (key === 'country') delete next.city;
      return next;
    });
  };

  const updateCoAuthor = (index: number, field: keyof CoAuthor, value: string) => {
    setCoAuthors((prev) =>
      prev.map((author, i) =>
        i === index
          ? {
            ...author,
            [field]: value,
            ...(field === 'country' ? { city: '' } : {}),
          }
          : author
      )
    );
  };

  const addCoAuthor = () => {
    setCoAuthors((prev) => [...prev, { ...EMPTY_COAUTHOR }]);
  };

  const removeCoAuthor = (index: number) => {
    setCoAuthors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSupplementaryFiles = (files: FileList | null) => {
    const selected = Array.from(files || []);
    if (!selected.length) return;

    setSupplementaryFiles((prev) => {
      const merged = [...prev];
      selected.forEach((file) => {
        const exists = merged.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        );
        if (!exists) merged.push(file);
      });
      return merged;
    });
  };

  const removeSupplementaryFile = (index: number) => {
    setSupplementaryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const nextErrors: Errors = {};

    if (!formData.journal_title.trim()) nextErrors.journal_title = 'Journal is required.';
    if (!formData.title.trim()) nextErrors.title = 'Article title is required.';
    if (!formData.abstract.trim()) nextErrors.abstract = 'Abstract is required.';
    if (!formData.keywords.trim()) nextErrors.keywords = 'Keywords are required.';

    if (!formData.first_name.trim()) nextErrors.first_name = 'First name is required.';
    if (!formData.last_name.trim()) nextErrors.last_name = 'Last name is required.';
    if (!formData.email.trim()) nextErrors.email = 'Email is required.';
    else if (!isValidEmail(formData.email)) nextErrors.email = 'Enter a valid email address.';

    if (!formData.degree_position.trim()) nextErrors.degree_position = 'Degree and position is required.';
    if (!formData.faculty.trim()) nextErrors.faculty = 'Faculty is required.';
    if (!formData.department.trim()) nextErrors.department = 'Department is required.';
    if (!formData.university.trim()) nextErrors.university = 'University is required.';
    if (!formData.country.trim()) nextErrors.country = 'Country is required.';
    if (!formData.city.trim()) nextErrors.city = 'City is required.';

    if (!articleFile) nextErrors.article_file = 'Article manuscript is required.';
    if (!coverLetterFile) nextErrors.cover_letter_file = 'Cover letter is required.';

    if (!formData.consent_original) nextErrors.consent_original = 'This confirmation is required.';
    if (!formData.consent_authors) nextErrors.consent_authors = 'This confirmation is required.';
    if (!formData.consent_privacy) nextErrors.consent_privacy = 'You must agree to the privacy terms.';

    coAuthors.forEach((author, index) => {
      if (!author.first_name.trim()) nextErrors[`co_${index}_first_name`] = 'Required';
      if (!author.last_name.trim()) nextErrors[`co_${index}_last_name`] = 'Required';
      if (!author.email.trim()) nextErrors[`co_${index}_email`] = 'Required';
      else if (!isValidEmail(author.email)) nextErrors[`co_${index}_email`] = 'Invalid email';
      if (!author.university.trim()) nextErrors[`co_${index}_university`] = 'Required';
    });

    return nextErrors;
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        formData,
        coAuthors,
      })
    );

    setBanner({
      type: 'success',
      text: 'Draft saved locally.',
    });
  };

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setCoAuthors([]);
    setArticleFile(null);
    setCoverLetterFile(null);
    setSupplementaryFiles([]);
    setErrors({});
    setBanner(null);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setBanner({
        type: 'error',
        text: 'Please fix the highlighted fields before submitting.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const keywords = formData.keywords
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
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
          author_order: 1,
        },
        ...coAuthors.map((author, index) => ({
          first_name: author.first_name,
          last_name: author.last_name,
          email: author.email,
          researcher_id: author.researcher_id,
          orcid: author.orcid,
          degree_position: author.degree_position,
          faculty: author.faculty,
          department: author.department,
          university: author.university,
          country: author.country,
          city: author.city,
          is_primary: false,
          author_order: index + 2,
        })),
      ];

      const newSubmission = {
        id: generateId(),
        status: 'Submitted',
        phase: 'Initial Review',
        journal_title: formData.journal_title,
        title: formData.title,
        abstract: formData.abstract,
        comments: formData.comments,
        keywords,
        authors,
        article_file_name: articleFile?.name || '',
        cover_letter_file_name: coverLetterFile?.name || '',
        supplementary_files: supplementaryFiles.map((file) => file.name),
        created_at: new Date().toISOString(),
      };

      const existingSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      existingSubmissions.push(newSubmission);
      localStorage.setItem('submissions', JSON.stringify(existingSubmissions));
      localStorage.removeItem(DRAFT_STORAGE_KEY);

      navigate(`/success/${newSubmission.id}`);
    } catch (error) {
      console.error('SUBMISSION ERROR:', error);
      setBanner({
        type: 'error',
        text: 'Failed to save submission locally.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldGrid = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    gap: 2,
  };

  return (
    <Box sx={{ pb: 6, pt: 2, maxWidth: 1000, mx: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 0.5 }}>
          New Article Submission
        </Typography>

        <Card sx={{ p: { xs: 2, md: 3 }, mt: 2 }}>
          {banner && (
            <Alert severity={banner.type} sx={{ mb: 3 }}>
              {banner.text}
            </Alert>
          )}

          <Typography variant="h6" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
            Journal Selection
          </Typography>

          <SuggestionField
            label="Journal Title"
            value={formData.journal_title}
            onChange={(value) => updateField('journal_title', value)}
            options={JOURNALS}
            required
            error={Boolean(errors.journal_title)}
            helperText={errors.journal_title || 'Search active journals'}
          />

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" fontWeight={700} textAlign="center" sx={{ mb: 3 }}>
            Author – Correspondent Personal Information
          </Typography>

          <Typography variant="subtitle2" color="primary" textAlign="center" sx={{ mb: 2 }}>
            Contact Information
          </Typography>

          <Box sx={fieldGrid}>
            <TextField
              fullWidth
              size="small"
              label="First Name"
              value={formData.first_name}
              onChange={(e) => updateField('first_name', e.target.value)}
              required
              error={Boolean(errors.first_name)}
              helperText={errors.first_name || ' '}
            />

            <TextField
              fullWidth
              size="small"
              label="Last Name"
              value={formData.last_name}
              onChange={(e) => updateField('last_name', e.target.value)}
              required
              error={Boolean(errors.last_name)}
              helperText={errors.last_name || ' '}
            />
          </Box>

          <Typography variant="subtitle2" color="primary" textAlign="center" sx={{ mt: 3, mb: 2 }}>
            Professional Occupation
          </Typography>

          <Box sx={fieldGrid}>
            <SuggestionField
              label="Degree and Position"
              value={formData.degree_position}
              onChange={(value) => updateField('degree_position', value)}
              options={DEGREE_POSITIONS}
              required
              error={Boolean(errors.degree_position)}
              helperText={errors.degree_position || ' '}
            />

            <SuggestionField
              label="Faculty"
              value={formData.faculty}
              onChange={(value) => updateField('faculty', value)}
              options={FACULTIES}
              required
              error={Boolean(errors.faculty)}
              helperText={errors.faculty || ' '}
            />

            <SuggestionField
              label="Department"
              value={formData.department}
              onChange={(value) => updateField('department', value)}
              options={DEPARTMENTS}
              required
              error={Boolean(errors.department)}
              helperText={errors.department || ' '}
            />

            <UniversityAutocomplete
              value={formData.university}
              onChange={(value) => updateField('university', value)}
              selectedCountry={formData.country}
              required
              error={Boolean(errors.university)}
              helperText={errors.university || ' '}
            />
          </Box>

          <Typography variant="subtitle2" color="primary" textAlign="center" sx={{ mt: 3, mb: 2 }}>
            Business Address
          </Typography>

          <Box sx={fieldGrid}>
            <Autocomplete
              freeSolo
              options={COUNTRIES}
              inputValue={formData.country}
              onInputChange={(_, newInputValue) => updateField('country', newInputValue)}
              onChange={(_, newValue) => updateField('country', typeof newValue === 'string' ? newValue : '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  label="Country"
                  required
                  error={Boolean(errors.country)}
                  helperText={errors.country || ' '}
                />
              )}
            />

            <CityAutocomplete
              selectedCountry={formData.country}
              value={formData.city}
              onChange={(value) => updateField('city', value)}
              required
              error={Boolean(errors.city)}
              helperText={errors.city || ' '}
            />

            <TextField
              fullWidth
              size="small"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
              error={Boolean(errors.email)}
              helperText={errors.email || ' '}
            />

            <TextField
              fullWidth
              size="small"
              label="Personal Webpage URL"
              value={formData.webpage}
              onChange={(e) => updateField('webpage', e.target.value)}
              helperText=" "
            />
          </Box>

          <Typography variant="subtitle2" color="primary" textAlign="center" sx={{ mt: 3, mb: 2 }}>
            IDs
          </Typography>

          <Box sx={fieldGrid}>
            <TextField
              fullWidth
              size="small"
              label="Researcher ID"
              value={formData.researcher_id}
              onChange={(e) => updateField('researcher_id', e.target.value)}
              helperText=" "
            />

            <TextField
              fullWidth
              size="small"
              label="ORCID iD"
              value={formData.orcid}
              onChange={(e) => updateField('orcid', e.target.value)}
              helperText=" "
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Co-Authors
            </Typography>

            <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={addCoAuthor} type="button">
              Add Co-author
            </Button>
          </Box>

          {coAuthors.map((author, index) => (
            <Box
              key={index}
              sx={{
                mb: 3,
                p: 3,
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 2,
                backgroundColor: '#fafafa',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2">Collaborator #{index + 1}</Typography>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => removeCoAuthor(index)}
                  type="button"
                >
                  Remove
                </Button>
              </Box>

              <Box sx={fieldGrid}>
                <TextField
                  fullWidth
                  size="small"
                  label="First Name"
                  value={author.first_name}
                  onChange={(e) => updateCoAuthor(index, 'first_name', e.target.value)}
                  error={Boolean(errors[`co_${index}_first_name`])}
                  helperText={errors[`co_${index}_first_name`] || ' '}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Last Name"
                  value={author.last_name}
                  onChange={(e) => updateCoAuthor(index, 'last_name', e.target.value)}
                  error={Boolean(errors[`co_${index}_last_name`])}
                  helperText={errors[`co_${index}_last_name`] || ' '}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  type="email"
                  value={author.email}
                  onChange={(e) => updateCoAuthor(index, 'email', e.target.value)}
                  error={Boolean(errors[`co_${index}_email`])}
                  helperText={errors[`co_${index}_email`] || ' '}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="ORCID"
                  value={author.orcid}
                  onChange={(e) => updateCoAuthor(index, 'orcid', e.target.value)}
                  helperText=" "
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Researcher ID"
                  value={author.researcher_id}
                  onChange={(e) => updateCoAuthor(index, 'researcher_id', e.target.value)}
                  helperText=" "
                />

                <SuggestionField
                  label="Degree and Position"
                  value={author.degree_position}
                  onChange={(value) => updateCoAuthor(index, 'degree_position', value)}
                  options={DEGREE_POSITIONS}
                  helperText=" "
                />

                <SuggestionField
                  label="Faculty"
                  value={author.faculty}
                  onChange={(value) => updateCoAuthor(index, 'faculty', value)}
                  options={FACULTIES}
                  helperText=" "
                />

                <SuggestionField
                  label="Department"
                  value={author.department}
                  onChange={(value) => updateCoAuthor(index, 'department', value)}
                  options={DEPARTMENTS}
                  helperText=" "
                />

                <UniversityAutocomplete
                  value={author.university}
                  onChange={(value) => updateCoAuthor(index, 'university', value)}
                  selectedCountry={author.country}
                  error={Boolean(errors[`co_${index}_university`])}
                  helperText={errors[`co_${index}_university`] || ' '}
                />

                <Autocomplete
                  freeSolo
                  options={COUNTRIES}
                  inputValue={author.country}
                  onInputChange={(_, newInputValue) => updateCoAuthor(index, 'country', newInputValue)}
                  onChange={(_, newValue) =>
                    updateCoAuthor(index, 'country', typeof newValue === 'string' ? newValue : '')
                  }
                  renderInput={(params) => (
                    <TextField {...params} fullWidth size="small" label="Country" helperText=" " />
                  )}
                />

                <CityAutocomplete
                  selectedCountry={author.country}
                  value={author.city}
                  onChange={(value) => updateCoAuthor(index, 'city', value)}
                  helperText=" "
                />
              </Box>
            </Box>
          ))}

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" fontWeight={700} textAlign="center" sx={{ mb: 3 }}>
            Article Details
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Article Title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
              error={Boolean(errors.title)}
              helperText={errors.title || ' '}
            />

            <TextField
              fullWidth
              size="small"
              label="Article Abstract"
              value={formData.abstract}
              onChange={(e) => updateField('abstract', e.target.value)}
              required
              multiline
              rows={5}
              error={Boolean(errors.abstract)}
              helperText={errors.abstract || `${abstractLength}/2000 characters`}
              inputProps={{ maxLength: 2000 }}
            />

            <TextField
              fullWidth
              size="small"
              label="Keywords (comma separated)"
              value={formData.keywords}
              onChange={(e) => updateField('keywords', e.target.value)}
              required
              error={Boolean(errors.keywords)}
              helperText={errors.keywords || `Current keywords: ${keywordCount} / 10`}
            />

            <TextField
              fullWidth
              size="small"
              label="Comment to Submission"
              value={formData.comments}
              onChange={(e) => updateField('comments', e.target.value)}
              multiline
              rows={3}
              helperText=" "
            />

            <Box sx={fieldGrid}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, fontWeight: 600 }}>
                  Attach Article Manuscript* (Word, PDF)
                </Typography>

                <Button variant="outlined" component="label" size="small">
                  Upload Article
                  <input hidden type="file" accept=".pdf,.doc,.docx" onChange={(e) => setArticleFile(e.target.files ? e.target.files[0] : null)} />
                </Button>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  {articleFile ? articleFile.name : 'No file selected'}
                </Typography>

                {errors.article_file && (
                  <Typography variant="caption" color="error">
                    {errors.article_file}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, fontWeight: 600 }}>
                  Attach Cover Letter* (PDF)
                </Typography>

                <Button variant="outlined" component="label" size="small">
                  Upload Article
                  <input hidden type="file" accept=".pdf,.doc,.docx" onChange={(e) => setArticleFile(e.target.files ? e.target.files[0] : null)} />
                </Button>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  {coverLetterFile ? coverLetterFile.name : 'No file selected'}
                </Typography>

                {errors.cover_letter_file && (
                  <Typography variant="caption" color="error">
                    {errors.cover_letter_file}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, fontWeight: 600 }}>
                Supplementary Files (optional)
              </Typography>

              <Button variant="outlined" component="label" size="small">
                Upload Article
                <input hidden type="file" accept=".pdf,.doc,.docx" onChange={(e) => setArticleFile(e.target.files ? e.target.files[0] : null)} />
              </Button>

              {supplementaryFiles.length > 0 && (
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
                  {supplementaryFiles.map((file, index) => (
                    <Chip
                      key={`${file.name}-${file.size}-${index}`}
                      label={file.name}
                      onDelete={() => removeSupplementaryFile(index)}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
            Consents
          </Typography>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.consent_original}
                  onChange={(e) => updateField('consent_original', e.target.checked)}
                />
              }
              label="I confirm this article has not been published elsewhere."
            />
            {errors.consent_original && (
              <Typography variant="caption" color="error" display="block" sx={{ ml: 4 }}>
                {errors.consent_original}
              </Typography>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.consent_authors}
                  onChange={(e) => updateField('consent_authors', e.target.checked)}
                />
              }
              label="All co-authors have approved this submission."
            />
            {errors.consent_authors && (
              <Typography variant="caption" color="error" display="block" sx={{ ml: 4 }}>
                {errors.consent_authors}
              </Typography>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.consent_privacy}
                  onChange={(e) => updateField('consent_privacy', e.target.checked)}
                />
              }
              label="I agree to the journal's Privacy Policy and data-processing terms."
            />
            {errors.consent_privacy && (
              <Typography variant="caption" color="error" display="block" sx={{ ml: 4 }}>
                {errors.consent_privacy}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box display="flex" justifyContent="space-between" gap={2} flexWrap="wrap">
            <Button variant="outlined" onClick={handleSaveDraft} type="button">
              Save as Draft
            </Button>

            <Box display="flex" gap={2}>
              <Button variant="text" color="inherit" onClick={handleCancel} type="button">
                Cancel
              </Button>

              <Button
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                type="submit"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Card>
      </form>
    </Box>
  );
}