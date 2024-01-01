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

const auth = getAuth(fireBaseApp);
const db = getFirestore(fireBaseApp);

async function getGroupByID(id: string) {
	if (!checkUserAuthentication()) {
		return new Error({ statusCode: 400 });
	}
	const groupRef = doc(db, `groups/${id}`);
	const groupToGet = (await getDoc(groupRef)).data()!;
	return groupToGet;
}

async function getGroupsByEmail(email: string) {
	if (!checkUserAuthentication()) {
		return new Error({ statusCode: 400 });
	}
	const groupRef = collection(db, "groups");
	const q = query(groupRef, where("users", "array-contains", email));
	const groupsToGet = (await getDocs(q)).docs;
	return groupsToGet;
}

async function createGroup(users: string[]) {
	if (!checkUserAuthentication()) {
		return new Error({ statusCode: 400 });
	}
	const groupRef = collection(db, "groups");
	const email = auth.currentUser?.email!;
	const res = await addDoc(groupRef, { users });
	return res.id;
}

async function updateGroup(id: string, users: string[]) {
	if (!checkUserAuthentication()) {
		return new Error({ statusCode: 400 });
	}
	const groupRef = doc(db, `groups/${id}`);
	const oldGroup = (await getDoc(groupRef)).data();
	if (!oldGroup) return alert(errors.groupNotFound);
	updateDoc(groupRef, { users, lists: oldGroup.lists })
		.then((res) => console.log("Success"))
		.catch((err) => console.error(err));
}

async function deleteGroup(id: string) {
	if (!checkUserAuthentication()) {
		return new Error({ statusCode: 400 });
	}
	const groupRef = doc(db, `groups/${id}`);
	const groupExists = (await getDoc(groupRef)).exists();
	if (!groupExists) return alert(errors.groupNotFound);
	deleteDoc(groupRef)
		.then((res) => console.log("Success"))
		.catch((err) => console.error(err));
}

async function getListsByGroupID(id: string) {
	if (!checkUserAuthentication()) {
		return new Error({ statusCode: 400 });
	}
	const groupRef = doc(db, `groups/${id}`);
	const foundGroup = await getDoc(groupRef);
	if (!foundGroup.exists()) return alert(errors.groupNotFound);
	return foundGroup.data().lists as string[];
}

async function addListToGroup(id: string, list: string) {
	if (!checkUserAuthentication()) {
		return new Error({ statusCode: 400 });
	}
	const groupRef = doc(db, `groups/${id}`);
	const foundGroup = await getDoc(groupRef);
	if (!foundGroup.exists()) return alert(errors.groupNotFound);
	updateDoc(groupRef, {
		users: foundGroup.data().users as string[],
		lists: [...foundGroup.data().lists, list] as string[],
	})
		.then((res) => console.log("Success"))
		.catch((err) => console.error(err));
}

async function deleteListFromGroup(id: string, list: string) {
	if (!checkUserAuthentication()) {
		return new Error({ statusCode: 400 });
	}
	const groupRef = doc(db, `groups/${id}`);
	const foundGroup = await getDoc(groupRef);
	if (!foundGroup.exists()) return alert(errors.groupNotFound);
	const listArray = foundGroup.data().lists as string[];
	updateDoc(groupRef, {
		users: foundGroup.data().users as string[],
		lists: listArray.filter((ele) => ele != list),
	})
		.then((res) => console.log("Success"))
		.catch((err) => console.error(err));
}

export default {
	getGroupByID,
	getGroupsByEmail,
	createGroup,
	updateGroup,
	deleteGroup,
	getListsByGroupID,
	addListToGroup,
	deleteListFromGroup,
};
