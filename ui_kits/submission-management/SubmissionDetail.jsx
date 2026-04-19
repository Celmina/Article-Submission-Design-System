// SubmissionDetail.jsx
const PHASES = ['New', 'Initial Review', 'Plagiarism', 'Desk Review', 'Peer Review', 'Decision', "Author Response", 'Publishing'];

function PhaseSteps({ current = 4 }) {
  return (
    <div className="phase-steps">
      {PHASES.map((p, i) => (
        <div key={p} className={'phase-step ' + (i < current ? 'done' : i === current ? 'current' : '')}>
          <span className="num">{i + 1}</span>{p}
        </div>
      ))}
    </div>
  );
}

function DetailsTab({ sub }) {
  return (
    <div>
      <div className="form-section">
        <div className="form-section-title">Article Details</div>
        <div className="form-grid">
          <div className="field"><label>Submission ID</label><input className="input" value={sub.id} readOnly /></div>
          <div className="field"><label>Journal</label><input className="input" value={sub.journal} readOnly /></div>
          <div className="field full"><label>Title</label><input className="input" value={sub.title} readOnly /></div>
          <div className="field"><label>Submission Phase</label><input className="input" value={sub.phase} readOnly /></div>
          <div className="field"><label>Submission Status</label><input className="input" value={sub.status} readOnly /></div>
          <div className="field full"><label>Abstract</label><textarea className="textarea" readOnly defaultValue="This paper introduces a low-latency adaptive bio-signal processing pipeline deployable on edge devices. We demonstrate a 38% reduction in end-to-end inference latency while preserving diagnostic accuracy within 2% of the cloud baseline." /></div>
          <div className="field full"><label>Keywords</label><input className="input" value="bio-signal · edge · tinyml · latency" readOnly /></div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">Author-Correspondent & Co-Authors</div>
        <div className="form-grid">
          <div className="field"><label>First Name</label><input className="input" value="Evita" readOnly /></div>
          <div className="field"><label>Last Name</label><input className="input" value="Celmina" readOnly /></div>
          <div className="field"><label>University</label><input className="input" value="Riga Technical University" readOnly /></div>
          <div className="field"><label>ORCID</label><input className="input" value="0000-0001-2345-6789" readOnly /></div>
          <div className="field full"><label>Co-Authors</label><input className="input" value="Andris Ozols · University of Latvia" readOnly /></div>
        </div>
      </div>

      <div className="between" style={{paddingTop:8}}>
        <button className="btn outlined info">Request Revision</button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn outlined danger">Reject</button>
          <button className="btn primary">Advance to Next Phase</button>
        </div>
      </div>
    </div>
  );
}

function EmailsTab() {
  const emails = [
    { from: 'Managing Editor',  date: '2026-04-14', subject: 'Peer Review Invitation Sent', preview: 'Three reviewers have been invited for the peer review phase.' },
    { from: 'Evita Celmina',    date: '2026-04-10', subject: 'Revised manuscript attached', preview: "Please find the revised version addressing all plagiarism-check feedback." },
    { from: 'System',           date: '2026-04-02', subject: 'Plagiarism check completed', preview: 'Unicheck report attached — similarity 8.3%.' },
  ];
  return (
    <div>
      <div className="between" style={{marginBottom:14}}>
        <div className="subtitle1">Conversation — {emails.length} emails</div>
        <button className="btn primary"><i className="material-icons">edit</i>New Email</button>
      </div>
      {emails.map((e, i) => (
        <div className="email" key={i}>
          <div className="email-head"><span className="email-from">{e.from}</span><span className="email-date">{e.date}</span></div>
          <div className="email-subject">{e.subject}</div>
          <div className="email-preview">{e.preview}</div>
        </div>
      ))}
    </div>
  );
}

