import { SET_USER } from "../Actions/ActionType";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const SignInWithGoogle = (props) => {
  const provider = new GoogleAuthProvider();
  return (dispatch) => {
    signInWithPopup(auth, provider)
      .then((payload) => {
        dispatch(setUser(payload.user));
      })
      .catch((err) => alert(err.message));
  };
};
