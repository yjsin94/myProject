import jwt from 'jsonwebtoken'

const AuthFunction = () => {
  return ''
}

// const jwtConfig = {
//   secret: process.env.SECRET_CODE
// }

export const AuthLogin = (email, uid, name) => {
  const initSettings = new Object()

  initSettings.email = email
  initSettings.uid = uid
  initSettings.name = name
  initSettings.date = new Date()

  const accessToken = jwt.sign(initSettings, process.env.SECRET_CODE)
  window.localStorage.setItem('project1-token', accessToken)
}

export const AuthLogout = () => {
  window.localStorage.removeItem('project1-token')
}

export const AuthGetToken = async () => {
  const token = window.localStorage.getItem('project1-token')

  const decoded = jwt.decode(token, { complete: true })

  if (decoded) {
    const { email, uid, name } = decoded.payload

    return { email, uid, name }
  }

  return ''
}

export const AuthNameChange = (email, uid, name) => {
  const initSettings = new Object()

  initSettings.email = email
  initSettings.uid = uid
  initSettings.name = name
  initSettings.date = new Date()

  const accessToken = jwt.sign(initSettings, process.env.SECRET_CODE)
  window.localStorage.setItem('project1-token', accessToken)
}
