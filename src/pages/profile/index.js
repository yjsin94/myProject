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

/* ????????? ?????? */
const schema = yup.object().shape({
  name: yup
    .string()
    .required('????????? ????????? ?????????')
    .min(2, '?????? 2?????? ?????? ????????? ?????????')
    .matches(
      /^[???-???a-zA-Z][^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/,
      '????????? ???????????? ?????? ????????? ???????????? ????????????'
    ),
  nickName: yup
    .string()
    .required('????????? ????????? ?????????')
    .min(2, '?????? 2?????? ?????? ????????? ?????????')
    .matches(
      /^[???-???a-zA-Z][^!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?\s]*$/,
      '????????? ???????????? ?????? ????????? ???????????? ????????????'
    ),
  country: yup.string().required('????????? ????????? ?????????'),
  area: yup.string().required('????????? ????????? ?????????'),
  date: yup.string().required('??????????????? ????????? ?????????'),
  phone: yup.number().required('??????????????? ????????? ?????????')
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

  /* mobx ????????? ???????????? */
  const mobxSetting = useMobxSettings()
  const { email, uid, name, infoChange } = mobxSetting

  /* ????????? ?????? */
  useEffect(() => {
    // alert('mobxSetting.login : ' + mobxSetting.login + ' login open:' + loginOpen)
    if (!mobxSetting.login) {
      setLoginOpen(true)
    } else {
      setLoginOpen(false)
    }
  }, [mobxSetting.login])

  /* ????????? ?????? */
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

  /* ????????? ????????? ???????????? */
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
          console.log('????????? ???????????? ????????????!')
        }
      } catch (e) {
        // console.log('error: ', e)
      }
    }

    if (email) {
      getData()
    }
  }, [email, infoChange])

  /* ????????? ????????? ?????? */
  const ImageOnChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = async () => {
        const file = files[0]

        if (file.size > 800000) {
          toast.error('800K ????????? ????????? ????????? ????????? ???????????????.')
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

    // 1. document ??????
    const values = { name, nickName, country, area, phone, date }
    const userPath = `users/${email}`
    const docRef = doc(db, userPath)
    await setDoc(docRef, values, { merge: true })

    // 2. mobx ??????
    // mobxSetting.name = name
    MobxProfileEditFunction(mobxSetting, name)

    // 3. token ??????
    AuthNameChange(email, uid, name)

    toast.info('????????? ?????????????????????!')
  }

  /* ????????? ????????? ?????? */
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

  /* ????????? ?????? */
  const handleClickOpen = () => {
    setOpen(true)
  }

  /* ????????? ?????? */
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <PageLayout>
      <p className='text-3xl py-5 font-bold '>?????????</p>
      <ProfileLayout>
        <p className='text-2xl'>
          <span className='font-bold'>{name}</span> ????????? ??????
        </p>
        <div className='flex justify-between items-center mt-2 mb-10'>
          <p className='text-xl'>{email}</p>
          <Link href='/'>
            <a>???????????? ??????</a>
          </Link>
        </div>

        {/* ????????? ????????? */}
        <Box>
          <p>????????? ?????????</p>
          <Box sx={{ my: 5, textAlign: 'center' }}>
            {renderUserAvatar()}
            <p className='mt-5'>?????? ?????? 800K????????? .png .jpg .jpeg ????????? ????????? ???????????????.</p>
            <Button color='error' variant='outlined' onClick={handleClickOpen} sx={{ fontSize: 16, mt: 5 }}>
              ????????? ??????
            </Button>
          </Box>
        </Box>
        <Form className='w-full' onSubmit={handleSubmit(handleEditSubmit)}>
          <FlexBox>
            {/* ?????? */}
            <FormControl error sx={{ width: '100%', my: 2 }}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label='??????'
                    value={name}
                    variant='standard'
                    placeholder='????????? ????????? ?????????'
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

            {/* ?????? */}
            <FormControl sx={{ width: '100%', my: 2 }}>
              <Controller
                name='nickName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label='??????'
                    variant='standard'
                    placeholder='????????? ????????? ?????????'
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
            {/* ?????? */}
            <FormControl fullWidth variant='standard' sx={{ width: '100%', my: 2 }}>
              <InputLabel error={Boolean(errors.country)}>??????</InputLabel>
              <Controller
                name='country'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select label='??????' {...field} error={Boolean(errors.country)}>
                    <MenuItem value={'??????'}>??????</MenuItem>
                    <MenuItem value={'??????1'}>??????1</MenuItem>
                  </Select>
                )}
              />
              {errors.country && (
                <FormHelperText sx={{ color: 'error.main', ml: 2 }}>{errors.country.message}</FormHelperText>
              )}
            </FormControl>
            {/* ?????? */}
            <FormControl fullWidth variant='standard' sx={{ width: '100%', my: 2 }}>
              <InputLabel error={Boolean(errors.area)}>??????</InputLabel>
              <Controller
                name='area'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select name='area' label='??????' {...field} error={Boolean(errors.area)}>
                    <MenuItem value={'??????1'}>??????1</MenuItem>
                    <MenuItem value={'??????2'}>??????2</MenuItem>
                  </Select>
                )}
              />
              {errors.area && (
                <FormHelperText sx={{ color: 'error.main', ml: 2 }}>{errors.area.message}</FormHelperText>
              )}
            </FormControl>
          </FlexBox>

          <FlexBox>
            {/* ???????????? */}
            <FormControl fullWidth sx={{ width: '100%', my: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name='date'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <MobileDatePicker
                      label='????????????'
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

            {/* ???????????? */}
            <FormControl sx={{ width: '100%', my: 2 }}>
              <Controller
                name='phone'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label='????????????'
                    variant='standard'
                    placeholder='??????????????? ????????? ?????????'
                    {...field}
                    error={Boolean(errors.phone)}
                  />
                )}
              />
              {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
            </FormControl>
          </FlexBox>
          {/* ???????????? ?????? */}
          <div className='w-full flex flex-col items-center justify-center'>
            <Button variant='contained' type='submit' sx={{ width: '200px', fontSize: '18px', mt: 5 }}>
              ?????? ??????
            </Button>
          </div>
        </Form>
      </ProfileLayout>

      {/* ????????? ?????? ??????????????? */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>????????? ????????? ??????</DialogTitle>
        <DialogContent>????????? ???????????? ?????????????????????????</DialogContent>
        <DialogActions>
          <Button color='error' variant='contained' onClick={handleProfileImageDelete}>
            ??????
          </Button>
          <Button color='lightGray' variant='contained' onClick={handleClose}>
            ??????
          </Button>
        </DialogActions>
      </Dialog>

      {/* ????????? ?????? ??????????????? */}
      <LoginQ loginOpen={loginOpen} />

      {/* Toast ?????? */}
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
