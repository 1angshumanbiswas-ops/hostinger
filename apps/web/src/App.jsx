import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { EduAuthProvider } from '@/contexts/EduAuthContext';
import { Helmet } from 'react-helmet';
import ProtectedRoute from '@/components/ProtectedRoute';
import EduProtectedRoute from '@/components/edulearn/EduProtectedRoute';

import PublicLandingPage from '@/pages/PublicLandingPage';
import Home from '@/pages/Home';
import AppsHub from '@/pages/AppsHub';
import PortfolioPage from '@/pages/PortfolioPage';

import EcomHomePage from '@/pages/ecommerce/EcomHomePage';
import EcomLoginPage from '@/pages/ecommerce/LoginPage';
import EcomRegisterPage from '@/pages/ecommerce/RegisterPage';

import JobAssistantDashboard from '@/components/apps/job-assistant/JobAssistantDashboard';
import StockAppWrapper from '@/components/apps/stock-dashboard/StockAppWrapper';
import TradingDashboard from '@/components/apps/custom-trading/TradingDashboard';
import SEOApp from '@/components/apps/SEOApp';
import WeatherForecaster from '@/components/apps/WeatherForecaster';
import HealthMonitor from '@/components/apps/HealthMonitor';
import ATSCVOptimizer from '@/components/apps/ATSCVOptimizer';
import MobileHub from '@/components/apps/MobileHub';
import CricketAnalytics from '@/components/apps/CricketAnalytics';
import AIProgramManager from '@/components/apps/AIProgramManager';
import TechJobFinderDashboard from '@/components/apps/TechJobFinderDashboard';

import BSEStockMarketAIDashboard from '@/components/apps/bse-dashboard/BSEStockMarketAIDashboard';

import HRPortalLayout from '@/components/hr-portal/HRPortalLayout';
import HRPortalDashboard from '@/components/hr-portal/HRPortalDashboard';
import EmployeesPage from '@/components/hr-portal/EmployeesPage';
import FinancialHealthPage from '@/components/hr-portal/FinancialHealthPage';
import CRMManagerPage from '@/components/hr-portal/CRMManagerPage';
import SCMLogisticsPage from '@/components/hr-portal/SCMLogisticsPage';

import CRMLayout from '@/components/crm/CRMLayout';
import CRMDashboardPage from '@/pages/CRMDashboard';
import ContactManagement from '@/pages/ContactManagement';
import SalesPipeline from '@/pages/SalesPipeline';
import ContactDetails from '@/pages/ContactDetails';
import CRMSettings from '@/pages/CRMSettings';

