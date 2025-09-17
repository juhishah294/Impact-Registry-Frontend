import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Upload,
  Save,
  Plus,
  Users,
  Stethoscope,
  Activity,
  Microscope,
  Pill,
  Heart,
  Zap
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { CREATE_PATIENT, UPLOAD_CONSENT } from '@/graphql/mutations'

const PatientManagement: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [consentFile, setConsentFile] = useState<File | null>(null)

  const [createPatient] = useMutation(CREATE_PATIENT)
  const [uploadConsent] = useMutation(UPLOAD_CONSENT)

  const [formData, setFormData] = useState({
    // Basic Demographics
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    
    // Guardian Contact
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianRelationship: '',
    
    // Socioeconomic Info
    motherEducationLevel: '',
    fatherEducationLevel: '',
    primaryCaregiver: '',
    earningMembersCount: '',
    primaryEarnerOccupation: '',
    dependentsCount: '',
    familyIncome: '',
    
    // Payment Information
    paymentMode: '',
    hasHealthInsurance: false,
    insuranceType: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    otherPaymentDetails: '',
    
    // Address
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    
    // Consent Management
    consentStatusEnum: '',
    consentType: '',
    isVerbalConsent: false,
    isWrittenConsent: false,
    consentNotes: '',
    assentRequired: false,
    ethicsApprovalRequired: false,
    
    // Clinical History
    ageAtDiagnosis: '',
    primaryRenalDiagnosis: '',
    currentCKDStage: '',
    symptomDurationYears: '',
    symptomDurationMonths: '',
    diagnosisDurationYears: '',
    diagnosisDurationMonths: '',
    surgicalInterventions: '',
    currentComplaints: '',
    comorbidities: '',
    
    // CKD Stage Logic
    isDialysisInitiated: false,
    dialysisNotInitiatedReason: '',
    isPreemptiveTransplantDiscussed: false,
    isTransplantEvaluationInitiated: false,
    transplantType: '',
    
    // Physical Examination
    height: '',
    heightSDS: '',
    weight: '',
    bmi: '',
    bmiSDS: '',
    systolicBP: '',
    diastolicBP: '',
    sbpPercentile: '',
    dbpPercentile: '',
    bpClassification: '',
    growthPercentile: '',
    tannerStage: '',
    
    // Laboratory Investigations
    serumCreatinine: '',
    serumUrea: '',
    eGFR: '',
    hemoglobin: '',
    sodium: '',
    potassium: '',
    bicarbonate: '',
    calcium: '',
    phosphorus: '',
    vitaminD: '',
    proteinuriaDipstick: '',
    ironLevel: '',
    ferritin: '',
    pth: '',
    alp: '',
    uricAcid: '',
    
    // Imaging and Genetics
    otherImaging: '',
    geneticTests: '',
    
    // Medications
    medications: []
  })

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] || {}),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setConsentFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.instituteId) {
      toast({
        title: "Error",
        description: "No institute associated with your account.",
        variant: "destructive"
      })
      return
    }

    setIsCreating(true)
    try {
      // Create patient
      const result = await createPatient({
        variables: {
          input: {
            ...formData,
            instituteId: user.instituteId
          }
        }
      })

      if (result.data?.createPatient) {
        const patient = result.data.createPatient
        
        // Upload consent document if provided
        if (consentFile) {
          await uploadConsent({
            variables: {
              input: {
                patientId: patient.patientId,
                documentType: 'CONSENT_FORM',
                consentStatus: 'OBTAINED'
              },
              file: consentFile
            }
          })
        }

        toast({
          title: "Patient Created Successfully",
          description: `Patient ${patient.firstName} ${patient.lastName} has been registered.`,
          variant: "success"
        })

        // Reset form
        setFormData({
          // Basic Demographics
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: '',
          email: '',
          phone: '',
          
          // Guardian Contact
          guardianName: '',
          guardianPhone: '',
          guardianEmail: '',
          guardianRelationship: '',
          
          // Socioeconomic Info
          motherEducationLevel: '',
          fatherEducationLevel: '',
          primaryCaregiver: '',
          earningMembersCount: '',
          primaryEarnerOccupation: '',
          dependentsCount: '',
          familyIncome: '',
          
          // Payment Information
          paymentMode: '',
          hasHealthInsurance: false,
          insuranceType: '',
          insuranceProvider: '',
          insurancePolicyNumber: '',
          otherPaymentDetails: '',
          
          // Address
          address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            country: '',
            postalCode: ''
          },
          
          // Consent Management
          consentStatusEnum: '',
          consentType: '',
          isVerbalConsent: false,
          isWrittenConsent: false,
          consentNotes: '',
          assentRequired: false,
          ethicsApprovalRequired: false,
          
          // Clinical History
          ageAtDiagnosis: '',
          primaryRenalDiagnosis: '',
          currentCKDStage: '',
          symptomDurationYears: '',
          symptomDurationMonths: '',
          diagnosisDurationYears: '',
          diagnosisDurationMonths: '',
          surgicalInterventions: '',
          currentComplaints: '',
          comorbidities: '',
          
          // CKD Stage Logic
          isDialysisInitiated: false,
          dialysisNotInitiatedReason: '',
          isPreemptiveTransplantDiscussed: false,
          isTransplantEvaluationInitiated: false,
          transplantType: '',
          
          // Physical Examination
          height: '',
          heightSDS: '',
          weight: '',
          bmi: '',
          bmiSDS: '',
          systolicBP: '',
          diastolicBP: '',
          sbpPercentile: '',
          dbpPercentile: '',
          bpClassification: '',
          growthPercentile: '',
          tannerStage: '',
          
          // Laboratory Investigations
          serumCreatinine: '',
          serumUrea: '',
          eGFR: '',
          hemoglobin: '',
          sodium: '',
          potassium: '',
          bicarbonate: '',
          calcium: '',
          phosphorus: '',
          vitaminD: '',
          proteinuriaDipstick: '',
          ironLevel: '',
          ferritin: '',
          pth: '',
          alp: '',
          uricAcid: '',
          
          // Imaging and Genetics
          otherImaging: '',
          geneticTests: '',
          
          // Medications
          medications: []
        })
        setConsentFile(null)
        setShowAddForm(false)
      }
    } catch (error: any) {
      toast({
        title: "Error Creating Patient",
        description: error.message || "Failed to create patient. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  if (!showAddForm) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600 mt-1">Manage patient registrations and data</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Patient
          </Button>
        </div>

        {/* Placeholder for patient list */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Patient Registry</span>
            </CardTitle>
            <CardDescription>Patient list and management features coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No patients found. Click "Add New Patient" to register your first patient.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Patient</h1>
          <p className="text-gray-600 mt-1">Register a new patient in the system</p>
        </div>
        <Button variant="outline" onClick={() => setShowAddForm(false)}>
          Back to Patients
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Basic Demographics</span>
            </CardTitle>
            <CardDescription>Patient's basic information and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Guardian Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Guardian Contact Information</span>
            </CardTitle>
            <CardDescription>Primary guardian or parent contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  value={formData.guardianName}
                  onChange={(e) => handleInputChange('guardianName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="guardianRelationship">Relationship to Patient</Label>
                <Select value={formData.guardianRelationship} onValueChange={(value) => handleInputChange('guardianRelationship', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PARENT">Parent</SelectItem>
                    <SelectItem value="GRANDPARENT">Grandparent</SelectItem>
                    <SelectItem value="SIBLING">Sibling</SelectItem>
                    <SelectItem value="GUARDIAN">Legal Guardian</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guardianPhone">Guardian Phone</Label>
                <Input
                  id="guardianPhone"
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="guardianEmail">Guardian Email</Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  value={formData.guardianEmail}
                  onChange={(e) => handleInputChange('guardianEmail', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Address Information</span>
            </CardTitle>
            <CardDescription>Patient's residential address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input
                id="addressLine1"
                value={formData.address.line1}
                onChange={(e) => handleInputChange('address.line1', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                value={formData.address.line2}
                onChange={(e) => handleInputChange('address.line2', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.address.postalCode}
                  onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.address.country}
                onChange={(e) => handleInputChange('address.country', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Socioeconomic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Socioeconomic Information</span>
            </CardTitle>
            <CardDescription>Family background and economic status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="motherEducation">Mother's Education Level</Label>
                <Select value={formData.motherEducationLevel} onValueChange={(value) => handleInputChange('motherEducationLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIMARY">Primary School</SelectItem>
                    <SelectItem value="SECONDARY">Secondary School</SelectItem>
                    <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
                    <SelectItem value="DIPLOMA">Diploma</SelectItem>
                    <SelectItem value="BACHELOR">Bachelor's Degree</SelectItem>
                    <SelectItem value="MASTER">Master's Degree</SelectItem>
                    <SelectItem value="PHD">PhD</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fatherEducation">Father's Education Level</Label>
                <Select value={formData.fatherEducationLevel} onValueChange={(value) => handleInputChange('fatherEducationLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIMARY">Primary School</SelectItem>
                    <SelectItem value="SECONDARY">Secondary School</SelectItem>
                    <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
                    <SelectItem value="DIPLOMA">Diploma</SelectItem>
                    <SelectItem value="BACHELOR">Bachelor's Degree</SelectItem>
                    <SelectItem value="MASTER">Master's Degree</SelectItem>
                    <SelectItem value="PHD">PhD</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primaryCaregiver">Primary Caregiver</Label>
                <Select value={formData.primaryCaregiver} onValueChange={(value) => handleInputChange('primaryCaregiver', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select caregiver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MOTHER">Mother</SelectItem>
                    <SelectItem value="FATHER">Father</SelectItem>
                    <SelectItem value="GRANDPARENT">Grandparent</SelectItem>
                    <SelectItem value="SIBLING">Sibling</SelectItem>
                    <SelectItem value="GUARDIAN">Legal Guardian</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="earningMembers">Number of Earning Members</Label>
                <Input
                  id="earningMembers"
                  type="number"
                  value={formData.earningMembersCount}
                  onChange={(e) => handleInputChange('earningMembersCount', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dependents">Number of Dependents</Label>
                <Input
                  id="dependents"
                  type="number"
                  value={formData.dependentsCount}
                  onChange={(e) => handleInputChange('dependentsCount', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryEarnerOccupation">Primary Earner Occupation</Label>
                <Input
                  id="primaryEarnerOccupation"
                  value={formData.primaryEarnerOccupation}
                  onChange={(e) => handleInputChange('primaryEarnerOccupation', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="familyIncome">Family Income (Monthly)</Label>
                <Input
                  id="familyIncome"
                  type="number"
                  value={formData.familyIncome}
                  onChange={(e) => handleInputChange('familyIncome', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Payment Information</span>
            </CardTitle>
            <CardDescription>Insurance and payment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentMode">Payment Mode</Label>
                <Select value={formData.paymentMode} onValueChange={(value) => handleInputChange('paymentMode', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="INSURANCE">Insurance</SelectItem>
                    <SelectItem value="GOVERNMENT_SCHEME">Government Scheme</SelectItem>
                    <SelectItem value="CHARITY">Charity/Free</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasHealthInsurance"
                  checked={formData.hasHealthInsurance}
                  onCheckedChange={(checked) => handleInputChange('hasHealthInsurance', checked)}
                />
                <Label htmlFor="hasHealthInsurance">Has Health Insurance</Label>
              </div>
            </div>

            {formData.hasHealthInsurance && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="insuranceType">Insurance Type</Label>
                  <Select value={formData.insuranceType} onValueChange={(value) => handleInputChange('insuranceType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIVATE">Private Insurance</SelectItem>
                      <SelectItem value="GOVERNMENT">Government Insurance</SelectItem>
                      <SelectItem value="EMPLOYER">Employer Provided</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                  />
                </div>
              </div>
            )}

            {formData.hasHealthInsurance && (
              <div>
                <Label htmlFor="insurancePolicyNumber">Insurance Policy Number</Label>
                <Input
                  id="insurancePolicyNumber"
                  value={formData.insurancePolicyNumber}
                  onChange={(e) => handleInputChange('insurancePolicyNumber', e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="otherPaymentDetails">Other Payment Details</Label>
              <Textarea
                id="otherPaymentDetails"
                value={formData.otherPaymentDetails}
                onChange={(e) => handleInputChange('otherPaymentDetails', e.target.value)}
                placeholder="Any additional payment information..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Consent Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Consent Management</span>
            </CardTitle>
            <CardDescription>Consent forms and ethical approvals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="consentStatus">Consent Status</Label>
                <Select value={formData.consentStatusEnum} onValueChange={(value) => handleInputChange('consentStatusEnum', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select consent status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="OBTAINED">Obtained</SelectItem>
                    <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="consentType">Consent Type</Label>
                <Select value={formData.consentType} onValueChange={(value) => handleInputChange('consentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select consent type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INFORMED_CONSENT">Informed Consent</SelectItem>
                    <SelectItem value="PARENTAL_CONSENT">Parental Consent</SelectItem>
                    <SelectItem value="ASSENT">Assent</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVerbalConsent"
                  checked={formData.isVerbalConsent}
                  onCheckedChange={(checked) => handleInputChange('isVerbalConsent', checked)}
                />
                <Label htmlFor="isVerbalConsent">Verbal Consent Obtained</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isWrittenConsent"
                  checked={formData.isWrittenConsent}
                  onCheckedChange={(checked) => handleInputChange('isWrittenConsent', checked)}
                />
                <Label htmlFor="isWrittenConsent">Written Consent Obtained</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="assentRequired"
                  checked={formData.assentRequired}
                  onCheckedChange={(checked) => handleInputChange('assentRequired', checked)}
                />
                <Label htmlFor="assentRequired">Assent Required</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ethicsApprovalRequired"
                  checked={formData.ethicsApprovalRequired}
                  onCheckedChange={(checked) => handleInputChange('ethicsApprovalRequired', checked)}
                />
                <Label htmlFor="ethicsApprovalRequired">Ethics Approval Required</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="consentNotes">Consent Notes</Label>
              <Textarea
                id="consentNotes"
                value={formData.consentNotes}
                onChange={(e) => handleInputChange('consentNotes', e.target.value)}
                placeholder="Additional notes about consent..."
              />
            </div>

            <div>
              <Label htmlFor="consentFile">Upload Consent Document</Label>
              <div className="mt-2">
                <Input
                  id="consentFile"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                {consentFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {consentFile.name}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinical History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="w-5 h-5" />
              <span>Clinical History</span>
            </CardTitle>
            <CardDescription>Patient's medical history and CKD information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="ageAtDiagnosis">Age at Diagnosis</Label>
                <Input
                  id="ageAtDiagnosis"
                  type="number"
                  value={formData.ageAtDiagnosis}
                  onChange={(e) => handleInputChange('ageAtDiagnosis', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currentCKDStage">Current CKD Stage</Label>
                <Select value={formData.currentCKDStage} onValueChange={(value) => handleInputChange('currentCKDStage', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select CKD stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAGE_1">Stage 1</SelectItem>
                    <SelectItem value="STAGE_2">Stage 2</SelectItem>
                    <SelectItem value="STAGE_3A">Stage 3A</SelectItem>
                    <SelectItem value="STAGE_3B">Stage 3B</SelectItem>
                    <SelectItem value="STAGE_4">Stage 4</SelectItem>
                    <SelectItem value="STAGE_5">Stage 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="primaryRenalDiagnosis">Primary Renal Diagnosis</Label>
                <Input
                  id="primaryRenalDiagnosis"
                  value={formData.primaryRenalDiagnosis}
                  onChange={(e) => handleInputChange('primaryRenalDiagnosis', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Symptom Duration</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    type="number"
                    placeholder="Years"
                    value={formData.symptomDurationYears}
                    onChange={(e) => handleInputChange('symptomDurationYears', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Months"
                    value={formData.symptomDurationMonths}
                    onChange={(e) => handleInputChange('symptomDurationMonths', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Diagnosis Duration</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    type="number"
                    placeholder="Years"
                    value={formData.diagnosisDurationYears}
                    onChange={(e) => handleInputChange('diagnosisDurationYears', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Months"
                    value={formData.diagnosisDurationMonths}
                    onChange={(e) => handleInputChange('diagnosisDurationMonths', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="surgicalInterventions">Surgical Interventions</Label>
              <Textarea
                id="surgicalInterventions"
                value={formData.surgicalInterventions}
                onChange={(e) => handleInputChange('surgicalInterventions', e.target.value)}
                placeholder="List any surgical interventions..."
              />
            </div>

            <div>
              <Label htmlFor="currentComplaints">Current Complaints</Label>
              <Textarea
                id="currentComplaints"
                value={formData.currentComplaints}
                onChange={(e) => handleInputChange('currentComplaints', e.target.value)}
                placeholder="Current symptoms and complaints..."
              />
            </div>

            <div>
              <Label htmlFor="comorbidities">Comorbidities</Label>
              <Textarea
                id="comorbidities"
                value={formData.comorbidities}
                onChange={(e) => handleInputChange('comorbidities', e.target.value)}
                placeholder="List any comorbidities..."
              />
            </div>
          </CardContent>
        </Card>

        {/* CKD Stage Logic */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>CKD Stage Logic</span>
            </CardTitle>
            <CardDescription>Dialysis and transplant evaluation status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDialysisInitiated"
                  checked={formData.isDialysisInitiated}
                  onCheckedChange={(checked) => handleInputChange('isDialysisInitiated', checked)}
                />
                <Label htmlFor="isDialysisInitiated">Dialysis Initiated</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPreemptiveTransplantDiscussed"
                  checked={formData.isPreemptiveTransplantDiscussed}
                  onCheckedChange={(checked) => handleInputChange('isPreemptiveTransplantDiscussed', checked)}
                />
                <Label htmlFor="isPreemptiveTransplantDiscussed">Preemptive Transplant Discussed</Label>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isTransplantEvaluationInitiated"
                checked={formData.isTransplantEvaluationInitiated}
                onCheckedChange={(checked) => handleInputChange('isTransplantEvaluationInitiated', checked)}
              />
              <Label htmlFor="isTransplantEvaluationInitiated">Transplant Evaluation Initiated</Label>
            </div>

            {!formData.isDialysisInitiated && (
              <div>
                <Label htmlFor="dialysisNotInitiatedReason">Dialysis Not Initiated Reason</Label>
                <Textarea
                  id="dialysisNotInitiatedReason"
                  value={formData.dialysisNotInitiatedReason}
                  onChange={(e) => handleInputChange('dialysisNotInitiatedReason', e.target.value)}
                  placeholder="Reason for not initiating dialysis..."
                />
              </div>
            )}

            <div>
              <Label htmlFor="transplantType">Transplant Type</Label>
              <Select value={formData.transplantType} onValueChange={(value) => handleInputChange('transplantType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transplant type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIVING_DONOR">Living Donor</SelectItem>
                  <SelectItem value="DECEASED_DONOR">Deceased Donor</SelectItem>
                  <SelectItem value="PREEMPTIVE">Preemptive</SelectItem>
                  <SelectItem value="NOT_APPLICABLE">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Physical Examination */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Physical Examination</span>
            </CardTitle>
            <CardDescription>Vital signs and physical measurements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bmi">BMI</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  value={formData.bmi}
                  onChange={(e) => handleInputChange('bmi', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heightSDS">Height SDS</Label>
                <Input
                  id="heightSDS"
                  type="number"
                  step="0.1"
                  value={formData.heightSDS}
                  onChange={(e) => handleInputChange('heightSDS', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bmiSDS">BMI SDS</Label>
                <Input
                  id="bmiSDS"
                  type="number"
                  step="0.1"
                  value={formData.bmiSDS}
                  onChange={(e) => handleInputChange('bmiSDS', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="systolicBP">Systolic BP (mmHg)</Label>
                <Input
                  id="systolicBP"
                  type="number"
                  value={formData.systolicBP}
                  onChange={(e) => handleInputChange('systolicBP', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="diastolicBP">Diastolic BP (mmHg)</Label>
                <Input
                  id="diastolicBP"
                  type="number"
                  value={formData.diastolicBP}
                  onChange={(e) => handleInputChange('diastolicBP', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="tannerStage">Tanner Stage</Label>
                <Select value={formData.tannerStage} onValueChange={(value) => handleInputChange('tannerStage', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tanner stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAGE_1">Stage 1</SelectItem>
                    <SelectItem value="STAGE_2">Stage 2</SelectItem>
                    <SelectItem value="STAGE_3">Stage 3</SelectItem>
                    <SelectItem value="STAGE_4">Stage 4</SelectItem>
                    <SelectItem value="STAGE_5">Stage 5</SelectItem>
                    <SelectItem value="NOT_APPLICABLE">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bpClassification">BP Classification</Label>
                <Select value={formData.bpClassification} onValueChange={(value) => handleInputChange('bpClassification', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select BP classification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="ELEVATED">Elevated</SelectItem>
                    <SelectItem value="HYPERTENSION_STAGE_1">Hypertension Stage 1</SelectItem>
                    <SelectItem value="HYPERTENSION_STAGE_2">Hypertension Stage 2</SelectItem>
                    <SelectItem value="HYPERTENSIVE_CRISIS">Hypertensive Crisis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="growthPercentile">Growth Percentile</Label>
                <Input
                  id="growthPercentile"
                  type="number"
                  step="0.1"
                  value={formData.growthPercentile}
                  onChange={(e) => handleInputChange('growthPercentile', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Laboratory Investigations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Microscope className="w-5 h-5" />
              <span>Laboratory Investigations</span>
            </CardTitle>
            <CardDescription>Mandatory and additional lab values</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-md">
              <h4 className="font-medium text-blue-900 mb-2">Mandatory Lab Values</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="serumCreatinine">Serum Creatinine (mg/dL) *</Label>
                  <Input
                    id="serumCreatinine"
                    type="number"
                    step="0.01"
                    value={formData.serumCreatinine}
                    onChange={(e) => handleInputChange('serumCreatinine', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="serumUrea">Serum Urea (mg/dL) *</Label>
                  <Input
                    id="serumUrea"
                    type="number"
                    step="0.1"
                    value={formData.serumUrea}
                    onChange={(e) => handleInputChange('serumUrea', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="eGFR">eGFR (mL/min/1.73m²) *</Label>
                  <Input
                    id="eGFR"
                    type="number"
                    step="0.1"
                    value={formData.eGFR}
                    onChange={(e) => handleInputChange('eGFR', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="hemoglobin">Hemoglobin (g/dL) *</Label>
                <Input
                  id="hemoglobin"
                  type="number"
                  step="0.1"
                  value={formData.hemoglobin}
                  onChange={(e) => handleInputChange('hemoglobin', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sodium">Sodium (mEq/L) *</Label>
                <Input
                  id="sodium"
                  type="number"
                  value={formData.sodium}
                  onChange={(e) => handleInputChange('sodium', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="potassium">Potassium (mEq/L) *</Label>
                <Input
                  id="potassium"
                  type="number"
                  step="0.1"
                  value={formData.potassium}
                  onChange={(e) => handleInputChange('potassium', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bicarbonate">Bicarbonate (mEq/L) *</Label>
                <Input
                  id="bicarbonate"
                  type="number"
                  value={formData.bicarbonate}
                  onChange={(e) => handleInputChange('bicarbonate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="calcium">Calcium (mg/dL) *</Label>
                <Input
                  id="calcium"
                  type="number"
                  step="0.1"
                  value={formData.calcium}
                  onChange={(e) => handleInputChange('calcium', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phosphorus">Phosphorus (mg/dL) *</Label>
                <Input
                  id="phosphorus"
                  type="number"
                  step="0.1"
                  value={formData.phosphorus}
                  onChange={(e) => handleInputChange('phosphorus', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="vitaminD">Vitamin D (ng/mL) *</Label>
                <Input
                  id="vitaminD"
                  type="number"
                  step="0.1"
                  value={formData.vitaminD}
                  onChange={(e) => handleInputChange('vitaminD', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="proteinuriaDipstick">Proteinuria Dipstick</Label>
                <Select value={formData.proteinuriaDipstick} onValueChange={(value) => handleInputChange('proteinuriaDipstick', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select proteinuria level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEGATIVE">Negative</SelectItem>
                    <SelectItem value="TRACE">Trace</SelectItem>
                    <SelectItem value="1_PLUS">1+</SelectItem>
                    <SelectItem value="2_PLUS">2+</SelectItem>
                    <SelectItem value="3_PLUS">3+</SelectItem>
                    <SelectItem value="4_PLUS">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ironLevel">Iron Level (μg/dL)</Label>
                <Input
                  id="ironLevel"
                  type="number"
                  step="0.1"
                  value={formData.ironLevel}
                  onChange={(e) => handleInputChange('ironLevel', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="ferritin">Ferritin (ng/mL)</Label>
                <Input
                  id="ferritin"
                  type="number"
                  step="0.1"
                  value={formData.ferritin}
                  onChange={(e) => handleInputChange('ferritin', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pth">PTH (pg/mL)</Label>
                <Input
                  id="pth"
                  type="number"
                  step="0.1"
                  value={formData.pth}
                  onChange={(e) => handleInputChange('pth', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="alp">ALP (U/L)</Label>
                <Input
                  id="alp"
                  type="number"
                  step="0.1"
                  value={formData.alp}
                  onChange={(e) => handleInputChange('alp', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="uricAcid">Uric Acid (mg/dL)</Label>
              <Input
                id="uricAcid"
                type="number"
                step="0.1"
                value={formData.uricAcid}
                onChange={(e) => handleInputChange('uricAcid', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Imaging and Genetics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Imaging and Genetics</span>
            </CardTitle>
            <CardDescription>Additional diagnostic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="otherImaging">Other Imaging</Label>
              <Textarea
                id="otherImaging"
                value={formData.otherImaging}
                onChange={(e) => handleInputChange('otherImaging', e.target.value)}
                placeholder="List any additional imaging studies..."
              />
            </div>
            <div>
              <Label htmlFor="geneticTests">Genetic Tests</Label>
              <Textarea
                id="geneticTests"
                value={formData.geneticTests}
                onChange={(e) => handleInputChange('geneticTests', e.target.value)}
                placeholder="List any genetic tests performed..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            <Save className="w-4 h-4 mr-2" />
            {isCreating ? 'Creating Patient...' : 'Create Patient'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PatientManagement
