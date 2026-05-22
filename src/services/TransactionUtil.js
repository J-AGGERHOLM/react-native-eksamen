import { collection, getDocs } from "firebase/firestore";
import { database } from '../../firebaseConfig';



export async function GetTransactions() {
    const query = await getDocs(collection(database, "transactions"));

    const transactions = query
        ? query.docs.map((doc) => ({
            // get the reference id. add to specific goal
            id: doc.id,
            ...doc.data(),
        }))
        : [];

    return transactions;
}