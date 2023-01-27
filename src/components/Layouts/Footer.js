import styled from '@emotion/styled'
import React from 'react'

const Footer = () => {
  const newDate = new Date()

  return (
    <FooterWrap>
      <p>
        &copy; Footer -- .{newDate.getFullYear()}.{newDate.getMonth()}.{newDate.getDay()}
      </p>
    </FooterWrap>
  )
}

const FooterWrap = styled.div(() => {
  return {
    width: '100%',
    padding: '20px',
    height: 'auto',
    backgroundColor: '#ddd',
    display: 'block',
    '@media (max-width: 412px)': {
      display: 'none'
    }
  }
})

export default Footer