import EduHomePage from '@/pages/edulearn/EduHomePage';
import EduClassesPage from '@/pages/edulearn/EduClassesPage';
import EduSubjectsPage from '@/pages/edulearn/EduSubjectsPage';
import EduResourceLibraryPage from '@/pages/edulearn/EduResourceLibraryPage';
import EduMaterialDetailsPage from '@/pages/edulearn/EduMaterialDetailsPage';
import EduAdminDashboardPage from '@/pages/edulearn/EduAdminDashboardPage';
import EduAdminMaterialsPage from '@/pages/edulearn/EduAdminMaterialsPage';
import EduLoginPage from '@/pages/edulearn/EduLoginPage';
import EduSignupPage from '@/pages/edulearn/EduSignupPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Main Landing Page - Portfolio */}
      <Route path="/" element={<Home />} />
      <Route path="/apps-hub" element={<AppsHub />} />
      <Route path="/hub" element={<PublicLandingPage />} />
      
      {/* Portfolio Page - Public Access with Tabbed Interface */}
      <Route path="/portfolio" element={<PortfolioPage />} />

      {/* E-Commerce Routes */}
      <Route path="/mystore" element={<EcomHomePage />} />
      <Route path="/mystore/login" element={<EcomLoginPage />} />
      <Route path="/mystore/register" element={<EcomRegisterPage />} />

      {/* ERP Application Routes */}
      <Route 
        path="/erp" 
        element={
          <HRPortalLayout>
            <HRPortalDashboard />
          </HRPortalLayout>
        } 
      />
      <Route 
        path="/erp/employees" 
        element={
          <HRPortalLayout>
            <EmployeesPage />
          </HRPortalLayout>
        } 
      />
      <Route 
        path="/erp/finance" 
        element={
          <HRPortalLayout>
            <FinancialHealthPage />
          </HRPortalLayout>
        } 
      />
      <Route 
        path="/erp/crm" 
        element={
          <HRPortalLayout>
            <CRMManagerPage />
          </HRPortalLayout>
        } 
      />
      <Route 
        path="/erp/scm" 
        element={
          <HRPortalLayout>
            <SCMLogisticsPage />
          </HRPortalLayout>
        } 
      />

      {/* Standalone Applications */}
      <Route path="/job-assistant" element={<JobAssistantDashboard />} />
      <Route path="/stock-dashboard" element={<StockAppWrapper />} />
      <Route path="/trading" element={<TradingDashboard />} />
      <Route path="/seo-app" element={<SEOApp />} />
      <Route path="/weather" element={<WeatherForecaster />} />
      <Route path="/health-monitor" element={<HealthMonitor />} />
      <Route path="/ats-optimizer" element={<ATSCVOptimizer />} />
      <Route path="/mobile-hub" element={<MobileHub />} />
      <Route path="/cricket-analytics" element={<CricketAnalytics />} />
      <Route path="/ai-program-manager" element={<AIProgramManager />} />
      <Route path="/ai-program-manager/:moduleId" element={<AIProgramManager />} />
      <Route path="/tech-job-finder" element={<TechJobFinderDashboard />} />
      <Route path="/bse-dashboard" element={<BSEStockMarketAIDashboard />} />

      {/* CRM Routes */}
      <Route 
        path="/crm" 
        element={
          <CRMLayout>
            <CRMDashboardPage />
          </CRMLayout>
        } 
      />
      <Route 
        path="/crm/contacts" 
        element={
          <CRMLayout>
            <ContactManagement />
          </CRMLayout>
        } 
      />
      <Route 
        path="/crm/pipeline" 
        element={
          <CRMLayout>
            <SalesPipeline />
          </CRMLayout>
        } 
      />
      <Route 
        path="/crm/contact/:id" 
        element={
          <CRMLayout>
            <ContactDetails />
          </CRMLayout>
        } 
      />
      <Route 
        path="/crm/settings" 
        element={
          <CRMLayout>
            <CRMSettings />
          </CRMLayout>
        } 
      />

      {/* Education Portal Routes */}
      <Route path="/education" element={<EduHomePage />} />
      <Route path="/education/login" element={<EduLoginPage />} />
      <Route path="/education/signup" element={<EduSignupPage />} />
      <Route path="/education/classes" element={<EduClassesPage />} />
      <Route path="/education/classes/:classId" element={<EduSubjectsPage />} />
      <Route path="/education/library" element={<EduResourceLibraryPage />} />
      <Route path="/education/material/:materialId" element={<EduMaterialDetailsPage />} />
      <Route 
        path="/education/admin" 
        element={
          <EduProtectedRoute requireAdmin={true}>
            <EduAdminDashboardPage />
          </EduProtectedRoute>
        } 
      />
      <Route 
        path="/education/admin/materials" 
        element={
          <EduProtectedRoute requireAdmin={true}>
            <EduAdminMaterialsPage />
          </EduProtectedRoute>
        } 
      />

      {/* Catch-all - Redirect to Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Helmet>
        <title>AI-Powered Applications Hub - Innovation at Your Fingertips</title>
        <meta name="description" content="Explore cutting-edge AI tools and no-code platforms designed to solve real-world problems" />
      </Helmet>
      <AuthProvider>
        <CartProvider>
          <EduAuthProvider>
            <AppRoutes />
          </EduAuthProvider>
        </CartProvider>
      </AuthProvider>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;