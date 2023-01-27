import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'

// ** Third Party Imports
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** firebase auth
import auth from 'src/firebase/auth'
import db from 'src/firebase/db'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

// ** login function
import { AuthLogin } from 'src/context/AuthFunction'
import { MobxLoginFunction } from 'src/context/MobxFunction'

// ** register functions
import useMobxSettings from 'src/context/settings'

/* sns 로그인 폼 컴포넌트 */
const SnsForm = () => {
  const router = useRouter()
  const mobxSetting = useMobxSettings()
  const createdAtDate = new Date()

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
      .then(res => {
        const credential = GoogleAuthProvider.credentialFromResult(res)
        const token = credential.accessToken

        const user = res.user
        const { email, uid, displayName, photoURL, phoneNumber } = user

        /* 가입 되어 있는 이메일인지 체크 */
        const emailCheck = async () => {
          const docRef = doc(db, 'users', email)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            /* 가입되어 있는 이메일이면 login 체크 후 메인 페이지로 이동 */

            /* localStorage 저장 */
            AuthLogin(email, uid, displayName)

            /* mobx 저장 */
            MobxLoginFunction(mobxSetting, email, uid, displayName)

            router.push('/home')
          } else {
            /* 등록되어 있는 이메일이 없다면 회원 정보 저장 후 메인 페이지로 이동 */

            const createValue = {
              uid: uid,
              email,
              name: displayName,
              nickName: '',
              country: '',
              area: '',
              date: '',
              createdAt: createdAtDate.toLocaleString('ko-kr'),
              phone: phoneNumber || '',
              photo: photoURL,
              photoURL,
              sns: 'google'
            }

            await setDoc(doc(db, 'users', email), createValue)

            /* localStorage 저장 */
            AuthLogin(email, uid, displayName)

            /* mobx 저장 */
            MobxLoginFunction(mobxSetting, email, uid, displayName)

            router.push('/home')
          }
        }

        emailCheck()
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message

        toast.error(error)
      })
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* <Link href='/' passHref>
        <IconButton component='a' onClick={e => e.preventDefault()}>
          <Facebook sx={{ color: '#497ce2' }} />
        </IconButton>
      </Link>
      <Link href='/' passHref>
        <IconButton component='a' onClick={e => e.preventDefault()}>
          <Twitter sx={{ color: '#1da1f2' }} />
        </IconButton>
      </Link>
      <Link href='/' passHref>
        <IconButton component='a' onClick={e => e.preventDefault()}>
          <Github sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]) }} />
        </IconButton>
      </Link> */}
      <div>
        <IconButton component='a' onClick={handleGoogleLogin}>
          <Google sx={{ color: '#db4437' }} />
        </IconButton>
      </div>

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
    </Box>
  )
}

export default SnsForm
