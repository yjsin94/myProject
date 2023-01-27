import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from '@emotion/styled'
import PageLayout from 'src/components/Layouts/PageLayout'
import LoginQ from 'src/components/Dialog/LoginError'
import ProfileForm from 'src/pages/profile/ProfileForm'

// ** MUI Components
import { useTheme } from '@mui/material/styles'
import { Box, Button } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'

// ** Icons Imports
// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** firebase import
import db from 'src/firebase/db'
import storage from 'src/firebase/storage'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// ** login function
import { AuthNameChange } from 'src/context/AuthFunction'
import { MobxProfileEditFunction } from 'src/context/MobxFunction'
import useMobxSettings from 'src/context/settings'
import { observer } from 'mobx-react-lite'

const ProfileLayout = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '2rem',
  backgroundColor: theme.palette.card.main
}))

/* 유효성 검사 */
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
  phone: yup.number().required('전화번호를 입력해 주세요')
})

const MainPgae = observer(() => {
  const [loginOpen, setLoginOpen] = useState(false)
  const [userPhoto, setUserPhoto] = useState()
  const [username, setUsername] = useState()

  /* hook */
  const createdAtDate = new Date()
  const theme = useTheme()
  const router = useRouter()

  /* mobx 상태값 가져오기 */
  const mobxSetting = useMobxSettings()
  const { email, uid, name, infoChange } = mobxSetting

  /* 로그인 체크 */
  useEffect(() => {
    // alert('mobxSetting.login : ' + mobxSetting.login + ' login open:' + loginOpen)
    if (!mobxSetting.login) {
      setLoginOpen(true)
    } else {
      setLoginOpen(false)
    }
  }, [mobxSetting.login])

  /* 프로필 이미지 가져오기 */
  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(db, `users/${email}`)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setUserPhoto(docSnap.data().photoURL)
        } else {
          console.log('사용자 이미지가 없습니다!')
        }
      } catch (e) {
        // console.log('error: ', e)
      }
    }

    if (email) {
      getData()
    }
  }, [email, infoChange])

  useEffect(() => {
    setUsername(name)
  }, [name])

  /* 프로필 이미지 변경 */
  const ImageOnChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = async () => {
        const file = files[0]

        if (file.size > 800000) {
          toast.error('800K 이하인 이미지 파일만 업로드 가능합니다.')
          return
        }

        const storagePath = `users/${email}/profile.jpg`
        const storageRef = ref(storage, storagePath)

        const upload = await uploadBytes(storageRef, file)
        if (upload) {
          const url = await getDownloadURL(ref(storage, storagePath))
          console.log('Uploaded a blob or file! : ', url)
          const userPath = `users/${email}`
          const values = { photo: url, photoURL: url }
          const docRef = doc(db, userPath)
          setDoc(docRef, values, { merge: true })
          mobxSetting.infoChange = !mobxSetting.infoChange
          setUserPhoto(url)
        }
      }
      reader.readAsDataURL(files[0])
    }
  }

  const handleEditName = () => {
    /**
     * 1. document 변경
     * 2. mobx 변경
     * 3. token 변경
     */

    // 1
    const userPath = `users/${email}`
    const values = { name: username }
    const docRef = doc(db, userPath)
    setDoc(docRef, values, { merge: true })

    // 2
    MobxProfileEditFunction(mobxSetting, username)

    // 3
    AuthNameChange(email, uid, username)

    toast.info('수정이 완료되었습니다!')
  }

  /* 프로필 이미지 삭제 */
  const handleProfileImageDelete = () => {
    const userPath = `users/${email}`
    const values = { photo: '', photoURL: '' }
    const docRef = doc(db, userPath)
    setDoc(docRef, values, { merge: true })

    mobxSetting.infoChange = !mobxSetting.infoChange
    setUserPhoto()
  }

  /* 유효성 검사 */
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      uid: uid,
      email: email,
      username: name,
      nickName: '',
      country: '',
      area: '',
      date: '',
      phone: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  return (
    <PageLayout>
      <p className='text-3xl py-5 font-bold '>프로필</p>

      <ProfileLayout>
        <ProfileForm
          control={control}
          errors={errors}
          userPhoto={userPhoto}
          name={name}
          email={email}
          ImageOnChange={ImageOnChange}
          handleProfileImageDelete={handleProfileImageDelete}
          handleEditName={handleEditName}
        />
      </ProfileLayout>

      {/* 로그인 확인 다이얼로그 */}
      <LoginQ loginOpen={loginOpen} />
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
    </PageLayout>
  )
})

export default MainPgae
