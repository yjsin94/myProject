import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import AuthLayout from 'src/components/Layouts/AuthLayout'
import LoginForm from 'src/pages/auth/login/LoginForm'
import SnsForm from 'src/pages/auth/login/SnsForm'

// ** MUI Components
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** login function
import { AuthLogin } from 'src/context/AuthFunction'
import { MobxLoginFunction } from 'src/context/MobxFunction'
import useMobxSettings from 'src/context/settings'

// *** firebase import
import auth from 'src/firebase/auth'
import db from 'src/firebase/db'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'

const schema = yup.object().shape({
  email: yup.string().email('올바른 이메일 형식이 아닙니다').required('이메일을 입력해 주세요'),
  password: yup
    .string()
    .required('비밀번호를 입력해 주세요')
    .min(6, '최소 6 글자 이상 입력해 주세요')
    .max(16, '16글자 이하로 입력해 주세요')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[^\s]*$/,
      '공백을 제외한고 알파벳, 숫자, 특수문자를 모두 포함해야 합니다'
    )
})

const LoginPage = () => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  /* Hook */
  const router = useRouter()
  const mobxSetting = useMobxSettings()

  /* react-hook-form */
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  /* 일반 로그인 */
  const authSubmit = data => {
    const { email, password } = data

    /* 로그인 체크 */
    signInWithEmailAndPassword(auth, email, password)
      .then(res => {
        /* 로그인됬을때 */
        const user = res.user

        /* 이메일 인증 체크 */
        if (!user.emailVerified) {
          setMessage('이메일 인증이 필요합니다.')

          return
        } else {
          /* 이름 데이터 가져오기 */
          const getData = async () => {
            try {
              const q = query(collection(db, 'users'), where('uid', '==', user.uid))
              const querySnapshot = await getDocs(q)

              querySnapshot.forEach(doc => {
                const name = doc.data().name

                /* LocalStorage 에 저장 */
                AuthLogin(user.email, user.uid, name)

                /* Mobx 에 저장 */
                MobxLoginFunction(mobxSetting, user.email, user.uid, name)
              })
            } catch (error) {
              console.log('error : ', error)
            }
          }
          getData()

          setMessage('로그인 성공')
          router.push('/home')
        }
      })
      .catch(error => {
        const errorCode = error.code
        // const errorMessage = error.message
        // console.log(errorMessage)
        setOpen(true)
        switch (errorCode) {
          case 'auth/invalid-email':
            setMessage('잘못된 이메일 입니다.')
            break
          case 'auth/user-disabled':
            setMessage('유저가 허용되지 않았습니다.')
            break
          case 'auth/user-not-found':
            setMessage('가입한 내역이 없습니다.')
            break
          case 'auth/wrong-password':
            setMessage('암호가 맞지 않습니다.')
            break
          default:
            setMessage(errorCode)
        }
      })
  }

  /* 모달창 닫기 */
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <AuthLayout>
      <Box sx={{ mb: 6 }}>
        <p>안녕하세요 👋🏻</p>
        <p>등록된 계정으로 로그인 후 사용해주세요.</p>
      </Box>
      {/* 로그인 폼 */}
      <LoginForm
        control={control}
        errors={errors}
        setError={setError}
        authSubmit={authSubmit}
        handleSubmit={handleSubmit}
      />
      {/* 구글 로그인 */}
      <SnsForm />
      {/* 로그인 다이얼로그 */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>로그인 에러</DialogTitle>
        <DialogContent>
          {message ? <DialogContentText>{message}</DialogContentText> : '로그인에 실패하였습니다.'}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </AuthLayout>
  )
}

export default LoginPage
