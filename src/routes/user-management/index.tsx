import React, { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { 
  GET_INSTITUTES, 
  GET_PENDING_INSTITUTES, 
  GET_APPROVED_INSTITUTES 
} from '@/graphql/queries'
import { 
  APPROVE_INSTITUTE, 
  REJECT_INSTITUTE, 
  SUSPEND_INSTITUTE, 
  DISABLE_INSTITUTE, 
  ENABLE_INSTITUTE,
  DISABLE_USER,
  ENABLE_USER
} from '@/graphql/mutations'
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Pause, 
  Play, 
  Users, 
  Building2,
  AlertCircle,
  Clock,
  Eye,
  MoreHorizontal
} from 'lucide-react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  status?: number
}

interface Institute {
  id: string
  centerName: string
  address: string
  contactInformation: string
  headOfDepartment: string
  approvalStatus: string
  status: number
  createdAt: string
  users: User[]
}

const UserManagement: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [instituteFilter, setInstituteFilter] = useState('all')
  const [selectedTab, setSelectedTab] = useState<'institutes' | 'users'>('institutes')
  
  // State for modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  // Queries
  const { data: institutesData, loading: institutesLoading, refetch: refetchInstitutes } = useQuery(GET_INSTITUTES)
  const { data: pendingData, loading: pendingLoading, refetch: refetchPending } = useQuery(GET_PENDING_INSTITUTES)
  const { data: approvedData, loading: approvedLoading, refetch: refetchApproved } = useQuery(GET_APPROVED_INSTITUTES)

  // Mutations
  const [approveInstitute] = useMutation(APPROVE_INSTITUTE)
  const [rejectInstitute] = useMutation(REJECT_INSTITUTE)
  const [suspendInstitute] = useMutation(SUSPEND_INSTITUTE)
  const [disableInstitute] = useMutation(DISABLE_INSTITUTE)
  const [enableInstitute] = useMutation(ENABLE_INSTITUTE)
  const [disableUser] = useMutation(DISABLE_USER)
  const [enableUser] = useMutation(ENABLE_USER)

  // Check if user is super admin
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  if (!isSuperAdmin) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access user management.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Combine all institutes data
  const allInstitutes = useMemo(() => {
    const institutes = institutesData?.institutes || []
    const pending = pendingData?.pendingInstitutes || []
    const approved = approvedData?.approvedInstitutes || []
    
    // Merge and deduplicate
    const combined = [...institutes, ...pending, ...approved]
    const unique = combined.filter((institute, index, self) => 
      index === self.findIndex(i => i.id === institute.id)
    )
    return unique
  }, [institutesData, pendingData, approvedData])

  // Get all users from all institutes
  const allUsers = useMemo(() => {
    return allInstitutes.flatMap(institute => 
      institute.users.map(user => ({
        ...user,
        instituteName: institute.centerName,
        instituteId: institute.id
      }))
    )
  }, [allInstitutes])

  // Filter data based on search and filters
  const filteredInstitutes = useMemo(() => {
    let filtered = allInstitutes

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(institute =>
        institute.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institute.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institute.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(institute => institute.approvalStatus === statusFilter)
    }

    return filtered
  }, [allInstitutes, searchTerm, statusFilter])

  const filteredUsers = useMemo(() => {
    let filtered = allUsers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.instituteName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Institute filter
    if (instituteFilter !== 'all') {
      filtered = filtered.filter(user => user.instituteId === instituteFilter)
    }

    return filtered
  }, [allUsers, searchTerm, instituteFilter])

  // Action handlers
  const handleApproveInstitute = async (instituteId: string) => {
    try {
      await approveInstitute({ variables: { id: instituteId } })
      toast({
        title: "Institute Approved",
        description: "The institute has been approved successfully.",
        variant: "success"
      })
      refetchInstitutes()
      refetchPending()
      refetchApproved()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve institute.",
        variant: "destructive"
      })
    }
  }

  const handleRejectInstitute = async () => {
    if (!selectedInstitute || !rejectReason.trim()) return

    try {
      await rejectInstitute({ 
        variables: { 
          id: selectedInstitute.id, 
          reason: rejectReason 
        } 
      })
      toast({
        title: "Institute Rejected",
        description: "The institute has been rejected successfully.",
        variant: "success"
      })
      setRejectModalOpen(false)
      setRejectReason('')
      setSelectedInstitute(null)
      refetchInstitutes()
      refetchPending()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject institute.",
        variant: "destructive"
      })
    }
  }

  const handleSuspendInstitute = async (instituteId: string) => {
    try {
      await suspendInstitute({ variables: { id: instituteId } })
      toast({
        title: "Institute Suspended",
        description: "The institute has been suspended successfully.",
        variant: "success"
      })
      refetchInstitutes()
      refetchApproved()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to suspend institute.",
        variant: "destructive"
      })
    }
  }

  const handleToggleInstituteStatus = async (instituteId: string, currentStatus: number) => {
    try {
      if (currentStatus === 1) {
        await disableInstitute({ variables: { id: instituteId } })
        toast({
          title: "Institute Disabled",
          description: "The institute has been disabled successfully.",
          variant: "success"
        })
      } else {
        await enableInstitute({ variables: { id: instituteId } })
        toast({
          title: "Institute Enabled",
          description: "The institute has been enabled successfully.",
          variant: "success"
        })
      }
      refetchInstitutes()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update institute status.",
        variant: "destructive"
      })
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: number) => {
    try {
      if (currentStatus === 1) {
        await disableUser({ variables: { id: userId } })
        toast({
          title: "User Disabled",
          description: "The user has been disabled successfully.",
          variant: "success"
        })
      } else {
        await enableUser({ variables: { id: userId } })
        toast({
          title: "User Enabled",
          description: "The user has been enabled successfully.",
          variant: "success"
        })
      }
      refetchInstitutes()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status.",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING_APPROVAL': { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'APPROVED': { label: 'Approved', className: 'bg-green-100 text-green-800 border-green-200' },
      'REJECTED': { label: 'Rejected', className: 'bg-red-100 text-red-800 border-red-200' },
      'SUSPENDED': { label: 'Suspended', className: 'bg-orange-100 text-orange-800 border-orange-200' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: 'bg-gray-100 text-gray-800 border-gray-200' }
    
    return (
      <Badge className={`px-3 py-1 ${config.className}`}>
        {config.label}
      </Badge>
    )
  }

  const getStatusIcon = (status: number) => {
    return status === 1 ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    )
  }

  if (institutesLoading || pendingLoading || approvedLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage institutes and users across the system</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">{allInstitutes.length} Institutes</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">{allUsers.length} Users</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setSelectedTab('institutes')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'institutes'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Institutes
        </button>
        <button
          onClick={() => setSelectedTab('users')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'users'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Users
        </button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={`Search ${selectedTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {selectedTab === 'institutes' && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {selectedTab === 'users' && (
              <Select value={instituteFilter} onValueChange={setInstituteFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by institute" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Institutes</SelectItem>
                  {allInstitutes.map((institute) => (
                    <SelectItem key={institute.id} value={institute.id}>
                      {institute.centerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Institutes Table */}
      {selectedTab === 'institutes' && (
        <Card>
          <CardHeader>
            <CardTitle>Institutes ({filteredInstitutes.length})</CardTitle>
            <CardDescription>Manage institute approvals and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Institute</th>
                    <th className="text-left p-4 font-medium">Contact</th>
                    <th className="text-left p-4 font-medium">Users</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">System Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstitutes.map((institute) => (
                    <tr key={institute.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{institute.centerName}</div>
                          <div className="text-sm text-gray-500">{institute.address}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-sm">{institute.contactInformation}</div>
                          <div className="text-sm text-gray-500">{institute.headOfDepartment}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{institute.users.length}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(institute.approvalStatus)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(institute.status)}
                          <span className="text-sm">
                            {institute.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {institute.approvalStatus === 'PENDING_APPROVAL' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApproveInstitute(institute.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedInstitute(institute)
                                  setRejectModalOpen(true)
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          
                          {institute.approvalStatus === 'APPROVED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSuspendInstitute(institute.id)}
                            >
                              <Pause className="w-4 h-4 mr-1" />
                              Suspend
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleInstituteStatus(institute.id, institute.status)}
                          >
                            {institute.status === 1 ? (
                              <>
                                <XCircle className="w-4 h-4 mr-1" />
                                Disable
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-1" />
                                Enable
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      {selectedTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">User</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Role</th>
                    <th className="text-left p-4 font-medium">Institute</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{user.email}</div>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{user.instituteName}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(user.status || 0)}
                          <span className="text-sm">
                            {user.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleUserStatus(user.id, user.status || 0)}
                        >
                          {user.status === 1 ? (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Disable
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-1" />
                              Enable
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reject Institute Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Institute</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedInstitute?.centerName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRejectInstitute}
                disabled={!rejectReason.trim()}
              >
                Reject Institute
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserManagement
