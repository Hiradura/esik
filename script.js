let auth = firebase.auth();
let database = firebase.database();

let canvas, ctx;
let cat, foods, score, lives, gameOver;
let foodImages = [];
let catImage;
let badImages = [];
let foodFallSpeed = 6;
let isRegistering = false;
const speedIncreaseInterval = 30000;
const speedIncrement = 0.5;

function startGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "flex";
    document.getElementById("game-container").style.background = "url(background.jpeg') no-repeat center center/cover";
    document.getElementById("game-over-screen").style.display = "none";

    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    catImage = new Image();
    catImage.src = "cat.png";

    foodImages = [new Image(), new Image(), new Image()];
    foodImages[0].src = "food1.png";
    foodImages[1].src = "food2.png";
    foodImages[2].src = "food3.png";

    badImages = [new Image(), new Image(), new Image()];
    badImages[0].src = "trash1.png";
    badImages[1].src = "trash2.png";
    badImages[2].src = "trash3.png";

    cat = {
        x: canvas.width / 2 - 50,
        y: canvas.height - 150,
        width: 150,
        height: 150,
        speed: 15,
        moveLeft: false,
        moveRight: false
    };

    foods = [];
    score = 0;
    lives = 3;
    gameOver = false;

    let imagesLoaded = 0;
    let totalImages = foodImages.length + badImages.length + 1;

    function imageLoaded() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            gameLoop();
        }
    }

    catImage.onload = imageLoaded;
    foodImages.forEach(img => img.onload = imageLoaded);
    badImages.forEach(img => img.onload = imageLoaded);
}

function quitGame() {
    document.getElementById("game-screen").style.display = "none";
    document.getElementById("start-screen").style.display = "flex";
    document.getElementById("game-over-screen").style.display = "none";
    document.getElementById("game-container").style.background = "url(menu-background.jpeg') no-repeat center center/cover";

    foods = [];
    score = 0;
    lives = 3;
    gameOver = false;
}
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") cat.moveLeft = true;
  if (event.key === "ArrowRight") cat.moveRight = true;
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") cat.moveLeft = false;
  if (event.key === "ArrowRight") cat.moveRight = false;
});

function createFood() {
  const x = Math.random() * (canvas.width - 40) + 20;
  const isBad = Math.random() < 0.5;
  const imgArray = isBad ? badImages : foodImages;
  const imageIndex = Math.floor(Math.random() * imgArray.length);
  foods.push({ x: x, y: -40, img: imgArray[imageIndex], isBad: isBad });
}

function moveCat() {
  if (cat.moveLeft && cat.x > 0) cat.x -= cat.speed;
  if (cat.moveRight && cat.x + cat.width < canvas.width) cat.x += cat.speed;
}

function moveFoods() {
  for (let i = foods.length - 1; i >= 0; i--) {
      foods[i].y += 3;

      if (
          foods[i].y + 40 > cat.y &&
          foods[i].x > cat.x &&
          foods[i].x < cat.x + cat.width
      ) {
          if (foods[i].isBad) {
              lives--;
              if (lives <= 0) {
                  gameOver = true;
                  startGameOver();
              }
          } else {
              score++;
          }
          foods.splice(i, 1);
      } else if (foods[i].y > canvas.height) {
          foods.splice(i, 1);
      }
  }
}

function drawCat() {
  ctx.drawImage(catImage, cat.x, cat.y, cat.width, cat.height);
}

function drawFoods() {
  foods.forEach(food => {
      ctx.drawImage(food.img, food.x, food.y, 80, 80);
  });
}

function drawScoreAndLives() {
  ctx.fillStyle = "#072530";
  ctx.font = "20px 'Arial Rounded MT Bold', Arial, sans-serif";
  ctx.fillText("Score: " + score, 10, 30);

  const heartImage = new Image();
  heartImage.src = "heart.png";
  for (let i = 0; i < lives; i++) {
      ctx.drawImage(heartImage, canvas.width - 30 - (i * 30), 10, 25, 25);
  }
}

function startGameOver() {
  document.getElementById("final-score").textContent = "Your Score: " + score;
  document.getElementById("game-over-screen").style.display = "flex";
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!gameOver) {
      moveCat();
      moveFoods();
      drawCat();
      drawFoods();
      drawScoreAndLives();
  } else {
      startGameOver();
  }
  if (Math.random() < 0.02) createFood();
  if (!gameOver) requestAnimationFrame(gameLoop);
}
function extraFunction() {
  const loginModal = document.getElementById('login-modal');
  if (loginModal) {
    loginModal.style.display = 'flex';
  }

  isRegistering = false;
  switchAuthMode();
}
function extraFunction() {
  const loginModal = document.getElementById('login-modal');
  if (loginModal) {
    loginModal.style.display = 'flex';
  }

  isRegistering = false;
  switchAuthMode();
}

