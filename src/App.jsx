import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import News from './pages/News';
import GetInvolved from './pages/GetInvolved';
import Contact from './pages/Contact';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminNews from './pages/admin/News';
import AdminProjects from './pages/admin/Projects';
import AdminVolunteers from './pages/admin/Volunteers';
import AdminContact from './pages/admin/Contact';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/news" element={<News />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="volunteers" element={<AdminVolunteers />} />
                <Route path="contact" element={<AdminContact />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 