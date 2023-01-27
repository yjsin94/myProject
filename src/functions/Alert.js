import * as React from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export const BasicAlert = ({ title }) => {
  return (
    <Alert severity='error'>
      <AlertTitle>Error</AlertTitle>
      {title}
    </Alert>
  )
}

export const SuccessAlert = ({ title }) => {
  return (
    <Alert severity='success'>
      <AlertTitle>Success</AlertTitle>
      {title}
    </Alert>
  )
}

export const WarningAlert = ({ title }) => {
  return (
    <Alert severity='warning'>
      <AlertTitle>Warning</AlertTitle>
      {title}
    </Alert>
  )
}

export const InfoAlert = ({ title }) => {
  return (
    <Alert severity='info'>
      <AlertTitle>Info</AlertTitle>
      {title}
    </Alert>
  )
}
