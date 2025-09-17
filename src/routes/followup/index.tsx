import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Stethoscope,
  Activity,
  Heart,
  Microscope,
  Pill,
  Plus,
  Save,
  Eye,
  X,
  Edit,
  Trash2,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { CREATE_PATIENT_FOLLOWUP, CREATE_FOLLOWUP_MEDICATION, UPDATE_PATIENT_FOLLOWUP, DELETE_PATIENT_FOLLOWUP } from '@/graphql/mutations'
import { GET_PATIENT_FOLLOWUPS, GET_PATIENT_FOLLOWUP } from '@/graphql/queries'

const FollowUpManagement: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [showFollowUpForm, setShowFollowUpForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingFollowUp, setEditingFollowUp] = useState<any>(null)
  const [showFollowUpDetails, setShowFollowUpDetails] = useState<any>(null)

  const [createFollowUp] = useMutation(CREATE_PATIENT_FOLLOWUP)
  const [updateFollowUp] = useMutation(UPDATE_PATIENT_FOLLOWUP)
  const [deleteFollowUp] = useMutation(DELETE_PATIENT_FOLLOWUP)
  const [createMedication] = useMutation(CREATE_FOLLOWUP_MEDICATION)

  const { data: followUpsData, loading, refetch } = useQuery(GET_PATIENT_FOLLOWUPS, {
    variables: { patientId: selectedPatientId },
    skip: !selectedPatientId
  })

  const [followUpData, setFollowUpData] = useState({
    // Basic Info
    patientId: '',
    followUpDate: new Date().toISOString().split('T')[0],
    visitNumber: 1,
    
    // Socioeconomic Changes
    hasSocioeconomicChanges: false,
    hasResidenceChange: false,
    hasContactChange: false,
    hasIncomeChange: false,
    hasEducationStatusChange: false,
    hasPaymentStatusChange: false,
    
    // Updated socioeconomic fields
    newFamilyIncome: '',
    newPaymentMode: '',
    newHasHealthInsurance: false,
    newInsuranceType: '',
    newInsuranceProvider: '',
    newMotherEducationLevel: '',
    newFatherEducationLevel: '',
    newPrimaryCaregiver: '',
    newEarningMembersCount: '',
    newPrimaryEarnerOccupation: '',
    newDependentsCount: '',
    newGuardianName: '',
    newGuardianPhone: '',
    newGuardianEmail: '',
    newGuardianRelationship: '',
    
    // Clinical Updates
    currentCKDStage: '',
    isDialysisInitiated: false,
    dialysisNotInitiatedReason: '',
    newSymptomsSinceLastVisit: [] as string[],
    hasHypertension: false,
    hasGrowthFailure: false,
    hasAnemia: false,
    hasBoneMineralDisease: false,
    hasMetabolicAcidosis: false,
    otherComorbidities: [] as string[],
    hasHospitalizationSinceLastVisit: false,
    hospitalizationDetails: '',
    
    // Physical Examination
    currentHeight: '',
    currentHeightSDS: '',
    currentWeight: '',
    currentBMI: '',
    currentBMISDS: '',
    currentSystolicBP: '',
    currentDiastolicBP: '',
    currentSBPPercentile: '',
    currentDBPPercentile: '',
    currentBPClassification: '',
    currentTannerStage: '',
    
    // Laboratory Investigations
    followUpSerumCreatinine: '',
    followUpSerumUrea: '',
    followUpEGFR: '',
    followUpProteinuriaDipstick: '',
    followUpHemoglobin: '',
    followUpSodium: '',
    followUpPotassium: '',
    followUpChloride: '',
    followUpBicarbonate: '',
    followUpCalcium: '',
    followUpPhosphorus: '',
    followUpVitaminD: '',
    followUpIronLevel: '',
    followUpFerritin: '',
    followUpPTH: '',
    followUpALP: '',
    followUpUricAcid: '',
    followUpOtherImaging: '',
    followUpGeneticTests: '',
    
    // Medication Adherence
    overallMedicationAdherence: false,
    adherenceNonComplianceReason: '',
    clinicalNotes: '',
    nextFollowUpDate: ''
  })

  const [medications, setMedications] = useState([
    {
      genericName: '',
      frequency: '',
      routeOfAdministration: '',
      meanDosePerDay: '',
      startDate: '',
      stopDate: '',
      isNewMedication: false,
      isDiscontinued: false,
      adherence: false,
      adherenceNotes: ''
    }
  ])

  const handleInputChange = (field: string, value: any) => {
    setFollowUpData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMedicationChange = (index: number, field: string, value: any) => {
    const updatedMedications = [...medications]
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    }
    setMedications(updatedMedications)
  }

  const addMedication = () => {
    setMedications([...medications, {
      genericName: '',
      frequency: '',
      routeOfAdministration: '',
      meanDosePerDay: '',
      startDate: '',
      stopDate: '',
      isNewMedication: false,
      isDiscontinued: false,
      adherence: false,
      adherenceNotes: ''
    }])
  }

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index))
    }
  }

  const handleEditFollowUp = (followUp: any) => {
    setEditingFollowUp(followUp)
    setFollowUpData({
      ...followUpData,
      ...followUp,
      followUpDate: followUp.followUpDate.split('T')[0],
      nextFollowUpDate: followUp.nextFollowUpDate ? followUp.nextFollowUpDate.split('T')[0] : ''
    })
    setShowFollowUpForm(true)
  }

  const handleViewFollowUp = (followUp: any) => {
    setShowFollowUpDetails(followUp)
  }

  const handleDeleteFollowUp = async (followUpId: string) => {
    if (window.confirm('Are you sure you want to delete this follow-up visit? This action cannot be undone.')) {
      try {
        await deleteFollowUp({
          variables: { id: followUpId }
        })
        toast({
          title: "Follow-up Deleted",
          description: "The follow-up visit has been deleted successfully.",
          variant: "success"
        })
        refetch()
      } catch (error: any) {
        toast({
          title: "Delete Failed",
          description: error.message || "Failed to delete follow-up visit.",
          variant: "destructive"
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPatientId) {
      toast({
        title: "Patient Required",
        description: "Please enter a patient ID to create follow-up.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      let followUpResult

      if (editingFollowUp) {
        // Update existing follow-up
        followUpResult = await updateFollowUp({
          variables: {
            id: editingFollowUp.id,
            input: {
              followUpDate: followUpData.followUpDate,
              visitNumber: followUpData.visitNumber,
              currentCKDStage: followUpData.currentCKDStage,
              followUpEGFR: followUpData.followUpEGFR,
              overallMedicationAdherence: followUpData.overallMedicationAdherence,
              clinicalNotes: followUpData.clinicalNotes,
              nextFollowUpDate: followUpData.nextFollowUpDate
            }
          }
        })

        toast({
          title: "Follow-up Updated Successfully",
          description: `Follow-up visit #${followUpData.visitNumber} has been updated.`,
          variant: "success"
        })
      } else {
        // Create new follow-up record
        followUpResult = await createFollowUp({
          variables: {
            input: {
              ...followUpData,
              patientId: selectedPatientId,
              newSymptomsSinceLastVisit: followUpData.newSymptomsSinceLastVisit,
              otherComorbidities: followUpData.otherComorbidities
            }
          }
        })

        if (followUpResult.data?.createPatientFollowUp) {
          const followUpId = followUpResult.data.createPatientFollowUp.id

          // Create medications
          for (const medication of medications) {
            if (medication.genericName) {
              await createMedication({
                variables: {
                  input: {
                    followUpId,
                    ...medication
                  }
                }
              })
            }
          }
        }

        toast({
          title: "Follow-up Created Successfully",
          description: `Follow-up visit #${followUpData.visitNumber} has been recorded.`,
          variant: "success"
        })
      }

      // Reset form
      setFollowUpData({
        ...followUpData,
        visitNumber: editingFollowUp ? followUpData.visitNumber : followUpData.visitNumber + 1,
        followUpDate: new Date().toISOString().split('T')[0]
      })
      setMedications([{
        genericName: '',
        frequency: '',
        routeOfAdministration: '',
        meanDosePerDay: '',
        startDate: '',
        stopDate: '',
        isNewMedication: false,
        isDiscontinued: false,
        adherence: false,
        adherenceNotes: ''
      }])
      setEditingFollowUp(null)
      setShowFollowUpForm(false)
      
      refetch()
    } catch (error: any) {
      toast({
        title: "Follow-up Creation Failed",
        description: error.message || "Failed to create follow-up. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCKDStageBadge = (stage: string) => {
    const colors = {
      'STAGE_1': 'bg-green-100 text-green-800',
      'STAGE_2': 'bg-blue-100 text-blue-800',
      'STAGE_3A': 'bg-yellow-100 text-yellow-800',
      'STAGE_3B': 'bg-orange-100 text-orange-800',
      'STAGE_4': 'bg-red-100 text-red-800',
      'STAGE_5': 'bg-purple-100 text-purple-800'
    }
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Follow-up Management</h1>
          <p className="text-gray-600 mt-1">Manage CKD patient follow-up visits and track progression</p>
        </div>
        <Button onClick={() => {
          setEditingFollowUp(null)
          setShowFollowUpForm(!showFollowUpForm)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          New Follow-up
        </Button>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Patient</CardTitle>
          <CardDescription>Enter patient ID to view follow-up history or create new follow-up</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                placeholder="Enter patient ID"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => refetch()} disabled={!selectedPatientId}>
                <Eye className="w-4 h-4 mr-2" />
                View History
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Follow-up History */}
      {selectedPatientId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Follow-up History</span>
            </CardTitle>
            <CardDescription>Chronological follow-up visits for patient {selectedPatientId}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading follow-up history...</div>
            ) : followUpsData?.patientFollowUps?.length > 0 ? (
              <div className="space-y-4">
                {followUpsData.patientFollowUps.map((followUp: any) => (
                  <div key={followUp.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">Visit #{followUp.visitNumber}</Badge>
                        <span className="font-medium">{new Date(followUp.followUpDate).toLocaleDateString()}</span>
                        {followUp.currentCKDStage && (
                          <Badge className={getCKDStageBadge(followUp.currentCKDStage)}>
                            {followUp.currentCKDStage.replace('STAGE_', 'Stage ')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditFollowUp(followUp)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewFollowUp(followUp)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteFollowUp(followUp.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">eGFR:</span>
                        <span className="ml-2 font-medium">{followUp.followUpEGFR || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Creatinine:</span>
                        <span className="ml-2 font-medium">{followUp.followUpSerumCreatinine || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Height:</span>
                        <span className="ml-2 font-medium">{followUp.currentHeight || 'N/A'} cm</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Weight:</span>
                        <span className="ml-2 font-medium">{followUp.currentWeight || 'N/A'} kg</span>
                      </div>
                    </div>
                    
                    {followUp.clinicalNotes && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Notes:</strong> {followUp.clinicalNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No follow-up visits found for this patient.</p>
                <p className="text-sm">Create the first follow-up visit using the form above.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Follow-up Form */}
      {showFollowUpForm && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{editingFollowUp ? 'Edit Follow-up Information' : 'Follow-up Information'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="followUpDate">Follow-up Date *</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={followUpData.followUpDate}
                    onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="visitNumber">Visit Number *</Label>
                  <Input
                    id="visitNumber"
                    type="number"
                    value={followUpData.visitNumber}
                    onChange={(e) => handleInputChange('visitNumber', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nextFollowUpDate">Next Follow-up Date</Label>
                  <Input
                    id="nextFollowUpDate"
                    type="date"
                    value={followUpData.nextFollowUpDate}
                    onChange={(e) => handleInputChange('nextFollowUpDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Socioeconomic Changes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Socioeconomic Changes</span>
              </CardTitle>
              <CardDescription>Mark any changes since last visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasSocioeconomicChanges"
                  checked={followUpData.hasSocioeconomicChanges}
                  onCheckedChange={(checked) => handleInputChange('hasSocioeconomicChanges', checked)}
                />
                <Label htmlFor="hasSocioeconomicChanges">Any socioeconomic changes since last visit?</Label>
              </div>

              {followUpData.hasSocioeconomicChanges && (
                <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasResidenceChange"
                        checked={followUpData.hasResidenceChange}
                        onCheckedChange={(checked) => handleInputChange('hasResidenceChange', checked)}
                      />
                      <Label htmlFor="hasResidenceChange">Residence Change</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasContactChange"
                        checked={followUpData.hasContactChange}
                        onCheckedChange={(checked) => handleInputChange('hasContactChange', checked)}
                      />
                      <Label htmlFor="hasContactChange">Contact Change</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasIncomeChange"
                        checked={followUpData.hasIncomeChange}
                        onCheckedChange={(checked) => handleInputChange('hasIncomeChange', checked)}
                      />
                      <Label htmlFor="hasIncomeChange">Income Change</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasEducationStatusChange"
                        checked={followUpData.hasEducationStatusChange}
                        onCheckedChange={(checked) => handleInputChange('hasEducationStatusChange', checked)}
                      />
                      <Label htmlFor="hasEducationStatusChange">Education Status Change</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasPaymentStatusChange"
                        checked={followUpData.hasPaymentStatusChange}
                        onCheckedChange={(checked) => handleInputChange('hasPaymentStatusChange', checked)}
                      />
                      <Label htmlFor="hasPaymentStatusChange">Payment Status Change</Label>
                    </div>
                  </div>

                  {/* Updated socioeconomic fields - only show if relevant changes are marked */}
                  {(followUpData.hasIncomeChange || followUpData.hasPaymentStatusChange) && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Updated Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {followUpData.hasIncomeChange && (
                          <>
                            <div>
                              <Label htmlFor="newFamilyIncome">New Family Income</Label>
                              <Select value={followUpData.newFamilyIncome} onValueChange={(value) => handleInputChange('newFamilyIncome', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select income range" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="BELOW_10000">Below ₹10,000</SelectItem>
                                  <SelectItem value="RUPEES_10000_TO_25000">₹10,000 - ₹25,000</SelectItem>
                                  <SelectItem value="RUPEES_25000_TO_50000">₹25,000 - ₹50,000</SelectItem>
                                  <SelectItem value="RUPEES_50000_TO_100000">₹50,000 - ₹1,00,000</SelectItem>
                                  <SelectItem value="ABOVE_100000">Above ₹1,00,000</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="newPaymentMode">New Payment Mode</Label>
                              <Select value={followUpData.newPaymentMode} onValueChange={(value) => handleInputChange('newPaymentMode', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment mode" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="CASH">Cash</SelectItem>
                                  <SelectItem value="HEALTH_INSURANCE">Health Insurance</SelectItem>
                                  <SelectItem value="GOVERNMENT_SCHEME">Government Scheme</SelectItem>
                                  <SelectItem value="PRIVATE_INSURANCE">Private Insurance</SelectItem>
                                  <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clinical Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5" />
                <span>Clinical Updates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentCKDStage">Current CKD Stage</Label>
                  <Select value={followUpData.currentCKDStage} onValueChange={(value) => handleInputChange('currentCKDStage', value)}>
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
                  <Label htmlFor="currentTannerStage">Tanner Stage</Label>
                  <Select value={followUpData.currentTannerStage} onValueChange={(value) => handleInputChange('currentTannerStage', value)}>
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
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDialysisInitiated"
                  checked={followUpData.isDialysisInitiated}
                  onCheckedChange={(checked) => handleInputChange('isDialysisInitiated', checked)}
                />
                <Label htmlFor="isDialysisInitiated">Dialysis Initiated</Label>
              </div>

              {!followUpData.isDialysisInitiated && (
                <div>
                  <Label htmlFor="dialysisNotInitiatedReason">Dialysis Not Initiated Reason</Label>
                  <Textarea
                    id="dialysisNotInitiatedReason"
                    value={followUpData.dialysisNotInitiatedReason}
                    onChange={(e) => handleInputChange('dialysisNotInitiatedReason', e.target.value)}
                    placeholder="Reason for not initiating dialysis..."
                  />
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-500">Structured Comorbidity Checklist</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasHypertension"
                      checked={followUpData.hasHypertension}
                      onCheckedChange={(checked) => handleInputChange('hasHypertension', checked)}
                    />
                    <Label htmlFor="hasHypertension">Hypertension</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasGrowthFailure"
                      checked={followUpData.hasGrowthFailure}
                      onCheckedChange={(checked) => handleInputChange('hasGrowthFailure', checked)}
                    />
                    <Label htmlFor="hasGrowthFailure">Growth Failure</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasAnemia"
                      checked={followUpData.hasAnemia}
                      onCheckedChange={(checked) => handleInputChange('hasAnemia', checked)}
                    />
                    <Label htmlFor="hasAnemia">Anemia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasBoneMineralDisease"
                      checked={followUpData.hasBoneMineralDisease}
                      onCheckedChange={(checked) => handleInputChange('hasBoneMineralDisease', checked)}
                    />
                    <Label htmlFor="hasBoneMineralDisease">Bone Mineral Disease</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasMetabolicAcidosis"
                      checked={followUpData.hasMetabolicAcidosis}
                      onCheckedChange={(checked) => handleInputChange('hasMetabolicAcidosis', checked)}
                    />
                    <Label htmlFor="hasMetabolicAcidosis">Metabolic Acidosis</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasHospitalizationSinceLastVisit"
                  checked={followUpData.hasHospitalizationSinceLastVisit}
                  onCheckedChange={(checked) => handleInputChange('hasHospitalizationSinceLastVisit', checked)}
                />
                <Label htmlFor="hasHospitalizationSinceLastVisit">Hospitalization since last visit</Label>
              </div>

              {followUpData.hasHospitalizationSinceLastVisit && (
                <div>
                  <Label htmlFor="hospitalizationDetails">Hospitalization Details</Label>
                  <Textarea
                    id="hospitalizationDetails"
                    value={followUpData.hospitalizationDetails}
                    onChange={(e) => handleInputChange('hospitalizationDetails', e.target.value)}
                    placeholder="Details about hospitalization..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Physical Examination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Physical Examination</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currentHeight">Current Height (cm)</Label>
                  <Input
                    id="currentHeight"
                    type="number"
                    step="0.1"
                    value={followUpData.currentHeight}
                    onChange={(e) => handleInputChange('currentHeight', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="currentWeight">Current Weight (kg)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    step="0.1"
                    value={followUpData.currentWeight}
                    onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="currentBMI">Current BMI</Label>
                  <Input
                    id="currentBMI"
                    type="number"
                    step="0.1"
                    value={followUpData.currentBMI}
                    onChange={(e) => handleInputChange('currentBMI', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentSystolicBP">Systolic BP (mmHg)</Label>
                  <Input
                    id="currentSystolicBP"
                    type="number"
                    value={followUpData.currentSystolicBP}
                    onChange={(e) => handleInputChange('currentSystolicBP', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="currentDiastolicBP">Diastolic BP (mmHg)</Label>
                  <Input
                    id="currentDiastolicBP"
                    type="number"
                    value={followUpData.currentDiastolicBP}
                    onChange={(e) => handleInputChange('currentDiastolicBP', e.target.value)}
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
                    <Label htmlFor="followUpSerumCreatinine">Serum Creatinine (mg/dL) *</Label>
                    <Input
                      id="followUpSerumCreatinine"
                      type="number"
                      step="0.01"
                      value={followUpData.followUpSerumCreatinine}
                      onChange={(e) => handleInputChange('followUpSerumCreatinine', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="followUpSerumUrea">Serum Urea (mg/dL) *</Label>
                    <Input
                      id="followUpSerumUrea"
                      type="number"
                      step="0.1"
                      value={followUpData.followUpSerumUrea}
                      onChange={(e) => handleInputChange('followUpSerumUrea', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="followUpEGFR">eGFR (mL/min/1.73m²) *</Label>
                    <Input
                      id="followUpEGFR"
                      type="number"
                      step="0.1"
                      value={followUpData.followUpEGFR}
                      onChange={(e) => handleInputChange('followUpEGFR', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="followUpHemoglobin">Hemoglobin (g/dL) *</Label>
                  <Input
                    id="followUpHemoglobin"
                    type="number"
                    step="0.1"
                    value={followUpData.followUpHemoglobin}
                    onChange={(e) => handleInputChange('followUpHemoglobin', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="followUpSodium">Sodium (mEq/L) *</Label>
                  <Input
                    id="followUpSodium"
                    type="number"
                    value={followUpData.followUpSodium}
                    onChange={(e) => handleInputChange('followUpSodium', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="followUpPotassium">Potassium (mEq/L) *</Label>
                  <Input
                    id="followUpPotassium"
                    type="number"
                    step="0.1"
                    value={followUpData.followUpPotassium}
                    onChange={(e) => handleInputChange('followUpPotassium', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="followUpBicarbonate">Bicarbonate (mEq/L) *</Label>
                  <Input
                    id="followUpBicarbonate"
                    type="number"
                    value={followUpData.followUpBicarbonate}
                    onChange={(e) => handleInputChange('followUpBicarbonate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="followUpCalcium">Calcium (mg/dL) *</Label>
                  <Input
                    id="followUpCalcium"
                    type="number"
                    step="0.1"
                    value={followUpData.followUpCalcium}
                    onChange={(e) => handleInputChange('followUpCalcium', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="followUpPhosphorus">Phosphorus (mg/dL) *</Label>
                  <Input
                    id="followUpPhosphorus"
                    type="number"
                    step="0.1"
                    value={followUpData.followUpPhosphorus}
                    onChange={(e) => handleInputChange('followUpPhosphorus', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="followUpVitaminD">Vitamin D (ng/mL) *</Label>
                <Input
                  id="followUpVitaminD"
                  type="number"
                  step="0.1"
                  value={followUpData.followUpVitaminD}
                  onChange={(e) => handleInputChange('followUpVitaminD', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Medication Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="w-5 h-5" />
                <span>Medication Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overallMedicationAdherence"
                  checked={followUpData.overallMedicationAdherence}
                  onCheckedChange={(checked) => handleInputChange('overallMedicationAdherence', checked)}
                />
                <Label htmlFor="overallMedicationAdherence">Overall Medication Adherence</Label>
              </div>

              {!followUpData.overallMedicationAdherence && (
                <div>
                  <Label htmlFor="adherenceNonComplianceReason">Non-compliance Reason</Label>
                  <Textarea
                    id="adherenceNonComplianceReason"
                    value={followUpData.adherenceNonComplianceReason}
                    onChange={(e) => handleInputChange('adherenceNonComplianceReason', e.target.value)}
                    placeholder="Reason for non-compliance..."
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Current Medications</h4>
                  <Button type="button" onClick={addMedication} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Medication
                  </Button>
                </div>

                {medications.map((medication, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4 mb-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Medication {index + 1}</h5>
                      {medications.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeMedication(index)}
                          size="sm"
                          variant="outline"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`medication-${index}-name`}>Generic Name *</Label>
                        <Input
                          id={`medication-${index}-name`}
                          value={medication.genericName}
                          onChange={(e) => handleMedicationChange(index, 'genericName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`medication-${index}-frequency`}>Frequency</Label>
                        <Select value={medication.frequency} onValueChange={(value) => handleMedicationChange(index, 'frequency', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ONCE_DAILY">Once Daily</SelectItem>
                            <SelectItem value="TWICE_DAILY">Twice Daily</SelectItem>
                            <SelectItem value="THREE_TIMES_DAILY">Three Times Daily</SelectItem>
                            <SelectItem value="FOUR_TIMES_DAILY">Four Times Daily</SelectItem>
                            <SelectItem value="AS_NEEDED">As Needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`medication-${index}-route`}>Route of Administration</Label>
                        <Select value={medication.routeOfAdministration} onValueChange={(value) => handleMedicationChange(index, 'routeOfAdministration', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select route" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ORAL">Oral</SelectItem>
                            <SelectItem value="INTRAVENOUS">Intravenous</SelectItem>
                            <SelectItem value="INTRAMUSCULAR">Intramuscular</SelectItem>
                            <SelectItem value="SUBCUTANEOUS">Subcutaneous</SelectItem>
                            <SelectItem value="TOPICAL">Topical</SelectItem>
                            <SelectItem value="INHALATION">Inhalation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`medication-${index}-dose`}>Mean Dose Per Day (mg)</Label>
                        <Input
                          id={`medication-${index}-dose`}
                          type="number"
                          step="0.1"
                          value={medication.meanDosePerDay}
                          onChange={(e) => handleMedicationChange(index, 'meanDosePerDay', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`medication-${index}-start`}>Start Date</Label>
                        <Input
                          id={`medication-${index}-start`}
                          type="date"
                          value={medication.startDate}
                          onChange={(e) => handleMedicationChange(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`medication-${index}-stop`}>Stop Date</Label>
                        <Input
                          id={`medication-${index}-stop`}
                          type="date"
                          value={medication.stopDate}
                          onChange={(e) => handleMedicationChange(index, 'stopDate', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`medication-${index}-new`}
                          checked={medication.isNewMedication}
                          onCheckedChange={(checked) => handleMedicationChange(index, 'isNewMedication', checked)}
                        />
                        <Label htmlFor={`medication-${index}-new`}>New Medication</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`medication-${index}-discontinued`}
                          checked={medication.isDiscontinued}
                          onCheckedChange={(checked) => handleMedicationChange(index, 'isDiscontinued', checked)}
                        />
                        <Label htmlFor={`medication-${index}-discontinued`}>Discontinued</Label>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`medication-${index}-adherence`}
                        checked={medication.adherence}
                        onCheckedChange={(checked) => handleMedicationChange(index, 'adherence', checked)}
                      />
                      <Label htmlFor={`medication-${index}-adherence`}>Patient Adherent</Label>
                    </div>

                    <div>
                      <Label htmlFor={`medication-${index}-notes`}>Adherence Notes</Label>
                      <Textarea
                        id={`medication-${index}-notes`}
                        value={medication.adherenceNotes}
                        onChange={(e) => handleMedicationChange(index, 'adherenceNotes', e.target.value)}
                        placeholder="Specific adherence notes for this medication..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Clinical Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Clinical Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="clinicalNotes">Overall Assessment and Next Steps</Label>
                <Textarea
                  id="clinicalNotes"
                  value={followUpData.clinicalNotes}
                  onChange={(e) => handleInputChange('clinicalNotes', e.target.value)}
                  placeholder="Overall assessment, treatment response, complications, and next steps..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFollowUpForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting 
                ? (editingFollowUp ? 'Updating Follow-up...' : 'Creating Follow-up...') 
                : (editingFollowUp ? 'Update Follow-up' : 'Create Follow-up')
              }
            </Button>
          </div>
        </form>
      )}

      {/* Follow-up Details Modal */}
      {showFollowUpDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Follow-up Visit #{showFollowUpDetails.visitNumber} Details
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setShowFollowUpDetails(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Visit Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Date:</strong> {new Date(showFollowUpDetails.followUpDate).toLocaleDateString()}</div>
                    <div><strong>Visit Number:</strong> {showFollowUpDetails.visitNumber}</div>
                    <div><strong>CKD Stage:</strong> 
                      <Badge className={`ml-2 ${getCKDStageBadge(showFollowUpDetails.currentCKDStage)}`}>
                        {showFollowUpDetails.currentCKDStage?.replace('STAGE_', 'Stage ') || 'Not specified'}
                      </Badge>
                    </div>
                    {showFollowUpDetails.nextFollowUpDate && (
                      <div><strong>Next Follow-up:</strong> {new Date(showFollowUpDetails.nextFollowUpDate).toLocaleDateString()}</div>
                    )}
                  </CardContent>
                </Card>

                {/* Physical Examination */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Physical Examination</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {showFollowUpDetails.currentHeight && (
                      <div><strong>Height:</strong> {showFollowUpDetails.currentHeight} cm</div>
                    )}
                    {showFollowUpDetails.currentWeight && (
                      <div><strong>Weight:</strong> {showFollowUpDetails.currentWeight} kg</div>
                    )}
                    {showFollowUpDetails.currentBMI && (
                      <div><strong>BMI:</strong> {showFollowUpDetails.currentBMI}</div>
                    )}
                    {showFollowUpDetails.currentSystolicBP && (
                      <div><strong>BP:</strong> {showFollowUpDetails.currentSystolicBP}/{showFollowUpDetails.currentDiastolicBP} mmHg</div>
                    )}
                    {showFollowUpDetails.currentTannerStage && (
                      <div><strong>Tanner Stage:</strong> {showFollowUpDetails.currentTannerStage.replace('STAGE_', 'Stage ')}</div>
                    )}
                  </CardContent>
                </Card>

                {/* Laboratory Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Laboratory Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {showFollowUpDetails.followUpSerumCreatinine && (
                      <div><strong>Creatinine:</strong> {showFollowUpDetails.followUpSerumCreatinine} mg/dL</div>
                    )}
                    {showFollowUpDetails.followUpEGFR && (
                      <div><strong>eGFR:</strong> {showFollowUpDetails.followUpEGFR} mL/min/1.73m²</div>
                    )}
                    {showFollowUpDetails.followUpHemoglobin && (
                      <div><strong>Hemoglobin:</strong> {showFollowUpDetails.followUpHemoglobin} g/dL</div>
                    )}
                    {showFollowUpDetails.followUpSodium && (
                      <div><strong>Sodium:</strong> {showFollowUpDetails.followUpSodium} mEq/L</div>
                    )}
                    {showFollowUpDetails.followUpPotassium && (
                      <div><strong>Potassium:</strong> {showFollowUpDetails.followUpPotassium} mEq/L</div>
                    )}
                    {showFollowUpDetails.followUpCalcium && (
                      <div><strong>Calcium:</strong> {showFollowUpDetails.followUpCalcium} mg/dL</div>
                    )}
                    {showFollowUpDetails.followUpPhosphorus && (
                      <div><strong>Phosphorus:</strong> {showFollowUpDetails.followUpPhosphorus} mg/dL</div>
                    )}
                  </CardContent>
                </Card>

                {/* Comorbidities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Comorbidities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {showFollowUpDetails.hasHypertension && <Badge variant="outline">Hypertension</Badge>}
                      {showFollowUpDetails.hasGrowthFailure && <Badge variant="outline">Growth Failure</Badge>}
                      {showFollowUpDetails.hasAnemia && <Badge variant="outline">Anemia</Badge>}
                      {showFollowUpDetails.hasBoneMineralDisease && <Badge variant="outline">Bone Mineral Disease</Badge>}
                      {showFollowUpDetails.hasMetabolicAcidosis && <Badge variant="outline">Metabolic Acidosis</Badge>}
                    </div>
                    {showFollowUpDetails.otherComorbidities && showFollowUpDetails.otherComorbidities.length > 0 && (
                      <div>
                        <strong>Other:</strong> {showFollowUpDetails.otherComorbidities.join(', ')}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Medications */}
                {showFollowUpDetails.followUpMedications && showFollowUpDetails.followUpMedications.length > 0 && (
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Medications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {showFollowUpDetails.followUpMedications.map((med: any, index: number) => (
                          <div key={index} className="border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">{med.genericName}</div>
                              <div className="flex space-x-2">
                                {med.isNewMedication && <Badge variant="outline" className="text-green-600">New</Badge>}
                                {med.isDiscontinued && <Badge variant="outline" className="text-red-600">Discontinued</Badge>}
                                <Badge variant={med.adherence ? "default" : "destructive"}>
                                  {med.adherence ? 'Adherent' : 'Non-adherent'}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div><strong>Dose:</strong> {med.meanDosePerDay}mg {med.frequency?.toLowerCase()}</div>
                              <div><strong>Route:</strong> {med.routeOfAdministration}</div>
                              {med.adherenceNotes && (
                                <div><strong>Notes:</strong> {med.adherenceNotes}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Clinical Notes */}
                {showFollowUpDetails.clinicalNotes && (
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Clinical Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{showFollowUpDetails.clinicalNotes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={() => setShowFollowUpDetails(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FollowUpManagement
