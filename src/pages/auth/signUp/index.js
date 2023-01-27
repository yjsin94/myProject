import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from '@emotion/styled'
import AuthLayout from 'src/components/Layouts/AuthLayout'
import SignUpForm from 'src/pages/auth/signUp/SignUpForm'

// ** MUI Components
import { Box, IconButton, Button } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'

// ** Icons Imports
import CloseIcon from '@mui/icons-material/Close'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ToastContainer, toast, Slide } from 'react-toastify'

// ** firebase import
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import auth from 'src/firebase/auth'
import db from 'src/firebase/db'
import { doc, setDoc } from 'firebase/firestore'

/* 유효성 검사 설정 */
const schema = yup.object().shape({
  email: yup.string().email('올바른 이메일 형식이 아닙니다').required('이메일을 입력해 주세요'),
  username: yup
    .string()
    .required('이름을 입력해 주세요')
    .min(2, '최소 2글자 이상 입력해 주세요')
    .matches(
      /^[가-힣a-zA-Z][^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/,
      '이름에 특수문자 또는 숫자가 포함되어 있습니다'
    ),
  nickName: yup
    .string()
    .required('별명을 입력해 주세요')
    .min(2, '최소 2글자 이상 입력해 주세요')
    .matches(
      /^[가-힣a-zA-Z][^!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?\s]*$/,
      '이름에 특수문자 또는 숫자가 포함되어 있습니다'
    ),
  password: yup
    .string()
    .required('비밀번호를 입력해 주세요')
    .min(6, '최소 6 글자 이상 입력해 주세요')
    .max(16, '16글자 이하로 입력해 주세요')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[^\s]*$/,
      '공백을 제외한고 알파벳, 숫자, 특수문자를 모두 포함해야 합니다'
    ),
  passwordCheck: yup
    .string()
    .required('비밀번호를 한번더 입력해 주세요')
    .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다'),
  country: yup.string().required('국가를 선택해 주세요'),
  area: yup.string().required('지역을 선택해 주세요'),
  date: yup.string().required('생년월일을 입력해 주세요'),
  term: yup.boolean().oneOf([true], '약관에 동의해 주세요.')
})

/* 회원가입 페이지 */
const SignUpPage = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [message, setMessage] = useState('')

  /* Hook */
  const router = useRouter()
  const createdAtDate = new Date()

  function sleeper(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
  }

  /* 모달창 닫기 */
  const ModalClose = () => {
    setModalOpen(false)
  }

  /* react-hook-form */
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: 'bsyjsin94@gmail.com',
      username: '신예진',
      nickName: 'yjsin94',
      password: '0000a/',
      passwordCheck: '0000a/',
      country: '한국',
      area: '지역1',
      date: '19940803',
      term: false
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    const { email, username, nickName, password, country, area, date } = data
    // console.log(data)
    createUserWithEmailAndPassword(auth, email, password)
      .then(res => {
        const user = res.user
        sendEmailVerification(auth.currentUser)

        const createValue = {
          uid: user.uid,
          email: email,
          name: username,
          nickName: nickName,
          country: country,
          area: area,
          date: date,
          createdAt: createdAtDate.toLocaleString('ko-kr'),
          phone: '',
          photo: '',
          photoURL: '',
          sns: 'email'
        }

        const addData = async () => {
          try {
            // console.log(createValue)
            await setDoc(doc(db, 'users', `${email}`), createValue)

            const text = (
              <div>
                <p>가입하신 이메일로 인증메일이 발송되었습니다. 인증을 완료 후 서비스를 이용해주세요.</p>
              </div>
            )
            toast.info(text)

            sleeper(4500).then(() => {
              router.push('/auth/login')
            })
          } catch (e) {
            console.error('Error adding document: ', e)
          }
        }
        addData()
      })
      .catch(error => {
        const errorCode = error.code
        // const errorMessage = error.message
        // console.log(errorMessage)

        switch (errorCode) {
          case 'auth/email-already-in-use':
            toast.error('이미 사용중인 이메일 입니다.')
            break
          case 'auth/invalid-email':
            toast.error('이메일 형식이 올바르지 않습니다.')
            break
          case 'auth/operation-not-allowed':
            toast.error('가입이 허용되지 않습니다.')
            break
          case 'auth/weak-password':
            toast.error('패스워가 보안에 취약합니다. 최소 6자 이상입니다')
            break
          default:
            toast.error(errorCode)
        }
        sleeper(1000).then(() => {
          toast.error('이메일 가입에 실패하였습니다.')
        })
      })
  }

  return (
    <AuthLayout>
      <p className='text-3xl p-5 font-bold text-center'>회원가입</p>
      <Box sx={{ mb: 6 }}>
        <p>안녕하세요 👋🏻</p>
        <p>회원가입 후 사용해주세요.</p>
      </Box>
      {/* 회원가입 폼 */}
      <SignUpForm control={control} errors={errors} onSubmit={onSubmit} handleSubmit={handleSubmit} />
      {/* 로그인 하러 가기 */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <p>계정이 이미 있습니까?</p>
        <Link href='/auth/login' passHref>
          <Button>로그인 하기</Button>
        </Link>
      </Box>

      {/* 회원가입 다이얼로그 */}
      <Dialog open={modalOpen} onClose={ModalClose}>
        <DialogTitle>회원가입 에러</DialogTitle>
        <DialogContent>
          {message ? <DialogContentText>{message}</DialogContentText> : '회원가입에 실패하였습니다.'}
        </DialogContent>
        <DialogActions>
          <Button onClick={ModalClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer
        position='top-right'
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
        transition={Slide}
      />
    </AuthLayout>
  )
}

export default SignUpPage
