import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { HashRouter, Routes, Route } from 'react-router-dom'
import CustomerPage from './pages/CustomerPage'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<CustomerPage />} />
            <Route path="/screens" element={<CustomerPage />} />
            <Route path="/admin" element={<App />} />
            <Route path="*" element={<CustomerPage />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
