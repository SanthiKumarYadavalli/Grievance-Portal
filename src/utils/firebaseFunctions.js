import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

const greivanceCollection = collection(db, "greivances");

export const createGreivance = async (data) => {
  try {
    const submissions = await getAllGreivances();
    data.body = data.body.trim();
    data.subject = data.subject.trim();
    let spam = false;
    submissions.forEach((submission) => {
      if (
        submission.subject === data.subject ||
        submission.body === data.body
      ) {
        spam = true;
      }
    });
    const docRef = await addDoc(greivanceCollection, {
      ...data,
      createdTime: serverTimestamp(),
      spam,
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getAllGreivances = async () => {
  try {
    const querySnapshot = await getDocs(
      query(greivanceCollection, orderBy("createdTime", "desc"))
    );
    const submissions = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({ ...data, id: doc.id });
    });
    console.log(submissions);
    return submissions;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    throw e;
  }
};
