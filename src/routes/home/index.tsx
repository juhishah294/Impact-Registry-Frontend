import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, Building2, Heart, Shield, Mail, Phone, MapPin, 
  TrendingUp, Award, Clock, Globe, FileText, BarChart3,
  ArrowRight, Star, Calendar, UserCheck, Database, 
  Target, Zap, CheckCircle, Quote, ExternalLink, Play
} from 'lucide-react'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-indigo-900/80"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Award className="w-4 h-4 mr-2" />
                Trusted by 23+ Medical Centers Across India
              </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              IMPACT Registry
            </h1>
            {/* HMR Test - This comment should trigger a reload */}
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Indian Multicentre Pediatric and Adolescent Chronic Kidney Disease Tracking Registry. 
                Advancing research and improving outcomes for children with kidney disease across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-blue-50">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Join the Registry
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
            
            {/* Hero Image/Visual */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <img src="/logo.png" alt="IMPACT Registry Logo" className="w-full max-w-md mx-auto mb-6" />
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Comprehensive Tracking</h3>
                  <p className="text-blue-100">From diagnosis to long-term outcomes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1931&q=80)'
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose IMPACT Registry?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides everything you need for effective pediatric CKD research and patient care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Comprehensive Data Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Capture detailed patient information, treatment protocols, and outcomes with our standardized data collection forms.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access powerful analytics and reporting tools to track trends, outcomes, and research insights in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Multi-center Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect with leading pediatric nephrology centers across India for collaborative research and knowledge sharing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Data Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Enterprise-grade security with HIPAA compliance ensures patient data is protected with the highest standards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Evidence-based Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate evidence-based treatment protocols and care guidelines based on real-world data from thousands of patients.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Easy Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Seamlessly integrate with existing hospital systems and workflows for minimal disruption to your practice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registry Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Registry Overview</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive registry aims to improve outcomes for children with chronic kidney disease 
              through systematic data collection and collaborative research across India.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-left text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    Comprehensive patient data collection
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    Outcome tracking and analysis
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    Quality improvement initiatives
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    Multi-center research collaboration
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Scope</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-left text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    Pediatric patients (0-18 years)
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    All stages of CKD
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    Multi-center participation
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    Long-term follow-up tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-left text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    Evidence-based care protocols
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    Improved patient outcomes
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    Clinical research advancement
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    Healthcare policy insights
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80)'
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Partners Say</h2>
            <p className="text-xl text-gray-600">Hear from leading pediatric nephrologists across India</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-blue-600 mb-4" />
                <p className="text-gray-600 mb-6 italic">
                  "The IMPACT Registry has revolutionized how we track and manage pediatric CKD patients. 
                  The comprehensive data collection has led to significant improvements in our treatment protocols."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Dr. Sarah Johnson</div>
                    <div className="text-sm text-gray-600">Chief Nephrologist, AIIMS Delhi</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-green-600 mb-4" />
                <p className="text-gray-600 mb-6 italic">
                  "The collaborative nature of the registry has enabled us to share best practices and 
                  learn from other centers, ultimately benefiting our young patients."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Dr. Michael Chen</div>
                    <div className="text-sm text-gray-600">Pediatric Nephrologist, CMC Vellore</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-purple-600 mb-4" />
                <p className="text-gray-600 mb-6 italic">
                  "The real-time analytics and reporting features have transformed our research capabilities. 
                  We can now identify trends and patterns that were previously impossible to detect."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Dr. Emily Rodriguez</div>
                    <div className="text-sm text-gray-600">Research Director, PGI Chandigarh</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600">Meet the experts leading the IMPACT Registry initiative</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-12 h-12 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Principal Investigators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-lg">Dr. Sarah Johnson</div>
                    <div className="text-sm text-gray-600">Chief Investigator</div>
                    <div className="text-sm text-gray-500">AIIMS Delhi</div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Dr. Michael Chen</div>
                    <div className="text-sm text-gray-600">Co-Investigator</div>
                    <div className="text-sm text-gray-500">CMC Vellore</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-12 h-12 text-green-600" />
                </div>
                <CardTitle className="text-xl">Coordinating Centre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-lg">St. John's Clinical Research</div>
                    <div className="text-sm text-gray-600">Registry Coordination</div>
                    <div className="text-sm text-gray-500">Data Management & Analysis</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Advisory Committee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-lg">Dr. Emily Rodriguez</div>
                    <div className="text-sm text-gray-600">Nephrology Specialist</div>
                    <div className="text-sm text-gray-500">PGI Chandigarh</div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Dr. James Wilson</div>
                    <div className="text-sm text-gray-600">Pediatric Specialist</div>
                    <div className="text-sm text-gray-500">KEM Mumbai</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Participating Centers */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Participating Centers</h2>
            <p className="text-xl text-gray-600">Leading medical institutions across India</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {[
              'AIIMS Delhi',
              'CMC Vellore',
              'PGI Chandigarh',
              'KEM Mumbai',
              'NIMHANS Bangalore',
              'SGPGI Lucknow',
              'JIPMER Puducherry',
              'AIIMS Jodhpur',
              'AIIMS Bhubaneswar',
              'AIIMS Raipur',
              'AIIMS Patna',
              'AIIMS Rishikesh'
            ].map((center, index) => (
              <Badge key={index} variant="secondary" className="p-4 text-center text-sm font-medium">
                {center}
              </Badge>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg">
              <ExternalLink className="w-5 h-5 mr-2" />
              View All Centers
            </Button>
          </div>
        </div>
      </section>

      {/* Latest News & Updates */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
            <p className="text-xl text-gray-600">Stay informed about registry developments and research findings</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  December 15, 2024
                </div>
                <CardTitle className="text-lg">New Research Publication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "Long-term Outcomes in Pediatric CKD: A Multi-center Analysis" published in Pediatric Nephrology Journal.
                </p>
                <Button variant="link" className="p-0 h-auto">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  December 10, 2024
                </div>
                <CardTitle className="text-lg">Registry Milestone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  IMPACT Registry reaches 1,000+ patient milestone with comprehensive data collection across 20+ centers.
                </p>
                <Button variant="link" className="p-0 h-auto">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  December 5, 2024
                </div>
                <CardTitle className="text-lg">New Center Joins</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  AIIMS Jodhpur becomes the latest medical center to join the IMPACT Registry network.
                </p>
                <Button variant="link" className="p-0 h-auto">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-indigo-900/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join the IMPACT Registry today and contribute to advancing pediatric kidney disease research across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-blue-50">
                <UserCheck className="w-5 h-5 mr-2" />
                Join the Registry
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact & Support</h2>
            <p className="text-xl text-gray-600">Get in touch with our team for support and information</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">General Inquiries:</p>
                <p className="font-semibold text-blue-600">registry@impact-ckd.org</p>
                <p className="text-gray-600 mb-4 mt-4">Technical Support:</p>
                <p className="font-semibold text-blue-600">support@impact-ckd.org</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Phone Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Registry Coordinator:</p>
                <p className="font-semibold text-green-600">+91 11 2658 8888</p>
                <p className="text-gray-600 mb-4 mt-4">Hours:</p>
                <p className="font-semibold text-green-600">Mon-Fri, 9AM-6PM IST</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-purple-600">IMPACT Registry</p>
                <p className="text-gray-600">St. John's Clinical Research</p>
                <p className="text-gray-600">123 Medical Center Drive</p>
                <p className="text-gray-600">New Delhi, 110029</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img src="/logo.png" alt="IMPACT Registry Logo" className="h-12 w-auto" />
                <div>
                  <span className="text-xl font-bold">IMPACT Registry</span>
                  <p className="text-sm text-gray-400">Indian Multicentre Pediatric CKD Tracking</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Advancing pediatric kidney disease research through comprehensive data collection, 
                collaboration, and evidence-based care improvements across India.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About the Registry</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Participating Centers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research Publications</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Data Collection Forms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training Materials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Protocol Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 IMPACT Registry. All rights reserved. | St. John's Clinical Research</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage