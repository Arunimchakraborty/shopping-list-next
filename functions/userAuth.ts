import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	User,
} from "firebase/auth";
import firebaseApp from "../services/firebase";
import { cookies } from "next/headers";
import {
	getFirestore,
	getDoc,
	updateDoc,
	doc,
	setDoc,
	addDoc,
	collection,
} from "@firebase/firestore/lite";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const cookieStore = cookies();
const provider = new GoogleAuthProvider();

function googleLogIn() {
	signInWithPopup(auth, provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result)!;
			const token = credential.accessToken;
			cookieStore.set("googleCredToken", token!);
			// The signed-in user info.
			const user = result.user;
			console.log(user);
			addUserToDB(user);
			return user;
			// IdP data available using getAdditionalUserInfo(result)
			// ...
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			console.error({ errorCode, errorMessage, email, credential });
			// ...
		});
}

function logOut() {
	signOut(auth)
		.then(() => {
			// Sign-out successful.
			cookieStore.delete("googleCredToken");
			console.log("Logged out successfully");
			return true;
		})
		.catch((error) => {
			console.error(error);
		});
}

async function addUserToDB(user: User) {
	const userRef = doc(db, `users/${user.email}`);
	console.log("set Ref");
	const foundUserDoc = await getDoc(userRef);
	console.log("Found Doc");
	console.log(foundUserDoc.exists());

	if (!foundUserDoc.exists()) {
		await setDoc(userRef, {
			email: user.email,
			name: user.displayName,
			uuid: user.uid,
			photoUrl: user.photoURL,
			emailVerified: user.emailVerified,
		});
		console.log("Added to DB");
	}
}

export default { googleLogIn, logOut };
