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
  Droplets,
  Heart,
  Activity,
  Plus,
  Save,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  AlertCircle,
  Calendar,
  Stethoscope
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { CREATE_PATIENT_DIALYSIS, CREATE_DIALYSIS_FOLLOWUP } from '@/graphql/mutations'
import { GET_PATIENT_DIALYSIS_RECORDS, GET_DIALYSIS_FOLLOWUPS } from '@/graphql/queries'

const DialysisManagement: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [showDialysisForm, setShowDialysisForm] = useState(false)
  const [showFollowUpForm, setShowFollowUpForm] = useState(false)
  const [selectedDialysisId, setSelectedDialysisId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [createDialysis] = useMutation(CREATE_PATIENT_DIALYSIS)
  const [createFollowUp] = useMutation(CREATE_DIALYSIS_FOLLOWUP)

  const { data: dialysisData, loading, refetch } = useQuery(GET_PATIENT_DIALYSIS_RECORDS, {
    variables: { patientId: selectedPatientId },
    skip: !selectedPatientId
  })

  const { data: followUpData, refetch: refetchFollowUps } = useQuery(GET_DIALYSIS_FOLLOWUPS, {
    variables: { dialysisId: selectedDialysisId },
    skip: !selectedDialysisId
  })

  const [dialysisFormData, setDialysisFormData] = useState({
    patientId: '',
    dialysisStartDate: new Date().toISOString().split('T')[0],
    isActive: true,
    initialDialysisModality: '',
    
    // HD Access
    hdAccessType: '',
    hdAccessCreationDate: '',
    hdAccessComplicationNotes: '',
    
    // PD Access
    pdCatheterType: '',
    pdCatheterInsertionDate: '',
    pdCatheterComplicationNotes: '',
    
    // HD Prescription
    hdFrequencyPerWeek: '',
    hdSessionDurationHours: '',
    hdBloodFlowRate: '',
    hdDialysateFlowRate: '',
    hdUltrafiltrationGoal: '',
    hdDialyzerType: '',
    hdAnticoagulation: '',
    hdVascularAccess: '',
    
    // PD Prescription
    pdModalityType: '',
    pdFillVolume: '',
    pdDwellTime: '',
    pdExchangesPerDay: '',
    pdGlucoseConcentration: '',
    pdAdditionalMedications: '',
    pdCyclerSettings: '',
    
    // Complications
    initialComplications: [] as string[],
    initialComplicationNotes: '',
    
    // Payment
    paymentMethod: '',
    monthlyCostSelfPay: '',
    insuranceCoverage: '',
    
    clinicalNotes: ''
  })

  const [followUpFormData, setFollowUpFormData] = useState({
    dialysisId: '',
    followUpDate: new Date().toISOString().split('T')[0],
    visitNumber: 1,
    
    // Modality
    currentModality: '',
    hasModalityChange: false,
    modalityChangeDate: '',
    modalityChangeReason: '',
    
    // HD Prescription
    hdFrequencyPerWeek: '',
    hdSessionDurationHours: '',
    hdBloodFlowRate: '',
    hdDialysateFlowRate: '',
    hdUltrafiltrationGoal: '',
    hdDialyzerType: '',
    hdAnticoagulation: '',
    hdVascularAccess: '',
    hdKtV: '',
    hdURR: '',
    
    // PD Prescription
    pdModalityType: '',
    pdFillVolume: '',
    pdDwellTime: '',
    pdExchangesPerDay: '',
    pdGlucoseConcentration: '',
    pdAdditionalMedications: '',
    pdCyclerSettings: '',
    pdWeeklyKtV: '',
    pdCreatinineClearance: '',
    
    // Complications
    newComplications: [] as string[],
    complicationNotes: '',
    
    // Access Issues
    accessProblems: false,
    accessProblemDescription: '',
    accessInterventionsRequired: false,
    accessInterventionDetails: '',
    
    // Payment
    currentPaymentMethod: '',
    currentMonthlyCostSelfPay: '',
    paymentMethodChanged: false,
    
    // Lab Results
    preDialysisWeight: '',
    postDialysisWeight: '',
    weightGain: '',
    bloodPressurePreDialysis: '',
    bloodPressurePostDialysis: '',
    
    // Quality of Life
    functionalStatus: '',
    qualityOfLifeScore: '',
    
    clinicalNotes: '',
    nextFollowUpDate: ''
  })

  const handleDialysisInputChange = (field: string, value: any) => {
    setDialysisFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFollowUpInputChange = (field: string, value: any) => {
    setFollowUpFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDialysisSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPatientId) {
      toast({
        title: "Patient Required",
        description: "Please enter a patient ID to create dialysis record.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createDialysis({
        variables: {
          input: {
            ...dialysisFormData,
            patientId: selectedPatientId,
            initialComplications: dialysisFormData.initialComplications
          }
        }
      })

      toast({
        title: "Dialysis Record Created Successfully",
        description: "New dialysis record has been created for the patient.",
        variant: "success"
      })

      // Reset form
      setDialysisFormData({
        ...dialysisFormData,
        dialysisStartDate: new Date().toISOString().split('T')[0]
      })
      setShowDialysisForm(false)
      
      refetch()
    } catch (error: any) {
      toast({
        title: "Dialysis Creation Failed",
        description: error.message || "Failed to create dialysis record. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDialysisId) {
      toast({
        title: "Dialysis Record Required",
        description: "Please select a dialysis record to create follow-up.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createFollowUp({
        variables: {
          input: {
            ...followUpFormData,
            dialysisId: selectedDialysisId,
            newComplications: followUpFormData.newComplications
          }
        }
      })

      toast({
        title: "Dialysis Follow-up Created Successfully",
        description: `Follow-up visit #${followUpFormData.visitNumber} has been recorded.`,
        variant: "success"
      })

      // Reset form
      setFollowUpFormData({
        ...followUpFormData,
        visitNumber: followUpFormData.visitNumber + 1,
        followUpDate: new Date().toISOString().split('T')[0]
      })
      setShowFollowUpForm(false)
      
      refetchFollowUps()
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

  const getModalityBadge = (modality: string) => {
    if (modality === 'HEMODIALYSIS') {
      return <Badge className="bg-blue-100 text-blue-800">HD</Badge>
    } else if (modality === 'PERITONEAL_DIALYSIS') {
      return <Badge className="bg-green-100 text-green-800">PD</Badge>
    }
    return <Badge variant="outline">{modality}</Badge>
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dialysis Management</h1>
          <p className="text-gray-600 mt-1">Manage CKD Stage 5 patient dialysis records and follow-ups</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowDialysisForm(!showDialysisForm)}>
            <Plus className="w-4 h-4 mr-2" />
            New Dialysis
          </Button>
        </div>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Patient</CardTitle>
          <CardDescription>Enter patient ID to view dialysis records</CardDescription>
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
                View Records
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialysis Records */}
      {selectedPatientId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="w-5 h-5" />
              <span>Dialysis Records</span>
            </CardTitle>
            <CardDescription>Dialysis records for patient {selectedPatientId}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading dialysis records...</div>
            ) : dialysisData?.patientDialysisRecords?.length > 0 ? (
              <div className="space-y-4">
                {dialysisData.patientDialysisRecords.map((dialysis: any) => (
                  <div key={dialysis.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">
                          Started: {new Date(dialysis.dialysisStartDate).toLocaleDateString()}
                        </span>
                        {getModalityBadge(dialysis.initialDialysisModality)}
                        {getStatusBadge(dialysis.isActive)}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedDialysisId(dialysis.id)
                            setShowFollowUpForm(true)
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Follow-up
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Access:</span>
                        <span className="ml-2 font-medium">
                          {dialysis.hdAccessType || dialysis.pdCatheterType || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Payment:</span>
                        <span className="ml-2 font-medium">{dialysis.paymentMethod || 'Not specified'}</span>
                      </div>
                      {dialysis.monthlyCostSelfPay && (
                        <div>
                          <span className="text-gray-500">Monthly Cost:</span>
                          <span className="ml-2 font-medium">₹{dialysis.monthlyCostSelfPay}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Complications:</span>
                        <span className="ml-2 font-medium">
                          {dialysis.initialComplications?.length || 0}
                        </span>
                      </div>
                    </div>
                    
                    {dialysis.clinicalNotes && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Notes:</strong> {dialysis.clinicalNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No dialysis records found for this patient.</p>
                <p className="text-sm">Create the first dialysis record using the form above.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialysis Form */}
      {showDialysisForm && (
        <form onSubmit={handleDialysisSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Dialysis Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dialysisStartDate">Dialysis Start Date *</Label>
                  <Input
                    id="dialysisStartDate"
                    type="date"
                    value={dialysisFormData.dialysisStartDate}
                    onChange={(e) => handleDialysisInputChange('dialysisStartDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="initialDialysisModality">Dialysis Modality *</Label>
                  <Select 
                    value={dialysisFormData.initialDialysisModality} 
                    onValueChange={(value) => handleDialysisInputChange('initialDialysisModality', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select modality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HEMODIALYSIS">Hemodialysis (HD)</SelectItem>
                      <SelectItem value="PERITONEAL_DIALYSIS">Peritoneal Dialysis (PD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={dialysisFormData.isActive}
                  onCheckedChange={(checked) => handleDialysisInputChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active Dialysis</Label>
              </div>
            </CardContent>
          </Card>

          {/* HD Access Information */}
          {dialysisFormData.initialDialysisModality === 'HEMODIALYSIS' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>HD Access Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hdAccessType">HD Access Type</Label>
                    <Select 
                      value={dialysisFormData.hdAccessType} 
                      onValueChange={(value) => handleDialysisInputChange('hdAccessType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select access type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERMCATH">Permcath</SelectItem>
                        <SelectItem value="AV_FISTULA">AV Fistula</SelectItem>
                        <SelectItem value="AV_GRAFT">AV Graft</SelectItem>
                        <SelectItem value="TEMPORARY_HD_CATHETER">Temporary HD Catheter</SelectItem>
                        <SelectItem value="TUNNELED_CATHETER">Tunneled Catheter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hdAccessCreationDate">Access Creation Date</Label>
                    <Input
                      id="hdAccessCreationDate"
                      type="date"
                      value={dialysisFormData.hdAccessCreationDate}
                      onChange={(e) => handleDialysisInputChange('hdAccessCreationDate', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hdAccessComplicationNotes">Access Complication Notes</Label>
                  <Textarea
                    id="hdAccessComplicationNotes"
                    value={dialysisFormData.hdAccessComplicationNotes}
                    onChange={(e) => handleDialysisInputChange('hdAccessComplicationNotes', e.target.value)}
                    placeholder="Any complications with access creation or maintenance..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* PD Access Information */}
          {dialysisFormData.initialDialysisModality === 'PERITONEAL_DIALYSIS' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5" />
                  <span>PD Catheter Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pdCatheterType">PD Catheter Type</Label>
                    <Select 
                      value={dialysisFormData.pdCatheterType} 
                      onValueChange={(value) => handleDialysisInputChange('pdCatheterType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select catheter type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STRAIGHT_TENCKHOFF">Straight Tenckhoff</SelectItem>
                        <SelectItem value="COILED_TENCKHOFF">Coiled Tenckhoff</SelectItem>
                        <SelectItem value="SWAN_NECK_CATHETER">Swan Neck Catheter</SelectItem>
                        <SelectItem value="PRESTERNAL_CATHETER">Presternal Catheter</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pdCatheterInsertionDate">Catheter Insertion Date</Label>
                    <Input
                      id="pdCatheterInsertionDate"
                      type="date"
                      value={dialysisFormData.pdCatheterInsertionDate}
                      onChange={(e) => handleDialysisInputChange('pdCatheterInsertionDate', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pdCatheterComplicationNotes">Catheter Complication Notes</Label>
                  <Textarea
                    id="pdCatheterComplicationNotes"
                    value={dialysisFormData.pdCatheterComplicationNotes}
                    onChange={(e) => handleDialysisInputChange('pdCatheterComplicationNotes', e.target.value)}
                    placeholder="Any complications with catheter insertion or maintenance..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5" />
                <span>Payment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select 
                    value={dialysisFormData.paymentMethod} 
                    onValueChange={(value) => handleDialysisInputChange('paymentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE_GOVERNMENT">Free - Government</SelectItem>
                      <SelectItem value="FREE_NGO">Free - NGO</SelectItem>
                      <SelectItem value="HEALTH_INSURANCE">Health Insurance</SelectItem>
                      <SelectItem value="SELF_PAY">Self Pay</SelectItem>
                      <SelectItem value="EMPLOYER_COVERAGE">Employer Coverage</SelectItem>
                      <SelectItem value="COMBINATION">Combination</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {dialysisFormData.paymentMethod === 'SELF_PAY' && (
                  <div>
                    <Label htmlFor="monthlyCostSelfPay">Monthly Cost (₹)</Label>
                    <Input
                      id="monthlyCostSelfPay"
                      type="number"
                      value={dialysisFormData.monthlyCostSelfPay}
                      onChange={(e) => handleDialysisInputChange('monthlyCostSelfPay', e.target.value)}
                      placeholder="Enter monthly cost"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="insuranceCoverage">Insurance Coverage Details</Label>
                <Textarea
                  id="insuranceCoverage"
                  value={dialysisFormData.insuranceCoverage}
                  onChange={(e) => handleDialysisInputChange('insuranceCoverage', e.target.value)}
                  placeholder="Details about insurance coverage..."
                />
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
                <Label htmlFor="clinicalNotes">Overall Assessment and Notes</Label>
                <Textarea
                  id="clinicalNotes"
                  value={dialysisFormData.clinicalNotes}
                  onChange={(e) => handleDialysisInputChange('clinicalNotes', e.target.value)}
                  placeholder="Overall assessment, family education, and next steps..."
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
              onClick={() => setShowDialysisForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating Dialysis Record...' : 'Create Dialysis Record'}
            </Button>
          </div>
        </form>
      )}

      {/* Follow-up Form */}
      {showFollowUpForm && selectedDialysisId && (
        <form onSubmit={handleFollowUpSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Dialysis Follow-up</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="followUpDate">Follow-up Date *</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={followUpFormData.followUpDate}
                    onChange={(e) => handleFollowUpInputChange('followUpDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="visitNumber">Visit Number *</Label>
                  <Input
                    id="visitNumber"
                    type="number"
                    value={followUpFormData.visitNumber}
                    onChange={(e) => handleFollowUpInputChange('visitNumber', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nextFollowUpDate">Next Follow-up Date</Label>
                  <Input
                    id="nextFollowUpDate"
                    type="date"
                    value={followUpFormData.nextFollowUpDate}
                    onChange={(e) => handleFollowUpInputChange('nextFollowUpDate', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="currentModality">Current Modality</Label>
                <Select 
                  value={followUpFormData.currentModality} 
                  onValueChange={(value) => handleFollowUpInputChange('currentModality', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select current modality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HEMODIALYSIS">Hemodialysis (HD)</SelectItem>
                    <SelectItem value="PERITONEAL_DIALYSIS">Peritoneal Dialysis (PD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasModalityChange"
                  checked={followUpFormData.hasModalityChange}
                  onCheckedChange={(checked) => handleFollowUpInputChange('hasModalityChange', checked)}
                />
                <Label htmlFor="hasModalityChange">Change in Modality</Label>
              </div>

              {followUpFormData.hasModalityChange && (
                <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="modalityChangeDate">Modality Change Date</Label>
                      <Input
                        id="modalityChangeDate"
                        type="date"
                        value={followUpFormData.modalityChangeDate}
                        onChange={(e) => handleFollowUpInputChange('modalityChangeDate', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="modalityChangeReason">Reason for Change</Label>
                    <Textarea
                      id="modalityChangeReason"
                      value={followUpFormData.modalityChangeReason}
                      onChange={(e) => handleFollowUpInputChange('modalityChangeReason', e.target.value)}
                      placeholder="Reason for modality change..."
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="clinicalNotes">Clinical Notes</Label>
                <Textarea
                  id="clinicalNotes"
                  value={followUpFormData.clinicalNotes}
                  onChange={(e) => handleFollowUpInputChange('clinicalNotes', e.target.value)}
                  placeholder="Assessment, complications, and next steps..."
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
              {isSubmitting ? 'Creating Follow-up...' : 'Create Follow-up'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default DialysisManagement
