import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Header from './components/comman/Header';
import Sidebar from './components/comman/Sidebar';
import Footer from './components/comman/Footer';

import Dashboard from './pages/Dashboard';
import PersonnelPage from './pages/PersonnelPage';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import MatchingPage from './pages/MatchingPage';

import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/personnel" element={<PersonnelPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/matching" element={<MatchingPage />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;