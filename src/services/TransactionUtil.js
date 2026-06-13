import { collection, getDocs, addDoc, where, query, doc, deleteDoc } from "firebase/firestore";
import { database } from "../../firebaseConfig";

// Fetches transactions for multiple goals.
export async function GetTransactions(goalIds) {
  // Returns an empty array if there are no goal ids.
  if (!goalIds || goalIds.length === 0) {
    return [];
  }

  // Creates a Firestore query for transactions matching the goal ids.
  const transactionQuery = query(collection(database, "transactions"), where("goalID", "in", goalIds));

  // Executes the Firestore query
  const querySnapshot = await getDocs(transactionQuery);

  // Executes the Firestore query
  const transactions = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Converts Firestore documents into normal JavaScript objects.
  return transactions;
}

// Fetches transactions for one specific goal.
export async function GetTransactionsByGoalID(goalID) {
  // Creates a Firestore query for transactions matching one goal id.
  const transactionQuery = query(collection(database, "transactions"), where("goalID", "==", goalID));

  // Executes the Firestore query.
  const querySnapshot = await getDocs(transactionQuery);

  // Converts Firestore documents into normal JavaScript objects.
  const transactions = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Returns the fetched transactions.
  return transactions;
}

// Saves a new transaction in Firestore.
export async function SetTransactions(transaction) {
  // Adds the transaction to the transactions collection.
  const docRef = await addDoc(collection(database, "transactions"), {
    amount: transaction.amount,
    date: transaction.date,
    goalID: transaction.goalID,
  });

  // Returns the saved transaction with its Firestore id.
  return {
    id: docRef.id,
    amount: transaction.amount,
    date: transaction.date,
    goalID: transaction.goalID,
  };
}

// Deletes one transaction from Firestore.
export async function DeleteTransaction(transactionId) {
  await deleteDoc(doc(database, "transactions", transactionId));
}
