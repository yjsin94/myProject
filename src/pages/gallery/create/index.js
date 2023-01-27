import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SuccessAlert } from 'src/functions/Alert'
import PageLayout from 'src/components/Layouts/PageLayout'
// *** Mui import
import Button from '@mui/material/Button'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
// *** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
// --- firebase import
import db from 'src/firebase/db'
import { collection, addDoc } from 'firebase/firestore'
import storage from 'src/firebase/storage'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const CreateGallery = () => {
  const date = new Date()
  const router = useRouter()
  const [imageList, setImageList] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [open, setOpen] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)

  function sleeper(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
  }

  const onSubmit = async data => {
    data = { ...data, imageUrls }
    // console.log(data)
    await addDoc(collection(db, 'GalleryInfo'), {
      data
    })
    setOpenSuccess(true)
    handleClose()
    sleeper(2000).then(() => {
      setOpenSuccess(false)
      router.push('/gallery')
    })
  }

  /* 유효성 검사 */
  const { handleSubmit } = useForm({
    defaultValues: {
      author: '홍길동',
      created_at: date.toLocaleString('ko-kr')
    },
    mode: 'onChange'
  })

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
      /* 이미지 구글 스토리지 업로드 실행 */
      // console.log(acceptedFiles)
      /* 하나의 파일을 업로드 하는 함수 */
      const uploadOneFile = async file => {
        const imageRef = ref(storage, `galleryImages/${file.name}`)
        const snapShot = await uploadBytes(imageRef, file)
        const url = await getDownloadURL(snapShot.ref)
        // console.log(url)
        setImageUrls(prev => [...prev, url])
      }
      acceptedFiles.map(file => uploadOneFile(file))
    }
  })

  const thumbs = imageList.map(file => (
    <div key={file.name} className='w-full my-10 p-2'>
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
  ))

  useEffect(() => {
    return () => imageList.forEach(file => URL.revokeObjectURL(file.preview))
  }, [imageList])

  // *** 다이얼로그
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <PageLayout>
      <p className='text-3xl p-5 font-bold '>CreateGallery</p>
      <form action='' className='w-full' onSubmit={handleSubmit(onSubmit)}>
        {/* 이미지 업로드 */}
        {imageList && imageList.length ? (
          <div>
            <section className='w-full p-5 flex flex-col items-center justify-center bg-slate-100'>
              <aside className='w-full flex'>{thumbs}</aside>
            </section>
            <div className='w-full flex justify-end'>
              <Button
                variant='contained'
                sx={{ mt: 10 }}
                color='lightGray'
                onClick={() => {
                  router.push('/gallery')
                }}
              >
                취소
              </Button>
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
          </div>
        ) : (
          <section className='w-full p-5 flex flex-col items-center justify-center bg-slate-100'>
            <div
              {...getRootProps({ className: 'dropzone' })}
              className='bg-slate-100 w-full p-10 flex flex-col items-center justify-center border border-dashed border-gray-500 rounded-lg'
            >
              <input {...getInputProps()} />
              <p className='font-bold text-xl text-gray-500'>파일을 올려주세요</p>
            </div>
          </section>
        )}
        {/* 다이얼로그 */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>이미지 등록</DialogTitle>
          <DialogContent>해당 이미지를 등록하시겠습니까?</DialogContent>
          <DialogActions>
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>
              등록
            </Button>
            <Button variant='contained' color='lightGray' onClick={handleClose}>
              취소
            </Button>
          </DialogActions>
        </Dialog>
        {/* 다이얼로그 */}
        <Dialog open={openSuccess} onClose={handleClose}>
          <SuccessAlert title='완료' />
        </Dialog>
      </form>
    </PageLayout>
  )
}

export default CreateGallery
