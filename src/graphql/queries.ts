import { gql } from '@apollo/client'

export const GET_ME = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      role
      instituteId
      institute {
        id
        centerName
        approvalStatus
        approvedAt
        rejectionReason
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_INSTITUTES = gql`
  query GetInstitutes {
    institutes {
      id
      centerName
      address
      contactInformation
      headOfDepartment
      approvalStatus
      status
      createdAt
      users {
        id
        email
        firstName
        lastName
        role
        status
      }
    }
  }
`

export const GET_PENDING_INSTITUTES = gql`
  query GetPendingInstitutes {
    pendingInstitutes {
      id
      centerName
      address
      contactInformation
      headOfDepartment
      approvalStatus
      createdAt
      users {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`

export const GET_APPROVED_INSTITUTES = gql`
  query GetApprovedInstitutes {
    approvedInstitutes {
      id
      centerName
      address
      approvalStatus
      approvedAt
      approvedBy
      users {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`

export const GET_INSTITUTE = gql`
  query GetInstitute($id: ID!) {
    institute(id: $id) {
      id
      centerName
      address
      contactInformation
      headOfDepartment
      headOfDepartmentContact
      coInvestigatorName
      coInvestigatorContact
      isPublicSector
      numberOfBeds
      numberOfFaculty
      approvalStatus
      status
      createdAt
      updatedAt
      users {
        id
        email
        firstName
        lastName
        role
        status
        createdAt
        updatedAt
      }
    }
  }
`

export const GET_SECURE_DOWNLOAD = gql`
  query GetSecureDownload($consentId: String!) {
    generateSignedUrl(consentId: $consentId) {
      signedUrl
      expiresIn
      fileName
      fileSize
      mimeType
    }
  }
`

// Follow-up Management Queries
export const GET_PATIENT_FOLLOWUPS = gql`
  query GetPatientFollowUps($patientId: String!) {
    patientFollowUps(patientId: $patientId) {
      id
      patientId
      followUpDate
      visitNumber
      
      # Socioeconomic Changes
      hasSocioeconomicChanges
      hasResidenceChange
      hasContactChange
      hasIncomeChange
      hasEducationStatusChange
      hasPaymentStatusChange
      
      # Clinical Updates
      currentCKDStage
      isDialysisInitiated
      dialysisNotInitiatedReason
      newSymptomsSinceLastVisit
      hasHypertension
      hasGrowthFailure
      hasAnemia
      hasBoneMineralDisease
      hasMetabolicAcidosis
      otherComorbidities
      hasHospitalizationSinceLastVisit
      hospitalizationDetails
      
      # Physical Examination
      currentHeight
      currentHeightSDS
      currentWeight
      currentBMI
      currentBMISDS
      currentSystolicBP
      currentDiastolicBP
      currentSBPPercentile
      currentDBPPercentile
      currentBPClassification
      currentTannerStage
      
      # Laboratory Investigations
      followUpSerumCreatinine
      followUpSerumUrea
      followUpEGFR
      followUpProteinuriaDipstick
      followUpHemoglobin
      followUpSodium
      followUpPotassium
      followUpChloride
      followUpBicarbonate
      followUpCalcium
      followUpPhosphorus
      followUpVitaminD
      followUpIronLevel
      followUpFerritin
      followUpPTH
      followUpALP
      followUpUricAcid
      followUpOtherImaging
      followUpGeneticTests
      
      # Medication Adherence
      overallMedicationAdherence
      adherenceNonComplianceReason
      clinicalNotes
      nextFollowUpDate
      
      # Relations
      patient {
        patientId
        firstName
        lastName
      }
      followUpMedications {
        id
        genericName
        frequency
        routeOfAdministration
        meanDosePerDay
        startDate
        stopDate
        isNewMedication
        isDiscontinued
        adherence
        adherenceNotes
      }
    }
  }
`

export const GET_PATIENT_FOLLOWUP = gql`
  query GetPatientFollowUp($id: ID!) {
    patientFollowUp(id: $id) {
      id
      patientId
      followUpDate
      visitNumber
      
      # Socioeconomic Changes
      hasSocioeconomicChanges
      hasResidenceChange
      hasContactChange
      hasIncomeChange
      hasEducationStatusChange
      hasPaymentStatusChange
      
      # Updated socioeconomic fields
      newFamilyIncome
      newPaymentMode
      newHasHealthInsurance
      newInsuranceType
      newInsuranceProvider
      newMotherEducationLevel
      newFatherEducationLevel
      newPrimaryCaregiver
      newEarningMembersCount
      newPrimaryEarnerOccupation
      newDependentsCount
      newGuardianName
      newGuardianPhone
      newGuardianEmail
      newGuardianRelationship
      
      # Clinical Updates
      currentCKDStage
      isDialysisInitiated
      dialysisNotInitiatedReason
      newSymptomsSinceLastVisit
      hasHypertension
      hasGrowthFailure
      hasAnemia
      hasBoneMineralDisease
      hasMetabolicAcidosis
      otherComorbidities
      hasHospitalizationSinceLastVisit
      hospitalizationDetails
      
      # Physical Examination
      currentHeight
      currentHeightSDS
      currentWeight
      currentBMI
      currentBMISDS
      currentSystolicBP
      currentDiastolicBP
      currentSBPPercentile
      currentDBPPercentile
      currentBPClassification
      currentTannerStage
      
      # Laboratory Investigations
      followUpSerumCreatinine
      followUpSerumUrea
      followUpEGFR
      followUpProteinuriaDipstick
      followUpHemoglobin
      followUpSodium
      followUpPotassium
      followUpChloride
      followUpBicarbonate
      followUpCalcium
      followUpPhosphorus
      followUpVitaminD
      followUpIronLevel
      followUpFerritin
      followUpPTH
      followUpALP
      followUpUricAcid
      followUpOtherImaging
      followUpGeneticTests
      
      # Medication Adherence
      overallMedicationAdherence
      adherenceNonComplianceReason
      clinicalNotes
      nextFollowUpDate
      
      # Relations
      patient {
        patientId
        firstName
        lastName
      }
      followUpMedications {
        id
        genericName
        frequency
        routeOfAdministration
        meanDosePerDay
        startDate
        stopDate
        isNewMedication
        isDiscontinued
        adherence
        adherenceNotes
      }
    }
  }
`

export const GET_FOLLOWUP_MEDICATIONS = gql`
  query GetFollowUpMedications($followUpId: String!) {
    followUpMedications(followUpId: $followUpId) {
      id
      followUpId
      genericName
      frequency
      routeOfAdministration
      meanDosePerDay
      startDate
      stopDate
      isNewMedication
      isDiscontinued
      adherence
      adherenceNotes
    }
  }
`

// Dialysis Management Queries
export const GET_PATIENT_DIALYSIS_RECORDS = gql`
  query GetPatientDialysisRecords($patientId: String!) {
    patientDialysisRecords(patientId: $patientId) {
      id
      patientId
      dialysisStartDate
      isActive
      
      # Initial Dialysis Setup
      initialDialysisModality
      
      # HD Access Information
      hdAccessType
      hdAccessCreationDate
      hdAccessComplicationNotes
      
      # PD Access Information
      pdCatheterType
      pdCatheterInsertionDate
      pdCatheterComplicationNotes
      
      # Initial HD Prescription
      hdFrequencyPerWeek
      hdSessionDurationHours
      hdBloodFlowRate
      hdDialysateFlowRate
      hdUltrafiltrationGoal
      hdDialyzerType
      hdAnticoagulation
      hdVascularAccess
      
      # Initial PD Prescription
      pdModalityType
      pdFillVolume
      pdDwellTime
      pdExchangesPerDay
      pdGlucoseConcentration
      pdAdditionalMedications
      pdCyclerSettings
      
      # Initial Complications
      initialComplications
      initialComplicationNotes
      
      # Payment Information
      paymentMethod
      monthlyCostSelfPay
      insuranceCoverage
      
      clinicalNotes
      
      # Relations
      patient {
        patientId
        firstName
        lastName
      }
    }
  }
`

export const GET_PATIENT_DIALYSIS = gql`
  query GetPatientDialysis($id: ID!) {
    patientDialysis(id: $id) {
      id
      patientId
      dialysisStartDate
      isActive
      
      # Initial Dialysis Setup
      initialDialysisModality
      
      # HD Access Information
      hdAccessType
      hdAccessCreationDate
      hdAccessComplicationNotes
      
      # PD Access Information
      pdCatheterType
      pdCatheterInsertionDate
      pdCatheterComplicationNotes
      
      # Initial HD Prescription
      hdFrequencyPerWeek
      hdSessionDurationHours
      hdBloodFlowRate
      hdDialysateFlowRate
      hdUltrafiltrationGoal
      hdDialyzerType
      hdAnticoagulation
      hdVascularAccess
      
      # Initial PD Prescription
      pdModalityType
      pdFillVolume
      pdDwellTime
      pdExchangesPerDay
      pdGlucoseConcentration
      pdAdditionalMedications
      pdCyclerSettings
      
      # Initial Complications
      initialComplications
      initialComplicationNotes
      
      # Payment Information
      paymentMethod
      monthlyCostSelfPay
      insuranceCoverage
      
      clinicalNotes
      
      # Relations
      patient {
        patientId
        firstName
        lastName
      }
    }
  }
`

export const GET_DIALYSIS_FOLLOWUPS = gql`
  query GetDialysisFollowUps($dialysisId: String!) {
    dialysisFollowUps(dialysisId: $dialysisId) {
      id
      dialysisId
      followUpDate
      visitNumber
      
      # Current Modality with Change Detection
      currentModality
      hasModalityChange
      modalityChangeDate
      modalityChangeReason
      
      # HD Prescription Updates
      hdFrequencyPerWeek
      hdSessionDurationHours
      hdBloodFlowRate
      hdDialysateFlowRate
      hdUltrafiltrationGoal
      hdDialyzerType
      hdAnticoagulation
      hdVascularAccess
      hdKtV
      hdURR
      
      # PD Prescription Updates
      pdModalityType
      pdFillVolume
      pdDwellTime
      pdExchangesPerDay
      pdGlucoseConcentration
      pdAdditionalMedications
      pdCyclerSettings
      pdWeeklyKtV
      pdCreatinineClearance
      
      # Complications Since Last Visit
      newComplications
      complicationNotes
      
      # Access-Related Issues
      accessProblems
      accessProblemDescription
      accessInterventionsRequired
      accessInterventionDetails
      
      # Payment Updates
      currentPaymentMethod
      currentMonthlyCostSelfPay
      paymentMethodChanged
      
      # Laboratory Results
      preDialysisWeight
      postDialysisWeight
      weightGain
      bloodPressurePreDialysis
      bloodPressurePostDialysis
      
      # Quality of Life Assessment
      functionalStatus
      qualityOfLifeScore
      
      clinicalNotes
      nextFollowUpDate
    }
  }
`

export const GET_DIALYSIS_FOLLOWUP = gql`
  query GetDialysisFollowUp($id: ID!) {
    dialysisFollowUp(id: $id) {
      id
      dialysisId
      followUpDate
      visitNumber
      
      # Current Modality with Change Detection
      currentModality
      hasModalityChange
      modalityChangeDate
      modalityChangeReason
      
      # HD Prescription Updates
      hdFrequencyPerWeek
      hdSessionDurationHours
      hdBloodFlowRate
      hdDialysateFlowRate
      hdUltrafiltrationGoal
      hdDialyzerType
      hdAnticoagulation
      hdVascularAccess
      hdKtV
      hdURR
      
      # PD Prescription Updates
      pdModalityType
      pdFillVolume
      pdDwellTime
      pdExchangesPerDay
      pdGlucoseConcentration
      pdAdditionalMedications
      pdCyclerSettings
      pdWeeklyKtV
      pdCreatinineClearance
      
      # Complications Since Last Visit
      newComplications
      complicationNotes
      
      # Access-Related Issues
      accessProblems
      accessProblemDescription
      accessInterventionsRequired
      accessInterventionDetails
      
      # Payment Updates
      currentPaymentMethod
      currentMonthlyCostSelfPay
      paymentMethodChanged
      
      # Laboratory Results
      preDialysisWeight
      postDialysisWeight
      weightGain
      bloodPressurePreDialysis
      bloodPressurePostDialysis
      
      # Quality of Life Assessment
      functionalStatus
      qualityOfLifeScore
      
      clinicalNotes
      nextFollowUpDate
      
      # Relations
      dialysis {
        patientId
        initialDialysisModality
      }
    }
  }
`

// Dashboard and Calculator Queries
export const GET_CKD_STAGE_DISTRIBUTION = gql`
  query GetCKDStageDistribution($filters: DashboardFilterInput) {
    ckdStageDistribution(filters: $filters) {
      stage
      count
      percentage
    }
  }
`

export const GET_DEMOGRAPHIC_SUMMARY = gql`
  query GetDemographicSummary($filters: DashboardFilterInput) {
    demographicSummary(filters: $filters) {
      totalPatients
      genderDistribution {
        gender
        count
        percentage
      }
      ageGroups {
        ageGroup
        count
        percentage
      }
      regionalDistribution {
        region
        count
        percentage
      }
    }
  }
`

export const GET_DIALYSIS_PREVALENCE = gql`
  query GetDialysisPrevalence($filters: DashboardFilterInput) {
    dialysisPrevalence(filters: $filters) {
      totalCKDPatients
      dialysisPatients
      dialysisPercentage
      modalityDistribution {
        modality
        count
        percentage
      }
      accessDistribution {
        accessType
        count
        percentage
      }
    }
  }
`

export const GET_COMORBIDITY_ANALYSIS = gql`
  query GetComorbidityAnalysis($filters: DashboardFilterInput) {
    comorbidityAnalysis(filters: $filters) {
      hypertension {
        count
        percentage
      }
      anemia {
        count
        percentage
      }
      boneDiseaseCount {
        count
        percentage
      }
      growthFailure {
        count
        percentage
      }
      metabolicAcidosis {
        count
        percentage
      }
    }
  }
`

export const GET_GROWTH_TRENDS = gql`
  query GetGrowthTrends($filters: DashboardFilterInput) {
    growthTrends(filters: $filters) {
      heightZScoreDistribution {
        range
        count
        percentage
      }
      bmiZScoreDistribution {
        range
        count
        percentage
      }
      averageHeightZScore
      averageBMIZScore
    }
  }
`

export const GET_DATA_COMPLETENESS_REPORT = gql`
  query GetDataCompletenessReport($filters: DashboardFilterInput) {
    dataCompletenessReport(filters: $filters) {
      totalPatients
      overallCompleteness
      completenessMetrics {
        field
        completed
        percentage
        category
      }
    }
  }
`

export const CALCULATE_EGFR = gql`
  query CalculateEGFR($input: EGFRCalculatorInput!) {
    calculateEGFR(input: $input) {
      value
      unit
      interpretation
      category
      reference
    }
  }
`

export const CALCULATE_BMI_Z_SCORE = gql`
  query CalculateBMIZScore($input: BMIZScoreCalculatorInput!) {
    calculateBMIZScore(input: $input) {
      value
      unit
      interpretation
      category
      percentile
      zScore
      reference
    }
  }
`

export const CALCULATE_HEIGHT_Z_SCORE = gql`
  query CalculateHeightZScore($input: HeightZScoreCalculatorInput!) {
    calculateHeightZScore(input: $input) {
      value
      unit
      interpretation
      category
      percentile
      zScore
      reference
    }
  }
`

export const CALCULATE_BP_PERCENTILE = gql`
  query CalculateBPPercentile($input: BPPercentileCalculatorInput!) {
    calculateBPPercentile(input: $input) {
      value
      unit
      interpretation
      category
      reference
    }
  }
`

export const CALCULATE_DIALYSIS_KTV = gql`
  query CalculateDialysisKtV($input: DialysisKtVCalculatorInput!) {
    calculateDialysisKtV(input: $input) {
      value
      unit
      interpretation
      category
      reference
    }
  }
`

export const CALCULATE_URR = gql`
  query CalculateURR($input: URRCalculatorInput!) {
    calculateURR(input: $input) {
      value
      unit
      interpretation
      category
      reference
    }
  }
`

// Patient Exit Management Queries
export const GET_PATIENT_EXIT = gql`
  query GetPatientExit($patientId: String!) {
    patientExit(patientId: $patientId) {
      id
      patientId
      exitDate
      exitCause
      exitNotes
      reportedBy
      verifiedBy
      verificationDate
      verificationNotes
      createdAt
      updatedAt
      
      # Death details (if applicable)
      deathDetails {
        dateOfDeath
        timeOfDeath
        placeOfDeath
        hospitalName
        primaryCauseOfDeath
        secondaryCauseOfDeath
        immediateCareCause
        underlyingCause
        isCKDRelated
        ckdRelatedCause
        dialysisRelated
        dialysisComplication
        isCardiovascular
        cardiovascularCause
        isInfectionRelated
        infectionType
        infectionSite
        autopsyPerformed
        autopsyFindings
        deathCertificateNumber
        certifyingPhysician
        informedFamily
        familyContactDate
        familyContactPerson
        clinicalNotes
      }
      
      # Loss to follow-up details (if applicable)
      lossToFollowUpDetails {
        lastContactDate
        lastVisitDate
        durationOfLoss
        phoneCallAttempts
        phoneCallDates
        phoneCallOutcomes
        smsAttempts
        smsDates
        smsDeliveryStatus
        emailAttempts
        emailDates
        emailDeliveryStatus
        homeVisitAttempts
        homeVisitDates
        homeVisitOutcomes
        letterAttempts
        letterDates
        letterDeliveryStatus
        emergencyContactAttempts
        emergencyContactDates
        emergencyContactOutcomes
        suspectedReasons
        familyReportedReasons
        hasRelocated
        newLocation
        hasChangedContact
        financialConstraints
        transportationIssues
        improvedCondition
        seekingAlternativeCare
        alternativeCareProvider
        checklistCompletedBy
        checklistCompletionDate
        referredToSocialWorker
        socialWorkerNotes
        finalClassification
        clinicalNotes
      }
      
      # Transplant details (if applicable)
      transplantDetails {
        transplantDate
        transplantType
        donorType
        donorAge
        donorGender
        donorRelationship
        livingDonorName
        livingDonorContact
        donorWorkup
        donorWorkupDate
        donorCompatibility
        donorOrganizationName
        waitingListDuration
        waitingListRegistrationDate
        transplantCenter
        transplantCenterCity
        transplantCenterState
        surgeonName
        preTransplantEGFR
        preTransplantDialysis
        dialysisDuration
        preemptiveTransplant
        surgeryDuration
        coldIschemiaTime
        warmIschemiaTime
        inductionTherapy
        maintenanceImmunosuppression
        immediateGraftFunction
        delayedGraftFunction
        acuteRejectionEpisodes
        surgicalComplications
        medicalComplications
        followUpCenter
        followUpPhysician
        followUpContact
        registryTransitionDate
        newRegistryName
        dataTransferCompleted
        transplantNotes
        familyEducationCompleted
      }
      
      # Relations
      patient {
        patientId
        firstName
        lastName
        dateOfBirth
        currentCKDStage
      }
      reportedByUser {
        firstName
        lastName
        role
      }
      verifiedByUser {
        firstName
        lastName
        role
      }
    }
  }
`

export const GET_PATIENT_EXITS = gql`
  query GetPatientExits($filters: PatientExitFilterInput) {
    patientExits(filters: $filters) {
      id
      patientId
      exitDate
      exitCause
      exitNotes
      reportedBy
      verifiedBy
      verificationDate
      createdAt
      
      # Patient information
      patient {
        patientId
        firstName
        lastName
        currentCKDStage
      }
      
      # Reporter information
      reportedByUser {
        firstName
        lastName
        role
      }
      
      # Verifier information
      verifiedByUser {
        firstName
        lastName
        role
      }
    }
  }
`
