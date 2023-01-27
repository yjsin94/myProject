import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import createEmotionCache from 'src/util/createEmotionCache'
import { CssVarsProvider } from '@mui/joy/styles'
import { lightTheme, darkTheme } from '/styles/themeIndex'
import Layout from 'src/components/Layouts/Layout'
import 'styles/globals.css'

// ** login check
import { AuthGetToken } from 'src/context/AuthFunction'
import { MobxLoginFunction } from 'src/context/MobxFunction'
import useMobxSettings from 'src/context/settings'

const clientSideEmotionCache = createEmotionCache()

const MyApp = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const [activeTheme, setActiveTheme] = useState(lightTheme) // 살제 themeCode에 의해서 테마 선택
  const [themeCode, setThemeCode] = useState('light') // 사람이 바꾸는 토글

  useEffect(() => {
    if (themeCode === 'light') setActiveTheme(lightTheme)
    else if (themeCode === 'dark') setActiveTheme(darkTheme)
  }, [themeCode])

  const mobxSetting = useMobxSettings()

  /* login check */
  useEffect(() => {
    const loginCheck = async () => {
      const { email, uid, name } = await AuthGetToken()
      if (email !== undefined && email !== '') {
        MobxLoginFunction(mobxSetting, email, uid, name)
      }
    }
    loginCheck()
  }, [])

  return (
    <>
      <Head>
        <title>안녕하세요</title>
        <meta name='description' content='환영합니다.' />
        <meta name='keywords' content='키워드를, 입력해, 주면, 됨' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <CacheProvider value={emotionCache}>
        <CssVarsProvider theme={activeTheme}>
          <ThemeProvider theme={activeTheme}>
            <Layout themeCode={themeCode} setThemeCode={setThemeCode}>
              <CssBaseline />
              <Component {...pageProps} themeCode={themeCode} setThemeCode={setThemeCode} />
            </Layout>
          </ThemeProvider>
        </CssVarsProvider>
      </CacheProvider>
    </>
  )
}

export default MyApp
