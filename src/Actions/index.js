import { SET_USER } from "../Actions/ActionType";
import { auth, db, storage } from "../firebase";
import firebase from "firebase/compat/app";

import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { addDoc, collection, Timestamp } from "firebase/firestore";

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

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
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

// export function postArticleAPI(payload) {
//   return (dispatch) => {
//     if (!payload.image) {
//       const reff = ref(storage, `images/${payload.image.name}`);
//       const upload = uploadBytesResumable(reff, payload.image);
//       upload.on(
//         "state_changed",
//         (snapshot) => {
//           const progress = Math.round(
//             (snapshot.BytesTransferred / snapshot.totalBytes) * 100
//           );
//           console.log(`Progress: ${progress}%`);
//           if (snapshot.state === "RUNNING") {
//             console.log(`Progress: ${progress}%`);
//           }
//         },
//         (error) => {
//           console.log(error.code);
//         },

//         getDownloadURL(upload.snapshot.ref)
//           .then((url) => {
//             const articleRef = collection(db, "Articles");
//             articleRef.addDoc({
//               actor: {
//                 description: payload.user.email,
//                 title: payload.user.displayName,
//                 timestamp: Timestamp.now().toDate(),
//                 image: url,
//               },
//               video: C
//               sharedImg: url,
//               comments: 0,
//               description: payload.description,
//             });
//           })
//           .catch((err) => {
//             console.log("image uploaded error");
//           })
//       );
//     }
//   };
// }

export function postArticleAPI(payload) {
  return (dispatch) => {
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
              timestamp: Timestamp.now().toDate(),
              image: payload.user.photoURL,
            },
            video: payload.video,
            sharedImg: downloadURL,
            comments: 0,
            description: payload.description,
          });
        }
      );
    }
  };
}
