import firebaseApp from 'src/firebase/firebaseConfig'
import { getStorage } from 'firebase/storage'

const storage = getStorage(firebaseApp)

export default storage
