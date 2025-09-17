import React from 'react'
import { useQuery } from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Building2, 
  FileText, 
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { GET_INSTITUTES, GET_PENDING_INSTITUTES, GET_APPROVED_INSTITUTES } from '@/graphql/queries'

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  // Fetch data for statistics
  const { data: institutesData, loading: institutesLoading } = useQuery(GET_INSTITUTES)
  const { data: pendingData, loading: pendingLoading } = useQuery(GET_PENDING_INSTITUTES)
  const { data: approvedData, loading: approvedLoading } = useQuery(GET_APPROVED_INSTITUTES)

  // Calculate real statistics
  const allInstitutes = institutesData?.institutes || []
  const pendingInstitutes = pendingData?.pendingInstitutes || []
  const approvedInstitutes = approvedData?.approvedInstitutes || []
  
  // Calculate total users across all institutes
  const totalUsers = allInstitutes.reduce((total: number, institute: any) => total + (institute.users?.length || 0), 0)
  
  // Calculate active institutes (approved and active)
  const activeInstitutes = approvedInstitutes.filter((institute: any) => institute.status === 1)
  
  // Calculate pending approvals
  const pendingApprovals = pendingInstitutes.length

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Users across all institutes'
    },
    {
      title: 'Active Institutes',
      value: activeInstitutes.length.toString(),
      change: `+${pendingApprovals} pending`,
      changeType: 'positive' as const,
      icon: Building2,
      description: 'Approved and active institutes'
    },
    {
      title: 'Total Institutes',
      value: allInstitutes.length.toString(),
      change: `+${pendingApprovals} pending`,
      changeType: 'positive' as const,
      icon: FileText,
      description: 'All registered institutes'
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals.toString(),
      change: 'Needs review',
      changeType: 'pending' as const,
      icon: Clock,
      description: 'Institutes awaiting approval'
    }
  ]

  // Generate recent activities based on real data
  const recentActivities = React.useMemo(() => {
    const activities: any[] = []
    
    // Add recent pending institutes
    pendingInstitutes.slice(0, 2).forEach((institute: any, index: number) => {
      activities.push({
        id: `pending-${index}`,
        type: 'institute',
        message: `New institute registration: ${institute.centerName}`,
        time: 'Pending approval',
        icon: Clock
      })
    })
    
    // Add recent approved institutes
    approvedInstitutes.slice(0, 2).forEach((institute: any, index: number) => {
      activities.push({
        id: `approved-${index}`,
        type: 'institute',
        message: `Institute approved: ${institute.centerName}`,
        time: 'Recently approved',
        icon: CheckCircle
      })
    })
    
    return activities.slice(0, 4) // Show max 4 activities
  }, [pendingInstitutes, approvedInstitutes])

  // Show loading state
  if (institutesLoading || pendingLoading || approvedLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'PENDING_APPROVAL':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'REJECTED':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your institute today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Institute Status */}
      {user?.institute && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon(user.institute.approvalStatus)}
              <span>Institute Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{user.institute.centerName}</h3>
                <p className="text-sm text-gray-600">Institute ID: {user.institute.id}</p>
              </div>
              <Badge className={`px-3 py-1 ${
                user.institute.approvalStatus === 'APPROVED' 
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : user.institute.approvalStatus === 'PENDING_APPROVAL'
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  : 'bg-red-100 text-red-800 border-red-200'
              }`}>
                {user.institute.approvalStatus.replace('_', ' ')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  <span className={`${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  {' '}{stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your institute</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user?.role === 'SUPER_ADMIN' && (
                <button 
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => window.location.href = '/user-management'}
                >
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Manage Institutes</p>
                      <p className="text-sm text-gray-500">Review and approve institute registrations</p>
                    </div>
                  </div>
                </button>
              )}
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">View All Users</p>
                    <p className="text-sm text-gray-500">Browse users across all institutes</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Generate Report</p>
                    <p className="text-sm text-gray-500">Create data reports and analytics</p>
                  </div>
                </div>
              </button>
              {pendingApprovals > 0 && (
                <button 
                  className="w-full text-left p-3 rounded-lg border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-colors"
                  onClick={() => window.location.href = '/user-management'}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">{pendingApprovals} Pending Approvals</p>
                      <p className="text-sm text-yellow-700">Review institute registrations</p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard