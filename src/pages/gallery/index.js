import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from '@emotion/styled'
import PageLayout from 'src/components/Layouts/PageLayout'
import GalleryCard from 'src/components/Card/GalleryCard'

// ** MUI Components
import Button from '@mui/material/Button'
import { ImageList, ImageListItem } from '@mui/material'

// ** firebase import
import db from 'src/firebase/db'
import { collection, query, where, getDocs } from 'firebase/firestore'

const GalleryCardList = styled(ImageList)(({ theme }) => ({
  columnCount: '4 !important',
  columnGap: '8px !important',

  '@media (max-width: 1024px)': {
    columnCount: '3 !important',
    columnGap: '8px !important'
  },
  '@media (max-width: 768px)': {
    columnCount: '2 !important',
    columnGap: '8px !important'
  },
  '@media (max-width: 480px)': {
    columnCount: '1 !important',
    columnGap: '0 !important'
  }
}))

const GalleryPage = () => {
  const router = useRouter()
  const [cardDocs, setCardDocs] = useState([])

  // 카드 목록 가져오기
  useEffect(() => {
    const getCardDocs = async () => {
      const q = query(collection(db, 'GalleryInfo'))
      const querySnapshot = await getDocs(q)
      const themeArray = []
      querySnapshot.forEach(doc => {
        // console.log(doc.id, '=>', doc.data())
        const { data } = doc.data()
        themeArray.push({ ...data, id: doc.id })
      })
      setCardDocs(themeArray)
    }
    getCardDocs()
  }, [])

  return (
    <PageLayout>
      <div className='flex justify-between items-center'>
        <p className='text-3xl p-5 font-bold '>GalleryPage</p>
        <Link href='/gallery/create'>
          <a>
            <Button variant='contained'>추가</Button>
          </a>
        </Link>
      </div>
      <div className='w-full'>
        <GalleryCardList variant='masonry'>
          {cardDocs
            ? cardDocs.map(card => (
                <ImageListItem key={card.id}>
                  <GalleryCard key={card.id} data={card} card={card} loading='lazy' />
                </ImageListItem>
              ))
            : ''}
        </GalleryCardList>
      </div>
    </PageLayout>
  )
}

export default GalleryPage
