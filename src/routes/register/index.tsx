import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useMutation } from '@apollo/client'
import { REGISTER_INSTITUTE_WITH_ADMIN } from '@/graphql/mutations'
import { useToast } from '@/hooks/use-toast'
import { 
  Building2, User, Mail, Phone, MapPin, Users, Bed, GraduationCap,
  ArrowLeft, ArrowRight, CheckCircle, Circle
} from 'lucide-react'

interface FormData {
  centerName: string
  address: string
  contactInformation: string
  headOfDepartment: string
  headOfDepartmentContact: string
  coInvestigatorName: string
  coInvestigatorContact: string
  isPublicSector: boolean
  numberOfBeds: string
  numberOfFaculty: string
  adminEmail: string
  adminPassword: string
  adminFirstName: string
  adminLastName: string
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  const [registerInstitute] = useMutation(REGISTER_INSTITUTE_WITH_ADMIN)

  const [formData, setFormData] = useState<FormData>({
    centerName: '',
    address: '',
    contactInformation: '',
    headOfDepartment: '',
    headOfDepartmentContact: '',
    coInvestigatorName: '',
    coInvestigatorContact: '',
    isPublicSector: true,
    numberOfBeds: '',
    numberOfFaculty: '',
    adminEmail: '',
    adminPassword: '',
    adminFirstName: '',
    adminLastName: ''
  })

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      const result = await registerInstitute({
        variables: {
          input: {
            centerName: formData.centerName,
            address: formData.address,
            contactInformation: formData.contactInformation,
            headOfDepartment: formData.headOfDepartment,
            headOfDepartmentContact: formData.headOfDepartmentContact,
            coInvestigatorName: formData.coInvestigatorName,
            coInvestigatorContact: formData.coInvestigatorContact,
            isPublicSector: formData.isPublicSector,
            numberOfBeds: formData.numberOfBeds ? parseInt(formData.numberOfBeds) : 0,
            numberOfFaculty: formData.numberOfFaculty ? parseInt(formData.numberOfFaculty) : 0,
            adminEmail: formData.adminEmail,
            adminPassword: formData.adminPassword,
            adminFirstName: formData.adminFirstName,
            adminLastName: formData.adminLastName
          }
        }
      })

      if (result.data?.registerInstituteWithAdmin) {
        const { institute, user, token } = result.data.registerInstituteWithAdmin
        
        // Store token in localStorage
        localStorage.setItem('token', token)
        
        toast({
          title: "Registration Successful!",
          description: `Welcome to IMPACT Registry, ${user.firstName}! Your institute "${institute.centerName}" has been registered.`,
          variant: "success"
        })
        
        // Redirect to dashboard
        navigate('/dashboard')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { id: 1, title: 'Institute Information', description: 'Basic details about your medical center' },
    { id: 2, title: 'Department Leadership', description: 'Key personnel and contacts' },
    { id: 3, title: 'Admin Account', description: 'Create your administrator account' }
  ]

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.centerName && formData.address && formData.contactInformation
      case 2:
        return formData.headOfDepartment && formData.headOfDepartmentContact && 
               formData.coInvestigatorName && formData.coInvestigatorContact
      case 3:
        return formData.adminFirstName && formData.adminLastName && 
               formData.adminEmail && formData.adminPassword
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join IMPACT Registry</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Register your medical institute and create an admin account to start contributing to pediatric CKD research.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.id 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              {currentStep === 1 && <Building2 className="w-6 h-6 mr-2 text-blue-600" />}
              {currentStep === 2 && <User className="w-6 h-6 mr-2 text-green-600" />}
              {currentStep === 3 && <Mail className="w-6 h-6 mr-2 text-purple-600" />}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Institute Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="centerName">Center Name *</Label>
                    <Input
                      id="centerName"
                      placeholder="Your Medical Center"
                      value={formData.centerName}
                      onChange={(e) => handleInputChange('centerName', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street, City, State, ZIP"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactInformation">Contact Information *</Label>
                  <Input
                    id="contactInformation"
                    placeholder="Phone: 123-456-7890, Email: contact@yourcenter.com"
                    value={formData.contactInformation}
                    onChange={(e) => handleInputChange('contactInformation', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfBeds">Number of Beds</Label>
                    <Input
                      id="numberOfBeds"
                      type="number"
                      placeholder="50 (optional)"
                      value={formData.numberOfBeds}
                      onChange={(e) => handleInputChange('numberOfBeds', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="numberOfFaculty">Number of Faculty</Label>
                    <Input
                      id="numberOfFaculty"
                      type="number"
                      placeholder="5 (optional)"
                      value={formData.numberOfFaculty}
                      onChange={(e) => handleInputChange('numberOfFaculty', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublicSector"
                    checked={formData.isPublicSector}
                    onCheckedChange={(checked) => handleInputChange('isPublicSector', checked)}
                  />
                  <Label htmlFor="isPublicSector">Public Sector Institution</Label>
                </div>
              </div>
            )}

            {/* Step 2: Department Leadership */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="headOfDepartment">Head of Department *</Label>
                    <Input
                      id="headOfDepartment"
                      placeholder="Dr. John Smith"
                      value={formData.headOfDepartment}
                      onChange={(e) => handleInputChange('headOfDepartment', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="headOfDepartmentContact">Head of Department Contact *</Label>
                    <Input
                      id="headOfDepartmentContact"
                      type="email"
                      placeholder="john@yourcenter.com"
                      value={formData.headOfDepartmentContact}
                      onChange={(e) => handleInputChange('headOfDepartmentContact', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="coInvestigatorName">Co-Investigator Name *</Label>
                    <Input
                      id="coInvestigatorName"
                      placeholder="Dr. Jane Doe"
                      value={formData.coInvestigatorName}
                      onChange={(e) => handleInputChange('coInvestigatorName', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coInvestigatorContact">Co-Investigator Contact *</Label>
                    <Input
                      id="coInvestigatorContact"
                      type="email"
                      placeholder="jane@yourcenter.com"
                      value={formData.coInvestigatorContact}
                      onChange={(e) => handleInputChange('coInvestigatorContact', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Admin Account */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="adminFirstName">First Name *</Label>
                    <Input
                      id="adminFirstName"
                      placeholder="John"
                      value={formData.adminFirstName}
                      onChange={(e) => handleInputChange('adminFirstName', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminLastName">Last Name *</Label>
                    <Input
                      id="adminLastName"
                      placeholder="Smith"
                      value={formData.adminLastName}
                      onChange={(e) => handleInputChange('adminLastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@yourcenter.com"
                    value={formData.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Admin Password *</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    placeholder="Create a secure password"
                    value={formData.adminPassword}
                    onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center space-x-2">
                  <input
                    id="terms"
                    type="checkbox"
                    className="rounded border-gray-300"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{' '}
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Terms of Service
                    </Button>{' '}
                    and{' '}
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Privacy Policy
                    </Button>
                  </Label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="flex items-center"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid(currentStep) || isLoading}
                  className="flex items-center"
                >
                  {isLoading ? 'Registering...' : 'Complete Registration'}
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Button variant="link" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
