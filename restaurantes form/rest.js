const db = firebase.firestore();
function saveRest() {
    showLoading()
    const restaurantes = registerRestaurante()
      
    db.collection('Restaurantes').add(restaurantes)
    .then(() => {
        hideLoading()
        window.location.href = "../home/home.html"
    }).catch(() => {
        hideLoading()
        alert("erro ao registrar restaurante")
    })
    
}

function registerRestaurante() {
    return {
        name: form.restName().value,
        bairro: form.restBairro().value,
        selfService: form.isSelf().checked ? "Self Service" : "Não é Self Service",
       //só pra quando tiver logado mostrar qual é o usuário
        /*  user: {
            uid: firebase.auth().currentUser.uid
        } */
    }   
}





const form = {
    restName: () => document.getElementById('nome'),
    restBairro: () => document.getElementById('bairro'),
    isSelf: () => document.getElementById('isSelf'),
}