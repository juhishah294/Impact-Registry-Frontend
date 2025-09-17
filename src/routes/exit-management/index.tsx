/** @format */

import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	UserX,
	Heart,
	AlertTriangle,
	CheckCircle,
	Clock,
	Plus,
	Save,
	Eye,
	Edit,
	Trash2,
	Phone,
	Mail,
	Home,
	FileText,
	Users,
	Calendar,
	MapPin,
	Stethoscope,
	Shield,
	Activity,
	AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import {
	CREATE_PATIENT_EXIT,
	UPDATE_PATIENT_EXIT,
	VERIFY_PATIENT_EXIT,
} from '@/graphql/mutations';
import { GET_PATIENT_EXIT, GET_PATIENT_EXITS } from '@/graphql/queries';

const ExitManagement: React.FC = () => {
	const { user } = useAuth();
	const { toast } = useToast();
	const [selectedPatientId, setSelectedPatientId] = useState('');
	const [showExitForm, setShowExitForm] = useState(false);
	const [activeTab, setActiveTab] = useState('overview');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [createExit] = useMutation(CREATE_PATIENT_EXIT);
	const [updateExit] = useMutation(UPDATE_PATIENT_EXIT);
	const [verifyExit] = useMutation(VERIFY_PATIENT_EXIT);

	const {
		data: exitData,
		loading,
		refetch,
	} = useQuery(GET_PATIENT_EXIT, {
		variables: { patientId: selectedPatientId },
		skip: !selectedPatientId,
	});

	const { data: exitsData, refetch: refetchExits } = useQuery(
		GET_PATIENT_EXITS,
		{
			variables: { filters: {} },
		}
	);

	const [exitFormData, setExitFormData] = useState({
		patientId: '',
		exitDate: new Date().toISOString().split('T')[0],
		exitCause: '',
		exitNotes: '',

		// Death details
		deathDetails: {
			dateOfDeath: '',
			timeOfDeath: '',
			placeOfDeath: '',
			hospitalName: '',
			primaryCauseOfDeath: '',
			secondaryCauseOfDeath: '',
			immediateCareCause: '',
			underlyingCause: '',
			isCKDRelated: false,
			ckdRelatedCause: '',
			dialysisRelated: false,
			dialysisComplication: '',
			isCardiovascular: false,
			cardiovascularCause: '',
			isInfectionRelated: false,
			infectionType: '',
			infectionSite: '',
			autopsyPerformed: false,
			autopsyFindings: '',
			deathCertificateNumber: '',
			certifyingPhysician: '',
			informedFamily: false,
			familyContactDate: '',
			familyContactPerson: '',
			clinicalNotes: '',
		},

		// Loss to follow-up details
		lossToFollowUpDetails: {
			lastContactDate: '',
			lastVisitDate: '',
			durationOfLoss: 0,
			phoneCallAttempts: 0,
			phoneCallDates: [] as string[],
			phoneCallOutcomes: [] as string[],
			smsAttempts: 0,
			smsDates: [] as string[],
			smsDeliveryStatus: [] as string[],
			emailAttempts: 0,
			emailDates: [] as string[],
			emailDeliveryStatus: [] as string[],
			homeVisitAttempts: 0,
			homeVisitDates: [] as string[],
			homeVisitOutcomes: [] as string[],
			letterAttempts: 0,
			letterDates: [] as string[],
			letterDeliveryStatus: [] as string[],
			emergencyContactAttempts: 0,
			emergencyContactDates: [] as string[],
			emergencyContactOutcomes: [] as string[],
			suspectedReasons: [] as string[],
			familyReportedReasons: '',
			hasRelocated: false,
			newLocation: '',
			hasChangedContact: false,
			financialConstraints: false,
			transportationIssues: false,
			improvedCondition: false,
			seekingAlternativeCare: false,
			alternativeCareProvider: '',
			checklistCompletedBy: user?.id || '',
			checklistCompletionDate: new Date().toISOString().split('T')[0],
			referredToSocialWorker: false,
			socialWorkerNotes: '',
			finalClassification: '',
			clinicalNotes: '',
		},

		// Transplant details
		transplantDetails: {
			transplantDate: '',
			transplantType: '',
			donorType: '',
			donorAge: '',
			donorGender: '',
			donorRelationship: '',
			livingDonorName: '',
			livingDonorContact: '',
			donorWorkup: false,
			donorWorkupDate: '',
			donorCompatibility: '',
			donorOrganizationName: '',
			waitingListDuration: '',
			waitingListRegistrationDate: '',
			transplantCenter: '',
			transplantCenterCity: '',
			transplantCenterState: '',
			surgeonName: '',
			preTransplantEGFR: '',
			preTransplantDialysis: false,
			dialysisDuration: '',
			preemptiveTransplant: false,
			surgeryDuration: '',
			coldIschemiaTime: '',
			warmIschemiaTime: '',
			inductionTherapy: '',
			maintenanceImmunosuppression: '',
			immediateGraftFunction: '',
			delayedGraftFunction: false,
			acuteRejectionEpisodes: '',
			surgicalComplications: [] as string[],
			medicalComplications: [] as string[],
			followUpCenter: '',
			followUpPhysician: '',
			followUpContact: '',
			registryTransitionDate: '',
			newRegistryName: '',
			dataTransferCompleted: false,
			transplantNotes: '',
			familyEducationCompleted: false,
		},
	});

	const handleInputChange = (field: string, value: any) => {
		setExitFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleNestedInputChange = (
		section: string,
		field: string,
		value: any
	) => {
		setExitFormData((prev) => ({
			...prev,
			[section]: {
				...(prev[section as keyof typeof prev] || {}),
				[field]: value,
			},
		}));
	};

	const handleExitSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedPatientId) {
			toast({
				title: 'Patient Required',
				description: 'Please enter a patient ID to create exit record.',
				variant: 'destructive',
			});
			return;
		}

		if (!exitFormData.exitCause) {
			toast({
				title: 'Exit Cause Required',
				description: 'Please select an exit cause.',
				variant: 'destructive',
			});
			return;
		}

		setIsSubmitting(true);
		try {
			const input: any = {
				patientId: selectedPatientId,
				exitDate: exitFormData.exitDate,
				exitCause: exitFormData.exitCause,
				exitNotes: exitFormData.exitNotes,
			};

			// Add specific details based on exit cause
			if (exitFormData.exitCause === 'DEATH') {
				input.deathDetails = exitFormData.deathDetails;
			} else if (exitFormData.exitCause === 'LOSS_TO_FOLLOWUP') {
				input.lossToFollowUpDetails = exitFormData.lossToFollowUpDetails;
			} else if (exitFormData.exitCause === 'KIDNEY_TRANSPLANT') {
				input.transplantDetails = exitFormData.transplantDetails;
			}

			await createExit({
				variables: { input },
			});

			toast({
				title: 'Exit Record Created Successfully',
				description: 'Patient exit record has been created and documented.',
				variant: 'success',
			});

			// Reset form
			setExitFormData({
				...exitFormData,
				exitDate: new Date().toISOString().split('T')[0],
			});
			setShowExitForm(false);

			refetch();
			refetchExits();
		} catch (error: any) {
			toast({
				title: 'Exit Creation Failed',
				description:
					error.message || 'Failed to create exit record. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleVerifyExit = async (exitId: string) => {
		try {
			await verifyExit({
				variables: {
					id: exitId,
					verificationNotes: 'Exit verified by supervisor',
				},
			});

			toast({
				title: 'Exit Verified Successfully',
				description: 'Patient exit has been verified and approved.',
				variant: 'success',
			});

			refetch();
			refetchExits();
		} catch (error: any) {
			toast({
				title: 'Verification Failed',
				description:
					error.message || 'Failed to verify exit. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const getExitCauseBadge = (cause: string) => {
		switch (cause) {
			case 'DEATH':
				return <Badge className='bg-red-100 text-red-800'>Death</Badge>;
			case 'LOSS_TO_FOLLOWUP':
				return (
					<Badge className='bg-orange-100 text-orange-800'>
						Loss to Follow-up
					</Badge>
				);
			case 'KIDNEY_TRANSPLANT':
				return (
					<Badge className='bg-green-100 text-green-800'>Transplant</Badge>
				);
			case 'TRANSFER_TO_ADULT_CARE':
				return <Badge className='bg-blue-100 text-blue-800'>Transfer</Badge>;
			case 'FAMILY_RELOCATION':
				return (
					<Badge className='bg-purple-100 text-purple-800'>Relocation</Badge>
				);
			case 'IMPROVED_CONDITION':
				return (
					<Badge className='bg-emerald-100 text-emerald-800'>Improved</Badge>
				);
			default:
				return <Badge variant='outline'>{cause}</Badge>;
		}
	};

	const getVerificationBadge = (
		verified: boolean,
		verificationDate?: string
	) => {
		if (verified && verificationDate) {
			return <Badge className='bg-green-100 text-green-800'>Verified</Badge>;
		}
		return <Badge className='bg-yellow-100 text-yellow-800'>Pending</Badge>;
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Patient Exit Management
					</h1>
					<p className='text-gray-600 mt-1'>
						Track and manage patient exits from the CKD registry
					</p>
				</div>
				<div className='flex space-x-2'>
					<Button onClick={() => setShowExitForm(!showExitForm)}>
						<Plus className='w-4 h-4 mr-2' />
						New Exit
					</Button>
				</div>
			</div>

			{/* Patient Selection */}
			<Card>
				<CardHeader>
					<CardTitle>Select Patient</CardTitle>
					<CardDescription>
						Enter patient ID to view or create exit records
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex space-x-4'>
						<div className='flex-1'>
							<Label htmlFor='patientId'>Patient ID</Label>
							<Input
								id='patientId'
								value={selectedPatientId}
								onChange={(e) => setSelectedPatientId(e.target.value)}
								placeholder='Enter patient ID'
							/>
						</div>
						<div className='flex items-end'>
							<Button
								onClick={() => refetch()}
								disabled={!selectedPatientId}
							>
								<Eye className='w-4 h-4 mr-2' />
								View Exit Record
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Exit Records Overview */}
			{exitsData?.patientExits?.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center space-x-2'>
							<UserX className='w-5 h-5' />
							<span>Recent Exit Records</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{exitsData.patientExits.slice(0, 5).map((exit: any) => (
								<div
									key={exit.id}
									className='border rounded-lg p-4 space-y-3'
								>
									<div className='flex items-center justify-between'>
										<div className='flex items-center space-x-4'>
											<span className='font-medium'>
												{exit.patient.firstName} {exit.patient.lastName}
											</span>
											<span className='text-sm text-gray-500'>
												ID: {exit.patient.patientId}
											</span>
											{getExitCauseBadge(exit.exitCause)}
											{getVerificationBadge(
												!!exit.verifiedBy,
												exit.verificationDate
											)}
										</div>
										<div className='flex space-x-2'>
											{!exit.verifiedBy && user?.role === 'SUPER_ADMIN' && (
												<Button
													size='sm'
													variant='outline'
													onClick={() => handleVerifyExit(exit.id)}
												>
													<CheckCircle className='w-3 h-3 mr-1' />
													Verify
												</Button>
											)}
											<Button
												size='sm'
												variant='outline'
											>
												<Eye className='w-3 h-3' />
											</Button>
										</div>
									</div>

									<div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
										<div>
											<span className='text-gray-500'>Exit Date:</span>
											<span className='ml-2 font-medium'>
												{new Date(exit.exitDate).toLocaleDateString()}
											</span>
										</div>
										<div>
											<span className='text-gray-500'>Reported By:</span>
											<span className='ml-2 font-medium'>
												{exit.reportedByUser.firstName}{' '}
												{exit.reportedByUser.lastName}
											</span>
										</div>
										{exit.verifiedBy && (
											<div>
												<span className='text-gray-500'>Verified By:</span>
												<span className='ml-2 font-medium'>
													{exit.verifiedByUser.firstName}{' '}
													{exit.verifiedByUser.lastName}
												</span>
											</div>
										)}
										<div>
											<span className='text-gray-500'>Created:</span>
											<span className='ml-2 font-medium'>
												{new Date(exit.createdAt).toLocaleDateString()}
											</span>
										</div>
									</div>

									{exit.exitNotes && (
										<div className='text-sm text-gray-600 bg-gray-50 p-2 rounded'>
											<strong>Notes:</strong> {exit.exitNotes}
										</div>
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Patient Exit Record */}
			{selectedPatientId && exitData?.patientExit && (
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center space-x-2'>
							<UserX className='w-5 h-5' />
							<span>
								Exit Record for {exitData.patientExit.patient.firstName}{' '}
								{exitData.patientExit.patient.lastName}
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
						>
							<TabsList className='grid w-full grid-cols-4'>
								<TabsTrigger value='overview'>Overview</TabsTrigger>
								<TabsTrigger value='death'>Death Details</TabsTrigger>
								<TabsTrigger value='ltfu'>Loss to Follow-up</TabsTrigger>
								<TabsTrigger value='transplant'>Transplant</TabsTrigger>
							</TabsList>

							<TabsContent
								value='overview'
								className='space-y-4'
							>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<Label>Exit Date</Label>
										<p className='font-medium'>
											{new Date(
												exitData.patientExit.exitDate
											).toLocaleDateString()}
										</p>
									</div>
									<div>
										<Label>Exit Cause</Label>
										<div className='mt-1'>
											{getExitCauseBadge(exitData.patientExit.exitCause)}
										</div>
									</div>
									<div>
										<Label>Reported By</Label>
										<p className='font-medium'>
											{exitData.patientExit.reportedByUser.firstName}{' '}
											{exitData.patientExit.reportedByUser.lastName}
										</p>
									</div>
									<div>
										<Label>Verification Status</Label>
										<div className='mt-1'>
											{getVerificationBadge(
												!!exitData.patientExit.verifiedBy,
												exitData.patientExit.verificationDate
											)}
										</div>
									</div>
								</div>

								{exitData.patientExit.exitNotes && (
									<div>
										<Label>Exit Notes</Label>
										<p className='mt-1 text-gray-700'>
											{exitData.patientExit.exitNotes}
										</p>
									</div>
								)}
							</TabsContent>

							<TabsContent
								value='death'
								className='space-y-4'
							>
								{exitData.patientExit.deathDetails ? (
									<div className='space-y-4'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div>
												<Label>Date of Death</Label>
												<p className='font-medium'>
													{new Date(
														exitData.patientExit.deathDetails.dateOfDeath
													).toLocaleDateString()}
												</p>
											</div>
											<div>
												<Label>Time of Death</Label>
												<p className='font-medium'>
													{exitData.patientExit.deathDetails.timeOfDeath ||
														'Not specified'}
												</p>
											</div>
											<div>
												<Label>Place of Death</Label>
												<p className='font-medium'>
													{exitData.patientExit.deathDetails.placeOfDeath}
												</p>
											</div>
											<div>
												<Label>Primary Cause</Label>
												<p className='font-medium'>
													{
														exitData.patientExit.deathDetails
															.primaryCauseOfDeath
													}
												</p>
											</div>
										</div>

										<div className='flex space-x-4'>
											<div className='flex items-center space-x-2'>
												<Checkbox
													checked={
														exitData.patientExit.deathDetails.isCKDRelated
													}
													disabled
												/>
												<Label>CKD Related</Label>
											</div>
											<div className='flex items-center space-x-2'>
												<Checkbox
													checked={
														exitData.patientExit.deathDetails.isCardiovascular
													}
													disabled
												/>
												<Label>Cardiovascular</Label>
											</div>
											<div className='flex items-center space-x-2'>
												<Checkbox
													checked={
														exitData.patientExit.deathDetails.isInfectionRelated
													}
													disabled
												/>
												<Label>Infection Related</Label>
											</div>
										</div>

										{exitData.patientExit.deathDetails.clinicalNotes && (
											<div>
												<Label>Clinical Notes</Label>
												<p className='mt-1 text-gray-700'>
													{exitData.patientExit.deathDetails.clinicalNotes}
												</p>
											</div>
										)}
									</div>
								) : (
									<div className='text-center py-8 text-gray-500'>
										<AlertCircle className='w-12 h-12 mx-auto mb-4 text-gray-300' />
										<p>No death details available for this exit record.</p>
									</div>
								)}
							</TabsContent>

							<TabsContent
								value='ltfu'
								className='space-y-4'
							>
								{exitData.patientExit.lossToFollowUpDetails ? (
									<div className='space-y-4'>
										<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
											<div>
												<Label>Last Contact Date</Label>
												<p className='font-medium'>
													{new Date(
														exitData.patientExit.lossToFollowUpDetails.lastContactDate
													).toLocaleDateString()}
												</p>
											</div>
											<div>
												<Label>Duration of Loss</Label>
												<p className='font-medium'>
													{
														exitData.patientExit.lossToFollowUpDetails
															.durationOfLoss
													}{' '}
													days
												</p>
											</div>
											<div>
												<Label>Final Classification</Label>
												<p className='font-medium'>
													{
														exitData.patientExit.lossToFollowUpDetails
															.finalClassification
													}
												</p>
											</div>
										</div>

										<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
											<div className='text-center p-3 border rounded-lg'>
												<Phone className='w-6 h-6 mx-auto mb-2 text-blue-600' />
												<p className='text-sm font-medium'>Phone Calls</p>
												<p className='text-lg font-bold'>
													{
														exitData.patientExit.lossToFollowUpDetails
															.phoneCallAttempts
													}
												</p>
											</div>
											<div className='text-center p-3 border rounded-lg'>
												<Mail className='w-6 h-6 mx-auto mb-2 text-green-600' />
												<p className='text-sm font-medium'>SMS/Email</p>
												<p className='text-lg font-bold'>
													{exitData.patientExit.lossToFollowUpDetails
														.smsAttempts +
														exitData.patientExit.lossToFollowUpDetails
															.emailAttempts}
												</p>
											</div>
											<div className='text-center p-3 border rounded-lg'>
												<Home className='w-6 h-6 mx-auto mb-2 text-purple-600' />
												<p className='text-sm font-medium'>Home Visits</p>
												<p className='text-lg font-bold'>
													{
														exitData.patientExit.lossToFollowUpDetails
															.homeVisitAttempts
													}
												</p>
											</div>
											<div className='text-center p-3 border rounded-lg'>
												<FileText className='w-6 h-6 mx-auto mb-2 text-orange-600' />
												<p className='text-sm font-medium'>Letters</p>
												<p className='text-lg font-bold'>
													{
														exitData.patientExit.lossToFollowUpDetails
															.letterAttempts
													}
												</p>
											</div>
										</div>

										{exitData.patientExit.lossToFollowUpDetails
											.clinicalNotes && (
											<div>
												<Label>Clinical Notes</Label>
												<p className='mt-1 text-gray-700'>
													{
														exitData.patientExit.lossToFollowUpDetails
															.clinicalNotes
													}
												</p>
											</div>
										)}
									</div>
								) : (
									<div className='text-center py-8 text-gray-500'>
										<AlertCircle className='w-12 h-12 mx-auto mb-4 text-gray-300' />
										<p>
											No loss to follow-up details available for this exit
											record.
										</p>
									</div>
								)}
							</TabsContent>

							<TabsContent
								value='transplant'
								className='space-y-4'
							>
								{exitData.patientExit.transplantDetails ? (
									<div className='space-y-4'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div>
												<Label>Transplant Date</Label>
												<p className='font-medium'>
													{new Date(
														exitData.patientExit.transplantDetails.transplantDate
													).toLocaleDateString()}
												</p>
											</div>
											<div>
												<Label>Donor Type</Label>
												<p className='font-medium'>
													{exitData.patientExit.transplantDetails.donorType}
												</p>
											</div>
											<div>
												<Label>Transplant Center</Label>
												<p className='font-medium'>
													{
														exitData.patientExit.transplantDetails
															.transplantCenter
													}
												</p>
											</div>
											<div>
												<Label>Graft Function</Label>
												<p className='font-medium'>
													{
														exitData.patientExit.transplantDetails
															.immediateGraftFunction
													}
												</p>
											</div>
										</div>

										<div className='flex space-x-4'>
											<div className='flex items-center space-x-2'>
												<Checkbox
													checked={
														exitData.patientExit.transplantDetails
															.preTransplantDialysis
													}
													disabled
												/>
												<Label>Pre-transplant Dialysis</Label>
											</div>
											<div className='flex items-center space-x-2'>
												<Checkbox
													checked={
														exitData.patientExit.transplantDetails
															.preemptiveTransplant
													}
													disabled
												/>
												<Label>Preemptive Transplant</Label>
											</div>
											<div className='flex items-center space-x-2'>
												<Checkbox
													checked={
														exitData.patientExit.transplantDetails
															.dataTransferCompleted
													}
													disabled
												/>
												<Label>Data Transfer Completed</Label>
											</div>
										</div>

										{exitData.patientExit.transplantDetails.transplantNotes && (
											<div>
												<Label>Transplant Notes</Label>
												<p className='mt-1 text-gray-700'>
													{
														exitData.patientExit.transplantDetails
															.transplantNotes
													}
												</p>
											</div>
										)}
									</div>
								) : (
									<div className='text-center py-8 text-gray-500'>
										<AlertCircle className='w-12 h-12 mx-auto mb-4 text-gray-300' />
										<p>No transplant details available for this exit record.</p>
									</div>
								)}
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			)}

			{/* Exit Form */}
			{showExitForm && (
				<form
					onSubmit={handleExitSubmit}
					className='space-y-6'
				>
					{/* Basic Exit Information */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center space-x-2'>
								<Calendar className='w-5 h-5' />
								<span>Exit Information</span>
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='exitDate'>Exit Date *</Label>
									<Input
										id='exitDate'
										type='date'
										value={exitFormData.exitDate}
										onChange={(e) =>
											handleInputChange('exitDate', e.target.value)
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor='exitCause'>Exit Cause *</Label>
									<Select
										value={exitFormData.exitCause}
										onValueChange={(value) =>
											handleInputChange('exitCause', value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select exit cause' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='DEATH'>Death of Patient</SelectItem>
											<SelectItem value='LOSS_TO_FOLLOWUP'>
												Loss to Follow-up ({'>'}1 year)
											</SelectItem>
											<SelectItem value='KIDNEY_TRANSPLANT'>
												Kidney Transplant Achieved
											</SelectItem>
											<SelectItem value='TRANSFER_TO_ADULT_CARE'>
												Transfer to Adult Care
											</SelectItem>
											<SelectItem value='FAMILY_RELOCATION'>
												Family Relocation
											</SelectItem>
											<SelectItem value='IMPROVED_CONDITION'>
												Improved Condition
											</SelectItem>
											<SelectItem value='OTHER'>Other</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div>
								<Label htmlFor='exitNotes'>Exit Notes</Label>
								<Textarea
									id='exitNotes'
									value={exitFormData.exitNotes}
									onChange={(e) =>
										handleInputChange('exitNotes', e.target.value)
									}
									placeholder='Additional notes about the exit...'
									rows={3}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Death Details */}
					{exitFormData.exitCause === 'DEATH' && (
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center space-x-2'>
									<Heart className='w-5 h-5' />
									<span>Death Details</span>
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='dateOfDeath'>Date of Death *</Label>
										<Input
											id='dateOfDeath'
											type='date'
											value={exitFormData.deathDetails.dateOfDeath}
											onChange={(e) =>
												handleNestedInputChange(
													'deathDetails',
													'dateOfDeath',
													e.target.value
												)
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor='timeOfDeath'>Time of Death</Label>
										<Input
											id='timeOfDeath'
											type='time'
											value={exitFormData.deathDetails.timeOfDeath}
											onChange={(e) =>
												handleNestedInputChange(
													'deathDetails',
													'timeOfDeath',
													e.target.value
												)
											}
										/>
									</div>
									<div>
										<Label htmlFor='placeOfDeath'>Place of Death</Label>
										<Select
											value={exitFormData.deathDetails.placeOfDeath}
											onValueChange={(value) =>
												handleNestedInputChange(
													'deathDetails',
													'placeOfDeath',
													value
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder='Select place of death' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='HOME'>Home</SelectItem>
												<SelectItem value='HOSPITAL'>Hospital</SelectItem>
												<SelectItem value='ICU'>ICU</SelectItem>
												<SelectItem value='EMERGENCY_DEPARTMENT'>
													Emergency Department
												</SelectItem>
												<SelectItem value='HOSPICE'>Hospice</SelectItem>
												<SelectItem value='NURSING_HOME'>
													Nursing Home
												</SelectItem>
												<SelectItem value='OTHER'>Other</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label htmlFor='primaryCauseOfDeath'>
											Primary Cause of Death
										</Label>
										<Select
											value={exitFormData.deathDetails.primaryCauseOfDeath}
											onValueChange={(value) =>
												handleNestedInputChange(
													'deathDetails',
													'primaryCauseOfDeath',
													value
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder='Select primary cause' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='CARDIOVASCULAR'>
													Cardiovascular
												</SelectItem>
												<SelectItem value='INFECTION'>Infection</SelectItem>
												<SelectItem value='MALIGNANCY'>Malignancy</SelectItem>
												<SelectItem value='ACCIDENT_TRAUMA'>
													Accident/Trauma
												</SelectItem>
												<SelectItem value='RESPIRATORY_FAILURE'>
													Respiratory Failure
												</SelectItem>
												<SelectItem value='LIVER_FAILURE'>
													Liver Failure
												</SelectItem>
												<SelectItem value='NEUROLOGICAL'>
													Neurological
												</SelectItem>
												<SelectItem value='METABOLIC'>Metabolic</SelectItem>
												<SelectItem value='UNKNOWN'>Unknown</SelectItem>
												<SelectItem value='OTHER'>Other</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className='flex space-x-4'>
									<div className='flex items-center space-x-2'>
										<Checkbox
											checked={exitFormData.deathDetails.isCKDRelated}
											onCheckedChange={(checked) =>
												handleNestedInputChange(
													'deathDetails',
													'isCKDRelated',
													checked
												)
											}
										/>
										<Label>CKD Related Death</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<Checkbox
											checked={exitFormData.deathDetails.isCardiovascular}
											onCheckedChange={(checked) =>
												handleNestedInputChange(
													'deathDetails',
													'isCardiovascular',
													checked
												)
											}
										/>
										<Label>Cardiovascular Death</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<Checkbox
											checked={exitFormData.deathDetails.isInfectionRelated}
											onCheckedChange={(checked) =>
												handleNestedInputChange(
													'deathDetails',
													'isInfectionRelated',
													checked
												)
											}
										/>
										<Label>Infection Related</Label>
									</div>
								</div>

								<div>
									<Label htmlFor='clinicalNotes'>Clinical Notes</Label>
									<Textarea
										id='clinicalNotes'
										value={exitFormData.deathDetails.clinicalNotes}
										onChange={(e) =>
											handleNestedInputChange(
												'deathDetails',
												'clinicalNotes',
												e.target.value
											)
										}
										placeholder='Clinical details about the death...'
										rows={4}
									/>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Loss to Follow-up Details */}
					{exitFormData.exitCause === 'LOSS_TO_FOLLOWUP' && (
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center space-x-2'>
									<AlertTriangle className='w-5 h-5' />
									<span>Loss to Follow-up Details</span>
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='lastContactDate'>Last Contact Date *</Label>
										<Input
											id='lastContactDate'
											type='date'
											value={exitFormData.lossToFollowUpDetails.lastContactDate}
											onChange={(e) =>
												handleNestedInputChange(
													'lossToFollowUpDetails',
													'lastContactDate',
													e.target.value
												)
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor='lastVisitDate'>Last Visit Date *</Label>
										<Input
											id='lastVisitDate'
											type='date'
											value={exitFormData.lossToFollowUpDetails.lastVisitDate}
											onChange={(e) =>
												handleNestedInputChange(
													'lossToFollowUpDetails',
													'lastVisitDate',
													e.target.value
												)
											}
											required
										/>
									</div>
								</div>

								<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
									<div>
										<Label htmlFor='phoneCallAttempts'>
											Phone Call Attempts
										</Label>
										<Input
											id='phoneCallAttempts'
											type='number'
											value={
												exitFormData.lossToFollowUpDetails.phoneCallAttempts
											}
											onChange={(e) =>
												handleNestedInputChange(
													'lossToFollowUpDetails',
													'phoneCallAttempts',
													parseInt(e.target.value) || 0
												)
											}
										/>
									</div>
									<div>
										<Label htmlFor='smsAttempts'>SMS Attempts</Label>
										<Input
											id='smsAttempts'
											type='number'
											value={exitFormData.lossToFollowUpDetails.smsAttempts}
											onChange={(e) =>
												handleNestedInputChange(
													'lossToFollowUpDetails',
													'smsAttempts',
													parseInt(e.target.value) || 0
												)
											}
										/>
									</div>
									<div>
										<Label htmlFor='homeVisitAttempts'>
											Home Visit Attempts
										</Label>
										<Input
											id='homeVisitAttempts'
											type='number'
											value={
												exitFormData.lossToFollowUpDetails.homeVisitAttempts
											}
											onChange={(e) =>
												handleNestedInputChange(
													'lossToFollowUpDetails',
													'homeVisitAttempts',
													parseInt(e.target.value) || 0
												)
											}
										/>
									</div>
									<div>
										<Label htmlFor='letterAttempts'>Letter Attempts</Label>
										<Input
											id='letterAttempts'
											type='number'
											value={exitFormData.lossToFollowUpDetails.letterAttempts}
											onChange={(e) =>
												handleNestedInputChange(
													'lossToFollowUpDetails',
													'letterAttempts',
													parseInt(e.target.value) || 0
												)
											}
										/>
									</div>
								</div>

								<div>
									<Label htmlFor='finalClassification'>
										Final Classification
									</Label>
									<Select
										value={
											exitFormData.lossToFollowUpDetails.finalClassification
										}
										onValueChange={(value) =>
											handleNestedInputChange(
												'lossToFollowUpDetails',
												'finalClassification',
												value
											)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select final classification' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='TEMPORARY_LOSS'>
												Temporary Loss
											</SelectItem>
											<SelectItem value='PERMANENT_LOSS'>
												Permanent Loss
											</SelectItem>
											<SelectItem value='TRANSFERRED_CARE'>
												Transferred Care
											</SelectItem>
											<SelectItem value='DECEASED_UNCONFIRMED'>
												Deceased (Unconfirmed)
											</SelectItem>
											<SelectItem value='IMPROVED_DISCHARGED'>
												Improved/Discharged
											</SelectItem>
											<SelectItem value='UNKNOWN'>Unknown</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor='clinicalNotes'>Clinical Notes</Label>
									<Textarea
										id='clinicalNotes'
										value={exitFormData.lossToFollowUpDetails.clinicalNotes}
										onChange={(e) =>
											handleNestedInputChange(
												'lossToFollowUpDetails',
												'clinicalNotes',
												e.target.value
											)
										}
										placeholder='Details about loss to follow-up and prevention efforts...'
										rows={4}
									/>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Transplant Details */}
					{exitFormData.exitCause === 'KIDNEY_TRANSPLANT' && (
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center space-x-2'>
									<Activity className='w-5 h-5' />
									<span>Transplant Details</span>
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='transplantDate'>Transplant Date *</Label>
										<Input
											id='transplantDate'
											type='date'
											value={exitFormData.transplantDetails.transplantDate}
											onChange={(e) =>
												handleNestedInputChange(
													'transplantDetails',
													'transplantDate',
													e.target.value
												)
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor='donorType'>Donor Type</Label>
										<Select
											value={exitFormData.transplantDetails.donorType}
											onValueChange={(value) =>
												handleNestedInputChange(
													'transplantDetails',
													'donorType',
													value
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder='Select donor type' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='LIVING_RELATED'>
													Living Related
												</SelectItem>
												<SelectItem value='LIVING_UNRELATED'>
													Living Unrelated
												</SelectItem>
												<SelectItem value='DECEASED'>Deceased</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label htmlFor='transplantCenter'>
											Transplant Center *
										</Label>
										<Input
											id='transplantCenter'
											value={exitFormData.transplantDetails.transplantCenter}
											onChange={(e) =>
												handleNestedInputChange(
													'transplantDetails',
													'transplantCenter',
													e.target.value
												)
											}
											placeholder='Transplant center name'
											required
										/>
									</div>
									<div>
										<Label htmlFor='immediateGraftFunction'>
											Graft Function
										</Label>
										<Select
											value={
												exitFormData.transplantDetails.immediateGraftFunction
											}
											onValueChange={(value) =>
												handleNestedInputChange(
													'transplantDetails',
													'immediateGraftFunction',
													value
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder='Select graft function' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='IMMEDIATE_FUNCTION'>
													Immediate Function
												</SelectItem>
												<SelectItem value='SLOW_GRAFT_FUNCTION'>
													Slow Graft Function
												</SelectItem>
												<SelectItem value='DELAYED_GRAFT_FUNCTION'>
													Delayed Graft Function
												</SelectItem>
												<SelectItem value='PRIMARY_NON_FUNCTION'>
													Primary Non-Function
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className='flex space-x-4'>
									<div className='flex items-center space-x-2'>
										<Checkbox
											checked={
												exitFormData.transplantDetails.preTransplantDialysis
											}
											onCheckedChange={(checked) =>
												handleNestedInputChange(
													'transplantDetails',
													'preTransplantDialysis',
													checked
												)
											}
										/>
										<Label>Pre-transplant Dialysis</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<Checkbox
											checked={
												exitFormData.transplantDetails.preemptiveTransplant
											}
											onCheckedChange={(checked) =>
												handleNestedInputChange(
													'transplantDetails',
													'preemptiveTransplant',
													checked
												)
											}
										/>
										<Label>Preemptive Transplant</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<Checkbox
											checked={
												exitFormData.transplantDetails.dataTransferCompleted
											}
											onCheckedChange={(checked) =>
												handleNestedInputChange(
													'transplantDetails',
													'dataTransferCompleted',
													checked
												)
											}
										/>
										<Label>Data Transfer Completed</Label>
									</div>
								</div>

								<div>
									<Label htmlFor='transplantNotes'>Transplant Notes</Label>
									<Textarea
										id='transplantNotes'
										value={exitFormData.transplantDetails.transplantNotes}
										onChange={(e) =>
											handleNestedInputChange(
												'transplantDetails',
												'transplantNotes',
												e.target.value
											)
										}
										placeholder='Details about the transplant procedure and outcomes...'
										rows={4}
									/>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Submit Button */}
					<div className='flex justify-end space-x-4'>
						<Button
							type='button'
							variant='outline'
							onClick={() => setShowExitForm(false)}
						>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={isSubmitting}
						>
							<Save className='w-4 h-4 mr-2' />
							{isSubmitting ? 'Creating Exit Record...' : 'Create Exit Record'}
						</Button>
					</div>
				</form>
			)}
		</div>
	);
};

export default ExitManagement;
