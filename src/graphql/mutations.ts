import { gql } from '@apollo/client'

export const REGISTER_INSTITUTE_WITH_ADMIN = gql`
  mutation RegisterInstituteWithAdmin($input: PublicRegistrationInput!) {
    registerInstituteWithAdmin(input: $input) {
      institute {
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
      }
      user {
        id
        email
        firstName
        lastName
        role
      }
      token
    }
  }
`

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        firstName
        lastName
        role
      }
      token
    }
  }
`

// User Management Mutations
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      firstName
      lastName
      role
      status
      instituteId
      createdAt
      updatedAt
    }
  }
`

export const DISABLE_USER = gql`
  mutation DisableUser($id: ID!) {
    disableUser(id: $id) {
      id
      email
      firstName
      lastName
      role
      status
      instituteId
    }
  }
`

export const ENABLE_USER = gql`
  mutation EnableUser($id: ID!) {
    enableUser(id: $id) {
      id
      email
      firstName
      lastName
      role
      status
      instituteId
    }
  }
`

export const REGISTER_USER_TO_INSTITUTE = gql`
  mutation RegisterUserToInstitute($input: UserRegistrationInput!) {
    registerUserToInstitute(input: $input) {
      user {
        id
        email
        firstName
        lastName
        role
        status
        instituteId
        createdAt
        updatedAt
      }
      token
    }
  }
`

// Institute Management Mutations
export const APPROVE_INSTITUTE = gql`
  mutation ApproveInstitute($id: ID!) {
    approveInstitute(id: $id) {
      id
      centerName
      approvalStatus
      approvedAt
      approvedBy
    }
  }
`

export const REJECT_INSTITUTE = gql`
  mutation RejectInstitute($id: ID!, $reason: String!) {
    rejectInstitute(id: $id, reason: $reason) {
      id
      centerName
      approvalStatus
      rejectionReason
      approvedAt
      approvedBy
    }
  }
`

export const SUSPEND_INSTITUTE = gql`
  mutation SuspendInstitute($id: ID!) {
    suspendInstitute(id: $id) {
      id
      centerName
      approvalStatus
      approvedAt
      approvedBy
    }
  }
`

export const DISABLE_INSTITUTE = gql`
  mutation DisableInstitute($id: ID!) {
    disableInstitute(id: $id) {
      id
      centerName
      status
      approvalStatus
      users {
        id
        email
        role
      }
    }
  }
`

export const ENABLE_INSTITUTE = gql`
  mutation EnableInstitute($id: ID!) {
    enableInstitute(id: $id) {
      id
      centerName
      status
      approvalStatus
      users {
        id
        email
        role
      }
    }
  }
`

// Patient Management Mutations
export const CREATE_PATIENT = gql`
  mutation CreatePatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      # Basic Demographics
      id
      patientId
      firstName
      lastName
      dateOfBirth
      gender
      email
      phone
      
      # Guardian Contact
      guardianName
      guardianPhone
      guardianEmail
      guardianRelationship
      
      # Socioeconomic
      motherEducationLevel
      fatherEducationLevel
      primaryCaregiver
      earningMembersCount
      primaryEarnerOccupation
      dependentsCount
      familyIncome
      paymentMode
      hasHealthInsurance
      insuranceType
      insuranceProvider
      insurancePolicyNumber
      otherPaymentDetails
      
      # Address
      address {
        line1
        line2
        city
        state
        country
        postalCode
      }
      
      # Consent Management
      consentStatusEnum
      consentType
      isVerbalConsent
      isWrittenConsent
      consentNotes
      assentRequired
      ethicsApprovalRequired
      
      # Clinical History
      ageAtDiagnosis
      primaryRenalDiagnosis
      currentCKDStage
      symptomDurationYears
      symptomDurationMonths
      diagnosisDurationYears
      diagnosisDurationMonths
      surgicalInterventions
      currentComplaints
      comorbidities
      
      # CKD Stage Logic
      isDialysisInitiated
      dialysisNotInitiatedReason
      isPreemptiveTransplantDiscussed
      isTransplantEvaluationInitiated
      transplantType
      
      # Physical Examination
      height
      heightSDS
      weight
      bmi
      bmiSDS
      systolicBP
      diastolicBP
      sbpPercentile
      dbpPercentile
      bpClassification
      growthPercentile
      tannerStage
      
      # Laboratory Investigations
      serumCreatinine
      serumUrea
      eGFR
      hemoglobin
      sodium
      potassium
      bicarbonate
      calcium
      phosphorus
      vitaminD
      proteinuriaDipstick
      ironLevel
      ferritin
      pth
      alp
      uricAcid
      
      # Imaging and Genetics
      otherImaging
      geneticTests
      
      # Medications
      medications {
        genericName
        frequency
        routeOfAdministration
        meanDosePerDay
        startDate
        stopDate
      }
      
      # Institute Association
      institute {
        centerName
        approvalStatus
      }
    }
  }
`

