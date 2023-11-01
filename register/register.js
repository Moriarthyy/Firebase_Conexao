/* essa função ira ser chamada assim que o formulário estiver preenchido e o usuário tiver clicado no
botão de registrar 
primeiramente ira mostrar o loading para chegar o registro na api
iremos pegar os valores do campo de email e senha e armazenar em duas variaveis sendo email e password
iremos usar o comando createUserWithEmailAndPassword(aqui recebendo as variaveis com os valores dos campos de email e senha ou seja email e password)
caso essa ação tenha sido concluida com sucesso iremos para o then que ira esconder o loading e redirecionar para a home do site
caso a ação tenha dado algum erro ira esconder o loading e ser mostrado na tela o erro. */
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
//caso ja exista um usuário registrado com esse email irá mostrar um aviso na tela que o email ja está em uso.
function errorMessage(error) {
    if (error.code == "auth/email-already-in-use"){
        return "email ja está em uso"
    }
    return error.message
}

/* verificará se o formulário é válido caso o formulário seja válido será o inverso para habilitar o botão pois os botões só serão
clicaveis caso todos os campos tenham sidos preenchidos corretamente // o botão é disabled True para ficar desabilitado como o 
formulário é válido ele retorna true então disabled = inverso do formulário para ficar disabled false e ficar clicavel */
function toggleRegisterButton() {
    form.registerButton().disabled = !isFormValid()
}
//verificação se os dados estão corretos para validação
function isFormValid() {
    //email recebe o que colocamos no campo de email
    /* validateEmail é a função que recebe o script para saber se o email é 
    realmente válido caso o email seja válido ele retornara True caso seja 
    inválido retornara false  */
    const email = form.email().value
    if (!email || !validateEmail(email)) {
        return false
    }
    //password recebe o que colocamos no campo de senha
    /* caso a senha seja inválida ou menor que 6 digitos retornará falso
    se atender ao requisitos retornará true */
    const password = form.password().value
    if (!password || password.length < 6) {
        return false
    }    
    //confirmPassword recebe o que colocamos no campo de confirmar senha
    /* aqui vericamos se o confirmPassword é igual ou diferente a senha
    que colocamos no campo de senha caso seja igual retornará true caso
    seja diferente retornará false */
    const confirmPassword = form.confirmPassword().value
    if (password != confirmPassword) {
        return false;
    }
    
    /*caso não tenha dado false em nenhum dos casos retornará True ou seja o 
    formulário é Válido  */
    return true
}
//botão onde ao clicar em login vai para a aba de login caso ja tenha conta.
function loginButton(){
    window.location.href = "../index.html"
}

/* const auth = firebase.auth() */


//formulário onde pega os dados dos campos.
const form = {
    email: () => document.getElementById("email"),
    password: () => document.getElementById("password"),
    confirmPassword: () =>  document.getElementById("confirmPassword"),
    registerButton: () => document.getElementById("register-button"),
    googleButton: () => document.getElementById("googleButton")
}