//recebe tudo e transforma em função
const form = {
    email: () => document.getElementById("email"),
    password: () => document.getElementById("password"),
    loginButton: () => document.getElementById("login-button"),
    recoverPassword: () => document.getElementById("recover-password")
}
//verifca se os campos de email e senha são validos
function ValidateFields() {
    toggleRecoverPasswordButton()
    toggleLoginButton()
}
//verifca se o email é valido
function isEmailValid() {
    const email = form.email().value
    if (!email) {
        return false
    }
    return validateEmail(email)
    // tem como deixar isso em apenas 1 linha com operador térnario
}

function isPasswordValid() {
    const password = form.password().value
    if (!password) {
        return false
    }
    return true
    // tem como deixar isso em apenas 1 linha com operador térnario
}
//function de login verifica se tem o login para logar 
function login() {
    showLoading()
    firebase.auth().signInWithEmailAndPassword(form.email().value,form.password().value).then(response => {
        hideLoading()
        window.location.href = "home/home.html"
    }).catch(error => {
      hideLoading()
      alert(errorMessage(error))
    })
}
//vê os erros e bota na tela como alert
function errorMessage(error) {
    if (error.code == "auth/user-not-found" || error.code == "auth/invalid-login-credentials"){
        return "Usuário Não Existe"
    }
    if (error.code == "auth/wrong-password") {
        return "Senha Inválida"
    }
    return error.message
}
function register() {
    window.location.href = "register/register.html"
}
//manda email de recuperação de senha para o email
function recoverPassword() {
    showLoading()
    firebase.auth().sendPasswordResetEmail(form.email().value).then(() => {
        hideLoading()
        alert("email enviado com sucesso")
    }).catch(error => {
        hideLoading()
        alert(errorMessage(error))
    })
}

//ativa os botão de recuperar senha
function toggleRecoverPasswordButton() {
    const recoverPasswordButton = form.recoverPassword();
    recoverPasswordButton.disabled = !isEmailValid();
}
//ativa o botão de login
function toggleLoginButton() {
    const loginButton = form.loginButton();
    loginButton.disabled = !isEmailValid() || !isPasswordValid();
}

//isso não tá funcionando mas na teoria é pra logar o usuario automaticamente
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        window.location.href = "home/home.html"
    }else{
        alert("usuario não existe.")
    }
})