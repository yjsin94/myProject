import React from 'react'
import { useTheme } from '@mui/material/styles'
import { jsx, css } from '@emotion/css'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'

// @emotion/styled 사용해서 theme 가져오기
const Mainwrap = styled.div(() => {
  return {
    width: '100%'
  }
})

const StyledButton = styled(Button)(({ theme }) => {
  return {
    backgroundColor: theme.palette.lightGray.main,
    color: '#fff'
  }
})

const HomePgae = () => {
  const theme = useTheme()
  const sampleButton4 = SampleButton4(theme)

  return (
    <Mainwrap>
      <p className='text-3xl p-5 font-bold '>HomePage</p>
      <input
        id='upload'
        type='file'
        accept='image/*'
        onChange={event => {
          //to do
        }}
        onClick={e => {
          e.target.value = null
        }}
      />
      <div className='flex px-5'>
        {/* 방법 1 - mui 에서만 사용가능 */}
        <StyledButton variant='contained' sx={{ backgroundColor: 'primary.main' }}>
          Sample1
        </StyledButton>
        {/* 방법 1 - mui 에서만 사용가능 */}
        <Button variant='contained' sx={{ backgroundColor: 'primary.main' }}>
          Sample1
        </Button>
        {/* 방법 2 - mui 에서만 사용가능 */}
        <Button variant='contained' color='secondary'>
          Sample2
        </Button>
        {/* 방법 3 - emotion css 사용 + theme 사용 */}
        <Button variant='contained' className={SampleButton3(theme)}>
          Sample3
        </Button>
        {/* 방법 4 - emotion css + theme 사용 */}
        <Button className={sampleButton4}>Sample4</Button>
        {/* 방법 5 */}
        <button
          className={{
            width: '120px',
            height: '30px',
            backgroundColor: '#555',
            color: '#fff'
          }}
        >
          Sample5
        </button>
        {/* 방법 6 */}
        <button className={SampleButton6}>Sample6</button>
      </div>
      <div>{JSON.stringify(theme.palette)}</div>
    </Mainwrap>
  )
}

const SampleButton3 = theme => css`
  background-color: ${theme.palette.error.main};
  color: #fff;
`
const SampleButton4 = theme => css`
  background-color: ${theme.palette.lightGray.main};
  color: #fff;
`
const SampleButton6 = css`
  width: 120px;
  height: 20px;
  background-color: #555 !important;
  color: #fff;
`

export default HomePgae
