import React, { useState, useEffect, useRef, useMemo } from 'react'
import { throttle } from 'lodash'
import styled from '@emotion/styled'
import Navbar from './Nav/Navbar'
// --- Mui import
import { useTheme } from '@mui/material/styles'

// @emotion/styled 사용해서 theme 가져오기
const HeaderWrap = styled.div(({ theme }) => {
  return {
    width: '100%',
    height: 'auto',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 99999,
    backgroundColor: theme.palette.lightGray.light,
    '.hide': {
      display: 'none'
    }
  }
})
const HeaderContent = styled.div(() => {
  return {
    textAlign: 'center',
    fontSize: '20px',
    padding: '20px'
  }
})

const Header = ({ themeCode, setThemeCode }) => {
  const [isNavOn, setIsNavOn] = useState(true)
  //이전 스크롤 초기값
  const beforeScrollY = useRef(0)

  useEffect(() => {
    window.addEventListener('scroll', scrollEvent)
  }, [])

  const scrollEvent = useMemo(
    () =>
      throttle(() => {
        const currentScrollY = window.scrollY
        if (beforeScrollY.current < currentScrollY) {
          setIsNavOn(false)
          // console.log('내림')
        } else {
          setIsNavOn(true)
          // console.log('올림')
        }
        //이전 스크롤값 저장
        beforeScrollY.current = currentScrollY
      }, 300),
    [beforeScrollY]
  )

  return (
    <HeaderWrap>
      <HeaderContent className={isNavOn ? '' : 'hide'}>Header 영역</HeaderContent>
      <Navbar themeCode={themeCode} setThemeCode={setThemeCode} />
    </HeaderWrap>
  )
}

export default Header
