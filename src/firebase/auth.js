import firebaseApp from 'src/firebase/firebaseConfig'
import { getAuth } from 'firebase/auth'

const auth = getAuth(firebaseApp)

export default auth
