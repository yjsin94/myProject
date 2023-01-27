import firebaseApp from 'src/firebase/firebaseConfig'
import { getFirestore } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

export default db
