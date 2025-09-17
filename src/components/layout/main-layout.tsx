import React from 'react'
import Navigation from './navigation'
import AuthenticatedLayout from './authenticated-layout'
import { Toaster } from '@/components/ui/toaster'
import { useAuth } from '@/contexts/auth-context'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen">
      {isAuthenticated ? (
        <AuthenticatedLayout>
          {children}
        </AuthenticatedLayout>
      ) : (
        <>
          <Navigation />
          <main>
            {children}
          </main>
        </>
      )}
      <Toaster />
    </div>
  )
}

export default MainLayout
