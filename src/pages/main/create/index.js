import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import styled from '@emotion/styled'
import PageLayout from 'src/components/Layouts/PageLayout'
import LoginQ from 'src/components/Dialog/LoginError'

// ** MUI Components
import { useTheme } from '@mui/material/styles'
import { Button, Avatar } from '@mui/material'
import { FormControl, TextField, FormHelperText } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** firebase import
import db from 'src/firebase/db'
import { collection, addDoc, getDoc, doc, setDoc } from 'firebase/firestore'
import storage from 'src/firebase/storage'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// ** login function
import useMobxSettings from 'src/context/settings'
import { observer } from 'mobx-react-lite'

const schema = yup.object().shape({
  titleText: yup.string().required('제목를 입력해 주세요').min(2, '최소 2 글자 이상 입력해 주세요'),
  contentText: yup.string().required('내용을 입력해 주세요').min(5, '최소 5 글자 이상 입력해 주세요')
})

const CreateContentCard = observer(props => {
  const [imageList, setImageList] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [open, setOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  const createdAtDate = new Date()
  const router = useRouter()

  /* mobx 상태값 가져오기 */
  const mobxSetting = useMobxSettings()
  const { email, uid, name } = mobxSetting

  /* 로그인 체크 */
  useEffect(() => {
    if (!mobxSetting.login) {
      setLoginOpen(true)
    }
  }, [mobxSetting.login])

  /* 유효성 검사 */
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      titleText: '',
      contentText: '',
      uid: uid,
      name: name,
      email: email,
      imageUrls: imageUrls,
      createdAt: createdAtDate.toLocaleString('ko-kr')
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  /* firebase로 내용 전송 */
  const onSubmit = async data => {
    data = { ...data, imageUrls }
    // console.log(data)
    await addDoc(collection(db, 'Card'), {
      data
    })
    alert('카드가 등록되었습니다')
    handleClose()

    router.push('/main')
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      setImageList(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      )
      //이미지 구글 스토리지 업로드 실행
      // console.log(acceptedFiles)
      // 하나의 파일을 업로드 하는 함수
      const uploadOneFile = async file => {
        const imageRef = ref(storage, `images/${file.name}`)
        const snapshot = await uploadBytes(imageRef, file)
        const url = await getDownloadURL(snapshot.ref)
        // console.log(url)
        // 여러개 파일을 올리는 부분
        setImageUrls(prev => [...prev, url])
      }
      acceptedFiles.map(file => uploadOneFile(file))
    }
  })

  const thumbs = imageList.map(file => (
    <div key={file.name} className='w-full my-10'>
      <div>
        <Image
          width={300}
          height={300}
          src={file.preview}
          onLoad={() => {
            URL.revokeObjectURL(file.preview)
          }}
          alt=''
        />
        <p className='w-full text-xl font-bold center'>{file.name}</p>
      </div>
    </div>
  ))

  useEffect(() => {
    return () => imageList.forEach(file => URL.revokeObjectURL(file.preview))
  }, [imageList])

  /* 닫기 */
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <PageLayout>
      <p className='text-3xl p-5 font-bold'>카드추가</p>
      <form action='' className='w-full' onSubmit={handleSubmit(onSubmit)}>
        {/* 이미지 업로드 */}
        <section className='w-full p-5 flex flex-col items-center justify-center bg-slate-100'>
          <div
            {...getRootProps({ className: 'dropzone' })}
            className='bg-slate-100 w-full p-10 flex flex-col items-center justify-center border border-dashed border-gray-500 rounded-lg'
          >
            <input {...getInputProps()} />
            <p className='font-bold text-xl text-gray-500'>파일을 올려주세요</p>
          </div>
          <aside>{thumbs}</aside>
        </section>
        {/* 제목 입력 */}
        <CardTitleText control={control} errors={errors} />
        {/* 내용 입력 */}
        <CardContentText control={control} errors={errors} />
        {/* 작성완료 버튼 */}
        <div className='w-full flex justify-end'>
          <Button
            variant='contained'
            sx={{ mt: 10 }}
            onClick={() => {
              setOpen(true)
            }}
          >
            작성 완료
          </Button>
        </div>

        {/* 카드 등록 관련 다이얼로그 */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>카드 등록</DialogTitle>
          <DialogContent>입력한 정보를 카드에 등록하시겠습니까?</DialogContent>
          <DialogActions>
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>
              등록
            </Button>
            <Button variant='contained' color='lightGray' onClick={handleClose}>
              취소
            </Button>
          </DialogActions>
        </Dialog>
      </form>
      {/* 로그인 확인 다이얼로그 */}
      <LoginQ loginOpen={loginOpen} />
    </PageLayout>
  )
})

/* 제목 */
const CardTitleText = ({ control, errors }) => {
  return (
    <FormControl error sx={{ width: '100%', my: 2 }}>
      <Controller
        name='titleText'
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            label='제목'
            variant='standard'
            placeholder='제목을 입력해 주세요'
            {...field}
            error={Boolean(errors.titleText)}
          />
        )}
      />
      {errors.titleText && <FormHelperText sx={{ color: 'error.main' }}>{errors.titleText.message}</FormHelperText>}
    </FormControl>
  )
}

/* 내용 */
const CardContentText = ({ control, errors }) => {
  return (
    <FormControl error sx={{ width: '100%', my: 2 }}>
      <Controller
        name='contentText'
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            label='내용'
            variant='standard'
            placeholder='내용을 입력해 주세요'
            {...field}
            error={Boolean(errors.contentText)}
          />
        )}
      />
      {errors.contentText && <FormHelperText sx={{ color: 'error.main' }}>{errors.contentText.message}</FormHelperText>}
    </FormControl>
  )
}

export default CreateContentCard