export const UPLOAD_CONSENT = gql`
  mutation UploadConsent($input: UploadConsentInput!, $file: Upload!) {
    uploadConsentDocument(input: $input, file: $file) {
      id
      fileName
      originalFileName
      documentType
      s3Key
      s3Url
      cloudFrontUrl
      fileSize
      mimeType
      consentStatus
      obtainedDate
      patient {
        patientId
        firstName
        lastName
      }
      uploadedBy {
        firstName
        lastName
        email
      }
    }
  }
`

// Follow-up Management Mutations
export const CREATE_PATIENT_FOLLOWUP = gql`
  mutation CreatePatientFollowUp($input: CreatePatientFollowUpInput!) {
    createPatientFollowUp(input: $input) {
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

export const UPDATE_PATIENT_FOLLOWUP = gql`
  mutation UpdatePatientFollowUp($id: ID!, $input: UpdatePatientFollowUpInput!) {
    updatePatientFollowUp(id: $id, input: $input) {
      id
      followUpDate
      visitNumber
      currentCKDStage
      followUpEGFR
      overallMedicationAdherence
      clinicalNotes
      nextFollowUpDate
    }
  }
`

export const DELETE_PATIENT_FOLLOWUP = gql`
  mutation DeletePatientFollowUp($id: ID!) {
    deletePatientFollowUp(id: $id)
  }
`

export const CREATE_FOLLOWUP_MEDICATION = gql`
  mutation CreateFollowUpMedication($input: CreateFollowUpMedicationInput!) {
    createFollowUpMedication(input: $input) {
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

export const UPDATE_FOLLOWUP_MEDICATION = gql`
  mutation UpdateFollowUpMedication($id: ID!, $input: UpdateFollowUpMedicationInput!) {
    updateFollowUpMedication(id: $id, input: $input) {
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
`

export const DELETE_FOLLOWUP_MEDICATION = gql`
  mutation DeleteFollowUpMedication($id: ID!) {
    deleteFollowUpMedication(id: $id)
  }
`

// Dialysis Management Mutations
export const CREATE_PATIENT_DIALYSIS = gql`
  mutation CreatePatientDialysis($input: CreatePatientDialysisInput!) {
    createPatientDialysis(input: $input) {
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

export const UPDATE_PATIENT_DIALYSIS = gql`
  mutation UpdatePatientDialysis($id: ID!, $input: UpdatePatientDialysisInput!) {
    updatePatientDialysis(id: $id, input: $input) {
      id
      dialysisStartDate
      isActive
      initialDialysisModality
      paymentMethod
      monthlyCostSelfPay
      clinicalNotes
    }
  }
`

export const DELETE_PATIENT_DIALYSIS = gql`
  mutation DeletePatientDialysis($id: ID!) {
    deletePatientDialysis(id: $id)
  }
`

export const CREATE_DIALYSIS_FOLLOWUP = gql`
  mutation CreateDialysisFollowUp($input: CreateDialysisFollowUpInput!) {
    createDialysisFollowUp(input: $input) {
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

export const UPDATE_DIALYSIS_FOLLOWUP = gql`
  mutation UpdateDialysisFollowUp($id: ID!, $input: UpdateDialysisFollowUpInput!) {
    updateDialysisFollowUp(id: $id, input: $input) {
      id
      followUpDate
      visitNumber
      currentModality
      hasModalityChange
      newComplications
      accessProblems
      functionalStatus
      qualityOfLifeScore
      clinicalNotes
      nextFollowUpDate
    }
  }
`

export const DELETE_DIALYSIS_FOLLOWUP = gql`
  mutation DeleteDialysisFollowUp($id: ID!) {
    deleteDialysisFollowUp(id: $id)
  }
`

// Dashboard and Calculator Mutations
export const REQUEST_DATA_EXPORT = gql`
  mutation RequestDataExport($input: DataExportRequestInput!) {
    requestDataExport(input: $input) {
      id
      exportType
      exportFormat
      fileName
      status
      createdAt
      expiresAt
    }
  }
`

export const SAVE_CALCULATOR_RESULT = gql`
  mutation SaveCalculatorResult($input: SaveCalculatorResultInput!) {
    saveCalculatorResult(input: $input) {
      id
      calculatorType
      result
      interpretation
      createdAt
    }
  }
`

// Patient Exit Management Mutations
export const CREATE_PATIENT_EXIT = gql`
  mutation CreatePatientExit($input: CreatePatientExitInput!) {
    createPatientExit(input: $input) {
      id
      patientId
      exitDate
      exitCause
      exitNotes
      reportedBy
      createdAt
      
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
      }
      reportedByUser {
        firstName
        lastName
      }
    }
  }
`

export const UPDATE_PATIENT_EXIT = gql`
  mutation UpdatePatientExit($id: ID!, $input: UpdatePatientExitInput!) {
    updatePatientExit(id: $id, input: $input) {
      id
      exitDate
      exitCause
      exitNotes
      updatedAt
    }
  }
`

export const VERIFY_PATIENT_EXIT = gql`
  mutation VerifyPatientExit($id: ID!, $verificationNotes: String) {
    verifyPatientExit(id: $id, verificationNotes: $verificationNotes) {
      id
      verifiedBy
      verificationDate
      verificationNotes
    }
  }
`

