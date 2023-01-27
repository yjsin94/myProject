import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
// --- Mui import
import TextField from '@mui/material/TextField'
import { Button, IconButton } from '@mui/material'
import { FormControl, FormHelperText, Input, InputLabel, InputAdornment } from '@mui/material'
// *** Mui icon
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
// *** Third Party Imports
import { Controller } from 'react-hook-form'
// *** firebase import
import auth from 'src/firebase/auth'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const LoginForm = props => {
  const { control, errors, authSubmit, handleSubmit } = props

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
    <form className='w-full' onSubmit={handleSubmit(authSubmit)}>
      <p className='text-3xl p-5 font-bold text-center'>로그인</p>
      {/* 아이디 */}
      <FormControl sx={{ width: '100%', my: 2 }}>
        <Controller
          name='email'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              label='이메일'
              variant='standard'
              placeholder='이메일 입력해 주세요'
              {...field}
              error={Boolean(errors.email)}
            />
          )}
        />
        {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
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
      {/* 로그인 버튼 */}
      <div className='w-full flex flex-col items-center'>
        <Button variant='contained' type='submit' sx={{ width: '100%', fontSize: '18px', mb: 2 }}>
          Login
        </Button>
      </div>
    </form>
  )
}

export default LoginForm
