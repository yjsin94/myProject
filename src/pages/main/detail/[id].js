/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styled from '@emotion/styled'
// *** Mui import
import { Router } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
// *** Third Party Imports
import * as yup from 'yup'
// --- firebase import
import db from 'src/firebase/db'
import { doc, getDoc } from 'firebase/firestore'

const schema = yup.object().shape({
  titleText: yup.string().required('제목를 입력해 주세요').min(2, '최소 2 글자 이상 입력해 주세요'),
  contentText: yup.string().required('내용을 입력해 주세요').min(5, '최소 5 글자 이상 입력해 주세요')
})

const CreateContentCard = props => {
  const [myDoc, setMyDoc] = useState()

  const router = useRouter()
  const { id } = router.query

  // 카드 1개 가져오기
  useEffect(() => {
    const getCardDoc = async () => {
      if (id) {
        const docRef = doc(db, 'Card', id)
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
      <p className='text-3xl p-5 font-bold'>카드추가</p>
      <form action='' className='w-full'>
        {/* 제목 입력 */}
        <div>{myDoc.titleText}</div>
        <div>{myDoc.contentText}</div>
        {myDoc && myDoc.imageUrls && myDoc.imageUrls.length > 0
          ? myDoc.imageUrls.map(url => <Image key={url} src={url} width={300} height={300}></Image>)
          : ''}
      </form>
    </div>
  )
}

export default CreateContentCard
