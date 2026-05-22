import { collection, getDocs, addDoc } from "firebase/firestore";
import { database } from '../../firebaseConfig';

export async function SetGoal(goal) {
    await addDoc(collection(database, "goals"), {
        id: goal.id,
        completed: goal.completed,
        dueDate: goal.dueDate,
        name: goal.name,
        startDate: goal.startDate,
        userID: goal.userID,
        amountLeft: goal.amountLeft,
        totalPaid: goal.totalPaid,
        target: goal.target,
        percentage: goal.percentage,
    });
}

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