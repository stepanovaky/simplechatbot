import React, {useState, useRef} from 'react';
import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState} from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import './App.css'
 
firebase.initializeApp({
  apiKey: "AIzaSyDTr-m-PaxqYpaf5cbrPEWwjo3NycL5JSI",
    authDomain: "chatbot-f26fd.firebaseapp.com",
    projectId: "chatbot-f26fd",
    storageBucket: "chatbot-f26fd.appspot.com",
    messagingSenderId: "833132631796",
    appId: "1:833132631796:web:1a232dcee616538c4ff0a1",
    measurementId: "G-DTD2S5FZ50"

})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
const [user] = useAuthState(auth);


  return (
    <div className="App">
     {user ? <ChatRoom />: <SignIn />}
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }

  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef()
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, {idField: 'id'})

  const [formValue, setFormValue] = useState('') 

  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid, 
      photoURL
    })
    setFormValue('')
    dummy.current.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <>
    <div>

{messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
<div ref={dummy}></div>


      </div>
     <form onSubmit={sendMessage}>
<input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

<button type="submit">Submit</button>
     </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message
  const messageClass = uid === auth.currentUser.uid?'sent':'received';

  return (<div className={`message ${messageClass}`}>
    <img src = {photoURL} />

    <p>{text}</p>
  </div>)
}

export default App;
