import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from '@emotion/styled'

// ** MUI Components
import { Box, Avatar, Badge, Typography, Tooltip } from '@mui/material'
import { Menu, MenuItem, ListItemIcon, Divider } from '@mui/material'
import { IconButton } from '@mui/material'

// ** Icons Imports
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined'
import ModeCommentOutlined from '@mui/icons-material/ModeCommentOutlined'
import InsertEmoticonOutlinedIcon from '@mui/icons-material/InsertEmoticonOutlined'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import Logout from '@mui/icons-material/Logout'

// ** Third Party Imports
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** logout function
import useMobxSettings from 'src/context/settings'
import { MobxLogoutFunction } from 'src/context/MobxFunction'
import { AuthLogout } from 'src/context/AuthFunction'
import { observer } from 'mobx-react-lite'

// ** firebase import
import db from 'src/firebase/db'
import { doc, getDoc } from 'firebase/firestore'

const MyMenu = styled(props => (
  <Menu
    elevation={0}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    {...props}
  />
))(({ theme }) => ({
  '.MuiPaper-root': {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
    border: '1px solid #ddd',
    marginTop: 1.5,
    minWidth: '300px',

    '.MuiAvatar-root': {
      width: 32,
      height: 32,
      marginLeft: -7,
      marginRight: 11
    }
  }
}))

const MyMenuNav = observer(({ settings }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [photo, setPhoto] = useState()

  /* hook */
  const router = useRouter()
  const open = Boolean(anchorEl)

  const mobxSetting = useMobxSettings()
  const { email, name, infoChange } = mobxSetting

  function sleeper(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
  }

  /* ?????? ?????? */
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  /* ?????? ?????? */
  const handleClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  /* ???????????? */
  const handleLogout = () => {
    MobxLogoutFunction(mobxSetting)
    AuthLogout()

    sleeper(500).then(() => {
      router.push('/auth/login')
    })
  }

  /* ?????? */
  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(db, `users/${email}`)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setPhoto(docSnap.data().photoURL)
        } else {
          console.log('No such document')
        }
      } catch (e) {
        console.log('error : ', error)
      }
    }

    if (email) {
      getData()
    }
  }, [email, infoChange])

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title='Account settings'>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }} src={photo ? photo : ''} />
          </IconButton>
        </Tooltip>
      </Box>
      <MyMenu anchorEl={anchorEl} id='account-menu' open={open} onClose={handleClose} onClick={handleClose}>
        <MenuItem>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
            <Badge overlap='circular'>
              <Avatar sx={{ width: 32, height: 32 }} src={photo ? photo : ''} />
            </Badge>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column'
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>{email}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {name}
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        <Divider sx={{ my: 1 }} />

        <MenuItem>
          <ListItemIcon>
            <GridViewRoundedIcon fontSize='small' />
          </ListItemIcon>
          ?????? ?????????
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <InsertPhotoOutlinedIcon fontSize='small' />
          </ListItemIcon>
          ?????? ?????????
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ModeCommentOutlined fontSize='small' />
          </ListItemIcon>
          ??????
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <SettingsRoundedIcon fontSize='small' />
          </ListItemIcon>
          ?????????
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <SettingsRoundedIcon fontSize='small' />
          </ListItemIcon>
          ????????? ?????????
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <SettingsRoundedIcon fontSize='small' />
          </ListItemIcon>
          ???????????? ??????
        </MenuItem>
        <Divider />
        <Link href='/profile'>
          <MenuItem>
            <ListItemIcon>
              <InsertEmoticonOutlinedIcon fontSize='small' />
            </ListItemIcon>
            ?????? ??????
          </MenuItem>
        </Link>
        <MenuItem>
          <ListItemIcon>
            <SettingsRoundedIcon fontSize='small' />
          </ListItemIcon>
          ?????? ??????
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          ????????????
        </MenuItem>
      </MyMenu>
      <ToastContainer
        position='top-right'
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
        transition={Slide}
      />
    </Box>
  )
})

export default MyMenuNav
