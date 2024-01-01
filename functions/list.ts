import { getAuth } from "@firebase/auth";
import {
	getFirestore,
	addDoc,
	updateDoc,
	deleteDoc,
	getDoc,
	collection,
	doc,
	getDocs,
	query,
	where,
} from "@firebase/firestore/lite";
import Error from "next/error";
import fireBaseApp from "@/services/firebase";
import checkUserAuthentication from "@/middlewares/checkUserAuthentication";
import errors from "@/constants/errors";

interface listItem {
	name: string;
	quantity: number;
	unit: string;
}

interface listData {
	email: string;
	items: listItem[];
}

const auth = getAuth(fireBaseApp);
const db = getFirestore(fireBaseApp);

async function getListByID(id: string) {
	if (!checkUserAuthentication()) {
		return new Error({ statusCode: 400 });
	}
	const listRef = doc(db, `lists/${id}`);
	const listToGet = (await getDoc(listRef)).data()!;
	return listToGet;
}

async function getListsByEmail(email: string) {
	if (!checkUserAuthentication()) {
		return new Error({ statusCode: 400 });
	}
	const listRef = collection(db, "lists");
	const q = query(listRef, where("email", "==", email));
	const listsToGet = (await getDocs(q)).docs;
	return listsToGet;
}

async function createList(items: listItem[]) {
	if (!checkUserAuthentication()) {
		return new Error({ statusCode: 400 });
	}
	const listRef = collection(db, "lists");
	const email = auth.currentUser?.email!;
	const res = await addDoc(listRef, { email, items });
	return res.id;
}

async function updateList(id: string, items: listItem[]) {
	if (!checkUserAuthentication()) {
		return new Error({ statusCode: 400 });
	}
	const listRef = doc(db, `lists/${id}`);
	const oldList = (await getDoc(listRef)).data();
	if (!oldList) return alert(errors.listNotFound);
	updateDoc(listRef, { email: oldList.email, items })
		.then((res) => console.log("Success"))
		.catch((err) => console.error(err));
}

async function deleteList(id: string) {
	if (!checkUserAuthentication()) {
		return new Error({ statusCode: 400 });
	}
	const listRef = doc(db, `lists/${id}`);
	const listExists = (await getDoc(listRef)).exists();
	if (!listExists) return alert(errors.listNotFound);
	deleteDoc(listRef)
		.then((res) => console.log("Success"))
		.catch((err) => console.error(err));
}

export default {
	getListByID,
	getListsByEmail,
	createList,
	updateList,
	deleteList,
};
