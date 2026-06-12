import { collection, getDocs, addDoc, where, query } from "firebase/firestore";
import { database } from "../../firebaseConfig";

export async function GetTransactions(goalIds) {
  if (!goalIds || goalIds.length === 0) {
    return [];
  }

  const transactionQuery = query(
    collection(database, "transactions"),
    where("goalID", "in", goalIds)
  );

  const querySnapshot = await getDocs(transactionQuery);

  const transactions = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return transactions;
}

export async function GetTransactionsByGoalID(goalID) {
  const transactionQuery = query(collection(database, "transactions"), where("goalID", "==", goalID));

  const querySnapshot = await getDocs(transactionQuery);

  const transactions = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return transactions;
}

export async function SetTransactions(transaction) {
  const docRef = await addDoc(collection(database, "transactions"), {
    amount: transaction.amount,
    date: transaction.date,
    goalID: transaction.goalID,
  });

  return {
    id: docRef.id,
    amount: transaction.amount,
    date: transaction.date,
    goalID: transaction.goalID,
  };
}
