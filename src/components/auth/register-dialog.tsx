import React from 'react'
import InstituteRegisterDialog from './institute-register-dialog'

interface RegisterDialogProps {
  children: React.ReactNode
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({ children }) => {
  return (
    <InstituteRegisterDialog>
      {children}
    </InstituteRegisterDialog>
  )
}

export default RegisterDialog
