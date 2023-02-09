import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from '@emotion/styled'
import PageLayout from 'src/components/Layouts/PageLayout'
import LoginQ from 'src/components/Dialog/LoginError'

// ** MUI Components
import { useTheme } from '@mui/material/styles'
import { Box, Badge, Avatar, Button, IconButton } from '@mui/material'
import { FormControl, FormHelperText, Input, InputLabel, InputAdornment, TextField } from '@mui/material'
import { MenuItem, Select } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

// ** Icons Imports
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded'
// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** firebase import
import auth from 'src/firebase/auth'
import db from 'src/firebase/db'
import storage from 'src/firebase/storage'
import { doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// ** login function
import { AuthNameChange } from 'src/context/AuthFunction'
import { MobxProfileEditFunction } from 'src/context/MobxFunction'
import useMobxSettings from 'src/context/settings'
import { observer } from 'mobx-react-lite'
import { data } from 'autoprefixer'

const ProfileLayout = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '2rem',
  backgroundColor: theme.palette.card.main
}))

const Form = styled.form(({ theme }) => ({
  color: theme.palette.fontColor.main
}))

const FlexBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: 20,
  justifyContent: 'space-between',
  alignItems: 'center',
  color: theme.palette.fontColor.main,

  '&>div': {
    margin: '0 2rem'
  },
  '&>div:nth-of-type(1)': {
    marginLeft: 0
  },
  '&>div:nth-of-type(2)': {
    marginRight: 0
  }
}))

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 130,
  height: 130
}))

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  border: `3px solid ${theme.palette.border.white}`,
  backgroundColor: theme.palette.background.dark0
}))

/* 유효성 검사 */
const schema = yup.object().shape({
  name: yup
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
  country: yup.string().required('국가를 선택해 주세요'),
  area: yup.string().required('지역을 선택해 주세요'),
  date: yup.string().required('생년월일을 입력해 주세요'),
  phone: yup.number().required('전화번호를 입력해 주세요')
})

