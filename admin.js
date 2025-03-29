if (!firebase.apps.length) {
    const firebaseConfig = {
        apiKey: "AIzaSyA6p7PMWu6Au85AQXZ0l5aleAWBR2uUBIg",
        authDomain: "vizsga-55ea5.firebaseapp.com",
        databaseURL: "https://vizsga-55ea5-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "vizsga-55ea5",
        storageBucket: "vizsga-55ea5.appspot.com",
        messagingSenderId: "457886173828",
        appId: "1:457886173828:web:145dbde8e65d08344a10d1"
    };
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // Már inicializálva van, használjuk a meglévőt
}

// Kommentek megjelenítése (csak a reportolt kommentek)
firebase.auth().onAuthStateChanged(function (user) {
    const adminLoginToggle = document.getElementById('admin-login-toggle');
    const adminLogoutButton = document.getElementById('admin-logout-button');

    if (user) {
        // Ellenőrizzük, hogy admin jogosultsággal rendelkezik-e
        user.getIdTokenResult().then((idTokenResult) => {
            if (idTokenResult.claims.admin) { // Ha admin jogosultsága van
                document.getElementById('admin-panel-screen').style.display = 'block';
                showAdminAuthMessage("Sikeres bejelentkezés, Admin!", "green");
                viewReportedComments(); // A kommentek betöltése
            } else {
                // Ha ideiglenes admin jogosultságot szeretnél
                showAdminAuthMessage("Ideiglenes admin jogosultság engedélyezve!", "green");
                document.getElementById('admin-panel-screen').style.display = 'block';
                viewReportedComments(); // A kommentek betöltése
            }
        }).catch((error) => {
            console.error("Hiba a token lekérésekor:", error);
        });
    } else {
        if (adminLoginToggle) adminLoginToggle.style.display = 'inline-block';
        if (adminLogoutButton) adminLogoutButton.style.display = 'none';
    }
});

// Admin üzenet megjelenítése
function showAdminAuthMessage(message, color = "red") {
    let msg = document.getElementById('admin-auth-message');
    if (!msg) {
        msg = document.createElement('p');
        msg.id = 'admin-auth-message';
        msg.style.marginTop = "10px";
        msg.style.textAlign = "center";
        document.body.appendChild(msg);
    }
    msg.textContent = message;
    msg.style.color = color;
    msg.style.display = 'block';
    setTimeout(() => { msg.textContent = ""; }, 5000);
}

// Kommentek megjelenítése (csak a reportolt kommentek)
// Kommentek megjelenítése (csak a reportolt kommentek)
function viewReportedComments() {
    const commentsList = document.getElementById('admin-comments-list');
    commentsList.innerHTML = "<h3>Reportált kommentek</h3>";

    const commentsRef = firebase.database().ref('comments');
    commentsRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            let foundReport = false;

            snapshot.forEach((commentSnapshot) => {
                const commentId = commentSnapshot.key;
                const commentData = commentSnapshot.val();

                if (commentData.reports) {
                    foundReport = true;
                    Object.keys(commentData.reports).forEach((reportId) => {
                        const report = commentData.reports[reportId];

                        const commentElement = document.createElement('div');
                        commentElement.classList.add('comment-item');
                        commentElement.innerHTML = `
                            <p><strong>Felhasználó:</strong> ${commentData.name}</p>
                            <p><strong>Komment:</strong> ${commentData.text}</p>
                            <p><strong>Jelentés oka:</strong> ${report.reportReason}</p>
                            <p><strong>Jelentés ideje:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
                            <button onclick="deleteComment('${commentId}')">Komment törlése</button>
                        `;
                        commentsList.appendChild(commentElement);
                    });
                }
            });

            if (!foundReport) {
                commentsList.innerHTML += "<p>Nincsenek jelentett kommentek.</p>";
            }
        } else {
            commentsList.innerHTML += "<p>Nincsenek kommentek.</p>";
        }
    });
}
function deleteComment(commentId) {
    if (confirm("Biztosan törölni szeretnéd ezt a kommentet?")) {
        firebase.database().ref('comments/' + commentId).remove()
            .then(() => {
                alert("Komment sikeresen törölve!");
                viewReportedComments(); // Frissítjük a kommentlistát
            })
            .catch((error) => {
                console.error("Hiba a komment törlésekor:", error);
                alert("Nem sikerült törölni a kommentet.");
            });
    }
}function deleteComment(commentId) {
    if (confirm("Biztosan törölni szeretnéd ezt a kommentet?")) {
        firebase.database().ref('comments/' + commentId).remove()
            .then(() => {
                alert("Komment sikeresen törölve!");
                viewReportedComments(); // Frissítjük a kommentlistát
            })
            .catch((error) => {
                console.error("Hiba a komment törlésekor:", error);
                alert("Nem sikerült törölni a kommentet.");
            });
    }
}

