import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Activity,
  Droplets,
  BarChart3,
  UserX
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/contexts/auth-context'

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Institute', href: '/institute', icon: Building2 },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Follow-up', href: '/followup', icon: Activity },
    { name: 'Dialysis', href: '/dialysis', icon: Droplets },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Exit Management', href: '/exit-management', icon: UserX },
    { name: 'Consent', href: '/consent', icon: FileText },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  // Add user management for super admins
  const superAdminItems = [
    { name: 'User Management', href: '/user-management', icon: Shield },
  ]

  const allNavigationItems = user?.role === 'SUPER_ADMIN' 
    ? [...navigationItems, ...superAdminItems]
    : navigationItems

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'SUSPENDED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="IMPACT Registry Logo" className="h-8 w-auto" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">IMPACT</h1>
                <p className="text-xs text-gray-600">CKD Registry</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      {user && !isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            
            {user.institute && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-700 truncate">{user.institute.centerName}</p>
                </div>
                <Badge className={`text-xs ${getStatusColor(user.institute.approvalStatus)}`}>
                  {user.institute.approvalStatus.replace('_', ' ')}
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {allNavigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="space-y-3">
            {/* Contact Info */}
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center space-x-2">
                <Mail className="w-3 h-3" />
                <span>support@impact-ckd.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3 h-3" />
                <span>+91 11 2658 8888</span>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
        
        {isCollapsed && (
          <Button
            variant="outline"
            size="icon"
            onClick={logout}
            className="w-full"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default Sidebar
