import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'

// ** MUI Components
import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

// ** firebase import
import { onAuthStateChanged, signOut } from 'firebase/auth'
import auth from 'src/firebase/auth'
import MyMenuNav from './MyMenuNav'

// ** login function
import useSettings from 'src/context/settings'
import { observer } from 'mobx-react-lite'

const Menu = styled.div(({ theme }) => ({
  '&.active': {
    color: theme.palette.fontColor.active
  },
  fontWeight: 'bold',
  minWidth: '5rem',
  fontSize: '16px',
  color: theme.palette.fontColor.main,
  padding: '.5rem 1rem',
  cursor: 'pointer'
}))

const Navbar = observer(({ themeCode, setThemeCode }) => {
  const router = useRouter()
  const mobxSetting = useSettings()

  return (
    <div className='flex justify-between items-center w-full'>
      <div className='flex'>
        <Link href='/home'>
          <Menu className={`${router.pathname.startsWith('/home') ? 'active' : ''}`}>Home</Menu>
        </Link>
        <Link href='/main'>
          <Menu className={`${router.pathname.startsWith('/main') ? 'active' : ''}`}>Main</Menu>
        </Link>
        <Link href='/gallery'>
          <Menu className={`${router.pathname.startsWith('/gallery') ? 'active' : ''}`}>갤러리</Menu>
        </Link>
        <Link href='/noticeboard'>
          <Menu className={`${router.pathname.startsWith('/noticeboard') ? 'active' : ''}`}>게시판</Menu>
        </Link>
        <Link href='/'>
          <Menu className={`${router.pathname.startsWith('/noticeboard') ? 'active' : ''}`}>소개</Menu>
        </Link>
        <Link href='/'>
          <Menu className={`${router.pathname.startsWith('/noticeboard') ? 'active' : ''}`}>contect</Menu>
        </Link>
      </div>
      {mobxSetting.login ? (
        <div className='flex'>
          <MyMenuNav />
          <div className='mx-2'>
            <IconButton
              onClick={() => {
                if (themeCode === 'light') setThemeCode('dark')
                else if (themeCode === 'dark') setThemeCode('light')
              }}
            >
              {themeCode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </div>
        </div>
      ) : (
        <div className='flex justify-end w-full'>
          <Link href='/auth/login' className=''>
            <Menu className={`${router.pathname.startsWith('/auth/login') ? 'active' : ''}`}>로그인</Menu>
          </Link>
          <Link href='/auth/signUp' className=''>
            <Menu className={`${router.pathname.startsWith('/auth/signUp') ? 'active' : ''}`}>회원가입</Menu>
          </Link>
          <IconButton
            onClick={() => {
              if (themeCode === 'light') setThemeCode('dark')
              else if (themeCode === 'dark') setThemeCode('light')
            }}
          >
            {themeCode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>
      )}
    </div>
  )
})

export default Navbar
