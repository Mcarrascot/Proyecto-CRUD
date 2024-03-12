// Función para borrar el formulario de agregar película
const clearAddMovieForm = () => {
  document.getElementById("nombre").value = "";
  document.getElementById("clasificacion").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("precio").value = "";
}

// Función para crear una película
const addMovie = (event) => {
  event.preventDefault();

  // Obtener valores de entrada
  const nombre = document.getElementById("nombre").value;
  const clasificacion = document.getElementById("clasificacion").value;
  const cantidad = document.getElementById("cantidad").value;
  const precio = document.getElementById("precio").value;

  // Crear objeto película
  const newMovie = {
    nombre,
    clasificacion,
    cantidad,
    precio
  };

  // Obtenga datos de películas existentes o inicialice un array
  let movieData = JSON.parse(localStorage.getItem("movieData")) || [];

  // Agregar nueva película a la lista
  movieData.push(newMovie);

  // Actualizar datos de películas en localStorage
  localStorage.setItem("movieData", JSON.stringify(movieData));

  // Volver a cargar tabla
  loadTable();

  // Cerrar y borrar el formulario
  $('#addMovieModal').modal('hide');
  clearAddMovieForm();
}


document.addEventListener("DOMContentLoaded", () => {
  // Cargar tabla y datos de película predeterminados
  loadTable();
  loadDefaultData();

  // Mostrar agregar modo de película al hacer clic en el botón
  document.getElementById("add-movie-btn").addEventListener("click", () => {
    // Mostrar botón "Crear" & ocultar botón "actualizar" 
    document.getElementById("createMovieButton").style.display = "block";
    document.getElementById("updateMovieButton").style.display = "none";
    $('#addMovieModal').modal('show')
  });

  // Añadir una nueva película
  document.getElementById("createMovieButton").addEventListener("click", addMovie);
});

// Función para cargar datos de película predeterminados
function loadDefaultData() {
  const defaultMovies = [
    {
      nombre: "The Shawshank Redemption",
      clasificacion: "R",
      cantidad: 10,
      precio: 9.99
    },
    {
      nombre: "The Godfather",
      clasificacion: "R",
      cantidad: 8,
      precio: 9.99
    },
    {
      nombre: "The Dark Knight",
      clasificacion: "PG-13",
      cantidad: 12,
      precio: 9.99
    },
    {
      nombre: "Forrest Gump",
      clasificacion: "PG-13",
      cantidad: 9,
      precio: 9.99
    },
    {
      nombre: "Inception",
      clasificacion: "PG-13",
      cantidad: 10,
      precio: 9.99
    },
    {
      nombre: "Jurassic Park",
      clasificacion: "PG-13",
      cantidad: 9,
      precio: 9.99
    }
  ];

  // Obtenga datos de películas existentes de localStorage o inicialice un array vacío
  let movieData = JSON.parse(localStorage.getItem("movieData")) || [];

  // Compruebe si las películas predeterminadas ya están agregadas al almacenamiento local
  if (movieData.length === 0) {
    //Agregar películas predeterminadas a movieData
    defaultMovies.forEach(movie => {
      movieData.push(movie);
    });

    // Actualice localStorage con datos de película predeterminados
    localStorage.setItem("movieData", JSON.stringify(movieData));

    // Vuelva a cargar la tabla para reflejar los cambios
    loadTable();
  }
}

// Función cargar datos tabla
function loadTable() {
  // Obtener datos de películas de localStorage
  const movieData = JSON.parse(localStorage.getItem("movieData")) || [];

  // Obtener el body de la tabla
  const tableBody = document.getElementById("movieTableBody");

  // Limpiar tabla
  tableBody.innerHTML = "";

  // Generar filas de tabla a partir de datos de películas
  movieData.forEach(function (movie, index) {
    const row = `
          <tr>
              <th scope="row">${index + 1}</th>
              <td>${movie.nombre}</td>
              <td class="d-none d-md-table-cell">${movie.clasificacion}</td>
              <td class="d-none d-md-table-cell">${movie.cantidad}</td>
              <td>$${movie.precio}</td>
              <td>
                  <button type="button" class="btn btn-outline-primary" onclick="editMovie(${index})"><i class="fas fa-edit"></i></button>
                  <button type="button" class="btn btn-outline-danger" onclick="deleteMovie(${index})"><i class="fas fa-trash-alt"></i></button>
              </td>
          </tr>
      `;
    // Añade la fila a la tabla
    tableBody.innerHTML += row;
  });
}

// Función para editar una película
function editMovie(index) {
  // Obtener datos de películas de localStorage
  const movieData = JSON.parse(localStorage.getItem("movieData")) || [];
  const movie = movieData[index];

  // Obtener referencias a campos de entrada en el modo de edición
  const nombreInput = document.getElementById("nombre");
  const clasificacionInput = document.getElementById("clasificacion");
  const cantidadInput = document.getElementById("cantidad");
  const precioInput = document.getElementById("precio");

  // Establezca los valores de la película actual en los campos de entrada modales de edición
  nombreInput.value = movie.nombre;
  clasificacionInput.value = movie.clasificacion;
  cantidadInput.value = movie.cantidad;
  precioInput.value = movie.precio;


  // Mostrar el botón "Actualizar"
  document.getElementById("createMovieButton").style.display = "none";
  document.getElementById("updateMovieButton").style.display = "block";

  // Agregar detector de eventos para el botón "Actualizar"
  const updateButton = document.getElementById("updateMovieButton");

  const updateMovie = (index) => {
    // Obtenga nuevos valores de película desde los campos de entrada modales de edición
    const newNombre = nombreInput.value;
    const newClasificacion = clasificacionInput.value;
    const newCantidad = cantidadInput.value;
    const newPrecio = precioInput.value;

    // Actualizar datos de la película con nuevos detalles.
    movieData[index] = {
      nombre: newNombre,
      clasificacion: newClasificacion,
      cantidad: newCantidad,
      precio: newPrecio
    };

    // Guarde los datos de la película actualizados en localStorage
    localStorage.setItem("movieData", JSON.stringify(movieData));

    // Ocultar el modal de edición
    $('#editMovieModal').modal('hide');
    document.getElementById("createMovieButton").style.display = "none";
    document.getElementById("updateMovieButton").style.display = "block";
    clearAddMovieForm();

    // Vuelva a cargar la tabla para reflejar los cambios
    loadTable();
  }

  // Agregar detector de eventos para el botón "Actualizar"
  const updateMovieHandler = () => {
    updateMovie(index);
    // Eliminar el detector de eventos después de su ejecución
    updateButton.removeEventListener("click", updateMovieHandler);
    // Cerrar el formulario modal y borrar
    $('#addMovieModal').modal('hide');
    clearAddMovieForm();
  };

  updateButton.addEventListener("click", updateMovieHandler);

  // Mostrar edición Modal
  $('#addMovieModal').modal('show');
}

// Función borrar película
const deleteMovie = (index) => {
  //Obtener datos de películas de localStorage
  let movieData = JSON.parse(localStorage.getItem("movieData")) || [];

  // Eliminar la película en el índice especificado
  movieData.splice(index, 1);

  // Actualizar datos de películas en localStorage
  localStorage.setItem("movieData", JSON.stringify(movieData));

  // Vuelva a cargar la tabla para reflejar los cambios.
  loadTable();
}
