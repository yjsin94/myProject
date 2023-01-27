import {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey
} from '@mui/material/colors'

const paletteTheme = {
  palette: {
    background: {
      main: 'rgba(40, 36, 61, 1)',
      dark0: 'rgb(86 80 125)',
      dark: 'rgba(40, 36, 61)'
    },
    border: {
      white: 'rgb(49, 45, 75)',
      darknone: 'none',
      main: 'rgba(255, 255, 255, 0.1)'
    },
    fontColor: {
      light: 'rgba(255, 255, 255, 0.4)',
      main: 'rgba(255, 255, 255, 0.8)',
      active: '#fff'
    },
    linkFontColor: {
      main: deepPurple['A100'],
      active: deepPurple['A700'],
      hover: deepPurple[200]
    },
    card: {
      inBox: 'rgba(255, 255, 255, 0.2)',
      light: 'rgba(0, 0, 0, 0.5)',
      main: 'rgb(49, 45, 75)'
    },
    primary: {
      light: blueGrey[100],
      main: blueGrey['A200'],
      dark: blueGrey['A700'],
      contrastText: '#fff'
    },
    secondary: {
      light: yellow[100],
      main: yellow[500],
      dark: yellow['A400'],
      contrastText: '#fff'
    },
    error: {
      light: brown[200],
      main: brown[400],
      dark: brown[800],
      contrastText: '#fff'
    },
    lightGray: {
      light: grey['A200'],
      main: '#333',
      dark: grey['A700'],
      contrastText: '#fff'
    },
    white: {
      main: '#fff'
    }
  }
}

export default paletteTheme
