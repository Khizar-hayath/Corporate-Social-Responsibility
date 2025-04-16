import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import News from './pages/News';
import ArticleDetail from './pages/ArticleDetail';
import GetInvolved from './pages/GetInvolved';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminNews from './pages/admin/News';
import AdminProjects from './pages/admin/Projects';
import AdminVolunteers from './pages/admin/Volunteers';
import AdminContact from './pages/admin/Contact';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';
import ProjectManagement from './pages/account/ProjectManagement';

// Layout wrapper component that conditionally renders Navbar and Footer
const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Only show Navbar for non-admin routes */}
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* Only show Footer for non-admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Wrap all routes in the AppLayout component */}
            <Route element={<AppLayout />}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<ArticleDetail />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* NGO Project Management (accessible only to NGOs) */}
              <Route
                path="/account/projects"
                element={
                  <ProtectedRoute requireNGO>
                    <ProjectManagement />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/news" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminNews />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/projects" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminProjects />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/volunteers" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminVolunteers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/contact" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminContact />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App; 