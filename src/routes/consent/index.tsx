import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  Download, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { UPLOAD_CONSENT } from '@/graphql/mutations'
import { GET_SECURE_DOWNLOAD } from '@/graphql/queries'

const ConsentManagement: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([])

  const [uploadConsent] = useMutation(UPLOAD_CONSENT)
  const [getSecureDownload] = useMutation(GET_SECURE_DOWNLOAD)

  const [formData, setFormData] = useState({
    patientId: '',
    documentType: 'CONSENT_FORM',
    consentStatus: 'OBTAINED',
    obtainedDate: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, DOC, DOCX, JPG, or PNG file.",
          variant: "destructive"
        })
        return
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive"
        })
        return
      }

      setSelectedFile(file)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      })
      return
    }

    if (!formData.patientId) {
      toast({
        title: "Patient ID Required",
        description: "Please enter a patient ID.",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    try {
      const result = await uploadConsent({
        variables: {
          input: {
            patientId: formData.patientId,
            documentType: formData.documentType,
            consentStatus: formData.consentStatus,
            obtainedDate: formData.obtainedDate,
            notes: formData.notes
          },
          file: selectedFile
        }
      })

      if (result.data?.uploadConsentDocument) {
        const uploadedDoc = result.data.uploadConsentDocument
        
        // Add to uploaded documents list
        setUploadedDocuments(prev => [uploadedDoc, ...prev])
        
        toast({
          title: "Document Uploaded Successfully",
          description: `${uploadedDoc.originalFileName} has been uploaded for patient ${uploadedDoc.patient.patientId}.`,
          variant: "success"
        })

        // Reset form
        setFormData({
          patientId: '',
          documentType: 'CONSENT_FORM',
          consentStatus: 'OBTAINED',
          obtainedDate: new Date().toISOString().split('T')[0],
          notes: ''
        })
        setSelectedFile(null)
        // Reset file input
        const fileInput = document.getElementById('consentFile') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async (consentId: string, fileName: string) => {
    try {
      const result = await getSecureDownload.refetch({
        consentId: consentId
      })

      if (result.data?.generateSignedUrl) {
        const { signedUrl } = result.data.generateSignedUrl
        
        // Create a temporary link to download the file
        const link = document.createElement('a')
        link.href = signedUrl
        link.download = fileName
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast({
          title: "Download Started",
          description: `Downloading ${fileName}...`,
          variant: "success"
        })
      }
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to generate download link.",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OBTAINED':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Obtained</Badge>
      case 'PENDING':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'WITHDRAWN':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Withdrawn</Badge>
      case 'EXPIRED':
        return <Badge variant="outline" className="text-orange-600 border-orange-600"><AlertCircle className="w-3 h-3 mr-1" />Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDocumentTypeBadge = (type: string) => {
    switch (type) {
      case 'CONSENT_FORM':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Consent Form</Badge>
      case 'ASSENT_FORM':
        return <Badge variant="outline" className="text-purple-600 border-purple-600">Assent Form</Badge>
      case 'PARENTAL_CONSENT':
        return <Badge variant="outline" className="text-green-600 border-green-600">Parental Consent</Badge>
      case 'ETHICS_APPROVAL':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Ethics Approval</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consent Document Management</h1>
          <p className="text-gray-600 mt-1">Upload and manage patient consent documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Consent Document</span>
            </CardTitle>
            <CardDescription>Upload consent documents for patients</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="patientId">Patient ID *</Label>
                <Input
                  id="patientId"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  placeholder="Enter patient ID"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select value={formData.documentType} onValueChange={(value) => setFormData({ ...formData, documentType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONSENT_FORM">Consent Form</SelectItem>
                      <SelectItem value="ASSENT_FORM">Assent Form</SelectItem>
                      <SelectItem value="PARENTAL_CONSENT">Parental Consent</SelectItem>
                      <SelectItem value="ETHICS_APPROVAL">Ethics Approval</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="consentStatus">Consent Status</Label>
                  <Select value={formData.consentStatus} onValueChange={(value) => setFormData({ ...formData, consentStatus: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OBTAINED">Obtained</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="obtainedDate">Obtained Date</Label>
                <Input
                  id="obtainedDate"
                  type="date"
                  value={formData.obtainedDate}
                  onChange={(e) => setFormData({ ...formData, obtainedDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="consentFile">Select Document *</Label>
                <Input
                  id="consentFile"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                />
                {selectedFile && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <strong>Selected:</strong> {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about the consent document..."
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={isUploading || !selectedFile} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Uploaded Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Uploaded Documents</span>
            </CardTitle>
            <CardDescription>Recently uploaded consent documents</CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedDocuments.length > 0 ? (
              <div className="space-y-3">
                {uploadedDocuments.map((doc, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-sm">{doc.originalFileName}</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(doc.id, doc.originalFileName)}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getDocumentTypeBadge(doc.documentType)}
                      {getStatusBadge(doc.consentStatus)}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <p><strong>Patient:</strong> {doc.patient.firstName} {doc.patient.lastName} ({doc.patient.patientId})</p>
                      <p><strong>Uploaded:</strong> {new Date(doc.obtainedDate).toLocaleDateString()}</p>
                      <p><strong>Size:</strong> {(doc.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No documents uploaded yet.</p>
                <p className="text-sm">Upload your first consent document using the form.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* File Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Upload Guidelines</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Supported File Types:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• PDF documents (.pdf)</li>
                <li>• Word documents (.doc, .docx)</li>
                <li>• Image files (.jpg, .jpeg, .png)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">File Requirements:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Maximum file size: 10MB</li>
                <li>• Clear, readable documents</li>
                <li>• Proper consent signatures</li>
                <li>• Valid patient ID required</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConsentManagement
