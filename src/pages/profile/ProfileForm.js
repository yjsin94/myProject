import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from '@emotion/styled'
// -- Mui import
import { Box, Badge, Avatar, Button, IconButton } from '@mui/material'
import { FormControl, FormHelperText, Input, InputLabel, InputAdornment, TextField } from '@mui/material'
import { MenuItem, Select } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// ** Mui icon
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded'
// ** Third Party Imports
import { Controller } from 'react-hook-form'

// ** firebase import
import auth from 'src/firebase/auth'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

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

/* 
  프로필 폼 렌더
*/

const ProfileForm = props => {
  const {
    handleSubmit,
    control,
    errors,
    userPhoto,
    name,
    email,
    ImageOnChange,
    handleEditName,
    handleProfileImageDelete,
    open,
    handleClickOpen,
    handleClose,
    onSubmit
  } = props

  const [username, setUsername] = useState()
  const [formValues, setFormValues] = useState({
    email: email,
    username: name,
    nickName: '',
    country: '',
    area: '',
    date: '',
    phone: ''
  })
  const handleTextFieldChange = event => {
    alert(event.target.name + ' ' + event.target.value)
    const { name, value } = event.target
    setFormValues({
      ...formValues,
      [name]: value
    })
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

  return (
    <div>
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
      <Form className='w-full' onSubmit={handleSubmit(handleEditName)}>
        <FlexBox>
          {/* 이름 */}
          <FormControl error sx={{ width: '100%', my: 2 }}>
            {/* <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field, onChange }) => ( */}
            <TextField
              name='name'
              required
              label='이름'
              variant='standard'
              placeholder='이름을 입력해 주세요'
              defaultValue={name}
              onChange={e => handleTextFieldChange(e)}
              // onChange={e => setUsername(e.target.value)}
              // onChange={e => alert(e.target.value)}
              // {...field}
              error={Boolean(errors.username)}
            />
            {/* )} */}
            {/* /> */}
            {errors.username && <FormHelperText sx={{ color: 'error.main' }}>{errors.username}</FormHelperText>}
          </FormControl>

          {/* 별명 */}
          <FormControl sx={{ width: '100%', my: 2 }}>
            {/* <Controller
              name='nickName'
              control={control}
              rules={{ required: true }}
              render={({ field, onChange }) => ( */}
            <TextField
              name='nickName'
              label='별명'
              variant='standard'
              placeholder='별명을 입력해 주세요'
              onChange={handleTextFieldChange}
              // {...field}
              error={Boolean(errors.myId)}
            />
            {/* )}
            /> */}
            {errors.nickName && <FormHelperText sx={{ color: 'error.main' }}>{errors.nickName.message}</FormHelperText>}
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
                <Select label='지역' {...field} error={Boolean(errors.area)}>
                  <MenuItem value={'지역1'}>지역1</MenuItem>
                  <MenuItem value={'지역2'}>지역2</MenuItem>
                </Select>
              )}
            />
            {errors.area && <FormHelperText sx={{ color: 'error.main', ml: 2 }}>{errors.area.message}</FormHelperText>}
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
              render={({ field, onChange }) => (
                <TextField
                  label='전화번호'
                  variant='standard'
                  onChange={handleTextFieldChange}
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
          <Button
            variant='contained'
            // type='submit'
            onClick={() => handleEditName(formValues)}
            // onClick={() => alert(username)}
            sx={{ width: '200px', fontSize: '18px', mt: 5 }}
          >
            수정 완료
          </Button>
        </div>
      </Form>
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
    </div>
  )
}

export default ProfileForm
