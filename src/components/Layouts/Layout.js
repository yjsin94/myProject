import React, { useState } from 'react'
import styled from '@emotion/styled'
import Header from './Header'
import Footer from './Footer'

const LayoutWrap = styled.div(({ theme }) => ({
  width: '100%',
  minHeight: '100%',
  backgroundColor: theme.palette.background.main,

  '& > main': {
    paddingTop: '112px',
    minHeight: 'calc(100vh - 118px - 64px)'
  },
  '@media (max-width: 412px)': {
    height: 'calc(100vh - 118px - 64px)'
  }
}))

const Layout = ({ children, themeCode, setThemeCode }) => {
  return (
    <LayoutWrap>
      <Header themeCode={themeCode} setThemeCode={setThemeCode} />
      <main>{children}</main>
      <Footer />
    </LayoutWrap>
  )
}

export default Layout
