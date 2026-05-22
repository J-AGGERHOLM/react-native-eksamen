import { collection, getDocs } from "firebase/firestore";
import { database } from '../../firebaseConfig'


export async function GetGoals() {
    const query = await getDocs(collection(database, "goals"));

    const startGoals = query
        ? query.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        : [];

    return startGoals;
}