document.addEventListener('DOMContentLoaded', function() {
  let isRegistering = true; // Kezdeti állapot regisztráció

  // Az első funkció (extraFunction)
  function extraFunction() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
      loginModal.style.display = 'flex';
    }
    isRegistering = false;
    switchAuthMode();
  }

  // A második funkció (extraFunction2)
  function extraFunction2() {
    const menuModal = document.getElementById("menu-modal");
    const userInfo = document.getElementById("user-info");

    if (menuModal) {
        menuModal.style.display = "block";  // vagy "flex", ha CSS flexboxot használsz
    }

    if (userInfo) {
        userInfo.style.display = "block";
    }

    isRegistering = true;
    switchAuthMode();
}


  // Az autentikációs mód váltása
  function switchAuthMode() {
    const title = document.getElementById('modal-title');
    const nameField = document.getElementById('register-name');
    const button = document.getElementById('login-button');
    const toggleText = document.getElementById('toggle-text');
    const loggedInSection = document.getElementById('logged-in-section');
    const authSection = document.getElementById('auth-section');
    const loginToggle = document.getElementById('login-toggle');
    const logoutButton = document.getElementById('logout-button');
    const gameContainer = document.getElementById("game-container");
  
    // Firebase auth státusz változása
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (authSection && loggedInSection) {
          authSection.style.display = 'none';
          loggedInSection.style.display = 'block';
        }
  
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-name').textContent = user.displayName || 'Név nem elérhető';
  
        firebase.database().ref('users/' + user.uid).once('value').then(snapshot => {
          const userData = snapshot.val();
          const userRole = userData ? userData.role : 'user';
          document.getElementById('user-role').textContent = userRole;
  
          const adminLinkContainer = document.getElementById('admin-link-container');
          if (userRole === 'admin') {
            adminLinkContainer.innerHTML = '';
            let adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.style.color = 'blue';
            adminLink.style.fontWeight = 'bold';
            adminLink.textContent = 'Admin Panel';
            adminLinkContainer.appendChild(adminLink);
          } else {
            adminLinkContainer.innerHTML = '';
          }
        });
  
        if (loginToggle) loginToggle.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'inline-block';
  
        // Bejelentkezett állapot esetén háttér beállítása
        gameContainer.style.background = "url('szisza\public\background.jpeg') no-repeat center center/cover";
      } else {
        if (loggedInSection && authSection) {
          loggedInSection.style.display = 'none';
          authSection.style.display = 'block';
        }
  
        if (isRegistering) {
          title.textContent = "Regisztráció";
          nameField.style.display = "block";
          button.textContent = "Regisztrálok";
          toggleText.innerHTML = `Van már fiókod? <a href="#" id="toggle-register">Bejelentkezés</a>`;
        } else {
          title.textContent = "Bejelentkezés";
          nameField.style.display = "none";
          button.textContent = "Bejelentkezés";
          toggleText.innerHTML = `Még nincs fiókod? <a href="#" id="toggle-register">Regisztráció</a>`;
        }
  
        if (logoutButton) logoutButton.style.display = 'none';
        const adminLinkContainer = document.getElementById('admin-link-container');
        adminLinkContainer.innerHTML = '';
  
        // Ha nincs bejelentkezve, a háttér visszaállítása
        gameContainer.style.background = "none";
      }
  
      setTimeout(() => {
        const toggleLink = document.getElementById('toggle-register');
        if (toggleLink) {
          toggleLink.addEventListener('click', function (e) {
            e.preventDefault();
            isRegistering = !isRegistering;
            switchAuthMode();
          });
        }
      }, 0);
    });
  }
  
  // Különböző gombok eseménykezelése
  document.getElementById('login-toggle').addEventListener('click', extraFunction);
  document.getElementById('menu').addEventListener('click', extraFunction2);
});  


// Kijelentkezés
function logout() {
  firebase.auth().signOut().then(() => {
    showAuthMessage("Sikeres kijelentkezés!", "green");
    // Újra megjeleníti az autentikációs szakaszt
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('logged-in-section').style.display = 'none';
  }).catch((error) => {
    showAuthMessage("Hiba a kijelentkezéskor: " + error.message, "red");
  });
}


