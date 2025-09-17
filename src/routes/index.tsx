import React from 'react'
import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layout/main-layout'
import PublicLayout from '@/components/layout/public-layout'
import ProtectedRoute from '@/components/auth/protected-route'
import HomePage from './home'
import Dashboard from './dashboard'
import RegisterPage from './register'
import LoginPage from './login'
import UserManagement from './user-management'
import InstituteManagement from './institute'
import InstituteDetail from './institute/[id]'
import PatientManagement from './patients'
import ConsentManagement from './consent'
import FollowUpManagement from './followup'
import DialysisManagement from './dialysis'
import AnalyticsDashboard from './analytics'
import ExitManagement from './exit-management'

const Routes: React.FC = () => {
  return (
    <ReactRoutes>
      {/* Public routes */}
      <Route path="/" element={
        <ProtectedRoute requireAuth={false}>
          <PublicLayout><HomePage /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/login" element={
        <ProtectedRoute requireAuth={false}>
          <PublicLayout><LoginPage /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/register" element={
        <ProtectedRoute requireAuth={false}>
          <PublicLayout><RegisterPage /></PublicLayout>
        </ProtectedRoute>
      } />
      
      {/* Protected routes - require authentication */}
      <Route path="/dashboard" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><Dashboard /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/institute" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><InstituteManagement /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/institute/:id" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><InstituteDetail /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/user-management" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><UserManagement /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/patients" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><PatientManagement /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/consent" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><ConsentManagement /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/followup" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><FollowUpManagement /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/dialysis" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><DialysisManagement /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><AnalyticsDashboard /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/exit-management" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><ExitManagement /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/registry" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><div className="p-8"><h1 className="text-2xl font-bold">Registry</h1><p>Registry page coming soon...</p></div></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/research" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><div className="p-8"><h1 className="text-2xl font-bold">Research</h1><p>Research page coming soon...</p></div></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/centers" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><div className="p-8"><h1 className="text-2xl font-bold">Participating Centers</h1><p>Centers page coming soon...</p></div></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/contact" element={
        <ProtectedRoute requireAuth={true}>
          <MainLayout><div className="p-8"><h1 className="text-2xl font-bold">Contact</h1><p>Contact page coming soon...</p></div></MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </ReactRoutes>
  )
}

export default Routes