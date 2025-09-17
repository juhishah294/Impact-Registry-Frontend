import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Building2, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  MapPin,
  Phone,
  Mail,
  User
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
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
  ENABLE_INSTITUTE
} from '@/graphql/mutations'

const InstituteManagement: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'>('ALL')

  // Fetch all institute data
  const { data: institutesData, loading: institutesLoading, refetch: refetchInstitutes } = useQuery(GET_INSTITUTES)
  const { data: pendingData, loading: pendingLoading, refetch: refetchPending } = useQuery(GET_PENDING_INSTITUTES)
  const { data: approvedData, loading: approvedLoading, refetch: refetchApproved } = useQuery(GET_APPROVED_INSTITUTES)

  // Mutations for institute actions
  const [approveInstitute] = useMutation(APPROVE_INSTITUTE)
  const [rejectInstitute] = useMutation(REJECT_INSTITUTE)
  const [suspendInstitute] = useMutation(SUSPEND_INSTITUTE)
  const [disableInstitute] = useMutation(DISABLE_INSTITUTE)
  const [enableInstitute] = useMutation(ENABLE_INSTITUTE)

  const allInstitutes = institutesData?.institutes || []
  const pendingInstitutes = pendingData?.pendingInstitutes || []
  const approvedInstitutes = approvedData?.approvedInstitutes || []

  // Combine all institutes with their status
  const combinedInstitutes = [
    ...pendingInstitutes.map((institute: any) => ({ ...institute, status: 'PENDING' })),
    ...approvedInstitutes.map((institute: any) => ({ ...institute, status: 'APPROVED' })),
    ...allInstitutes.filter((institute: any) => 
      institute.approvalStatus === 'REJECTED' || institute.approvalStatus === 'SUSPENDED'
    ).map((institute: any) => ({ ...institute, status: institute.approvalStatus }))
  ]

  // Filter institutes based on search and status
  const filteredInstitutes = combinedInstitutes.filter((institute: any) => {
    const matchesSearch = institute.centerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institute.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institute.contactInformation?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'ALL' || institute.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const handleApprove = async (instituteId: string) => {
    try {
      await approveInstitute({
        variables: { id: instituteId }
      })
      
      toast({
        title: "Institute Approved",
        description: "The institute has been successfully approved.",
        variant: "success"
      })
      
      // Refetch data
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

  const handleReject = async (instituteId: string) => {
    const reason = prompt("Please provide a reason for rejection:")
    if (!reason) return

    try {
      await rejectInstitute({
        variables: { id: instituteId, reason }
      })
      
      toast({
        title: "Institute Rejected",
        description: "The institute has been rejected.",
        variant: "destructive"
      })
      
      // Refetch data
      refetchInstitutes()
      refetchPending()
      refetchApproved()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject institute.",
        variant: "destructive"
      })
    }
  }

  const handleSuspend = async (instituteId: string) => {
    try {
      await suspendInstitute({
        variables: { id: instituteId }
      })
      
      toast({
        title: "Institute Suspended",
        description: "The institute has been suspended.",
        variant: "destructive"
      })
      
      // Refetch data
      refetchInstitutes()
      refetchPending()
      refetchApproved()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to suspend institute.",
        variant: "destructive"
      })
    }
  }

  const handleDisable = async (instituteId: string) => {
    try {
      await disableInstitute({
        variables: { id: instituteId }
      })
      
      toast({
        title: "Institute Disabled",
        description: "The institute has been disabled.",
        variant: "destructive"
      })
      
      // Refetch data
      refetchInstitutes()
      refetchPending()
      refetchApproved()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to disable institute.",
        variant: "destructive"
      })
    }
  }

  const handleEnable = async (instituteId: string) => {
    try {
      await enableInstitute({
        variables: { id: instituteId }
      })
      
      toast({
        title: "Institute Enabled",
        description: "The institute has been enabled.",
        variant: "success"
      })
      
      // Refetch data
      refetchInstitutes()
      refetchPending()
      refetchApproved()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to enable institute.",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'APPROVED':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case 'REJECTED':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      case 'SUSPENDED':
        return <Badge variant="outline" className="text-orange-600 border-orange-600"><AlertCircle className="w-3 h-3 mr-1" />Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getActionButtons = (institute: any) => {
    const buttons = []
    
    if (institute.status === 'PENDING') {
      buttons.push(
        <Button
          key="approve"
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => handleApprove(institute.id)}
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Approve
        </Button>
      )
      buttons.push(
        <Button
          key="reject"
          size="sm"
          variant="destructive"
          onClick={() => handleReject(institute.id)}
        >
          <XCircle className="w-4 h-4 mr-1" />
          Reject
        </Button>
      )
    }
    
    if (institute.status === 'APPROVED') {
      buttons.push(
        <Button
          key="suspend"
          size="sm"
          variant="outline"
          className="text-orange-600 border-orange-600 hover:bg-orange-50"
          onClick={() => handleSuspend(institute.id)}
        >
          <AlertCircle className="w-4 h-4 mr-1" />
          Suspend
        </Button>
      )
      buttons.push(
        <Button
          key="disable"
          size="sm"
          variant="destructive"
          onClick={() => handleDisable(institute.id)}
        >
          <XCircle className="w-4 h-4 mr-1" />
          Disable
        </Button>
      )
    }
    
    if (institute.status === 'SUSPENDED' || institute.status === 'REJECTED') {
      buttons.push(
        <Button
          key="enable"
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => handleEnable(institute.id)}
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Enable
        </Button>
      )
    }
    
    return buttons
  }

  if (institutesLoading || pendingLoading || approvedLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Institute Management</h1>
          <p className="text-gray-600 mt-1">Manage and approve institute registrations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Institutes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allInstitutes.length}</div>
            <p className="text-xs text-muted-foreground">All registered institutes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingInstitutes.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedInstitutes.length}</div>
            <p className="text-xs text-muted-foreground">Active institutes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allInstitutes.reduce((total: number, institute: any) => total + (institute.users?.length || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all institutes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Institute Directory</CardTitle>
          <CardDescription>Search and filter institutes by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search institutes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          {/* Institutes Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Institute</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Users</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstitutes.map((institute: any) => (
                  <tr key={institute.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <button
                          onClick={() => navigate(`/institute/${institute.id}`)}
                          className="font-medium text-gray-900 hover:text-blue-600 hover:underline text-left"
                        >
                          {institute.centerName}
                        </button>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {institute.address}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        {institute.contactInformation && (
                          <div className="flex items-center text-gray-600 mb-1">
                            <Phone className="w-3 h-3 mr-1" />
                            {institute.contactInformation}
                          </div>
                        )}
                        {institute.headOfDepartmentContact && (
                          <div className="flex items-center text-gray-600">
                            <Mail className="w-3 h-3 mr-1" />
                            {institute.headOfDepartmentContact}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-3 h-3 mr-1" />
                        {institute.users?.length || 0} users
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(institute.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        {getActionButtons(institute)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredInstitutes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No institutes found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InstituteManagement
