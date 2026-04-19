import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';

import DashboardLayout from './components/DashboardLayout';
import NewSubmission from './pages/NewSubmission';
import SubmissionSuccess from './pages/SubmissionSuccess';
import SubmissionList from './pages/SubmissionList';
import SubmissionDetail from './pages/SubmissionDetail';
import AuthorRevision from './pages/AuthorRevision';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<NewSubmission />} />
            <Route path="/success/:id" element={<SubmissionSuccess />} />
            <Route path="/internal" element={<SubmissionList />} />
            <Route path="/internal/:id" element={<SubmissionDetail />} />
            <Route path="/revision/:id" element={<AuthorRevision />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
