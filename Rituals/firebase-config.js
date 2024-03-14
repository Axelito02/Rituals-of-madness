// // // Reemplaza los imports con requires
// const { initializeApp } = require("firebase/app");
// const { getFirestore, collection, getDocs, addDoc, onSnapshot } = require("firebase/firestore");
// // // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCuJNq9J7qLax6ZO8WGpqrfomXnLuRWXhQ",
//   authDomain: "rituals-of-madness.firebaseapp.com",
//   databaseURL: "https://rituals-of-madness-default-rtdb.firebaseio.com",
//   projectId: "rituals-of-madness",
//   storageBucket: "rituals-of-madness.appspot.com",
//   messagingSenderId: "639478617555",
//   appId: "1:639478617555:web:7d035a4c934bb422240b26"
// };

// // Initialize Firebase
// const firebaseapp = initializeApp(firebaseConfig);

// class FireStoreDB {
//     static instance
//     static collections = {}

//     constructor(firebaseAppInstance) {

//         if (FireStoreDB.instance) {
//             return FireStoreDB.instance;
//         }

//         this.database = getFirestore(firebaseAppInstance);
//         FireStoreDB.collections = {
//             'jugadores-actuales': collection(this.database, 'jugadores-actuales'),
//         };

//         FireStoreDB.instance = this;
//     }

//     getCollection = async (collectionName) => {
//         const snapshot = await getDocs(FireStoreDB.collections[collectionName]);
//         const list = snapshot.docs.map(doc => doc.data());
//         return list;
//     }

//     addNewDocumentTo = async (newDocument, collection) => {
//         try {
//             const document = newDocument;
//             const docRef = await addDoc(FireStoreDB.collections[collection], document);
//             console.log(docRef.id);
//         } catch (error) {
//             console.log(`Error adding document to collection: ${error}`);
//         }
//     }

//     updateRealTime = (collection, doSomething) => {
//         const c = FireStoreDB.collections[collection];
//         onSnapshot(c, doSomething);
//     }
// }

// const fireStoreDB = new FireStoreDB(firebaseapp);

// export default fireStoreDB;

// // firebase-config.js

// // // Inicializa Firebase
// // const firebaseConfig = {
// //     apiKey: "AIzaSyCuJNq9J7qLax6ZO8WGpqrfomXnLuRWXhQ",
// //   authDomain: "rituals-of-madness.firebaseapp.com",
// //   databaseURL: "https://rituals-of-madness-default-rtdb.firebaseio.com",
// //   projectId: "rituals-of-madness",
// //   storageBucket: "rituals-of-madness.appspot.com",
// //   messagingSenderId: "639478617555",
// //   appId: "1:639478617555:web:7d035a4c934bb422240b26"
// //   };
  
// //   firebase.initializeApp(firebaseConfig);
  
// //   // Exporta una instancia de Firestore
// //   const db = firebase.firestore();

// //   export default db 
  