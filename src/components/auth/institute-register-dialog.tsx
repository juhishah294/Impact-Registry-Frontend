import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useMutation } from '@apollo/client'
import { REGISTER_INSTITUTE_WITH_ADMIN } from '@/graphql/mutations'
import { useToast } from '@/hooks/use-toast'
import { Building2, User, Mail, Phone, MapPin, Users, Bed, GraduationCap } from 'lucide-react'

interface InstituteRegisterDialogProps {
  children: React.ReactNode
}

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

const InstituteRegisterDialog: React.FC<InstituteRegisterDialogProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const [registerInstitute] = useMutation(REGISTER_INSTITUTE_WITH_ADMIN)

  const [formData, setFormData] = React.useState<FormData>({
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await registerInstitute({
        variables: {
          input: {
            ...formData,
            numberOfBeds: parseInt(formData.numberOfBeds),
            numberOfFaculty: parseInt(formData.numberOfFaculty)
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
        
        setOpen(false)
        // Reset form
        setFormData({
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Building2 className="w-6 h-6 mr-2 text-blue-600" />
            Register Your Medical Institute
          </DialogTitle>
          <DialogDescription>
            Join the IMPACT Registry by registering your medical center and creating an admin account.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Institute Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              Institute Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfBeds">Number of Beds *</Label>
                <Input
                  id="numberOfBeds"
                  type="number"
                  placeholder="50"
                  value={formData.numberOfBeds}
                  onChange={(e) => handleInputChange('numberOfBeds', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numberOfFaculty">Number of Faculty *</Label>
                <Input
                  id="numberOfFaculty"
                  type="number"
                  placeholder="5"
                  value={formData.numberOfFaculty}
                  onChange={(e) => handleInputChange('numberOfFaculty', e.target.value)}
                  required
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

          {/* Department Leadership */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="w-5 h-5 mr-2 text-green-600" />
              Department Leadership
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Admin Account */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Mail className="w-5 h-5 mr-2 text-purple-600" />
              Admin Account
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registering Institute...' : 'Register Institute & Create Admin Account'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default InstituteRegisterDialog
