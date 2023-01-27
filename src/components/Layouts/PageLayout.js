import React from 'react'
import styled from '@emotion/styled'

const Page = styled.div(({ theme }) => ({
  maxWidth: '1440px',
  minHeight: 'calc(100vh - 118px - 58px)',
  margin: '0 auto',
  paddingLeft: 20,
  paddingRight: 20,
  paddingBottom: 50,

  '@media (max-width: 1024px)': {
    maxWidth: '100%',
    width: '100%'
  },

  '@media (max-width: 420px)': {
    paddingLeft: 10,
    paddingRight: 10
  }
}))

export default function PageLayout({ children }) {
  return <Page>{children}</Page>
}
