import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Building2, 
  Users, 
  UserPlus, 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  User,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  GraduationCap,
  Stethoscope,
  Heart,
  Microscope,
  Activity,
  Bed,
  UserCheck,
  Award,
  Building,
  Edit,
  Save,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { GET_INSTITUTE } from '@/graphql/queries'
import { REGISTER_USER_TO_INSTITUTE } from '@/graphql/mutations'

const InstituteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editData, setEditData] = useState<any>({})

  // Fetch institute data
  const { data, loading, error, refetch } = useQuery(GET_INSTITUTE, {
    variables: { id },
    skip: !id
  })

  // Register user mutation
  const [registerUser] = useMutation(REGISTER_USER_TO_INSTITUTE)

  const institute = data?.institute

  // Check if current user can manage this institute
  const canManageInstitute = user?.role === 'SUPER_ADMIN' || 
    (user?.role === 'INSTITUTE_ADMIN' && user?.instituteId === id)

  // Check if current user can edit institute details (super admin only)
  const canEditInstitute = user?.role === 'SUPER_ADMIN'

  // Initialize edit data when entering edit mode
  const handleEditMode = () => {
    if (institute) {
      setEditData({ ...institute })
      setIsEditMode(true)
    }
  }

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditData({})
  }

  // Save changes (placeholder - needs backend implementation)
  const handleSaveChanges = () => {
    toast({
      title: "Update Not Available",
      description: "Institute update functionality needs to be implemented in the backend GraphQL schema.",
      variant: "destructive"
    })
    setIsEditMode(false)
  }

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!institute?.id) return

    setIsCreatingUser(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await registerUser({
        variables: {
          input: {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            role: formData.get('role') as string,
            instituteId: institute.id
          }
        }
      })

      if (result.data?.registerUserToInstitute) {
        toast({
          title: "User Created Successfully",
          description: `${result.data.registerUserToInstitute.user.firstName} ${result.data.registerUserToInstitute.user.lastName} has been added to the institute.`,
          variant: "success"
        })
        
        // Reset form and hide it
        setShowAddUserForm(false)
        e.currentTarget.reset()
        
        // Refetch institute data
        refetch()
      }
    } catch (error: any) {
      toast({
        title: "Error Creating User",
        description: error.message || "Failed to create user. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsCreatingUser(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending Approval</Badge>
      case 'APPROVED':
        return <Badge variant="outline" className="text-green-600 border-green-600">Approved</Badge>
      case 'REJECTED':
        return <Badge variant="outline" className="text-red-600 border-red-600">Rejected</Badge>
      case 'SUSPENDED':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge variant="outline" className="text-purple-600 border-purple-600">Super Admin</Badge>
      case 'INSTITUTE_ADMIN':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Institute Admin</Badge>
      case 'DATA_ENTRY':
        return <Badge variant="outline" className="text-green-600 border-green-600">Data Entry</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const renderBooleanField = (value: boolean | undefined, label: string) => {
    if (value === undefined) return null
    return (
      <div className="flex items-center space-x-2">
        {value ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : (
          <XCircle className="w-4 h-4 text-red-600" />
        )}
        <span className="text-sm">{label}</span>
      </div>
    )
  }

  const getOrganizationType = (institute: any) => {
    if (institute.isPublicSector) return "Public Sector"
    if (institute.isPrivateNonProfit) return "Private Non-Profit"
    if (institute.isCorporateHospital) return "Corporate Hospital"
    if (institute.isPrivatePractice) return "Private Practice"
    return "Unknown"
  }

  const getMedicationCoverage = (institute: any) => {
    const coverage = []
    if (institute.medications100Percent) coverage.push("100% Medications")
    if (institute.lab100Percent) coverage.push("100% Lab Services")
    if (institute.hd100Percent) coverage.push("100% Hemodialysis")
    if (institute.hdReduced) coverage.push("Reduced HD")
    return coverage.length > 0 ? coverage.join(", ") : "Not specified"
  }

  const getTrainingInfo = (institute: any) => {
    const training = []
    if (institute.isTeachingHospital) training.push("Teaching Hospital")
    if (institute.isUGCenter) training.push("UG Center")
    if (institute.isPGCenter) training.push("PG Center")
    if (institute.hasPediatricTraining) training.push(`Pediatric Training (${institute.trainingType || 'Not specified'})`)
    return training.length > 0 ? training.join(", ") : "Not specified"
  }

  const renderEditableField = (label: string, value: any, fieldName: string, type: 'text' | 'number' | 'email' | 'tel' = 'text') => {
    if (isEditMode && canEditInstitute) {
      return (
        <div>
          <Label className="text-sm font-medium text-gray-500">{label}</Label>
          <Input
            type={type}
            value={editData[fieldName] || ''}
            onChange={(e) => setEditData({ ...editData, [fieldName]: e.target.value })}
            className="mt-1"
          />
        </div>
      )
    }
    
    return (
      <div>
        <Label className="text-sm font-medium text-gray-500">{label}</Label>
        <div className="mt-1 text-sm text-gray-600">{value || 'Not specified'}</div>
      </div>
    )
  }

  const renderEditableBooleanField = (label: string, value: boolean | undefined, fieldName: string) => {
    if (isEditMode && canEditInstitute) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={editData[fieldName] || false}
            onChange={(e) => setEditData({ ...editData, [fieldName]: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="text-sm">{label}</span>
        </div>
      )
    }
    
    return renderBooleanField(value, label)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error || !institute) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Institute Not Found</h1>
            <p className="text-gray-600 mb-4">The institute you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => navigate('/institute')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Institutes
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/institute')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{institute.centerName}</h1>
            <p className="text-gray-600 mt-1">Institute Details & User Management</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {canEditInstitute && !isEditMode && (
            <Button
              onClick={handleEditMode}
              variant="outline"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Institute
            </Button>
          )}
          {canEditInstitute && isEditMode && (
            <div className="flex space-x-2">
              <Button
                onClick={handleSaveChanges}
                size="sm"
                disabled={isUpdating}
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
          <Building2 className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Edit Mode Notice */}
      {isEditMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Edit Mode - Backend Update Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You can edit the fields below, but saving changes requires implementing the <code>updateInstitute</code> mutation in the backend GraphQL schema.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Institute Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Institute Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <div className="mt-1">{getStatusBadge(institute.approvalStatus)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <div className="mt-1 flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(institute.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {renderEditableField("Address", institute.address, "address")}

              {renderEditableField("Contact Information", institute.contactInformation, "contactInformation", "tel")}

              {renderEditableField("Head of Department", institute.headOfDepartment, "headOfDepartment")}

              {renderEditableField("Head of Department Contact", institute.headOfDepartmentContact, "headOfDepartmentContact", "email")}

              {renderEditableField("Co-Investigator", institute.coInvestigatorName, "coInvestigatorName")}

              {renderEditableField("Co-Investigator Contact", institute.coInvestigatorContact, "coInvestigatorContact", "email")}
            </CardContent>
          </Card>

          {/* Organization Type & Coverage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Organization & Coverage</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Organization Type</Label>
                {isEditMode && canEditInstitute ? (
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.isPublicSector || false}
                        onChange={(e) => setEditData({ ...editData, isPublicSector: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Public Sector</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.isPrivateNonProfit || false}
                        onChange={(e) => setEditData({ ...editData, isPrivateNonProfit: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Private Non-Profit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.isCorporateHospital || false}
                        onChange={(e) => setEditData({ ...editData, isCorporateHospital: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Corporate Hospital</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.isPrivatePractice || false}
                        onChange={(e) => setEditData({ ...editData, isPrivatePractice: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Private Practice</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-gray-600">{getOrganizationType(institute)}</div>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Medication & Service Coverage</Label>
                {isEditMode && canEditInstitute ? (
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.medications100Percent || false}
                        onChange={(e) => setEditData({ ...editData, medications100Percent: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">100% Medications</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.lab100Percent || false}
                        onChange={(e) => setEditData({ ...editData, lab100Percent: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">100% Lab Services</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.hd100Percent || false}
                        onChange={(e) => setEditData({ ...editData, hd100Percent: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">100% Hemodialysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.hdReduced || false}
                        onChange={(e) => setEditData({ ...editData, hdReduced: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Reduced HD</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-gray-600">{getMedicationCoverage(institute)}</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderEditableField("Number of Beds", institute.numberOfBeds, "numberOfBeds", "number")}
                {renderEditableField("Number of Faculty", institute.numberOfFaculty, "numberOfFaculty", "number")}
                {renderEditableField("Average Trainees", institute.averageTrainees, "averageTrainees", "number")}
              </div>
            </CardContent>
          </Card>

          {/* Training & Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5" />
                <span>Training & Education</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Training Information</Label>
                {isEditMode && canEditInstitute ? (
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.isTeachingHospital || false}
                        onChange={(e) => setEditData({ ...editData, isTeachingHospital: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Teaching Hospital</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.isUGCenter || false}
                        onChange={(e) => setEditData({ ...editData, isUGCenter: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">UG Center</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.isPGCenter || false}
                        onChange={(e) => setEditData({ ...editData, isPGCenter: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">PG Center</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.hasPediatricTraining || false}
                        onChange={(e) => setEditData({ ...editData, hasPediatricTraining: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Pediatric Training</span>
                    </div>
                    {editData.hasPediatricTraining && (
                      <div className="ml-6">
                        <Label className="text-sm font-medium text-gray-500">Training Type</Label>
                        <Input
                          type="text"
                          value={editData.trainingType || ''}
                          onChange={(e) => setEditData({ ...editData, trainingType: e.target.value })}
                          placeholder="e.g., 2 year fellowship"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-gray-600">{getTrainingInfo(institute)}</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Clinical Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5" />
                <span>Clinical Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">CKD & Dialysis Services</Label>
                  <div className="space-y-1">
                    {renderEditableBooleanField("Standalone CKD Clinic", institute.standaloneCKDClinic, "standaloneCKDClinic")}
                    {renderEditableBooleanField("Clinical Care Non-Dialysis", institute.clinicalCareNonDialysis, "clinicalCareNonDialysis")}
                    {renderEditableBooleanField("Maintenance Hemodialysis", institute.maintenanceHD, "maintenanceHD")}
                    {renderEditableBooleanField("Maintenance Peritoneal Dialysis", institute.maintenancePD, "maintenancePD")}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Transplant Services</Label>
                  <div className="space-y-1">
                    {renderEditableBooleanField("Kidney Transplant", institute.kidneyTransplant, "kidneyTransplant")}
                    {renderEditableBooleanField("Living Donor Transplant", institute.livingDonorTransplant, "livingDonorTransplant")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Laboratory & Diagnostic Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Microscope className="w-5 h-5" />
                <span>Laboratory & Diagnostic Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Laboratory Services</Label>
                  <div className="space-y-1">
                    {renderEditableBooleanField("Routine Lab Services", institute.routineLabServices, "routineLabServices")}
                    {renderEditableBooleanField("Cross Match Lab", institute.crossMatchLab, "crossMatchLab")}
                    {renderEditableBooleanField("HLA Typing Lab", institute.hlaTypingLab, "hlaTypingLab")}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Diagnostic Services</Label>
                  <div className="space-y-1">
                    {renderEditableBooleanField("Ultrasound", institute.ultrasound, "ultrasound")}
                    {renderEditableBooleanField("Doppler", institute.doppler, "doppler")}
                    {renderEditableBooleanField("PICU", institute.picu, "picu")}
                    {renderEditableBooleanField("NICU", institute.nicu, "nicu")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staffing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5" />
                <span>Staffing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Medical Staff</Label>
                  <div className="space-y-1">
                    {renderEditableBooleanField("Pediatric Nephrologists", institute.pediatricNephrologists, "pediatricNephrologists")}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Support Staff</Label>
                  <div className="space-y-1">
                    {renderEditableBooleanField("CKD Nurse", institute.ckdNurse, "ckdNurse")}
                    {renderEditableBooleanField("Dialysis Nurse", institute.dialysisNurse, "dialysisNurse")}
                    {renderEditableBooleanField("Transplant Coordinator", institute.transplantCoordinator, "transplantCoordinator")}
                    {renderEditableBooleanField("Social Worker", institute.socialWorker, "socialWorker")}
                    {renderEditableBooleanField("Renal Dietician", institute.renalDietician, "renalDietician")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{institute.users?.length || 0}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {institute.users?.filter((u: any) => u.status === 1).length || 0}
                </div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
            </CardContent>
          </Card>

          {canManageInstitute && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setShowAddUserForm(!showAddUserForm)}
                  className="w-full"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New User
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add User Form */}
      {showAddUserForm && canManageInstitute && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Add New User</span>
            </CardTitle>
            <CardDescription>Create a new user account for this institute</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter password"
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select name="role" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DATA_ENTRY">Data Entry</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={isCreatingUser}>
                  {isCreatingUser ? 'Creating...' : 'Create User'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddUserForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Institute Users</span>
          </CardTitle>
          <CardDescription>Manage users associated with this institute</CardDescription>
        </CardHeader>
        <CardContent>
          {institute.users && institute.users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {institute.users.map((user: any) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getUserRoleBadge(user.role)}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={user.status === 1 ? "outline" : "secondary"}>
                          {user.status === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No users found for this institute.</p>
              {canManageInstitute && (
                <Button
                  onClick={() => setShowAddUserForm(true)}
                  className="mt-4"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add First User
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default InstituteDetail
