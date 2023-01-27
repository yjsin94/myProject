import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from '@emotion/styled'
import PageLayout from 'src/components/Layouts/PageLayout'

// ** MUI Components
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import ContentCard from 'src/components/Card/ContentCard'

// ** Icons Imports
// ** Third Party Imports
// ** firebase import
import db from 'src/firebase/db'
import { collection, query, where, getDocs } from 'firebase/firestore'

/* 카드 센터정렬 */
const MainPageCard = styled.div(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexFlow: 'column wrap',
  alignItems: 'center',
  justifyContent: 'center'
}))

const MainPgae = () => {
  const theme = useTheme()
  const [cardDocs, setCardDocs] = useState([])
  const router = useRouter()

  // 카드 목록 가져오기
  useEffect(() => {
    const getCardDocs = async () => {
      const q = query(collection(db, 'Card'))
      const querySnapshot = await getDocs(q)
      const tempArray = []
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, ' => ', doc.data())
        const { data } = doc.data()
        tempArray.push({ ...data, id: doc.id })
      })
      setCardDocs(tempArray)
    }
    getCardDocs()
  }, [])

  return (
    <PageLayout>
      <div className='flex justify-between items-center'>
        <p className='text-3xl p-5 font-bold '>Main Page</p>
        <Link href='/main/create'>
          <a>
            <Button variant='contained'>추가</Button>
          </a>
        </Link>
      </div>
      <MainPageCard>
        {cardDocs ? cardDocs.map(card => <ContentCard key={card.id} data={card} card={card} />) : ''}
      </MainPageCard>
    </PageLayout>
  )
}

export default MainPgae