// Kijelentkezés
function logout() {
  firebase.auth().signOut().then(() => {
    showAuthMessage("Sikeres kijelentkezés!", "green");
    // Újra megjeleníti az autentikációs szakaszt
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('logged-in-section').style.display = 'none';
  }).catch((error) => {
    showAuthMessage("Hiba a kijelentkezéskor: " + error.message, "red");
  });
}

firebase.auth().onAuthStateChanged(function (user) {
  const userInfoSection = document.getElementById('user-info');
  const loginToggle = document.getElementById('login-toggle');
  const logoutButton = document.getElementById('logout-button');
  const adminLinkContainer = document.getElementById('admin-link-container');
  const authMessage = document.getElementById('auth-message');
  const loginModal = document.getElementById('login-modal');
  const startScreen = document.getElementById('start-screen');

  // Biztosítsuk, hogy az elemek léteznek
  if (loginToggle) loginToggle.style.display = 'inline-block';
  if (logoutButton) logoutButton.style.display = 'none';
  if (adminLinkContainer) adminLinkContainer.innerHTML = '';
  if (userInfoSection) userInfoSection.style.display = 'none';

  if (user) {
    if (loginToggle) loginToggle.style.display = 'none';
    if (logoutButton) logoutButton.style.display = 'inline-block';

    const userRef = firebase.database().ref('users/' + user.uid);
    userRef.once('value', function (snapshot) {
      const userData = snapshot.val();
      if (userData) {
        if (userInfoSection) {
          userInfoSection.style.display = 'block';
          userInfoSection.innerHTML = `
            <h3>Bejelentkezve</h3>
            <p>Email: ${user.email}</p>
            <p>Név: ${userData.name || 'N/A'}</p>
            <p>Szerepkör: ${userData.role || 'N/A'}</p>
          `;
        }

        if (userData.role === 'admin' && adminLinkContainer) {
          if (!adminLinkContainer.querySelector('a')) {
            let adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.style.color = 'blue';
            adminLink.style.fontWeight = 'bold';
            adminLink.textContent = 'Admin Panel';
            adminLinkContainer.appendChild(adminLink);
          }
        }
      } else {
        console.error("Felhasználói adatok nem találhatók!");
      }
    });

    setTimeout(() => {
      if (loginModal) loginModal.style.display = 'none';
    }, 100);
    
    if (startScreen) startScreen.style.display = 'flex';

  } else {
    console.warn("Nincs bejelentkezett felhasználó.");
  }
});




// Auth hiba üzenet megjelenítése
function showAuthMessage(message, color) {
  const authMessage = document.getElementById('auth-message');
  authMessage.style.display = 'block';
  authMessage.style.color = color;
  authMessage.textContent = message;
}


// Kijelentkezés
function logout() {
  firebase.auth().signOut().then(() => {
    showAuthMessage("Sikeres kijelentkezés!", "green");
  }).catch((error) => {
    showAuthMessage("Hiba a kijelentkezéskor: " + error.message, "red");
  });
}

// Üzenet megjelenítése
function showAuthMessage(message, color = "red") {
  let msg = document.getElementById('auth-message');
  if (!msg) {
    msg = document.createElement('p');
    msg.id = 'auth-message';
    msg.style.marginTop = "10px";
    msg.style.textAlign = "center";
    document.body.appendChild(msg);
  }
  msg.textContent = message;
  msg.style.color = color;
  msg.style.display = 'block';
  setTimeout(() => { msg.textContent = ""; }, 5000);
}


// Regisztráció vagy bejelentkezés
function loginOrRegister() {
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;
  const name = document.getElementById('register-name') ? document.getElementById('register-name').value : '';

  if (document.getElementById('register-name') && document.getElementById('register-name').style.display !== 'none') {
    // Regisztráció
    if (!name) {
      showAuthMessage("A név mező kitöltése kötelező!", "red");
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        firebase.database().ref('users/' + user.uid).set({
          name: name,
          email: email,
          role: 'user'
        });
        showAuthMessage("Sikeres regisztráció!", "green");
        updateUI(user);  // UI frissítése
      })
      .catch((error) => {
        showAuthMessage("Hiba: " + error.message, "red");
      });
  } else {
    // Bejelentkezés
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        showAuthMessage("Sikeres bejelentkezés!", "green");
        updateUI(firebase.auth().currentUser);  // UI frissítése
      })
      .catch((error) => {
        showAuthMessage("Sikertelen bejelentkezés. Kérlek, próbáld újra!", "red");
      });
  }
}

