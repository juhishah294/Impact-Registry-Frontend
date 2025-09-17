import React from 'react'
import Navigation from './navigation'
import { Toaster } from '@/components/ui/toaster'

interface PublicLayoutProps {
  children: React.ReactNode
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {children}
      </main>
      <Toaster />
    </div>
  )
}

export default PublicLayout
