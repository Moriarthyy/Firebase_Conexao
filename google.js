function loginWithGoogle() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(googleProvider).then(() => {
        window.location.href = "../home/home.html";
    }).catch(error => {
        console.error(error);
    });
}