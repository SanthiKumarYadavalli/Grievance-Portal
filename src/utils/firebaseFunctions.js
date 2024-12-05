import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const greivanceCollection = collection(db, "greivances");

export const createGreivance = async (data) => {
  try {
    const docRef = await addDoc(greivanceCollection, data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getAllGreivances = async () => {
  try {
    const querySnapshot = await getDocs(greivanceCollection);
    const submissions = [];
    querySnapshot.forEach((doc) => {
      submissions.push({ id: doc.id, ...doc.data() });
    });
    return submissions;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    throw e;
  }
};
