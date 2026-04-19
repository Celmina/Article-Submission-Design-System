// Sidenav.jsx — light, collapsible, full product map
const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  {
    group: 'Submission Management',
    items: [
      { key: 'list',   label: 'Submissions',       icon: 'article' },
      { key: 'new',    label: 'New Submission',    icon: 'send' },
      { key: 'detail', label: 'Submission Detail', icon: 'description' },
    ],
  },
  {
    group: 'Review Workflow',
    collapsible: true,
    items: [
      { key: 'initial',   label: 'Initial Review',   icon: 'rule' },
      { key: 'plagiarism',label: 'Plagiarism Check', icon: 'policy' },
      { key: 'desk',      label: 'Desk Review',      icon: 'fact_check' },
      { key: 'peer',      label: 'Peer Review',      icon: 'groups' },
      { key: 'decision',  label: 'Decision Making',  icon: 'gavel' },
    ],
  },
  { key: 'journals',  label: 'Journals',       icon: 'menu_book' },
  { key: 'users',     label: 'Users & Roles',  icon: 'group' },
  { key: 'reports',   label: 'Reports',        icon: 'insights' },
];

const DOCS = [
  { key: 'spec',    label: 'Functional Spec', icon: 'description' },
  { key: 'changes', label: 'Change Log',      icon: 'history' },
];

function Sidenav({ active, onNavigate }) {
  const [open, setOpen] = React.useState({ 'Review Workflow': false });
  const toggle = (g) => setOpen(o => ({ ...o, [g]: !o[g] }));
  const SUB_KEYS = ['list','new','detail'];

  return (
    <aside className="sidenav">
      <div className="sidenav-brand">
        <div className="sidenav-brand-logo"><i className="material-icons" style={{fontSize:18}}>description</i></div>
        <div>
          <div className="sidenav-brand-name">Submission System</div>
          <div style={{fontSize:'.66rem',color:'#8e8e93'}}>Article Management</div>
        </div>
      </div>

      <div className="sidenav-user">
        <div className="sidenav-user-avatar">AS</div>
        <div className="sidenav-user-name">A. Strauta</div>
        <i className="material-icons">expand_more</i>
      </div>

      <div className="sidenav-group-label">Pages</div>
      <div className="sidenav-item" onClick={() => onNavigate('dashboard')}>
        <i className="material-icons">dashboard</i>Dashboard
      </div>

      <div className="sidenav-group-label">Submission Management</div>
      {NAV[1].items.map(it => (
        <div key={it.key} className={'sidenav-item ' + (active === it.key ? 'active' : '')} onClick={() => onNavigate(it.key)}>
          <i className="material-icons">{it.icon}</i>{it.label}
        </div>
      ))}

      <div className="sidenav-group-label">Review Workflow</div>
      <div className={'sidenav-item ' + (open['Review Workflow'] ? 'open' : '')} onClick={() => toggle('Review Workflow')}>
        <i className="material-icons">fact_check</i>All Phases
        <i className="material-icons chev">expand_more</i>
      </div>
      {open['Review Workflow'] && (
        <div className="sidenav-sub">
          {NAV[2].items.map(it => (
            <div key={it.key} className="sidenav-item" onClick={() => onNavigate(it.key)}>
              {it.label}
            </div>
          ))}
        </div>
      )}

      <div className="sidenav-group-label">Admin</div>
      <div className="sidenav-item" onClick={() => onNavigate('journals')}><i className="material-icons">menu_book</i>Journals</div>
      <div className="sidenav-item" onClick={() => onNavigate('users')}><i className="material-icons">group</i>Users & Roles</div>
      <div className="sidenav-item" onClick={() => onNavigate('reports')}><i className="material-icons">insights</i>Reports</div>

      <div className="sidenav-group-label">Docs</div>
      {DOCS.map(d => (
        <div key={d.key} className="sidenav-item"><i className="material-icons">{d.icon}</i>{d.label}</div>
      ))}

      <div style={{flex:1}}></div>
      <div className="sidenav-item" style={{marginTop:10,borderTop:'1px solid #eeeeee',paddingTop:14,borderRadius:0}}>
        <i className="material-icons">logout</i>Sign Out
      </div>
    </aside>
  );
}

window.Sidenav = Sidenav;
