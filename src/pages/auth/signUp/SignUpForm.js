import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
// --- Mui import
import { Button, IconButton } from '@mui/material'
import { FormControl, FormHelperText, Input, InputLabel, InputAdornment, TextField } from '@mui/material'
import { MenuItem, Select } from '@mui/material'
import { Checkbox } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// *** Mui icon
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
// *** Third Party Imports
import { Controller } from 'react-hook-form'
// *** firebase import
import auth from 'src/firebase/auth'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const SignUpForm = props => {
  const { control, errors, onSubmit, handleSubmit, showPassword, setShowPassword } = props

  // 비밀번호
  const [state, setState] = useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false
  })

  // 비밀번호 보이기
  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword })
  }

  // 비밀번호 아이콘
  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  return (
    <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
      {/* 이메일 */}
      <FormControl sx={{ width: '100%', my: 2 }}>
        <Controller
          name='email'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              label='이메일'
              variant='standard'
              placeholder='이메일을 입력해 주세요'
              {...field}
              error={Boolean(errors.email)}
            />
          )}
        />
        {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
      </FormControl>
      {/* 이름 */}
      <FormControl error sx={{ width: '100%', my: 2 }}>
        <Controller
          name='username'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              label='이름'
              variant='standard'
              placeholder='이름을 입력해 주세요'
              {...field}
              error={Boolean(errors.username)}
            />
          )}
        />
        {errors.username && <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>}
      </FormControl>
      {/* 별명 */}
      <FormControl sx={{ width: '100%', my: 2 }}>
        <Controller
          name='nickName'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              label='nickName'
              variant='standard'
              placeholder='별명을 입력해 주세요'
              {...field}
              error={Boolean(errors.myId)}
            />
          )}
        />
        {errors.nickName && <FormHelperText sx={{ color: 'error.main' }}>{errors.nickName.message}</FormHelperText>}
      </FormControl>
      {/* 비밀번호 */}
      <FormControl variant='standard' sx={{ width: '100%', my: 2 }}>
        <InputLabel error={Boolean(errors.password)}>비밀번호</InputLabel>
        <Controller
          name='password'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <Input
              label='비밀번호'
              value={value}
              onChange={onChange}
              error={Boolean(errors.password)}
              type={state.showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    aria-label='toggle password visibility'
                  >
                    {state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          )}
        />
        {errors.password && <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>}
      </FormControl>
      {/* 비밀번호 확인 */}
      <FormControl variant='standard' sx={{ width: '100%', my: 2 }}>
        <InputLabel error={Boolean(errors.passwordCheck)}>비밀번호 확인</InputLabel>
        <Controller
          name='passwordCheck'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              label='비밀번호 확인'
              error={Boolean(errors.passwordCheck)}
              type={state.showPassword ? 'text' : 'password'}
              {...field}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    aria-label='toggle password visibility'
                  >
                    {state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          )}
        />
        {errors.passwordCheck && (
          <FormHelperText sx={{ color: 'error.main' }}>{errors.passwordCheck.message}</FormHelperText>
        )}
      </FormControl>
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
          {errors.date && <FormHelperText sx={{ color: 'error.main', ml: 2 }}>{errors.date.message}</FormHelperText>}
        </LocalizationProvider>
      </FormControl>
      {/* 약관 동의 */}
      <FormControl sx={{ width: '100%', my: 2 }}>
        <Controller
          name='term'
          control={control}
          defaultValue={false}
          render={({ field: { value, onChange } }) => (
            <div className='flex items-center mt-2'>
              <Checkbox onChange={onChange} checked={value} />
              <p>약관에 동의합니다.</p>
            </div>
          )}
        />
        {errors.term && <FormHelperText sx={{ color: 'error.main' }}>{errors.term.message}</FormHelperText>}
      </FormControl>
      {/* 회원가입 버튼 */}
      <div className='w-full flex flex-col items-center'>
        <Button variant='contained' type='submit' sx={{ width: '100%', fontSize: '18px' }}>
          회원가입
        </Button>
      </div>
    </form>
  )
}

export default SignUpForm
