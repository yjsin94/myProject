/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styled from '@emotion/styled'
// *** Mui import
import { Router } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
// --- firebase import
import db from 'src/firebase/db'
import { doc, getDoc } from 'firebase/firestore'

const CreateGalleryCard = props => {
  const [myDoc, setMyDoc] = useState()
  const router = useRouter()
  const { id } = router.query

  // 카드 1개 가져오기
  useEffect(() => {
    const getCardDoc = async () => {
      if (id) {
        const docRef = doc(db, 'GalleryInfo', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data())
          setMyDoc(docSnap.data().data)
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!')
        }
      }
    }
    getCardDoc()
  }, [id])

  if (!myDoc) return ''

  return (
    <div className='w-full mt-10'>
      <p className='text-3xl p-5 font-bold'>갤러리</p>
      <form action='' className='w-full'>
        {/* 제목 입력 */}
        <div>{myDoc.author}</div>
        <div>{myDoc.created_at}</div>
        {myDoc && myDoc.imageUrls && myDoc.imageUrls.length > 0
          ? myDoc.imageUrls.map(url => <Image key={url} src={url} width={300} height={300} alt='' />)
          : ''}

        {/* {myDoc && myDoc.imageUrls && myDoc.imageUrls.length > 0 ? myDoc.imageUrls.map(url => <p>{url}</p>) : ''} */}
      </form>
    </div>
  )
}

export default CreateGalleryCard
