import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../../firebaseConfig";

export async function GetTransactions(goalIds) {
  if (!goalIds || goalIds.lenght === 0) {
    return [];
  }

  const query = await getDocs(collection(database, "transactions"), where("goalID", "in", goalIds));

  const transactions = query
    ? query.docs.map((doc) => ({
        // get the reference id. add to specific goal
        id: doc.id,
        ...doc.data(),
      }))
    : [];

  return transactions;
}
