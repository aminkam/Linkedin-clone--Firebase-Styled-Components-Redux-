import { SET_USER, SET_LOADING_STATUS } from "../Actions/ActionType";
import { auth, db, storage } from "../firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

//............................................

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
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

export function getUserAuth() {
  return (dispatch) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((err) => console.log(err.message));
  };
}

export function postArticleAPI(payload) {
  return (dispatch) => {
    dispatch(setLoading(true));
    if (payload.image !== "") {
      const reff = ref(storage, `images/${payload.image.name}`);
      const upload = uploadBytesResumable(reff, payload.image);
      upload.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(`Progress : ${progress}%`);
          if (snapshot.state === "RUNNING") {
            console.log(`Progress: ${progress}%`);
          }
        },
        (error) => console.log(error.code),
        async () => {
          const downloadURL = await getDownloadURL(upload.snapshot.ref);
          const amin = collection(db, "articles");
          addDoc(amin, {
            actor: {
              description: payload.user.email,
              title: payload.user.displayName,
              date: Timestamp.now().toDate(),
              image: payload.user.photoURL,
            },
            video: payload.video,
            sharedImg: downloadURL,
            comments: 0,
            description: payload.description,
          });
          dispatch(setLoading(false));
        }
      );
    } else if (payload.video) {
      const amin = collection(db, "articles");
      addDoc(amin, {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: Timestamp.now().toDate(),
          image: payload.user.photoURL,
        },
        video: payload.video,
        sharedImg: "",
        comments: 0,
        description: payload.description,
      });
      dispatch(setLoading(false));
    }
  };
}

// export function getArticleAPI() {
//   return (dispatch) => {
//     let payload;
//     const colRef = collection((db, "articles"), orderBy("actor.date", "desc"));
//     // const q = query(collection(db, "guides"), orderBy("actor.date", "desc"));
//     onSnapshot(colRef, (snapshot) => {
//       payload = snapshot.docs.map((doc) => doc.data());
//       console.log(payload);
//     });
//   };
// }
