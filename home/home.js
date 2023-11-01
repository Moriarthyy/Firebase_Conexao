firebase.auth().onAuthStateChanged(function(user) {
  
  if (user) {
    // Usuário está logado
    const uid = user.email;
    console.log("Usuário logado:",uid);
    const userSlot = document.getElementById('logo')
    const userid = document.createElement('p')
    userid.innerHTML = uid
    userSlot.appendChild(userid)
    // Exibir informações do usuário na tela, como nome e foto
  }else {
    // Nenhum usuário logado
    window.location.href = "../../index.html"
    console.log("Nenhum usuário logado.");
    // Ocultar informações do usuário na tela
  }
});
const btnMobile = document.getElementById('btn-mobile')

function toggleMenu(event) {
  if (event.type === 'touchstart') event.preventDefault()
  const nav = document.getElementById('nav')
  nav.classList.toggle('active')
  const active = nav.classList.contains('active')
  event.currentTarget.setAttribute('aria-expanded', active)
  if (active) {
    event.currentTarget.setAttribute('aria-label', 'Fechar Menu')
  } else {
    event.currentTarget.setAttribute('aria-label', 'Abrir Menu')
  }
}

btnMobile.addEventListener('click', toggleMenu)
btnMobile.addEventListener('touchstart', toggleMenu)

const db = firebase.firestore()
const storage = firebase.storage()

//apenas rodando a função para ela funcionar assim que a página for aberta.
findRest()

// Array para mapear índices com IDs
let restaurantesData = [] 

/* função para encontrar os restaurantes no data base
primeiramente pegando a coleção que temos no firestore que é "Restaurante" com o .collection()
usamos o .get para buscar todos os documentos dentro dessa coleção
retornando uma premissa 
snapshot contém informações sobre os documentos que correspondem à consulta,
incluindo os próprios documentos e seus IDs 

criamos a const restaurantes que ira receber os dados dos documentos que estão na coleção "Restaurantes"

criamos a cosnt restaurantesData que ira guardar os IDs dos documentos

e ira colocar os dados na tela com a função addRestInScreen(restaurantes)*/
function findRest() {
  db.collection("Restaurantes").get().then(snapshot => {
      const restaurantes = snapshot.docs.map(doc => doc.data())

      // Preencha o array restaurantesData com os IDs
      restaurantesData = snapshot.docs.map(doc => doc.id)

      addRestInScreen(restaurantes)
    })
}

/* essa função servirá para colocar os restaurantes na tela em li 

pegamos a lista no html com o id dela
criamos li,name,bairro,service e o botão de delete
*/

/* criamos um evento ao clicar no botão de delete e uma const chamada restauranteIndex
para receber o data-id de cada item da nossa lista que cada item é um 'restaurante'

e rodamos a função removeRest(restauranteIndex) pegando o data-id do li que no caso seria o restaurante iremos remover ele do banco de dados */

/* usamos o método forEach dentro do array de dados que são os documentos e ira passar por cada um dando um index e atribuindo um data-id 
colocando na tela utilizando o innerHTML com o restaurante.name/bairro/selfService que são os dados que pegamos no registro de restaurante 

damos um li.appendChild e colocamos os dados na lista e fazendo aparecer na tela*/


function addRestInScreen(restaurantes) {
  const orderedList = document.getElementById("restaurantes")
  
  restaurantes.forEach((restaurante, index) => {
    const card = document.createElement('div')
    card.classList.add('cardContainer')
    const li = document.createElement('li') 
    const name = document.createElement('p')
    name.classList.add('TextContent')
    const bairro = document.createElement('p')
    bairro.classList.add('TextContent')
    const service = document.createElement('p')
    service.classList.add('TextContent')
    const Image = document.createElement('img')
    Image.classList.add('imgCard')
    const deleteButton = document.createElement('button')
  
    li.setAttribute('data-id', index) //coloca um data id nos restaurantes

    deleteButton.innerHTML = "Remover"
    deleteButton.classList.add('outline', 'danger')
    deleteButton.addEventListener('click', () => {
      const restauranteIndex = li.getAttribute('data-id')
      console.log(restauranteIndex)
      removeRest(restauranteIndex)
      card.classList.remove('cardContainer')
    })
    
    li.appendChild(deleteButton)


    if(restaurante.imageURL){
      Image.src = restaurante.imageURL
    }else {
      Image.src = null
    }
    
    name.innerHTML = restaurante.name
    bairro.innerHTML = restaurante.bairro
    service.innerHTML = restaurante.selfService
    Image.innerHTML = restaurante.Image

    li.appendChild(Image)
    li.appendChild(name)
    li.appendChild(bairro)
    li.appendChild(service)

   

    card.appendChild(li)
    orderedList.appendChild(card)
  })
}

/* essa função ira remover um restaurante do data base

ao clicar no botão de remover ira aparecer uma confirmação caso essa função seja aceita 
iremos pegar o Id do restaurante criando uma const restauranteId
que recebe o Array restaurantesData que tem os Ids dos documentos com o index do item ou seja irá pegar exatamente
o id do restaurante que eu quero remover 
ira aparecer a tela de loading 
irei na coleção Restaurantes no firestore
usarei o .doc() com o id para selecionar exatamente o restaurante que eu quero 
Se houver uma imagem, analise a URL para obter o caminho no Storage
armazenamos const storageRef = storage.refFromURL(imageURL) ou seja iremos pegar o item do storage pelo url da imagem
e iremos excluir ccom o storageref.delete()


e usaremos o .delete () para deletar esse restaurante no caso o documento 

retornando uma premissa caso a ação seja um sucesso 
ira esconder o loading e criamos uma variavel que recebe
o document.queryselector que ira procurar 
um elemento que tenha um atributo data-id com um valor igual ao índice restauranteIndex.

caso tenha ira dar um .remove e ira tirar da tela */
function removeRest(restauranteIndex) {
  const askRemove = confirm("Deseja remover o restaurante?")
  if (askRemove) {
    const restauranteId = restaurantesData[restauranteIndex]

    showLoading()
    
    db.collection('Restaurantes')
    .doc(restauranteId)
    .get()
    .then((doc) => {
      const restauranteData = doc.data()
      const imageURL = restauranteData.imageURL

      if (imageURL) {
        const storageRef = storage.refFromURL(imageURL)
        
        storageRef.delete()
          .then(() => {
            hideLoading()
          })
          .catch((error) => {
            hideLoading()
            console.error(error)
          });
      }
      
      // Agora, exclua o restaurante do Firestore
      db.collection('Restaurantes')
        .doc(restauranteId)
        .delete()
        .then(() => {
          hideLoading();
          liRemove = document.querySelector(`[data-id="${restauranteIndex}"]`)
          liRemove.remove()
        })
        .catch((error) => {
          hideLoading();
          console.log(error)
          alert('Erro ao remover o restaurante')
        })
    })
}
}

function userLogout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "../../index.html"
  }).catch((error) => {
    console.error(error)
  })
}
