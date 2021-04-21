const formularioContactos = document.querySelector("#contacto"),
      listadoContactos = document.querySelector("#listado-contactos tbody"),
      inputBuscador = document.querySelector("#buscar");

eventListeners();

function eventListeners() {
    //Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener("submit", leerFormulario);

    //Listener para eliminar el boton
    if(listadoContactos){
        listadoContactos.addEventListener("click", eliminarContacto);
    }

    //Buscador
    inputBuscador.addEventListener("input", buscarContactos);

    //Número Contactos
    numeroContactos();
}

function leerFormulario(e){
    e.preventDefault(); //Se recomienda hacer esto cuando quieras hacer algo con JS o Ajax
    const nombre = document.querySelector("#nombre").value,
          empresa = document.querySelector("#empresa").value,
          telefono = document.querySelector("#telefono").value,
          accion = document.querySelector("#accion").value;

    if(nombre === "" || empresa === "" || telefono == "") {
        //Dos parametros: texto y clase
        mostrarNotificacion("Todos los Campos son Obligatorios", "error");
    } else{
        //Pasa la validación, crear llamado a Ajax
        const infoContacto = new FormData();
        infoContacto.append("nombre", nombre); //Se le pasa una llave y una variable
        infoContacto.append("empresa", empresa);
        infoContacto.append("telefono", telefono);
        infoContacto.append("accion", accion);

        // console.log(...infoContacto);

        if (accion === "crear") {
            //Creamos un nuevo contacto
            insertarBD(infoContacto);
        } else {
            /*Editar el Contacto*/
            //Leer el ID
            const idRegistro = document.querySelector("#id").value;
            infoContacto.append("id", idRegistro);
            actualizarRegistro(infoContacto);
        }
    }
}

//Inserta en la Base de Datos via Ajax
function insertarBD(datos) {
    //llamado Ajax

    //Crear el objeto
    const xhr = new XMLHttpRequest();

    //Abrir la conexión
    xhr.open("POST", "includes/modelos/modelo-contactos.php", true);

    //Pasar los datos
    xhr.onload = function () {
        if(this.status === 200){
            //Leer la respuesta de PHP
            const respuesta = JSON.parse(xhr.responseText); //Lo convierte a Objeto "JSON.parse"
    
            //Inserta un nunevo elemento a la tabla
            const nuevoContacto = document.createElement("tr");

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            //Crear contenedor para los botones
            const contenedorAcciones = document.createElement("td");

            //Crear el icono de Editar
            const iconoEditar = document.createElement("i");
            iconoEditar.classList.add("fas", "fa-pen-square");

            //Crear el enlace para editar
            const btnEditar = document.createElement("a");
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add("btn", "btn-editar");

            //Agregarlo al Padre
            contenedorAcciones.appendChild(btnEditar);

            //Crear el icono de Eliminar
            const iconoEliminar = document.createElement("i");
            iconoEliminar.classList.add("fas", "fa-trash-alt");

            //Crear el boton de Eliminar
            const btnEliminar = document.createElement("button");
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute("data-id", respuesta.datos.id_insertado);
            btnEliminar.classList.add("btn", "btn-borrar");

            //Agregarlo al Padre
            contenedorAcciones.appendChild(btnEliminar);

            //Agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);

            //Agregarlo con los contactos
            listadoContactos.appendChild(nuevoContacto);

            //Resetear el Formulario
            document.querySelector("form").reset();

            //Mostrar la Notificación
            mostrarNotificacion("Contacto Creado Correctamente", "correcto");

            //Actualizar el número
            numeroContactos();

        }
    }

    //Enviar los datos
    xhr.send(datos);
}

//Editar Contacto
function actualizarRegistro(datos) {
    //Crear el objeto
    const xhr = new XMLHttpRequest();

    //Abrir la conexión
    xhr.open("POST", "includes/modelos/modelo-contactos.php", true);

    //Leer la respuesta
    xhr.onload = function() {
        if(this.status === 200){
            const respuesta = JSON.parse(xhr.responseText);

            if(respuesta.respuesta === "correcto"){
                mostrarNotificacion("Contacto Editado Correctamente", "correcto");
            } else {
                mostrarNotificacion("Hubo un error...", "error");
            }

            //Después de 3 segundos redireccionar
            setTimeout(() => {
                window.location.href = "index.php";
            }, 2700);
        }
    }

    //Enviar la petición
    xhr.send(datos);
}

//Eliminar Contacto
function eliminarContacto(e) {
    if( e.target.parentElement.classList.contains("btn-borrar") ){ //De vuelve un bool para indicar que existe la clase en donde hayamos dado click
        //Tomar el ID
        const id = e.target.parentElement.getAttribute("data-id");
        
        //Preguntar al Usuario
        const respuesta = confirm("¿Desea Eliminar el Registro?"); //Con esto se abre una ventana de confirmación nativa del navegador

        if(respuesta){
            /*Llamado a Ajax*/
            //Crear el Objeto
            const xhr = new XMLHttpRequest();

            //Abrir La conexión
            xhr.open("GET", `includes/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

            //Leer la respuesta
            xhr.onload = function() {
                if (this.status === 200) {
                    const resultado = JSON.parse(xhr.responseText);

                    if(resultado.respuesta === "correcto"){
                        //Eliminar el registro del DOM
                        e.target.parentElement.parentElement.parentElement.remove();
                        
                        //Mostrar Notificación
                        mostrarNotificacion("Contacto Eliminado Correctamente", "correcto");

                        //Actualizar Número
                        numeroContactos();
                    } else {
                        //Mostramos una notificación
                        mostrarNotificacion("Hubo un error, no se pudo eliminar", "error");
                    }
                }
            }

            //Enviar la petición
            xhr.send();

        } else{
            console.log("No, ya me arrepenti");
        }
    }
}

// Nofiticación en pantalla
function mostrarNotificacion(mensaje, clase){
    const notificacion = document.createElement("div");
    notificacion.classList.add(clase,"notificacion", "sombra");
    notificacion.textContent = mensaje;

    //formulario. El método de abajo recibe dos argumentos, que insertara y donde
    formularioContactos.insertBefore(notificacion, document.querySelector("form legend"));

    //Ocultar y Mostrar la notificación
    setTimeout(() => {
        notificacion.classList.add("visible");

        setTimeout(() => {
            notificacion.classList.remove("visible");

            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 2500);
    }, 100);
}

//Buscar Contacto
function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i"),
          registros = document.querySelectorAll("tbody tr");
          
        registros.forEach (registro => {
            registro.style.display = "none";

            if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1){
                registro.style.display = "table-row";
            }

            numeroContactos();
        });
}

//Numero dinamico de contactos
function numeroContactos() {
    const totalContactos = document.querySelectorAll("tbody tr"),
          contenedorNumero = document.querySelector(".total-contactos span");

    let total = 0;

    totalContactos.forEach(contacto =>{
        if(contacto.style.display === "" || contacto.style.display === "table-row"){
            total++;
        }
    });

    contenedorNumero.textContent = total;
}