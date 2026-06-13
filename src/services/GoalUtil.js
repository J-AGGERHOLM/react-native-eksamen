import { collection, getDocs, addDoc, where, query, doc, deleteDoc } from "firebase/firestore";
import { database } from "../../firebaseConfig";

// Saves a new goal in Firestore.
export async function SetGoal(goal, userId) {
  // Adds the goal to the goals collection.
  const docRef = await addDoc(collection(database, "goals"), {
    completed: goal.completed ?? false,
    dueDate: goal.dueDate,
    name: goal.name,
    startDate: goal.startDate,
    userID: userId,
    amountLeft: goal.amountLeft,
    totalPaid: goal.totalPaid ?? 0,
    target: goal.target,
    percentage: goal.percentage ?? 0,
  });

  // Returns the saved goal with its Firestore id.
  return {
    id: docRef.id,
    completed: goal.completed ?? false,
    dueDate: goal.dueDate,
    name: goal.name,
    startDate: goal.startDate,
    userID: userId,
    amountLeft: goal.amountLeft,
    totalPaid: goal.totalPaid ?? 0,
    target: goal.target,
    percentage: goal.percentage ?? 0,
  };
}

export async function GetGoals(userId) {
  // Creates a Firestore query.
  // collection(database, "goals") points to the "goals" collection in Firestore.
  const queryStatement = query(collection(database, "goals"), where("userID", "==", userId));

  // Sends the query to Firestore and waits for the result.
  const queryCall = await getDocs(queryStatement);

  // Converts the Firestore documents into normal JavaScript objects.
  // queryCall.docs is an array of all documents returned by the query.
  return queryCall.docs.map((goalDoc) => ({
    //id of the document
    id: goalDoc.id,
    // goalDoc.data() contains all the fields saved inside the Firestore document,
    // The spread operator (...) copies all those fields into this object.
    ...goalDoc.data(),
  }));
}

//Delete goals:
export async function DeleteGoal(goalId) {
  await deleteDoc(doc(database, "goals", goalId));
}
