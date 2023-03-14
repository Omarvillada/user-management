
// URL de la API pública
const API_URL = 'https://jsonplaceholder.typicode.com';

// Headers de la solicitud
const REQUEST_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
//div donde se renderizan los usuarios
const content = null || document.querySelector('.row');
// variable para acceder al espacio de almacenamiento local
const dataLocalStorage = window.localStorage;

/**
 * Función para realizar una solicitud a una URL dada.
 * Devuelve los datos de respuesta como JSON.
 * @param {string} urlAPI - URL a la que se realizará la solicitud.
 * @returns {Promise<object>} - Promesa que resuelve con los datos de respuesta de la solicitud como objeto JSON.
 */
async function fetchData(urlAPI) {
  try {
    // Comprobar que la URL es válida
    new URL(urlAPI);

    // Realizar la solicitud y obtener los datos de respuesta como JSON
    const response = await fetch(urlAPI, { method: 'GET', headers: REQUEST_HEADERS });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
}


//Función para obtener los datos de usuarios desde la API y devolverlos en un formato limpio.
async function getCleanUserData() {
  try {
    // Obtener los datos de usuario desde la API
    const users = await fetchData(`${API_URL}/users`);

    // Devolver los datos de usuario limpios
    //desestructuración
    return users.map(({ id, name, email, phone, website }) => ({
      id,
      name,
      email,
      phone,
      website
    }));
  } catch (error) {
    throw new Error('No se pudieron obtener los datos de usuario.');
  }
}

//Funcion para insertar los datos requeridos en LocalStorage
async function setDataLocalStorage() {
  let cleanObj = await getCleanUserData();

  cleanObj.forEach(element => {
    const id = element.id
    dataLocalStorage.setItem(id, JSON.stringify(element))
  });
  renderUser()
}
//Renderizar en HTML
async function renderUser() {
  console.log('------------Renderizando-------------')

  // Limpiar el contenido actual
  content.innerHTML = '';

  // Obtener los usuarios del almacenamiento local y convertirlos a objetos
  console.log('Obteniendo datalocalstorage sin parceo',Object.values(dataLocalStorage))
  const users = Object.values(dataLocalStorage).map(userString => JSON.parse(userString));
  console.log(users)
  // Ordenar los usuarios de forma ascendente por nombre
  /*
  Localcompare tiene en cuenta acentos y caracteres especiales
  */
  //b.name.localeCompare(a.name) -> Descendente
  users.sort((a, b) => a.name.localeCompare(b.name));

  // Iterar y agregarlos al HTML


  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.className = 'profile-card'
    userElement.innerHTML = `
      <div class="profile-content">
          <div class="btn-div">
              <button class="btn-close" onclick = removeUser(${user.id})><i class="fa-regular fa-circle-xmark iconestudio"></i></button>
          </div>
          <div class="profile-image">
              <img src="./assets/img/usuario.jpg" alt="firts user">
          </div>
          <div class="profile-text">
              <p>Nombre: ${user.name}</p>
              <p>Telefono: ${user.phone}</p>
              <p>Email:<a href="/"> ${user.email}</a></p>
              <p>WebSite:<a href="/">${user.website}</a></p>
          </div>
      </div>

    `;
    content.appendChild(userElement);
  });
}

function removeUser(id) {
  //eliminar el usuario del almacenamiento local
  dataLocalStorage.removeItem(id)
  //volver a renderizar los usuarios en el HTML
  renderUser()
}

window.addEventListener('load', setDataLocalStorage)
//window.addEventListener('load',renderUser)
