import { Routes, Route } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import AiAnalysis from './pages/AiAnalysis';
import ChatAnalyzer from './pages/ChatAnalyzer';
import History from './pages/History';
import Settings from './pages/Settings';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ai-analysis" element={<AiAnalysis />} />
        <Route path="/chat-analyzer" element={<ChatAnalyzer />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}