function FilesTab() {
  const files = [
    { name: 'MA113_m1_manuscript.pdf',     size: '2.4 MB', date: '2026-03-12', version: 'Manuscript v1' },
    { name: 'MA113_m2_manuscript_rev.pdf', size: '2.6 MB', date: '2026-04-10', version: 'Manuscript v2 (revision)' },
    { name: 'MA113_unicheck_report.pdf',   size: '410 KB', date: '2026-04-02', version: 'Plagiarism report' },
    { name: 'MA113_cover_letter.pdf',      size: '120 KB', date: '2026-03-12', version: 'Cover letter' },
  ];
  return (
    <div>
      <div className="between" style={{marginBottom:14}}>
        <div className="subtitle1">{files.length} files attached</div>
        <button className="btn primary"><i className="material-icons">upload_file</i>Upload File</button>
      </div>
      {files.map((f, i) => (
        <div className="file-row" key={i}>
          <div className="file-ico"><i className="material-icons">picture_as_pdf</i></div>
          <div style={{ flex: 1 }}>
            <div className="name">{f.name}</div>
            <div className="meta">{f.version} · {f.size} · {f.date}</div>
          </div>
          <button className="btn sm outlined"><i className="material-icons">download</i>Download</button>
        </div>
      ))}
    </div>
  );
}

function ActivityTab() {
  const log = [
    { who: 'Managing Editor (A. Strauta)', act: 'Transferred submission to Peer Review phase', time: '2026-04-14 11:02' },
    { who: 'Evita Celmina',                act: 'Uploaded revised manuscript (v2)',             time: '2026-04-10 17:48' },
    { who: 'System',                       act: 'Plagiarism check completed — similarity 8.3%', time: '2026-04-02 09:10' },
    { who: 'Managing Editor (A. Strauta)', act: 'Advanced to Plagiarism Check',                 time: '2026-03-28 14:20' },
    { who: 'Evita Celmina',                act: 'Submitted article',                            time: '2026-03-12 08:45' },
  ];
  return (
    <div>
      {log.map((l, i) => (
        <div className="log-item" key={i}>
          <div className="log-dot"></div>
          <div className="log-text"><b>{l.who}</b> — {l.act}</div>
          <div className="log-time">{l.time}</div>
        </div>
      ))}
    </div>
  );
}

function SubmissionDetail({ sub, onBack }) {
  const [tab, setTab] = React.useState('details');
  const data = sub || { id: 'MA113', title: 'Adaptive Bio-signal Processing in Edge Devices', journal: 'Journal of Applied Informatics', phase: 'Peer Review', status: 'In progress' };

  return (
    <div className="stack">
      <div className="between">
        <button className="btn ghost" onClick={onBack}><i className="material-icons">arrow_back</i>Back to list</button>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="muted" style={{ fontSize: '.8rem' }}>{data.id}</span>
          <span className="chip info">In progress</span>
        </div>
      </div>

      <PhaseSteps current={4} />

      <div className="card">
        <div className="card-head">
          <h5>{data.title}</h5>
          <div className="sub">{data.journal} · Phase: {data.phase}</div>
        </div>
        <div className="card-body">
          <div className="tabs">
            <button className={'tab ' + (tab === 'details'  ? 'active' : '')} onClick={() => setTab('details')}>Details</button>
            <button className={'tab ' + (tab === 'emails'   ? 'active' : '')} onClick={() => setTab('emails')}>Emails</button>
            <button className={'tab ' + (tab === 'files'    ? 'active' : '')} onClick={() => setTab('files')}>Files</button>
            <button className={'tab ' + (tab === 'activity' ? 'active' : '')} onClick={() => setTab('activity')}>Activity Log</button>
          </div>

          {tab === 'details'  && <DetailsTab sub={data} />}
          {tab === 'emails'   && <EmailsTab />}
          {tab === 'files'    && <FilesTab />}
          {tab === 'activity' && <ActivityTab />}
        </div>
      </div>
    </div>
  );
}

window.SubmissionDetail = SubmissionDetail;
