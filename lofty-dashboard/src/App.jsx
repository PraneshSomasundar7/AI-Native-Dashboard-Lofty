import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import LoftyDashboard from './components/LoftyDashboard'
import UserPortal from './pages/UserPortal'

/**
 * Protects a route — redirects to /login if not authenticated.
 * Optionally enforces a required role.
 */
function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If a specific role is required and user doesn't match, redirect to their home
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'agent' ? '/dashboard' : '/portal'} replace />
  }

  return children
}

/**
 * Handles the root redirect based on auth state and role.
 */
function RootRedirect() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'agent') return <Navigate to="/dashboard" replace />
  return <Navigate to="/portal" replace />
}

/**
 * If already logged in, redirect away from login page.
 */
function AuthRoute() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to={user.role === 'agent' ? '/dashboard' : '/portal'} replace />
  }

  return <AuthPage />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<AuthRoute />} />

          {/* Agent dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="agent">
                <LoftyDashboard />
              </ProtectedRoute>
            }
          />

          {/* User / Lead portal */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute requiredRole="user">
                <UserPortal />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
