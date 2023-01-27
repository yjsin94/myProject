import React from 'react'
import { useRouter } from 'next/router'
import { jsx, css } from '@emotion/css'
import styled from '@emotion/styled'
// --- Mui import
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { FormControl, TextField, Input, FormHelperText } from '@mui/material'
// *** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// --- firebase import
import { collection, addDoc } from 'firebase/firestore'
import db from 'src/firebase/db'

const Submit_Button = styled(Button)(({ theme }) => {
  return {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    fontSize: '18px'
  }
})

const schema = yup.object().shape({
  title: yup.string().min(2, '최소 2글자 이상 입력해 주세요').required('제목을 입력해 주세요'),
  contents: yup.string().min(5, '최소 5글자 이상 입력해 주세요').required('내용을 입력해 주세요')
})

const CreateNoticeboard = () => {
  // const theme = useTheme()
  const date = new Date()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      contents: '',
      author: '홍길동',
      created_at: date.toLocaleString('ko-kr')
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    console.log(data)
    await addDoc(collection(db, 'articles'), {
      data
    })
    alert('저장되었습니다.')
    router.push('/noticeboard')
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <p className='text-3xl p-5 font-bold'>글쓰기</p>
      <form action='' className='w-full' onSubmit={handleSubmit(onSubmit)}>
        {/* 제목 */}
        <FormControl sx={{ width: '100%', my: 2 }}>
          <Controller
            name='title'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                variant='filled'
                sx={{ input: { pb: '24px' } }}
                placeholder='제목을 입력하세요'
                {...field}
                error={Boolean(errors.title)}
              />
            )}
          />
          {errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>}
        </FormControl>
        {/* 내용 */}
        <FormControl sx={{ width: '100%', my: 2 }}>
          <Controller
            name='contents'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                variant='filled'
                multiline
                rows={10}
                placeholder='내용을 입력하세요'
                {...field}
                error={Boolean(errors.contents)}
              />
            )}
          />
          {errors.contents && <FormHelperText sx={{ color: 'error.main' }}>{errors.contents.message}</FormHelperText>}
        </FormControl>
        <Submit_Button variant='contained' type='submit'>
          작성 완료
        </Submit_Button>
      </form>
    </div>
  )
}

export default CreateNoticeboard
