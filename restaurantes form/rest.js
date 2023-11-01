//primeiro começamos colocando o comando principal dentro de uma variavel para ser mais fácil de ser chamada db(data base)
const db = firebase.firestore();
const storage = firebase.storage();

//essa função ira colocar os dados no banco de dados.
/* primeiramente criamos a const restaurantes que ira receber a função registerRestaurante()
depois criamos a const image file que ira receber exatamente a imagem que colocamos no input

fazemos uma condição que caso tenhamos colocado uma imagem vai entrar criando um nome aleatorio para a imagem na const fileName
criamos o storageref para entrar na coleção restauranteImagens no storage + filename para entra o arquivo da imagem 

depois usaremos o comando .collection que ira verificar a coleção no firebase ou seja no firestore temos uma coleção chamada "Restaurantes" 
e assim que mostrarmos a coleção iremos usar o .add criando uma subcoleção dentro dessa coleção(Restaurantes) e colocamos dentro a const restaurantes
que recebe os dados que queremos guardar.

caso essa ação seja concluida com sucesso iremos para a pagina de html
caso a ação de algum erro ira ser notificado que deu um erro ao registrar o restaurante*/ 
function saveRest() {
    showLoading()
    const restaurantes = registerRestaurante()
    const imageFile = form.fileInput().files[0]

    if (imageFile) {
        // Nome único para o arquivo de imagem
        const fileName = Date.now() + '_' + imageFile.name

        // Referência para o arquivo no Storage
        const storageRef = storage.ref().child('restauranteImagens/' + fileName)

        // Fazer upload da imagem
        storageRef.put(imageFile)
          .then(snapshot => {
            return storageRef.getDownloadURL(); // Obter a URL da imagem
          })
          .then(url => {
            restaurantes.imageURL = url // Adicione a URL da imagem aos dados do restaurante
            return db.collection('Restaurantes').add(restaurantes) // Salve os dados do restaurante no Firestore
          })
          .then(() => {
            hideLoading()
            window.location.href = "../home/home.html"
          })
          .catch(error => {
            hideLoading()
            console.error('Erro ao enviar arquivo de imagem:', error)
          })
    } else {
        hideLoading()
        alert('Selecione um arquivo de imagem antes de enviar.')
    }
    
}

/* essa função servirá para facilitar nosso chamado na função que ira colocar os dados no data base
assim que clicarmos no botão de salvar os dados do restaurante na tela de registro de restaurante essa função será verificada
iremos criar uma array com os nomes que queremos que sejam chamados no database ou seja nome,bairro, e se é self service
ela apenas ira pegar os valores dos itens que está no formulário. */
function registerRestaurante() {
    return {
        name: form.restName().value,
        bairro: form.restBairro().value,
        selfService: form.isSelf().checked ? "Self Service" : "Não é Self Service",
        imageURL: null
       //só pra quando tiver logado mostrar qual é o usuário
        /*  user: {
            uid: firebase.auth().currentUser.uid
        } */
    } 
}
  
//array criado para receber os dados que colocamos na tela de registro de restaurante.
const form = {
    restName: () => document.getElementById('nome'),
    restBairro: () => document.getElementById('bairro'),
    isSelf: () => document.getElementById('isSelf'),
    fileInput: () => document.getElementById('filesImg')
}