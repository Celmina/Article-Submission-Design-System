// StatCards.jsx — flat charcoal icon tile
const STAT_DEFS = [
  { key: 'total',    label: 'Total Submissions', icon: 'article',              desc: 'Across all journals' },
  { key: 'pending',  label: 'Pending Reviews',   icon: 'pending_actions',      desc: '+3 since last week',   trend: 'up' },
  { key: 'revision', label: 'Author Revisions',  icon: 'autorenew',            desc: 'Awaiting resubmit' },
  { key: 'done',     label: 'Published',         icon: 'assignment_turned_in', desc: '+1% than yesterday',   trend: 'up' },
];

function StatCards({ totals }) {
  return (
    <div className="grid-4">
      {STAT_DEFS.map(s => (
        <div className="stat-card" key={s.key}>
          <div className="stat-top">
            <div className="stat-info">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{totals[s.key] ?? 0}</div>
            </div>
            <div className="stat-icon"><i className="material-icons">{s.icon}</i></div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-caption">{s.desc}</div>
        </div>
      ))}
    </div>
  );
}

window.StatCards = StatCards;
