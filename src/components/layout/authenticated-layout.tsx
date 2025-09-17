import React from 'react'
import Sidebar from './sidebar'
import { useAuth } from '@/contexts/auth-context'
import ApprovalPending from '@/components/auth/approval-pending'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, isApproved, isInstituteAdmin, loading } = useAuth()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show approval pending for institute admins who aren't approved
  if (isAuthenticated && isInstituteAdmin && !isApproved) {
    return <ApprovalPending />
  }

  // Show sidebar layout for authenticated users
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    )
  }

  // Fallback - should not reach here if auth is working properly
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600">Please log in to access this page.</p>
      </div>
    </div>
  )
}

export default AuthenticatedLayout
