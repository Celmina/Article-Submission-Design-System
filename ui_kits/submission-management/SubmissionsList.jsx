// SubmissionsList.jsx — charcoal/flat
const PHASE_OPTIONS = ['New Submission', 'Initial Review', 'Plagiarism Check', 'Desk Review', 'Peer Review', 'Decision Making', "Author's Response", 'Publishing Process'];
const STATUS_OPTIONS = ['In progress', "Author's revision", 'Rejected', 'Publication Process'];

const MOCK_ROWS = [
  { id: 'MA113', title: 'Adaptive Bio-signal Processing in Edge Devices', authors: 'Celmina E., Ozols A.', journal: 'Journal of Applied Informatics', phase: 'Peer Review',     status: 'In progress',         overdue: true,  submitted: '2026-03-12', last: '2026-04-14' },
  { id: 'MA112', title: 'A Survey of Metaheuristic Clustering Techniques', authors: 'Berzins J., Kalnina M.', journal: 'RTU Scientific Proceedings',   phase: 'Desk Review',     status: "Author's revision",   overdue: false, submitted: '2026-03-20', last: '2026-04-10' },
  { id: 'MA111', title: 'Energy-Efficient Consensus in Blockchain Systems', authors: 'Liepa P., Strods R.',  journal: 'Journal of Applied Informatics', phase: 'Initial Review', status: 'In progress',         overdue: false, submitted: '2026-03-25', last: '2026-04-12' },
  { id: 'MA110', title: 'Multi-Modal Transformer for Latvian NLP',         authors: 'Ozols A.',            journal: 'Baltic Review of CS',            phase: 'Plagiarism Check',status: 'In progress',         overdue: false, submitted: '2026-04-01', last: '2026-04-08' },
  { id: 'MA109', title: 'Quantum-Resistant Key Exchange Protocols',        authors: 'Pauls K., Liepa P.',  journal: 'Journal of Applied Informatics', phase: 'Decision Making', status: 'In progress',         overdue: false, submitted: '2026-02-28', last: '2026-04-15' },
  { id: 'MA108', title: 'Real-Time Anomaly Detection in IoT Streams',      authors: 'Zarina I., Berzins J.', journal: 'RTU Scientific Proceedings',   phase: 'Publishing Process', status: 'Publication Process', overdue: false, submitted: '2026-01-14', last: '2026-04-02' },
  { id: 'MA107', title: 'Federated Learning for Medical Records',          authors: 'Kalnina M.',          journal: 'Baltic Review of CS',            phase: 'Publishing Process', status: 'Rejected',        overdue: false, submitted: '2026-01-02', last: '2026-03-20' },
];

function StatusChip({ status, overdue }) {
  if (overdue) return <span className="chip overdue">Overdue</span>;
  const cls = status.includes('revision') ? 'warning' : status.includes('Reject') ? 'error' : status.includes('Publication') ? 'success' : 'info';
  return <span className={'chip ' + cls}>{status}</span>;
}

function SubmissionsList({ onOpen }) {
  const [scope, setScope] = React.useState('mine');
  const [tab, setTab] = React.useState('active');
  const [state, setState] = React.useState('all');
  const [rows] = React.useState(MOCK_ROWS);

  const filtered = rows.filter(r => {
    if (tab === 'archived') return r.status === 'Rejected' || r.status === 'Publication Process';
    if (tab === 'active')   return r.status !== 'Rejected' && r.status !== 'Publication Process';
    return true;
  }).filter(r => state === 'overdue' ? r.overdue : state === 'new' ? (r.phase === 'Initial Review') : true);

  const overdueCount = rows.filter(r => r.overdue).length;
  const newCount     = rows.filter(r => r.phase === 'Initial Review').length;

  return (
    <div className="stack">
      <StatCards totals={{ total: rows.length, pending: 12, revision: 3, done: 8 }} />

      <div className="card">
        <div className="card-head">
          <div className="between">
            <div>
              <h5>Authors Submissions Table</h5>
              <div className="sub">Manage active and archived submissions across your journals</div>
            </div>
            <button className="btn primary"><i className="material-icons">add</i>New Submission</button>
          </div>
        </div>

        <div className="card-body">
          <div className="between" style={{ marginBottom: 16 }}>
            <div className="seg">
              <button className={'seg-btn ' + (scope === 'mine' ? 'active' : '')} onClick={() => setScope('mine')}>My Journals</button>
              <button className={'seg-btn ' + (scope === 'all'  ? 'active' : '')} onClick={() => setScope('all')}>All Journals</button>
            </div>
            <div className="seg">
              <button className={'seg-btn ' + (state === 'all'     ? 'active' : '')} onClick={() => setState('all')}>All</button>
              <button className={'seg-btn ' + (state === 'new'     ? 'active' : '')} onClick={() => setState('new')}>New <span className="seg-count">{newCount}</span></button>
              <button className={'seg-btn ' + (state === 'overdue' ? 'active' : '')} onClick={() => setState('overdue')}>Overdue <span className="seg-count">{overdueCount}</span></button>
            </div>
          </div>

          <div className="filter-bar">
            <div className="field"><label>Submission ID</label><input className="input" placeholder="MA…" /></div>
            <div className="field"><label>Author Name</label><input className="input" placeholder="Search author" /></div>
            <div className="field"><label>Journal</label><select className="select"><option>All journals</option><option>Journal of Applied Informatics</option><option>RTU Scientific Proceedings</option></select></div>
            <div className="field"><label>Phase</label><select className="select"><option>All phases</option>{PHASE_OPTIONS.map(p => <option key={p}>{p}</option>)}</select></div>
            <div className="field"><label>Status</label><select className="select"><option>All statuses</option>{STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}</select></div>
            <button className="btn ghost">Reset</button>
          </div>

          <div className="tabs">
            <button className={'tab ' + (tab === 'active' ? 'active' : '')} onClick={() => setTab('active')}>Active ({rows.filter(r => r.status !== 'Rejected' && r.status !== 'Publication Process').length})</button>
            <button className={'tab ' + (tab === 'archived' ? 'active' : '')} onClick={() => setTab('archived')}>Archived ({rows.filter(r => r.status === 'Rejected' || r.status === 'Publication Process').length})</button>
          </div>

          <div style={{ overflowX: 'auto', margin: '0 -24px' }}>
            <table className="tbl">
              <thead><tr>
                <th>ID</th><th>Title</th><th>Authors</th><th>Journal</th><th>Phase</th><th>Status</th><th>Submitted</th><th>Last Action</th>
              </tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32 }} className="muted">There are no submissions with chosen filtering criteria.</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id} onClick={() => onOpen && onOpen(r)}>
                    <td><a className="id-link">{r.id}</a></td>
                    <td style={{ fontWeight: 500 }}>{r.title}</td>
                    <td className="muted">{r.authors}</td>
                    <td className="muted">{r.journal}</td>
                    <td className="muted">{r.phase}</td>
                    <td><StatusChip status={r.status} overdue={r.overdue} /></td>
                    <td className="muted">{r.submitted}</td>
                    <td className="muted">{r.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pager">
            <span>Showing 1–{filtered.length} of {rows.length}</span>
            <div className="pages">
              <button className="page" disabled>‹</button>
              <button className="page active">1</button>
              <button className="page">2</button>
              <button className="page">3</button>
              <button className="page">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.SubmissionsList = SubmissionsList;
window.MOCK_ROWS = MOCK_ROWS;
