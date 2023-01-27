import * as jwt from 'jsonwebtoken'

const jwtToken = async () => {
  /* 회원일때 비회원일때 토큰 값 만들기 */
  // const SECRET_CODE = "sdkjkdlsAESRcdslkch";
  const tokenValue = window.localStorage.getItem('project1-token')

  if (tokenValue !== '' && tokenValue !== null) {
    const tokenParseValue = jwt.verify(tokenValue, process.env.SECRET_CODE)
    const { email } = tokenParseValue
    const sendToken = jwt.sign({ email }, process.env.SECRET_CODE, {
      expiresIn: '1d'
    })

    return sendToken
  }

  return ''
}
export default jwtToken