const MainPgae = observer(() => {
  const [loginOpen, setLoginOpen] = useState(false)
  const [userPhoto, setUserPhoto] = useState()
  const [userData, setUserData] = useState()
  const [open, setOpen] = useState(false)

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

  /* 유효성 검사 */
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    // defaultValues: {
    //   name: '',
    //   nickName: '',
    //   country: '',
    //   area: '',
    //   date: '',
    //   phone: ''
    // },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  /* 프로필 이미지 가져오기 */
  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(db, `users/${email}`)
        const docSnap = await getDoc(docRef)

        const docs = docSnap.data()
        setUserData(docs)

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

  // const [formValues, setFormValues] = useState({
  //   name: name,
  //   nickName: '',
  //   country: '',
  //   area: '',
  //   date: '',
  //   phone: ''
  // })

  // const handleTextFieldChange = event => {
  //   console.log(event.target.name + ' ' + event.target.value)
  //   const { name, value } = event.target

  //   setUsername({
  //     [name]: value
  //   })
  // }

  const handleEditSubmit = async ({ userData }) => {
    const { name, nickName, country, area, phone, date } = userData

    // 1. document 변경
    const values = { name, nickName, country, area, phone, date }
    const userPath = `users/${email}`
    const docRef = doc(db, userPath)
    await setDoc(docRef, values, { merge: true })

    // 2. mobx 변경
    // mobxSetting.name = name
    MobxProfileEditFunction(mobxSetting, name)

    // 3. token 변경
    AuthNameChange(email, uid, name)

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

    setOpen(false)
  }

  const renderUserAvatar = () => {
    if (userPhoto) {
      return (
        <Badge
          overlap='circular'
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <SmallAvatar>
              <IconButton color='primary' component='label' variant='contained'>
                <input hidden type='file' accept='image/png, image/jpeg' onChange={ImageOnChange} />
                <CameraAltRoundedIcon />
              </IconButton>
            </SmallAvatar>
          }
        >
          <LargeAvatar alt='Travis Howard' src={userPhoto} />
        </Badge>
      )
    } else {
      return (
        <Badge
          overlap='circular'
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <SmallAvatar>
              <IconButton color='primary' component='label' variant='contained'>
                <input hidden type='file' accept='image/png, image/jpeg' onChange={ImageOnChange} />
                <CameraAltRoundedIcon />
              </IconButton>
            </SmallAvatar>
          }
        >
          <LargeAvatar alt='Travis Howard' sx={{ border: '1.5px solid #fff' }} />
        </Badge>
      )
    }
  }

  /* 모달창 열기 */
  const handleClickOpen = () => {
    setOpen(true)
  }

  /* 모달창 닫기 */
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <PageLayout>
      <p className='text-3xl py-5 font-bold '>프로필</p>
      <ProfileLayout>
        <p className='text-2xl'>
          <span className='font-bold'>{name}</span> 프로필 관리
        </p>
        <div className='flex justify-between items-center mt-2 mb-10'>
          <p className='text-xl'>{email}</p>
          <Link href='/'>
            <a>비밀번호 변경</a>
          </Link>
        </div>

        {/* 프로필 이미지 */}
        <Box>
          <p>프로필 이미지</p>
          <Box sx={{ my: 5, textAlign: 'center' }}>
            {renderUserAvatar()}
            <p className='mt-5'>최대 크기 800K이하의 .png .jpg .jpeg 파일만 업로드 가능합니다.</p>
            <Button color='error' variant='outlined' onClick={handleClickOpen} sx={{ fontSize: 16, mt: 5 }}>
              이미지 삭제
            </Button>
          </Box>
        </Box>
        <Form className='w-full' onSubmit={handleSubmit(handleEditSubmit)}>
          <FlexBox>
            {/* 이름 */}
            <FormControl error sx={{ width: '100%', my: 2 }}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label='이름'
                    value={name}
                    variant='standard'
                    placeholder='이름을 입력해 주세요'
                    {...field}
                    onChange={e => {
                      e.target.value
                    }}
                    error={Boolean(errors.name)}
                  />
                )}
              />
              {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name}</FormHelperText>}
            </FormControl>

            {/* 별명 */}
            <FormControl sx={{ width: '100%', my: 2 }}>
              <Controller
                name='nickName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label='별명'
                    variant='standard'
                    placeholder='별명을 입력해 주세요'
                    {...field}
                    error={Boolean(errors.nickName)}
                  />
                )}
              />
              {errors.nickName && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.nickName.message}</FormHelperText>
              )}
            </FormControl>
          </FlexBox>

          <FlexBox>
            {/* 국가 */}
            <FormControl fullWidth variant='standard' sx={{ width: '100%', my: 2 }}>
              <InputLabel error={Boolean(errors.country)}>국가</InputLabel>
              <Controller
                name='country'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select label='국가' {...field} error={Boolean(errors.country)}>
                    <MenuItem value={'한국'}>한국</MenuItem>
                    <MenuItem value={'국가1'}>국가1</MenuItem>
                  </Select>
                )}
              />
              {errors.country && (
                <FormHelperText sx={{ color: 'error.main', ml: 2 }}>{errors.country.message}</FormHelperText>
              )}
            </FormControl>
            {/* 지역 */}
            <FormControl fullWidth variant='standard' sx={{ width: '100%', my: 2 }}>
              <InputLabel error={Boolean(errors.area)}>지역</InputLabel>
              <Controller
                name='area'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select name='area' label='지역' {...field} error={Boolean(errors.area)}>
                    <MenuItem value={'지역1'}>지역1</MenuItem>
                    <MenuItem value={'지역2'}>지역2</MenuItem>
                  </Select>
                )}
              />
              {errors.area && (
                <FormHelperText sx={{ color: 'error.main', ml: 2 }}>{errors.area.message}</FormHelperText>
              )}
            </FormControl>
          </FlexBox>

          <FlexBox>
            {/* 생년월일 */}
            <FormControl fullWidth sx={{ width: '100%', my: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name='date'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <MobileDatePicker
                      label='생년월일'
                      inputFormat='YYYY. MM. DD'
                      value={value}
                      onChange={onChange}
                      renderInput={params => (
                        <TextField
                          variant='standard'
                          {...params}
                          value={value}
                          onChange={onChange}
                          error={Boolean(errors.area)}
                        />
                      )}
                    />
                  )}
                />
                {errors.date && (
                  <FormHelperText sx={{ color: 'error.main', ml: 2 }}>{errors.date.message}</FormHelperText>
                )}
              </LocalizationProvider>
            </FormControl>

            {/* 전화번호 */}
            <FormControl sx={{ width: '100%', my: 2 }}>
              <Controller
                name='phone'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label='전화번호'
                    variant='standard'
                    placeholder='전화번호를 입력해 주세요'
                    {...field}
                    error={Boolean(errors.phone)}
                  />
                )}
              />
              {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
            </FormControl>
          </FlexBox>
          {/* 수정완료 버튼 */}
          <div className='w-full flex flex-col items-center justify-center'>
            <Button variant='contained' type='submit' sx={{ width: '200px', fontSize: '18px', mt: 5 }}>
              수정 완료
            </Button>
          </div>
        </Form>
      </ProfileLayout>

      {/* 이미지 삭제 다이얼로그 */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>프로필 이미지 삭제</DialogTitle>
        <DialogContent>프로필 이미지를 삭제하시겠습니까?</DialogContent>
        <DialogActions>
          <Button color='error' variant='contained' onClick={handleProfileImageDelete}>
            삭제
          </Button>
          <Button color='lightGray' variant='contained' onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </Dialog>

      {/* 로그인 확인 다이얼로그 */}
      <LoginQ loginOpen={loginOpen} />

      {/* Toast 알림 */}
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
