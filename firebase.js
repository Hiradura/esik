// Firebase modulok importálása
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase konfiguráció
const firebaseConfig = {
  apiKey: "AIzaSyA6p7PMWu6Au85AQXZ0l5aleAWBR2uUBIg",
  authDomain: "vizsga-55ea5.firebaseapp.com",
  databaseURL: "https://vizsga-55ea5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vizsga-55ea5",
  storageBucket: "vizsga-55ea5.appspot.com",
  messagingSenderId: "457886173828",
  appId: "1:457886173828:web:145dbde8e65d08344a10d1"
};

// Firebase inicializálás
const app = initializeApp(firebaseConfig); // Itt inicializáljuk a Firebase alkalmazást
const auth = getAuth(app); // Auth szolgáltatás
const db = getFirestore(app); // Firestore szolgáltatás

// Bejelentkezés kezelése
function login(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Bejelentkezve:", user.email);

      // Admin jogosultság lekérése Firestore-ból
      const userDocRef = doc(db, "users", user.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.role === 'admin') {
            document.getElementById('admin-panel').style.display = 'block'; // Admin panel megjelenítése
            console.log("Admin jogosultság.");
          } else {
            document.getElementById('admin-panel').style.display = 'none'; // Admin panel elrejtése
            console.log("Nem admin.");
          }
        } else {
          console.error("A felhasználói adatok nem találhatók.");
        }
      }).catch((error) => {
        console.error("Hiba a felhasználói adatok lekérésekor:", error);
      });
    })
    .catch((error) => {
      console.error("Bejelentkezési hiba:", error);
    });
}

// Bejelentkezett felhasználó kezelése
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists() && docSnap.data().role === 'admin') {
      document.getElementById('admin-panel').style.display = 'block'; // Admin panel megjelenítése
    } else {
      document.getElementById('admin-panel').style.display = 'none'; // Admin panel elrejtése
    }
  } else {
    document.getElementById('admin-panel').style.display = 'none'; // Ha nincs bejelentkezve, elrejtjük az admin panelt
  }
});

// Bejelentkezés kezelése email és jelszó alapján
function handleLoginForm(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
}

// Kilépés funkció
function logout() {
  signOut(auth).then(() => {
    document.getElementById('admin-panel').style.display = 'none'; // Admin panel elrejtése
    console.log("Kijelentkezve.");
  }).catch((error) => {
    console.error("Kilépési hiba:", error);
  });
}

// Exportálás, hogy más fájlokban is használható legyen
export { login, handleLoginForm, logout };
