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
      main: '#F4F5FA',
      dark0: '#ddd',
      dark: '#777'
    },
    border: {
      white: '#fff',
      darknone: '#ddd',
      main: '#ddd'
    },
    fontColor: {
      light: '#999',
      main: '#333',
      active: deepPurple['A700']
    },
    linkFontColor: {
      main: 'rgba(145, 85, 253, 1)',
      active: deepPurple['A700'],
      hover: deepPurple['A700']
    },
    card: {
      inBox: '#f5f5f5',
      // light: 'rgba(0, 0, 0, 0.5)',
      main: '#fff'
    },
    primary: {
      light: deepPurple[100],
      main: deepPurple['A200'],
      dark: deepPurple['A700'],
      contrastText: '#fff'
    },
    secondary: {
      light: deepOrange[100],
      main: deepOrange[500],
      dark: deepOrange['A400'],
      contrastText: '#fff'
    },
    error: {
      light: red[200],
      main: red[400],
      dark: red[800],
      contrastText: '#fff'
    },
    lightGray: {
      light: grey['A200'],
      main: grey['A400'],
      dark: grey['A700'],
      contrastText: '#fff'
    },
    white: {
      main: '#fff',
      dark: '#f5f5f5'
    }
  }
}

export default paletteTheme