// Regisztráció funkció
function registerUser() {
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;
  const name = document.getElementById('register-name').value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Felhasználó sikeres regisztrálása
      const user = userCredential.user;

      // Felhasználói adatok mentése a Firebase adatbázisba
      firebase.database().ref('users/' + user.uid).set({
        name: name,
        email: email,
        role: 'user' // alapértelmezett szerepkör
      }).then(() => {
        showAuthMessage("Sikeres regisztráció!", "green");
        // Lehetőséged van további UI frissítésekre is, pl. átirányítani a bejelentkezett felületre.
      }).catch((error) => {
        showAuthMessage("Hiba történt az adatbázis frissítésekor: " + error.message, "red");
      });
    })
    .catch((error) => {
      showAuthMessage("Hiba történt a regisztráció során: " + error.message, "red");
    });
}


// Frissíti a UI-t bejelentkezés után
function updateUI(user) {
  const loginToggle = document.getElementById('login-toggle');
  const logoutButton = document.getElementById('logout-button');
  const userInfoSection = document.getElementById('user-info');
  const menu = document.getElementById('menu');
  const profileImage = document.getElementById('profile-image');
  const userEmail = document.getElementById('user-email');
  const userName = document.getElementById('user-name');
  const userRole = document.getElementById('user-role');

  if (user) {
    if (loginToggle) loginToggle.style.display = 'none';
    if (logoutButton) logoutButton.style.display = 'inline-block';
    
    // A menu modul megjelenítése bejelentkezéskor
    if (menu) menu.style.display = 'block';  // Menu megjelenítése

    // Lekérjük a felhasználói adatokat a Firebase adatbázisból
    const userRef = firebase.database().ref('users/' + user.uid);
    userRef.once('value', function(snapshot) {
      const userData = snapshot.val();
      if (userData) {
        // Felhasználói adatok beállítása
        userEmail.textContent = `Email: ${userData.email}`;
        userName.textContent = `Név: ${userData.name}`;
        userRole.textContent = `Szerepkör: ${userData.role}`;
      }
    });

    // Kép kattintásra megjelenítjük a felhasználói információkat
    if (profileImage) {
      profileImage.addEventListener('click', function() {
        if (userInfoSection) {
          userInfoSection.style.display = 'block';  // Információk megjelenítése
        }
      });
    }

  } else {
    if (loginToggle) loginToggle.style.display = 'inline-block';
    if (logoutButton) logoutButton.style.display = 'none';
    if (userInfoSection) userInfoSection.innerHTML = '';  // Kiürítjük, ha nincs bejelentkezett felhasználó
    
    // A menu modul elrejtése kijelentkezéskor
    if (menu) menu.style.display = 'none';  // Menu elrejtése
  }
}


// Külön függvény az elem adatainak frissítéséhez
function updateElementData() {
  firebase.database().ref('path/to/data').on('value', (snapshot) => {
    const data = snapshot.val();  // Az adatokat itt kapjuk meg

    // Ellenőrizd, hogy az elem létezik a DOM-ban
    const element = document.getElementById('elementId');
    if (element) {
      element.textContent = data.name;  // Frissítjük a textContent-t
    } else {
      console.error('Elem nem található: elementId');
    }
  });
}

// Indítsd el a DOMContentLoaded eseményt
window.addEventListener("DOMContentLoaded", function() {
  updateElementData(); // Az elem frissítése
});

// Show authentication message function (for displaying messages)
function showAuthMessage(message, color) {
  const messageContainer = document.getElementById('auth-message');
  if (messageContainer) {
    messageContainer.innerHTML = message;
    messageContainer.style.color = color;
    messageContainer.style.display = 'block';
    setTimeout(() => {
      messageContainer.style.display = 'none';
    }, 3000);
  }
}


// Üzenet megjelenítése
function showAuthMessage(message, color) {
  const authMessageElement = document.getElementById('auth-message');
  authMessageElement.textContent = message;
  authMessageElement.style.color = color;
}


