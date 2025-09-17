import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Building2, Mail, Phone, RefreshCw, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

const ApprovalPending: React.FC = () => {
  const { user, logout, refetch } = useAuth()

  if (!user?.institute) return null

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return 'Your institute registration is under review. We will notify you once it\'s approved.'
      case 'REJECTED':
        return 'Your institute registration has been rejected. Please contact support for more information.'
      case 'SUSPENDED':
        return 'Your institute access has been suspended. Please contact support for assistance.'
      default:
        return 'Your institute status is being reviewed.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Approval Pending</CardTitle>
            <CardDescription>
              Your institute registration is being reviewed by our team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Badge */}
            <div className="text-center">
              <Badge className={`px-4 py-2 text-sm font-medium ${getStatusColor(user.institute.approvalStatus)}`}>
                {user.institute.approvalStatus.replace('_', ' ')}
              </Badge>
            </div>

            {/* Status Message */}
            <div className="text-center">
              <p className="text-gray-600">
                {getStatusMessage(user.institute.approvalStatus)}
              </p>
            </div>

            {/* Institute Information */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                Institute Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Center Name:</span>
                  <span className="ml-2 text-gray-900">{user.institute.centerName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Institute ID:</span>
                  <span className="ml-2 text-gray-900 font-mono text-xs">{user.institute.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Registration Date:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Rejection Reason (if applicable) */}
            {user.institute.approvalStatus === 'REJECTED' && user.institute.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Rejection Reason:</h4>
                <p className="text-red-700 text-sm">{user.institute.rejectionReason}</p>
              </div>
            )}

            {/* User Information */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Your Account
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-900">{user.firstName} {user.lastName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{user.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Role:</span>
                  <span className="ml-2 text-gray-900">{user.role.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={refetch} 
                variant="outline" 
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Status
              </Button>
              <Button 
                onClick={logout} 
                variant="outline" 
                className="flex-1"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Contact Information */}
            <div className="text-center text-sm text-gray-500">
              <p>Need help? Contact our support team:</p>
              <div className="flex items-center justify-center mt-2 space-x-4">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  <span>support@impact-ckd.org</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  <span>+91 11 2658 8888</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ApprovalPending
