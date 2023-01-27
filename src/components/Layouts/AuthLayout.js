import * as React from 'react'
import styled from '@emotion/styled'
// *** Mui import
import { Box, Card, CardContent } from '@mui/material'

const AuthWrap = styled.div(({ theme }) => ({
  width: '100%',
  marginTop: '-66px',
  paddingTop: '66px',
  minHeight: 'calc(100vh - 50px - 64px)',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.background.main
}))

const AuthCard = styled(Card)(({ theme }) => ({
  width: '400px',
  backgroundColor: theme.palette.card.main,
  margin: '3rem auto'
}))

export default function AuthLayout({ children }) {
  return (
    <AuthWrap>
      <AuthCard>
        <CardContent>{children}</CardContent>
      </AuthCard>
    </AuthWrap>
  )
}