// Tegyük globálissá, hogy HTML onclick elérje
window.deleteComment = deleteComment;


// Felhasználók listázása
function viewRegisteredUsers() {
    const usersList = document.getElementById('admin-users-list');
    usersList.innerHTML = '';

    firebase.database().ref('users').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            const userId = childSnapshot.key;
            const userRole = user.role || 'user'; // Alapértelmezett szerepkör 'user'

            const userElement = document.createElement('div');
            userElement.classList.add('user-item');
            userElement.innerHTML = `
                <p><strong>Felhasználó: </strong>${user.email}</p>
                <p><strong>Szerepkör: </strong>${userRole}</p>
                <button onclick="updateUserRole('${userId}', 'admin')">Admin jog</button>
                <button onclick="updateUserRole('${userId}', 'user')">User jog</button>
            `;
            usersList.appendChild(userElement);
        });
    });
}

// Felhasználó szerepkörének frissítése
function updateUserRole(userId, newRole) {
    const userRef = firebase.database().ref('users/' + userId);
    userRef.update({
        role: newRole
    }).then(() => {
        alert(`A felhasználó szerepköre ${newRole}-ra változott!`);
        viewRegisteredUsers(); // Frissítjük a felhasználók listáját
    }).catch((error) => {
        console.error("Hiba a szerepkör módosításakor:", error);
    });
}

// Admin bejelentkezés és jogosultság kezelés
firebase.auth().onAuthStateChanged(function (user) {
    const adminLoginToggle = document.getElementById('admin-login-toggle');
    const adminLogoutButton = document.getElementById('admin-logout-button');

    if (user) {
        // Ellenőrizzük, hogy admin jogosultsággal rendelkezik-e
        user.getIdTokenResult().then((idTokenResult) => {
            if (idTokenResult.claims.admin) { // Ha admin jogosultsága van
                document.getElementById('admin-panel-screen').style.display = 'block';
                showAdminAuthMessage("Sikeres bejelentkezés, Admin!", "green");
                viewReportedComments(); // Kommentek betöltése
                viewRegisteredUsers();  // Felhasználók betöltése
            } else {
                showAdminAuthMessage("Ideiglenes admin jogosultság engedélyezve!", "green");
                document.getElementById('admin-panel-screen').style.display = 'block';
                viewReportedComments(); // Kommentek betöltése
            }
        }).catch((error) => {
            console.error("Hiba a token lekérésekor:", error);
        });
    } else {
        if (adminLoginToggle) adminLoginToggle.style.display = 'inline-block';
        if (adminLogoutButton) adminLogoutButton.style.display = 'none';
    }
});

// Admin üzenet megjelenítése
function showAdminAuthMessage(message, color = "red") {
    let msg = document.getElementById('admin-auth-message');
    if (!msg) {
        msg = document.createElement('p');
        msg.id = 'admin-auth-message';
        msg.style.marginTop = "10px";
        msg.style.textAlign = "center";
        document.body.appendChild(msg);
    }
    msg.textContent = message;
    msg.style.color = color;
    msg.style.display = 'block';
    setTimeout(() => { msg.textContent = ""; }, 5000);
}

// Admin logout
document.getElementById('admin-logout-button').addEventListener('click', function() {
    firebase.auth().signOut().then(() => {
        showAdminAuthMessage("Kijelentkezve!");
        document.getElementById('admin-login-toggle').style.display = 'inline-block';
        document.getElementById('admin-logout-button').style.display = 'none';
        document.getElementById('admin-panel-screen').style.display = 'none';
    }).catch((error) => {
        console.error("Kijelentkezési hiba: ", error);
    });
});
