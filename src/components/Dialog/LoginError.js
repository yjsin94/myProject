import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from '@emotion/styled'

// ** MUI Components
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'

// ** Third Party Imports

// ** firebase import

/* 로그인 확인 다이얼로그 */
const LoginQ = ({ loginOpen }) => {
  const router = useRouter()

  return (
    <Dialog
      open={loginOpen}
      onClose={() => {
        router.push('/auth/login')
      }}
    >
      <DialogTitle>로그인 에러</DialogTitle>
      <DialogContent>로그인 후 사용이 가능합니다.</DialogContent>
      <DialogActions>
        <Link href='/auth/login'>
          <Button>로그인 페이지로 이동</Button>
        </Link>
      </DialogActions>
    </Dialog>
  )
}

export default LoginQ
