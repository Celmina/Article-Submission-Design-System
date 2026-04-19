// Navbar.jsx — flush, no glass
function Navbar({ crumbs = [], title = 'Submissions' }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="crumbs">
          <span>Pages</span>
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              <span className="sep">/</span>
              <span className={i === crumbs.length - 1 ? 'cur' : ''}>{c}</span>
            </React.Fragment>
          ))}
        </div>
        <div className="title">{title}</div>
      </div>
      <div className="navbar-right">
        <div className="search-pill">
          <i className="material-icons">search</i>
          <input placeholder="Search here" />
        </div>
        <button className="navbar-icon" title="Account"><i className="material-icons">account_circle</i></button>
        <button className="navbar-icon" title="Settings"><i className="material-icons">settings</i></button>
        <button className="navbar-icon" title="Notifications"><i className="material-icons">notifications</i><span className="dot"></span></button>
      </div>
    </nav>
  );
}

window.Navbar = Navbar;
