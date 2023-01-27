/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'

// ** MUI Components
import { Box, Avatar, Typography, Chip } from '@mui/material'
import { Card, CardHeader, CardMedia, CardActions, CardCover } from '@mui/material'
import { IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material'

// ** Icons Imports
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import Favorite from '@mui/icons-material/Favorite'
import Visibility from '@mui/icons-material/Visibility'
import CreateNewFolder from '@mui/icons-material/CreateNewFolder'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import { MessageOutlined, SendOutlined } from '@ant-design/icons'

/* 카드 레이아웃 */
const GalleryCardWrap = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  positon: 'relative',
  minHeight: '200px',
  '@media (max-width: 425px)': {
    minHeight: '300px'
  }
}))

/* 카드 info */
const InfoWrap = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '0.5rem 0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: '1px solid #eee'
}))

export default function GalleryCard({ data, onClick, card }) {
  let [like, setLike] = useState(false)

  const router = useRouter()

  /* 디테일 페이지로 이동 */
  const onClickCard = () => {
    router.push(`/gallery/detail/${card.id}`)
  }

  return (
    <GalleryCardWrap onClick={onClick}>
      {/* <CardHeader title={data.author} subheader={data.created_at} /> */}
      <div className='imgContainer' onClick={onClickCard}>
        <img src={data.imageUrls[0] ? data.imageUrls[0] : 'https://picsum.photos/250/250'} alt='img' />
      </div>
      <InfoWrap sx={{}}>
        {/* 제작자 정보 */}
        <div className='flex justify-end items-center'>
          <Avatar
            src='https://images.unsplash.com/profile-1502669002421-a8d274ad2897?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff'
            size='sm'
          />
          <p>User Name</p>
        </div>
        <div className='flex justify-end items-center'>
          {/* 좋아요 */}
          <p className='mr-5'>
            <IconButton
              onClick={() => {
                setLike(like + 1)
              }}
            >
              {like ? <Favorite /> : <FavoriteBorderRoundedIcon />}
            </IconButton>
            <span className='ml-1'>{like}</span>
          </p>
          {/* 조회수 */}
          <p>
            <Visibility />
            <span className='ml-1'>10.4k</span>
          </p>
        </div>
      </InfoWrap>
    </GalleryCardWrap>
  )
}
