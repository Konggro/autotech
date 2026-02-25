import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!isAdmin) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireUser({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn(
        'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.',
      );
      return;
    }

    // Smoke-check Supabase auth connection on app boot.
    supabase?.auth.getSession().catch((error) => {
      console.error('Supabase connection check failed:', error);
    });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/preview_page.html"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/products"
          element={
            <PublicLayout>
              <ProductListingPage />
            </PublicLayout>
          }
        />
        <Route
          path="/products/:category"
          element={
            <PublicLayout>
              <ProductListingPage />
            </PublicLayout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PublicLayout>
              <ProductDetailPage />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          }
        />
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* User Routes */}
        <Route
          path="/favorites"
          element={
            <RequireUser>
              <PublicLayout>
                <FavoritesPage />
              </PublicLayout>
            </RequireUser>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/login" replace />} />
        <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
        <Route path="/admin/products" element={<RequireAdmin><AdminProductsPage /></RequireAdmin>} />
        <Route path="/admin/products/new" element={<RequireAdmin><AdminProductFormPage /></RequireAdmin>} />
        <Route path="/admin/products/edit/:id" element={<RequireAdmin><AdminProductFormPage /></RequireAdmin>} />
        <Route path="/admin/inquiries" element={<RequireAdmin><AdminInquiriesPage /></RequireAdmin>} />
        <Route path="/admin/settings" element={<RequireAdmin><AdminSettingsPage /></RequireAdmin>} />

        {/* Catch-all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}