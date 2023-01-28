/* 로그인, 로그아웃 시 상태값 변경 */

export const MobxLoginFunction = (mobxSetting, email, uid, name) => {
  mobxSetting.email = email
  mobxSetting.login = true
  mobxSetting.uid = uid
  mobxSetting.name = name
  mobxSetting.nickName = nickName
}

export const MobxLogoutFunction = mobxSetting => {
  mobxSetting.email = ''
  mobxSetting.login = false
  mobxSetting.uid = ''
  mobxSetting.name = ''
  mobxSetting.nickName = ''
}

export const MobxProfileEditFunction = (mobxSetting, name) => {
  mobxSetting.name = name
}
