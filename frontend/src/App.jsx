import { Routes, Route } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AiAnalysis from './pages/AiAnalysis';
import ChatAnalyzer from './pages/ChatAnalyzer';
import History from './pages/History';
import Settings from './pages/Settings';
import About from './pages/About';
import Contact from './pages/Contact';
import ScreenshotTradeReport from './pages/ScreenshotTradeReport';
import { ThemeProvider } from './context/ThemeContext';
import LogIn from './pages/login';
import Register from './pages/Register';

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-analysis" element={<AiAnalysis />} />
          <Route path="/chat-analyzer" element={<ChatAnalyzer />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trade-report/screenshot" element={<ScreenshotTradeReport />} />
      </Routes>
    </ThemeProvider>
  );
}
