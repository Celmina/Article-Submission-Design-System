function generateId(prefix) {
  return `${prefix}-${Math.floor(Math.random() * 1000000)}`;
}

const JOURNAL_OPTIONS = [
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

const DEGREE_OPTIONS = [
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
  'Bachelor Student',
  'Master Student'
];

const FACULTY_OPTIONS = [
  'Faculty of Engineering',
  'Faculty of Computer Science',
  'Faculty of Information Technology',
  'Faculty of Mathematics',
  'Faculty of Natural Sciences',
  'Faculty of Business and Economics',
  'Faculty of Computing',
  'Faculty of Electronics and Telecommunications'
];

const DEPARTMENT_OPTIONS = [
  'Department of Artificial Intelligence',
  'Department of Information Systems',
  'Department of Computer Science',
  'Department of Software Engineering',
  'Department of Data Science',
  'Department of Cybersecurity',
  'Department of Electronics',
  'Department of Telecommunications'
];

const EMPTY_FORM = {
  articleTitle: '',
  journal: '',
  areaOfInterest: '',
  abstract: '',
  keywords: '',
  firstName: '',
  lastName: '',
  email: '',
  degree: '',
  faculty: '',
  department: '',
  university: '',
  country: '',
  city: '',
  orcid: '',
  researcherId: '',
  consentOriginal: false,
  consentAuthors: false,
  consentPrivacy: false
};

const EMPTY_COAUTHOR = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  degree: '',
  faculty: '',
  department: '',
  university: '',
  country: '',
  city: '',
  orcid: '',
  researcherId: ''
};

function useUniversitySearch(inputValue, countryValue) {
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    let active = true;

    const query = (inputValue || '').trim();
    const country = (countryValue || '').trim();

    if (query.length < 1) {
      setOptions([]);
      return;
    }

    const fetchUniversities = (url) =>
      fetch(url).then((res) => res.json());

    const baseUrl = `https://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`;
    const countryUrl = country
      ? `${baseUrl}&country=${encodeURIComponent(country)}`
      : baseUrl;

    fetchUniversities(countryUrl)
      .then((data) => {
        if (!active) return;

        const names = Array.isArray(data)
          ? Array.from(new Set(data.map((d) => d.name).filter(Boolean))).slice(0, 50)
          : [];

        if (names.length > 0 || !country) {
          setOptions(names);
          return;
        }

        return fetchUniversities(baseUrl).then((fallbackData) => {
          if (!active) return;

          const fallbackNames = Array.isArray(fallbackData)
            ? Array.from(new Set(fallbackData.map((d) => d.name).filter(Boolean))).slice(0, 50)
            : [];

          setOptions(fallbackNames);
        });
      })
      .catch((err) => {
        console.error('University search error:', err);
        if (active) setOptions([]);
      });

    return () => {
      active = false;
    };
  }, [inputValue, countryValue]);

  return options;
}