// Ezután rendezd el az eseményeket
window.addEventListener('DOMContentLoaded', function() {
  // Login modal bezárása
  const closeLoginBtn = document.getElementById('close-login');
  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', function() {
      document.getElementById('login-modal').style.display = 'none';
      document.getElementById('start-screen').style.display = 'flex';
    });
  }

  // Regisztrációs modal bezárása
  const closeRegisterBtn = document.getElementById('close-register');
  if (closeRegisterBtn) {
    closeRegisterBtn.addEventListener('click', function() {
      document.getElementById('register-modal').style.display = 'none';
      document.getElementById('start-screen').style.display = 'flex';
    });
  }

  // Eseménykezelők a Firebase be- és regisztrációhoz
  const registerButton = document.getElementById('register-button');
  const loginButton = document.getElementById('login-button');
  
  if (registerButton) {
    registerButton.addEventListener('click', loginOrRegister);  // Regisztráció
  }
  
  if (loginButton) {
    loginButton.addEventListener('click', loginOrRegister);  // Bejelentkezés
  }

  // Ha a login modalon belül van egy "Regisztráció" gomb (pl. id="open-register"), akkor annak eseménykezelője:
  const openRegisterBtn = document.getElementById('open-register');
  if (openRegisterBtn) {
    openRegisterBtn.addEventListener('click', function() {
      document.getElementById('login-modal').style.display = 'none';
      document.getElementById('register-modal').style.display = 'flex';
    });
  }

  // Hozzászólások betöltése
  loadComments();
});

// Regisztrációs és bejelentkezési logika
function loginOrRegister() {
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;
  const name = document.getElementById('register-name').value;  // Regisztráció esetén

  if (document.getElementById('register-name').style.display !== 'none') {
    // Regisztráció
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Felhasználói adatok mentése Firebase Realtime Database-be
        firebase.database().ref('users/' + user.uid).set({
          name: name,
          email: email,
          role: 'user'  // Alapértelmezett szerepkör
        });

        showAuthMessage("Sikeres regisztráció!", "green");
        // Regisztráció után bejelentkeztethetjük a felhasználót
        firebase.auth().signInWithEmailAndPassword(email, password);
      })
      .catch((error) => {
        const errorMessage = error.message;
        showAuthMessage(errorMessage, "red");
      });
  } else {
    // Bejelentkezés
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        showAuthMessage("Sikeres bejelentkezés!", "green");
        loadUserData(user.uid); // Felhasználói adatok betöltése
      })
      .catch((error) => {
        const errorMessage = error.message;
        showAuthMessage(errorMessage, "red");
      });
  }
}

// Felhasználói adatok betöltése
function loadUserData(uid) {
  const userRef = firebase.database().ref('users/' + uid);
  userRef.once('value', function(snapshot) {
    const userData = snapshot.val();
    console.log(userData);  // A lekért adatokat a konzolra kiírjuk
    // Felhasználói adatok megjelenítése
    document.getElementById('user-info').innerHTML = `
      <p>Bejelentkezve: ${userData.name}</p>
      <p>Email: ${userData.email}</p>
      <p>Szerepkör: ${userData.role}</p>
    `;
  });
}

function postComment() {
  const user = firebase.auth().currentUser;

  if (!user) {
    alert('Kérlek, jelentkezz be a hozzászóláshoz!');
    return;
  }

  const commentText = document.getElementById('comment-input').value.trim();
  const commentName = document.getElementById('comment-name').value.trim() || 'Névtelen';

  if (commentText === '') {
    alert('Kérlek, írj be egy hozzászólást!');
    return;
  }

  const newComment = {
    text: commentText,
    name: commentName,
    timestamp: Date.now(),
    uid: user.uid // opcionálisan mentjük a felhasználó azonosítóját
  };

  firebase.database().ref('comments').pFush(newComment)
    .then(() => {
      document.getElementById('comment-input').value = '';
      loadComments();
    })
    .catch(error => {
      console.error('Hiba a komment beküldésekor:', error);
    });
}

function loadComments() {
  const commentsRef = firebase.database().ref('comments').orderByChild('timestamp');
  commentsRef.off();
  commentsRef.on('value', (snapshot) => {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;
    commentsList.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
      const comment = childSnapshot.val();
      const commentId = childSnapshot.key;
      const commentElement = document.createElement('div');
      commentElement.classList.add('comment');
      commentElement.innerHTML = `
        <p><strong>${comment.name}</strong> (${new Date(comment.timestamp).toLocaleString()}):</p>
        <p>${comment.text}</p>
        <button onclick="reportComment('${commentId}')">Jelentés</button>
        <hr>
      `;
      commentsList.prepend(commentElement);
    });
  });
}

function showAuthMessage(message, color = "red") {
  const msgElem = document.getElementById('auth-message');
  if (msgElem) {
    msgElem.textContent = message;
    msgElem.style.color = color;
    msgElem.style.display = 'block';

    setTimeout(() => {
      msgElem.textContent = "";
    }, 5000);
  } 
}
