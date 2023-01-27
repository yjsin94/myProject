import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from '@emotion/styled'

// ** MUI Components
import { Card, CardHeader, CardMedia, CardContent, CardActions } from '@mui/material'
import { Box, Avatar, Typography, Input } from '@mui/material'
import { IconButton } from '@mui/material'

// ** Icons Imports
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import ModeCommentOutlined from '@mui/icons-material/ModeCommentOutlined'
import SendOutlined from '@mui/icons-material/SendOutlined'
import Face from '@mui/icons-material/Face'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'

// ** Third Party Imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

// ** firebase import
import db from 'src/firebase/db'
import { doc, getDoc } from 'firebase/firestore'

// ** login function
import useMobxSettings from 'src/context/settings'
import { observer } from 'mobx-react-lite'

/* 카드 레이아웃 */
const SnsCardWrap = styled(Card)(({ theme }) => ({
  maxWidth: '620px',
  boxShadow: 'none',
  border: `1px solid ${theme.palette.border.darknone}`,
  backgroundColor: theme.palette.card.main,
  marginBottom: '20px',

  /* 카드 헤더 스타일 */
  '.card_header': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1.2rem 1rem',
    '> p': {
      marginLeft: '0.6rem'
    }
  }
}))

/* 카드 이미지 반응형 정사각형 */
const SwiperImage = styled(Swiper)(({ theme }) => ({
  '> .swiper-wrapper': {
    '.swiper-slide': {
      position: 'relative',
      paddingBottom: '100%',

      '>img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute'
      }
    }
  }
}))

/* 카드 액티브 */
const CardActive = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignContent: 'center',
  borderTop: `1px solid ${theme.palette.border.main}`,
  borderBottom: `1px solid ${theme.palette.border.main}`,
  padding: '0.3rem 0.5rem',
  '> .icon_wrap': {
    display: 'flex'
  },
  button: {
    color: theme.palette.fontColor.main
  }
}))

