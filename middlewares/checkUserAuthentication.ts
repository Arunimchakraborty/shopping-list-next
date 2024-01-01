import errors from "@/constants/errors"
import { getAuth } from "@firebase/auth";
import fireBaseApp from "@/services/firebase"

const auth = getAuth(fireBaseApp)

export default function checkUserAuthentication(){
  if (!auth.currentUser){
    alert(errors.userNotAuthenticated)
    console.error(errors.userNotAuthenticated)
    return false
  }
  else return true
}