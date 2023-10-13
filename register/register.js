function register() {
    showLoading()
    const email = form.email().value
    const password = form.password().value
    firebase.auth().createUserWithEmailAndPassword(
        email,password
    ).then(() =>{
        hideLoading()
        window.location.href = "../../home/home.html"
    }).catch(error => {
        hideLoading()
        alert(errorMessage(error))
    })
}

function errorMessage(error) {
    if (error.code == "auth/email-already-in-use"){
        return "email ja está em uso"
    }
    return error.message
}


function toggleRegisterButton() {
    form.registerButton().disabled = !isFormValid()
}

function isFormValid() {
    const email = form.email().value
    if (!email || !validateEmail(email)) {
        return false
    }

    const password = form.password().value
    if (!password || password.length < 6) {
        return false
    }    

    const confirmPassword = form.confirmPassword().value
    if (password != confirmPassword) {
        return false;
    }
    
    
    return true
}

function loginButton(){
    window.location.href = "../index.html"
}

/* const auth = firebase.auth() */



const form = {
    email: () => document.getElementById("email"),
    password: () => document.getElementById("password"),
    confirmPassword: () =>  document.getElementById("confirmPassword"),
    registerButton: () => document.getElementById("register-button"),
    googleButton: () => document.getElementById("googleButton")
}