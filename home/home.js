const btnMobile = document.getElementById('btn-mobile');

function toggleMenu(event) {
  if (event.type === 'touchstart') event.preventDefault();
  const nav = document.getElementById('nav');
  nav.classList.toggle('active');
  const active = nav.classList.contains('active');
  event.currentTarget.setAttribute('aria-expanded', active);
  if (active) {
    event.currentTarget.setAttribute('aria-label', 'Fechar Menu');
  } else {
    event.currentTarget.setAttribute('aria-label', 'Abrir Menu');
  }
}

btnMobile.addEventListener('click', toggleMenu)
btnMobile.addEventListener('touchstart', toggleMenu)

const db = firebase.firestore()

findRest()

let restaurantesData = [] // Array para mapear índices com IDs

function findRest() {
  db.collection("Restaurantes")
    .get()
    .then(snapshot => {
      const restaurantes = snapshot.docs.map(doc => doc.data())

      // Preencha o array restaurantesData com os IDs
      restaurantesData = snapshot.docs.map(doc => doc.id)

      addRestInScreen(restaurantes)
    })
}

function addRestInScreen(restaurantes) {
  const orderedList = document.getElementById("restaurantes")

  restaurantes.forEach((restaurante, index) => {
    const li = document.createElement('li')
    const name = document.createElement('p')
    const bairro = document.createElement('p')
    const service = document.createElement('p')
    const deleteButton = document.createElement('button')

    li.setAttribute('data-id', index) //coloca um data id nos restaurantes

    deleteButton.innerHTML = "Remover"
    deleteButton.classList.add('outline', 'danger')
    deleteButton.addEventListener('click', () => {
      const restauranteIndex = li.getAttribute('data-id')
      removeRest(restauranteIndex)
    })
    li.appendChild(deleteButton)

    name.innerHTML = restaurante.name
    bairro.innerHTML = restaurante.bairro
    service.innerHTML = restaurante.selfService

    li.appendChild(name)
    li.appendChild(bairro)
    li.appendChild(service)

    const linhaEmBranco = document.createElement('hr')

    orderedList.appendChild(li)
    orderedList.appendChild(linhaEmBranco)
  })
}

function removeRest(restauranteIndex) {
  const askRemove = confirm("Deseja remover o restaurante?")
  if (askRemove) {
    const restauranteId = restaurantesData[restauranteIndex]

    showLoading();

    db.collection('Restaurantes')
      .doc(restauranteId)
      .delete()
      .then(() => {
        hideLoading()
        liRemove = document.querySelector(`[data-id="${restauranteIndex}"]`)
        liRemove.remove();
      })
      .catch(error => {
        hideLoading()
        console.log(error)
        alert('Erro ao remover o restaurante')
      })
  }
}
