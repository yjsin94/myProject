/* mobx 라이브러리로 상태 관리 */
import { useContext, createContext } from 'react'
import { makeAutoObservable } from 'mobx'

const values = createContext(
  makeAutoObservable({
    login: false,
    email: '',
    name: '',
    uid: '',
    infoChange: false
  })
)

const useMobxSettings = () => {
  return useContext(values)
}

export default useMobxSettings
