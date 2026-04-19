// NewSubmission.jsx
function NewSubmission({ onSubmitted }) {
  return (
    <div className="card">
      <div className="card-head">
        <h5>New Submission</h5>
        <div className="sub">Complete all mandatory fields (*). Your article will enter Initial Review once submitted.</div>
      </div>
      <div className="card-body">

        <div className="form-section">
          <div className="form-section-title">Article Details</div>
          <div className="form-grid">
            <div className="field full"><label>Article Title *</label><input className="input" placeholder="Enter full title" /></div>
            <div className="field"><label>Journal *</label>
              <select className="select"><option>Journal of Applied Informatics</option><option>RTU Scientific Proceedings</option><option>Baltic Review of CS</option></select>
            </div>
            <div className="field"><label>Area of Interest *</label><input className="input" placeholder="Start typing…" /></div>
            <div className="field full"><label>Abstract *</label><textarea className="textarea" placeholder="250–400 words" /></div>
            <div className="field full"><label>Keywords *</label><input className="input" placeholder="comma-separated" /></div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Author-Correspondent</div>
          <div className="form-grid">
            <div className="field"><label>First Name *</label><input className="input" /></div>
            <div className="field"><label>Last Name *</label><input className="input" /></div>
            <div className="field"><label>Email *</label><input className="input" type="email" /></div>
            <div className="field"><label>Degree & Position *</label><input className="input" /></div>
            <div className="field"><label>Faculty *</label><input className="input" /></div>
            <div className="field"><label>Department *</label><input className="input" /></div>
            <div className="field"><label>University *</label><input className="input" placeholder="Search universities…" /></div>
            <div className="field"><label>Country *</label><input className="input" /></div>
            <div className="field"><label>City *</label><input className="input" /></div>
            <div className="field"><label>ORCID</label><input className="input" placeholder="0000-0000-0000-0000" /></div>
          </div>
        </div>

        <div className="form-section">
          <div className="between" style={{ marginBottom: 14 }}>
            <div className="form-section-title" style={{ margin: 0 }}>Co-Authors</div>
            <button className="btn sm outlined"><i className="material-icons">add</i>Add Co-Author</button>
          </div>
          <div className="file-row">
            <div className="file-ico"><i className="material-icons">person</i></div>
            <div style={{ flex: 1 }}>
              <div className="name">Andris Ozols</div>
              <div className="meta">University of Latvia · Faculty of Computing</div>
            </div>
            <button className="btn sm ghost"><i className="material-icons">edit</i></button>
            <button className="btn sm ghost"><i className="material-icons">delete</i></button>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Manuscript & Supporting Files</div>
          <div className="upload">
            <i className="material-icons">cloud_upload</i>
            <div className="subtitle1" style={{ marginTop: 6 }}>Drop files here or click to upload</div>
            <div className="muted" style={{ fontSize: '.78rem', marginTop: 4 }}>Manuscript (PDF/DOCX), cover letter, figures, supplementary material</div>
            <button className="btn primary" style={{ marginTop: 14 }}>Choose Files</button>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Consents</div>
          <label style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: '.85rem' }}><input type="checkbox" /> I confirm this article has not been published elsewhere.</label>
          <label style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: '.85rem' }}><input type="checkbox" /> All co-authors have approved this submission.</label>
          <label style={{ display: 'flex', gap: 10, marginBottom: 0,  fontSize: '.85rem' }}><input type="checkbox" /> I agree to the journal's Privacy Policy and data-processing terms.</label>
        </div>

        <div className="between" style={{paddingTop:8}}>
          <button className="btn ghost">Save as Draft</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn outlined">Cancel</button>
            <button className="btn primary" onClick={onSubmitted}><i className="material-icons">send</i>Submit Article</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.NewSubmission = NewSubmission;