function useCitySearch(inputValue, countryValue) {
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    let active = true;

    if (!inputValue || inputValue.trim().length < 2) {
      setOptions([]);
      return;
    }

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputValue.trim())}&count=100&language=en&format=json`)
      .then((res) => res.json())
      .then((data) => {
        if (active && data.results) {
          let filtered = data.results;

          if (countryValue && countryValue.trim()) {
            const selected = countryValue.toLowerCase().trim();
            filtered = filtered.filter((item) => (item.country || '').toLowerCase().trim() === selected);
          }

          setOptions(
            Array.from(
              new Set(
                filtered
                  .map((item) => (item.admin1 ? `${item.name}, ${item.admin1}` : item.name))
                  .filter(Boolean)
              )
            ).slice(0, 50)
          );
        }
      })
      .catch((err) => console.error(err));

    return () => {
      active = false;
    };
  }, [inputValue, countryValue]);

  return options;
}

function useCountrySearch(inputValue) {
  const [allCountries, setAllCountries] = React.useState([]);
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    let active = true;

    fetch('https://restcountries.com/v3.1/all?fields=name')
      .then((res) => res.json())
      .then((data) => {
        if (!active || !Array.isArray(data)) return;

        const names = data
          .map((item) => item?.name?.common)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        const uniqueNames = Array.from(new Set(names));
        setAllCountries(uniqueNames);
      })
      .catch((err) => console.error(err));

    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    const query = (inputValue || '').trim().toLowerCase();

    if (!query) {
      setOptions(allCountries.slice(0, 50));
      return;
    }

    const filtered = allCountries.filter((country) =>
      country.toLowerCase().includes(query)
    );

    setOptions(filtered.slice(0, 50));
  }, [inputValue, allCountries]);

  return options;
}

function NewSubmission({ onSubmitted }) {
  const [form, setForm] = React.useState({ ...EMPTY_FORM });
  const [coAuthors, setCoAuthors] = React.useState([]);
  const [addingCoAuthor, setAddingCoAuthor] = React.useState(false);
  const [coAuthorForm, setCoAuthorForm] = React.useState({ ...EMPTY_COAUTHOR });
  const [files, setFiles] = React.useState([]);
  const fileInputRef = React.useRef(null);


  const uniOptions = useUniversitySearch(form.university, form.country);
  const cityOptions = useCitySearch(form.city, form.country);
  const coUniOptions = useUniversitySearch(coAuthorForm.university, coAuthorForm.country);
  const coCityOptions = useCitySearch(coAuthorForm.city, coAuthorForm.country);
  const countryOptions = useCountrySearch(form.country);
  const coCountryOptions = useCountrySearch(coAuthorForm.country);

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'country' ? { city: '' } : {})
    }));
  };

  const updateCoAuthorForm = (key, value) => {
    setCoAuthorForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'country' ? { city: '' } : {})
    }));
  };

  const handleFileChange = (e) => {
    const chosen = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...chosen]);
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const saveCoAuthor = () => {
    if (!coAuthorForm.firstName || !coAuthorForm.lastName || !coAuthorForm.email) {
      alert('Co-author First Name, Last Name, and Email are required.');
      return;
    }

    if (coAuthorForm.id) {
      setCoAuthors((prev) => prev.map((a) => (a.id === coAuthorForm.id ? coAuthorForm : a)));
    } else {
      setCoAuthors((prev) => [...prev, { ...coAuthorForm, id: generateId('ca') }]);
    }

    setAddingCoAuthor(false);
    setCoAuthorForm({ ...EMPTY_COAUTHOR });
  };

  const editCoAuthor = (author) => {
    setCoAuthorForm(author);
    setAddingCoAuthor(true);
  };

  const removeCoAuthor = (id) => {
    setCoAuthors((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (isDraft) => {
    const submission = {
      id: generateId('MA'),
      created_at: new Date().toISOString(),
      status: isDraft ? 'Draft' : 'In progress',
      phase: 'Initial Review',
      title: form.articleTitle,
      journal_title: form.journal,
      abstract: form.abstract,
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
      form: form,
      authors: [
        {
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          degree_position: form.degree,
          faculty: form.faculty,
          department: form.department,
          university: form.university,
          country: form.country,
          city: form.city,
          orcid: form.orcid,
          researcher_id: form.researcherId,
          is_primary: true
        },
        ...coAuthors.map((ca) => ({
          first_name: ca.firstName,
          last_name: ca.lastName,
          email: ca.email,
          degree_position: ca.degree,
          faculty: ca.faculty,
          department: ca.department,
          university: ca.university,
          country: ca.country,
          city: ca.city,
          orcid: ca.orcid,
          researcher_id: ca.researcherId,
          is_primary: false
        }))
      ],
      coAuthors: coAuthors,
      article_file_name: files.length > 0 ? files[0].name : '',
      cover_letter_file_name: files.length > 1 ? files[1].name : (files.length > 0 ? files[0].name : '')
    };

    const saved = JSON.parse(localStorage.getItem('submissions') || '[]');
    localStorage.setItem('submissions', JSON.stringify([submission, ...saved]));

    if (onSubmitted) {
      onSubmitted();
    }
  };

  return (
    <div className="card">
      <datalist id="journalOptions">
        {JOURNAL_OPTIONS.map((o, i) => <option key={i} value={o} />)}
      </datalist>

      <datalist id="degreeOptions">
        {DEGREE_OPTIONS.map((o, i) => <option key={i} value={o} />)}
      </datalist>

      <datalist id="facultyOptions">
        {FACULTY_OPTIONS.map((o, i) => <option key={i} value={o} />)}
      </datalist>

      <datalist id="departmentOptions">
        {DEPARTMENT_OPTIONS.map((o, i) => <option key={i} value={o} />)}
      </datalist>

      <datalist id="countryOptions">
        {countryOptions.map((o, i) => <option key={i} value={o} />)}
      </datalist>

      <datalist id="coCountryOptions">
        {coCountryOptions.map((o, i) => <option key={i} value={o} />)}
      </datalist>

      <datalist id="uniOptions">
        {uniOptions.map((o, i) => <option key={i} value={o} />)}
      </datalist>

      <datalist id="cityOptions">
        {cityOptions.map((o, i) => <option key={i} value={o} />)}
      </datalist>

      <datalist id="coUniOptions">
        {coUniOptions.map((o, i) => <option key={i} value={o} />)}
      </datalist>

      <datalist id="coCityOptions">
        {coCityOptions.map((o, i) => <option key={i} value={o} />)}
      </datalist>

      <div className="card-head">
        <h5>New Submission</h5>
        <div className="sub">Complete all mandatory fields (*). Your article will enter Initial Review once submitted.</div>
      </div>

      <div className="card-body">
        <div className="form-section">
          <div className="form-section-title">Article Details</div>
          <div className="form-grid">
            <div className="field full">
              <label>Article Title *</label>
              <input className="input" placeholder="Enter full title" value={form.articleTitle} onChange={(e) => updateForm('articleTitle', e.target.value)} />
            </div>

            <div className="field">
              <label>Journal *</label>
              <input
                className="input"
                list="journalOptions"
                placeholder="Start typing journal..."
                value={form.journal}
                onChange={(e) => updateForm('journal', e.target.value)}
              />
            </div>

            <div className="field">
              <label>Area of Interest *</label>
              <input className="input" placeholder="Start typing…" value={form.areaOfInterest} onChange={(e) => updateForm('areaOfInterest', e.target.value)} />
            </div>

            <div className="field full">
              <label>Abstract *</label>
              <textarea className="textarea" placeholder="250–400 words" value={form.abstract} onChange={(e) => updateForm('abstract', e.target.value)} />
            </div>

            <div className="field full">
              <label>Keywords *</label>
              <input className="input" placeholder="comma-separated" value={form.keywords} onChange={(e) => updateForm('keywords', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Author-Correspondent</div>
          <div className="form-grid">
            <div className="field">
              <label>First Name *</label>
              <input className="input" value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} />
            </div>

            <div className="field">
              <label>Last Name *</label>
              <input className="input" value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} />
            </div>

            <div className="field">
              <label>Email *</label>
              <input className="input" type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
            </div>

            <div className="field">
              <label>Degree & Position *</label>
              <input
                className="input"
                list="degreeOptions"
                placeholder="Start typing..."
                value={form.degree}
                onChange={(e) => updateForm('degree', e.target.value)}
              />
            </div>

            <div className="field">
              <label>Faculty *</label>
              <input
                className="input"
                list="facultyOptions"
                placeholder="Start typing..."
                value={form.faculty}
                onChange={(e) => updateForm('faculty', e.target.value)}
              />
            </div>

            <div className="field">
              <label>Department *</label>
              <input
                className="input"
                list="departmentOptions"
                placeholder="Start typing..."
                value={form.department}
                onChange={(e) => updateForm('department', e.target.value)}
              />
            </div>

            <div className="field">
              <label>University *</label>
              <input
                className="input"
                list="uniOptions"
                placeholder="Start typing university..."
                value={form.university}
                onChange={(e) => updateForm('university', e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label>Country *</label>
              <input
                className="input"
                list="countryOptions"
                placeholder="Start typing country..."
                value={form.country}
                onChange={(e) => updateForm('country', e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label>City *</label>
              <input
                className="input"
                list="cityOptions"
                placeholder={form.country ? 'Start typing city...' : 'Type country first, then city...'}
                value={form.city}
                onChange={(e) => updateForm('city', e.target.value)}
              />
            </div>

            <div className="field">
              <label>ORCID</label>
              <input className="input" placeholder="0000-0000-0000-0000" value={form.orcid} onChange={(e) => updateForm('orcid', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="between" style={{ marginBottom: 14 }}>
            <div className="form-section-title" style={{ margin: 0 }}>Co-Authors</div>
            {!addingCoAuthor && (
              <button className="btn sm outlined" type="button" onClick={() => setAddingCoAuthor(true)}>
                <i className="material-icons">add</i>
                Add Co-Author
              </button>
            )}
          </div>

          {coAuthors.map((author) => (
            <div className="file-row" key={author.id} style={{ marginBottom: 8 }}>
              <div className="file-ico"><i className="material-icons">person</i></div>
              <div style={{ flex: 1 }}>
                <div className="name">{author.firstName} {author.lastName}</div>
                <div className="meta">{author.university}{author.faculty ? ' · ' + author.faculty : ''}{author.email ? ' · ' + author.email : ''}</div>
              </div>

              <button className="btn sm ghost" type="button" onClick={() => editCoAuthor(author)}>
                <i className="material-icons">edit</i>
              </button>

              <button className="btn sm ghost" type="button" onClick={() => removeCoAuthor(author.id)}>
                <i className="material-icons">delete</i>
              </button>
            </div>
          ))}

          {addingCoAuthor && (
            <div style={{ padding: 16, border: '1px solid #e4e4e7', borderRadius: 12, marginTop: 12, backgroundColor: '#fafafa' }}>
              <div className="sub" style={{ marginBottom: 12, fontWeight: 600 }}>Co-Author Details</div>

              <div className="form-grid">
                <div className="field">
                  <label>First Name *</label>
                  <input className="input" value={coAuthorForm.firstName} onChange={(e) => updateCoAuthorForm('firstName', e.target.value)} />
                </div>

                <div className="field">
                  <label>Last Name *</label>
                  <input className="input" value={coAuthorForm.lastName} onChange={(e) => updateCoAuthorForm('lastName', e.target.value)} />
                </div>

                <div className="field full">
                  <label>Email *</label>
                  <input className="input" type="email" value={coAuthorForm.email} onChange={(e) => updateCoAuthorForm('email', e.target.value)} />
                </div>

                <div className="field">
                  <label>University *</label>
                  <input
                    className="input"
                    list="coUniOptions"
                    placeholder="Start typing university..."
                    value={coAuthorForm.university}
                    onChange={(e) => updateCoAuthorForm('university', e.target.value)}
                    autoComplete="off"
                  />
                </div>

                <div className="field">
                  <label>Country *</label>
                  <input
                    className="input"
                    list="coCountryOptions"
                    placeholder="Start typing country..."
                    value={coAuthorForm.country}
                    onChange={(e) => updateCoAuthorForm('country', e.target.value)}
                    autoComplete="off"
                  />
                </div>

                <div className="field">
                  <label>City</label>
                  <input
                    className="input"
                    list="coCityOptions"
                    placeholder={coAuthorForm.country ? 'Start typing city...' : 'Type country first, then city...'}
                    value={coAuthorForm.city}
                    onChange={(e) => updateCoAuthorForm('city', e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Faculty</label>
                  <input
                    className="input"
                    list="facultyOptions"
                    placeholder="Start typing..."
                    value={coAuthorForm.faculty}
                    onChange={(e) => updateCoAuthorForm('faculty', e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Department</label>
                  <input
                    className="input"
                    list="departmentOptions"
                    placeholder="Start typing..."
                    value={coAuthorForm.department}
                    onChange={(e) => updateCoAuthorForm('department', e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Degree & Position</label>
                  <input
                    className="input"
                    list="degreeOptions"
                    placeholder="Start typing..."
                    value={coAuthorForm.degree}
                    onChange={(e) => updateCoAuthorForm('degree', e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>ORCID</label>
                  <input className="input" value={coAuthorForm.orcid} onChange={(e) => updateCoAuthorForm('orcid', e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button
                  className="btn sm outlined"
                  type="button"
                  onClick={() => {
                    setAddingCoAuthor(false);
                    setCoAuthorForm({ ...EMPTY_COAUTHOR });
                  }}
                >
                  Cancel
                </button>

                <button className="btn sm primary" type="button" onClick={saveCoAuthor}>
                  Save Co-Author
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="form-section">
          <div className="form-section-title">Manuscript & Supporting Files</div>

          <div className="upload" onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ cursor: 'pointer' }}>
            <i className="material-icons">cloud_upload</i>
            <div className="subtitle1" style={{ marginTop: 6 }}>Drop files here or click to upload</div>
            <div className="muted" style={{ fontSize: '.78rem', marginTop: 4 }}>Manuscript (PDF/DOCX), cover letter, figures, supplementary material</div>
            <button className="btn primary" type="button" style={{ marginTop: 14 }}>
              Choose Files
            </button>
          </div>

          <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple onChange={handleFileChange} />

          {files.map((f, idx) => (
            <div className="file-row" key={idx} style={{ marginTop: 12 }}>
              <div className="file-ico"><i className="material-icons">insert_drive_file</i></div>
              <div style={{ flex: 1 }}>
                <div className="name">{f.name}</div>
                <div className="meta">{(f.size / 1024).toFixed(1)} KB</div>
              </div>
              <button className="btn sm ghost" type="button" onClick={() => removeFile(idx)}>
                <i className="material-icons">delete</i>
              </button>
            </div>
          ))}
        </div>

        <div className="form-section">
          <div className="form-section-title">Consents</div>

          <label style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: '.85rem' }}>
            <input type="checkbox" checked={form.consentOriginal} onChange={(e) => updateForm('consentOriginal', e.target.checked)} />
            I confirm this article has not been published elsewhere.
          </label>

          <label style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: '.85rem' }}>
            <input type="checkbox" checked={form.consentAuthors} onChange={(e) => updateForm('consentAuthors', e.target.checked)} />
            All co-authors have approved this submission.
          </label>

          <label style={{ display: 'flex', gap: 10, marginBottom: 0, fontSize: '.85rem' }}>
            <input type="checkbox" checked={form.consentPrivacy} onChange={(e) => updateForm('consentPrivacy', e.target.checked)} />
            I agree to the journal's Privacy Policy and data-processing terms.
          </label>
        </div>

        <div className="between" style={{ paddingTop: 8 }}>
          <button className="btn ghost" type="button" onClick={() => handleSubmit(true)}>
            Save as Draft
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn outlined"
              type="button"
              onClick={() => {
                setForm({ ...EMPTY_FORM });
                setCoAuthors([]);
                setFiles([]);
              }}
            >
              Cancel
            </button>

            <button className="btn primary" type="button" onClick={() => handleSubmit(false)}>
              <i className="material-icons">send</i>
              Submit Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.NewSubmission = NewSubmission;