/* 텍스트 영역 */
const TextWrap = styled(Box)(({ theme }) => ({
  padding: '0.5rem 1rem',
  fontSize: '14px',
  color: theme.palette.fontColor.main,
  '> div': {
    marginBottom: '0.2rem'
  },
  '.Link_text': {
    minWidth: 'fit-content',
    color: theme.palette.linkFontColor.main,
    fontWeight: 'bold',
    cursor: 'pointer',
    ':hover': {
      color: theme.palette.linkFontColor.hover
    }
  },
  '.Date_text': {
    color: theme.palette.fontColor.light
  },
  '.One_line_text': {
    display: 'inline-block',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}))

/* 댓글 영역 */
const InputBox = styled(Box)(({ theme }) => ({
  padding: '1rem',
  backgroundColor: theme.palette.card.inBox
}))

const ContentCard = observer(({ data, onClick, card, settings }) => {
  const [swiperDoc, setSwiperDoc] = useState([])
  const [userPhoto, setUserPhoto] = useState()

  /* hook */
  const router = useRouter()

  /* mobx 상태값 가져오기 */
  const mobxSetting = useMobxSettings()
  const { email, infoChange } = mobxSetting

  /* 프로필 이미지 가져오기 */
  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(db, `users/${email}`)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setUserPhoto(docSnap.data().photoURL)
        } else {
          console.log('사용자 이미지가 없습니다!')
        }
      } catch (e) {
        // console.log('error: ', e)
      }
    }

    if (email) {
      getData()
    }
  }, [email, infoChange])

  const renderUserAvatar = () => {
    if (userPhoto) {
      return <Avatar size='sm' src={userPhoto} sx={{ border: '1.5px solid #fff' }} />
    } else {
      return <Avatar size='sm' src='' sx={{ border: '1.5px solid #fff' }} />
    }
  }

  /* 게시물 이미지 가져오기 */
  useEffect(() => {
    const getImageDocs = async () => {
      const imageList = await data.imageUrls
      const imgArray = []
      imageList.forEach(doc => {
        imgArray.push(doc)
      })
      setSwiperDoc(imgArray)
    }
    getImageDocs()
  }, [data.imageUrls])

  /* 디테일 페이지로 이동 */
  const onClickCard = () => {
    router.push(`/main/detail/${card.id}`)
  }

  return (
    <SnsCardWrap onClick={onClick}>
      {/* 카드 헤더 */}
      <div className='card_header'>
        <Box
          sx={{
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              m: '-2px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
            }
          }}
        >
          {/* 프로필 이미지 */}
          {renderUserAvatar()}
        </Box>
        <p>{data.name}</p>
        <IconButton variant='plain' color='neutral' size='sm' sx={{ ml: 'auto' }}>
          <MoreHoriz />
        </IconButton>
      </div>

      {/* 슬라이드 이미지 */}
      <SwiperImage pagination={true} modules={[Pagination]} className='mySwiper'>
        {swiperDoc ? (
          swiperDoc.map(images => (
            <SwiperSlide key={images}>
              <CardMedia component='img' height='100%' src={images} alt='작성자 이미지' onClick={onClickCard} />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <CardMedia component='img' height='194' src='https://picsum.photos/250/250' alt='이미지 없음' />
          </SwiperSlide>
        )}
      </SwiperImage>

      {/* 카드 액티브 */}
      <CardActive>
        <div className='icon_wrap'>
          <IconButton variant='plain' color='neutral' size='sm'>
            <FavoriteBorder />
          </IconButton>
          <IconButton variant='plain' color='neutral' size='sm'>
            <ModeCommentOutlined />
          </IconButton>
          <IconButton variant='plain' color='neutral' size='sm'>
            <SendOutlined />
          </IconButton>
        </div>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mx: 'auto' }}>
          {[...Array(5)].map((_, index) => (
            <Box
              key={index}
              sx={{
                borderRadius: '50%',
                width: `max(${6 - index}px, 3px)`,
                height: `max(${6 - index}px, 3px)`,
                bgcolor: index === 0 ? 'primary.solidBg' : 'background.level3'
              }}
            />
          ))}
        </Box>
        <Box sx={{ width: 0, display: 'flex', flexDirection: 'row-reverse' }}>
          <IconButton variant='plain' color='neutral' size='sm'>
            <BookmarkBorderRoundedIcon />
          </IconButton>
        </Box>
      </CardActive>

      {/* 텍스트 영역 */}
      <TextWrap>
        {/* 좋아요 수 */}
        <div>
          <Link href='/'>
            <span className='Link_text'>8.1M Likes</span>
          </Link>
        </div>

        {/* 사용자 , 글 타이틀 */}
        <div className='flex'>
          <Link href='/'>
            <span className='Link_text mr-2'>{data.name}</span>
          </Link>
          <span>{data.titleText}</span>
        </div>

        {/* 카드 콘텐츠 */}
        <div className='One_line_text'>{data.contentText}</div>

        {/* 더보기 */}
        <div>
          <Link href='/'>
            <span className='Link_text text-xs'>...more</span>
          </Link>
        </div>

        {/* 작성일 */}
        <div>
          <p className='text-xs Date_text'>{data.createdAt}</p>
        </div>
      </TextWrap>

      {/* 댓글 */}
      <InputBox sx={{ display: 'flex', p: 1, bgcolor: '#eee' }}>
        <IconButton size='sm' variant='plain' color='neutral' sx={{ ml: -1 }}>
          <Face />
        </IconButton>
        <Input
          variant='plain'
          size='sm'
          placeholder='Add a comment…'
          sx={{ flexGrow: 1, mr: 1, '--Input-focusedThickness': '0px' }}
        />
        <Link href='/' disabled underline='none' role='button'>
          입력
        </Link>
      </InputBox>
    </SnsCardWrap>
  )
})

export default ContentCard
