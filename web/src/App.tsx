import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';

import { Upload } from './components/Upload';

// Placeholder components
const Dashboard = () => <div className="p-4"><h2>Dashboard</h2><p>Welcome to the DAM Platform.</p></div>;
const Assets = () => <div className="p-4"><h2>Assets</h2><p>Asset listing will be here.</p></div>;
const Settings = () => <div className="p-4"><h2>Settings</h2><p>Settings page.</p></div>;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
