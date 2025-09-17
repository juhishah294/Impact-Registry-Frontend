import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Activity,
  Calculator,
  Download,
  Filter,
  RefreshCw,
  FileText,
  Heart,
  Droplets,
  Stethoscope,
  Target,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { 
  GET_CKD_STAGE_DISTRIBUTION,
  GET_DEMOGRAPHIC_SUMMARY,
  GET_DIALYSIS_PREVALENCE,
  GET_COMORBIDITY_ANALYSIS,
  GET_GROWTH_TRENDS,
  GET_DATA_COMPLETENESS_REPORT,
  CALCULATE_EGFR,
  CALCULATE_BMI_Z_SCORE,
  CALCULATE_HEIGHT_Z_SCORE,
  CALCULATE_BP_PERCENTILE,
  CALCULATE_DIALYSIS_KTV,
  CALCULATE_URR
} from '@/graphql/queries'
import { REQUEST_DATA_EXPORT, SAVE_CALCULATOR_RESULT } from '@/graphql/mutations'

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [filters, setFilters] = useState({
    ageRange: { min: 0, max: 18 },
    gender: [] as string[],
    region: [] as string[],
    ckdStage: [] as string[],
    instituteId: user?.instituteId || undefined
  })
  const [isExporting, setIsExporting] = useState(false)

  const [requestExport] = useMutation(REQUEST_DATA_EXPORT)
  const [saveCalculatorResult] = useMutation(SAVE_CALCULATOR_RESULT)

  // Dashboard Queries
  const { data: ckdData, loading: ckdLoading, refetch: refetchCKD } = useQuery(GET_CKD_STAGE_DISTRIBUTION, {
    variables: { filters }
  })

  const { data: demoData, loading: demoLoading, refetch: refetchDemo } = useQuery(GET_DEMOGRAPHIC_SUMMARY, {
    variables: { filters }
  })

  const { data: dialysisData, loading: dialysisLoading, refetch: refetchDialysis } = useQuery(GET_DIALYSIS_PREVALENCE, {
    variables: { filters }
  })

  const { data: comorbidityData, loading: comorbidityLoading, refetch: refetchComorbidity } = useQuery(GET_COMORBIDITY_ANALYSIS, {
    variables: { filters }
  })

  const { data: growthData, loading: growthLoading, refetch: refetchGrowth } = useQuery(GET_GROWTH_TRENDS, {
    variables: { filters }
  })

  const { data: completenessData, loading: completenessLoading, refetch: refetchCompleteness } = useQuery(GET_DATA_COMPLETENESS_REPORT, {
    variables: { filters }
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleRefresh = () => {
    refetchCKD()
    refetchDemo()
    refetchDialysis()
    refetchComorbidity()
    refetchGrowth()
    refetchCompleteness()
  }

  const handleExport = async (exportType: string, format: string) => {
    setIsExporting(true)
    try {
      await requestExport({
        variables: {
          input: {
            exportType,
            exportFormat: format,
            filters
          }
        }
      })

      toast({
        title: "Export Request Submitted",
        description: "Your data export request has been submitted. You will be notified when ready.",
        variant: "success"
      })
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to request data export. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'CKD_STAGE_3': return 'bg-yellow-100 text-yellow-800'
      case 'CKD_STAGE_4': return 'bg-orange-100 text-orange-800'
      case 'CKD_STAGE_5': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCompletenessColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Calculators</h1>
          <p className="text-gray-600 mt-1">Comprehensive dashboard and medical calculators for CKD clinical trials</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Dashboard Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="ageMin">Age Range (years)</Label>
              <div className="flex space-x-2">
                <Input
                  id="ageMin"
                  type="number"
                  value={filters.ageRange.min}
                  onChange={(e) => handleFilterChange('ageRange', { ...filters.ageRange, min: parseInt(e.target.value) || 0 })}
                  placeholder="Min"
                />
                <Input
                  type="number"
                  value={filters.ageRange.max}
                  onChange={(e) => handleFilterChange('ageRange', { ...filters.ageRange, max: parseInt(e.target.value) || 18 })}
                  placeholder="Max"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={filters.gender.join(',')} 
                onValueChange={(value) => handleFilterChange('gender', value ? value.split(',') : [])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="MALE,FEMALE">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ckdStage">CKD Stage</Label>
              <Select 
                value={filters.ckdStage.join(',')} 
                onValueChange={(value) => handleFilterChange('ckdStage', value ? value.split(',') : [])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CKD_STAGE_3">Stage 3</SelectItem>
                  <SelectItem value="CKD_STAGE_4">Stage 4</SelectItem>
                  <SelectItem value="CKD_STAGE_5">Stage 5</SelectItem>
                  <SelectItem value="CKD_STAGE_3,CKD_STAGE_4,CKD_STAGE_5">All Stages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="export">Export Data</Label>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => handleExport('CLINICAL_DATA', 'EXCEL')}
                  disabled={isExporting}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Excel
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExport('CLINICAL_DATA', 'CSV')}
                  disabled={isExporting}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="calculators">Medical Calculators</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold">
                      {demoData?.demographicSummary?.totalPatients || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dialysis Patients</p>
                    <p className="text-2xl font-bold">
                      {dialysisData?.dialysisPrevalence?.dialysisPatients || 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dialysisData?.dialysisPrevalence?.dialysisPercentage?.toFixed(1) || 0}% of CKD patients
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Data Completeness</p>
                    <p className="text-2xl font-bold">
                      {completenessData?.dataCompletenessReport?.overallCompleteness?.toFixed(1) || 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Height Z-Score</p>
                    <p className="text-2xl font-bold">
                      {growthData?.growthTrends?.averageHeightZScore?.toFixed(2) || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CKD Stage Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>CKD Stage Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ckdLoading ? (
                <div className="text-center py-8">Loading CKD stage distribution...</div>
              ) : ckdData?.ckdStageDistribution?.length > 0 ? (
                <div className="space-y-4">
                  {ckdData.ckdStageDistribution.map((stage: any) => (
                    <div key={stage.stage} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={getStageColor(stage.stage)}>
                          {stage.stage.replace('CKD_STAGE_', 'Stage ')}
                        </Badge>
                        <span className="font-medium">{stage.count} patients</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${stage.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {stage.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No CKD stage data available for the selected filters.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gender and Age Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Gender Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {demoLoading ? (
                  <div className="text-center py-8">Loading gender distribution...</div>
                ) : demoData?.demographicSummary?.genderDistribution?.length > 0 ? (
                  <div className="space-y-3">
                    {demoData.demographicSummary.genderDistribution.map((gender: any) => (
                      <div key={gender.gender} className="flex items-center justify-between">
                        <span className="font-medium">{gender.gender}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{gender.count} patients</span>
                          <Badge variant="outline">{gender.percentage.toFixed(1)}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No gender data available</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Age Groups</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {demoLoading ? (
                  <div className="text-center py-8">Loading age groups...</div>
                ) : demoData?.demographicSummary?.ageGroups?.length > 0 ? (
                  <div className="space-y-3">
                    {demoData.demographicSummary.ageGroups.map((ageGroup: any) => (
                      <div key={ageGroup.ageGroup} className="flex items-center justify-between">
                        <span className="font-medium">{ageGroup.ageGroup}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{ageGroup.count} patients</span>
                          <Badge variant="outline">{ageGroup.percentage.toFixed(1)}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No age group data available</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Dialysis Modality Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Dialysis Modality Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dialysisLoading ? (
                <div className="text-center py-8">Loading dialysis data...</div>
              ) : dialysisData?.dialysisPrevalence?.modalityDistribution?.length > 0 ? (
                <div className="space-y-4">
                  {dialysisData.dialysisPrevalence.modalityDistribution.map((modality: any) => (
                    <div key={modality.modality} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={modality.modality === 'HEMODIALYSIS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                          {modality.modality === 'HEMODIALYSIS' ? 'HD' : 'PD'}
                        </Badge>
                        <span className="font-medium">{modality.count} patients</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${modality.modality === 'HEMODIALYSIS' ? 'bg-blue-600' : 'bg-green-600'}`}
                            style={{ width: `${modality.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {modality.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No dialysis modality data available.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comorbidity Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5" />
                <span>Comorbidity Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comorbidityLoading ? (
                <div className="text-center py-8">Loading comorbidity data...</div>
              ) : comorbidityData?.comorbidityAnalysis ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Hypertension</p>
                    <p className="text-2xl font-bold text-red-600">
                      {comorbidityData.comorbidityAnalysis.hypertension.percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {comorbidityData.comorbidityAnalysis.hypertension.count} patients
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Anemia</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {comorbidityData.comorbidityAnalysis.anemia.percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {comorbidityData.comorbidityAnalysis.anemia.count} patients
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Growth Failure</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {comorbidityData.comorbidityAnalysis.growthFailure.percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {comorbidityData.comorbidityAnalysis.growthFailure.count} patients
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No comorbidity data available</div>
              )}
            </CardContent>
          </Card>

          {/* Data Completeness Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Data Completeness Report</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completenessLoading ? (
                <div className="text-center py-8">Loading completeness data...</div>
              ) : completenessData?.dataCompletenessReport?.completenessMetrics?.length > 0 ? (
                <div className="space-y-3">
                  {completenessData.dataCompletenessReport.completenessMetrics.map((metric: any) => (
                    <div key={metric.field} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{metric.category}</Badge>
                        <span className="font-medium">{metric.field}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{metric.completed} completed</span>
                        <span className={`text-sm font-medium ${getCompletenessColor(metric.percentage)}`}>
                          {metric.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No completeness data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculators Tab */}
        <TabsContent value="calculators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>Medical Calculators</span>
              </CardTitle>
              <CardDescription>
                Evidence-based calculators for pediatric nephrology clinical assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Activity className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">eGFR Calculator</h3>
                        <p className="text-sm text-gray-600">Schwartz, CKiD, Bedside Schwartz</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">BMI Z-Score</h3>
                        <p className="text-sm text-gray-600">WHO/CDC reference charts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Target className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Height Z-Score</h3>
                        <p className="text-sm text-gray-600">Growth assessment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Heart className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">BP Percentile</h3>
                        <p className="text-sm text-gray-600">AAP guidelines</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Droplets className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Dialysis Kt/V</h3>
                        <p className="text-sm text-gray-600">HD adequacy</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">URR Calculator</h3>
                        <p className="text-sm text-gray-600">Urea reduction ratio</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calculator Coming Soon</CardTitle>
              <CardDescription>
                Individual calculator interfaces will be implemented in the next phase.
                The backend calculator service is ready with all medical formulas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Calculator interfaces are being developed...</p>
                <p className="text-sm text-gray-400 mt-2">
                  All backend calculator services are ready and functional.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AnalyticsDashboard
