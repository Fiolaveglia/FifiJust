$(document).ready();

// Variables 
let items = []; // Array para cargar todos los items
let productos = []; // Array para guardar los productos del carrito

// Clases 
class Aceite {
    constructor(id, nombre, categoria, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
    }
}

//Obtengo los productos por un llamado de AJAX 
$.getJSON('../js/productos.json', function (data) {
    data.forEach(elemento => items.push(elemento));

    //Selecciono el contenedor donde voy a instertar las cards 
    let contenedor = document.getElementById("main");
    //Por cada item guardado en el array creo un div con la class "card" donde voy a pintar los items en el HTML
    for (const item of items) {
        let tarjeta = document.createElement("div");
        tarjeta.className = "card";
        tarjeta.innerHTML = `
                        <img src="../img/Aceites escenciales/${item.nombre}.jpg" class="card-img-top" alt="${item.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">Aceite de ${item.nombre}</h5>
                            <button class="btn btn-primary" id=${item.id}>Agregar al carrito</button>
                            <span class="precio">${item.precio}</span>
                        </div>`;
        contenedor.append(tarjeta);
        document.getElementById(`${item.id}`).addEventListener('click', () => comprarProducto(item));

    }
})

// Creo la función para guardar el carrito en LocalStorage
function guardarCarrito() {
    let productosString = JSON.stringify(productos);
    localStorage.setItem("productos", productosString);
}

let listado = document.getElementById("menu");

//Creo la función para pintar productos en el menú vertical 
function pintarProductos(arregloProductos){
    for (const unico of arregloProductos) {
        let lista = document.createElement("li");
        lista.className = "lista_menu";
        texto.css({ 'visibility': 'hidden' });
        lista.innerHTML = 
            `<div id="numItems"></div>
            <div class="img-item">
            <img src="../img/Aceites escenciales/${unico.nombre}.jpg" class="img-cart" alt="${unico.nombre}">
            </div> 
            <div class="items">
                Aceite de ${unico.nombre} - $${unico.precio} 
            </div>
            <div class="eliminar" onclick = eliminarProducto(${unico.id})><i class="fas fa-trash"></i></div>`;
        listado.prepend(lista);
    }
}

let mensaje = document.getElementById("usuario");
let contador = document.getElementById("contador");
let texto = $('#empty');

//Función que agrega productos al carrito de compras
function comprarProducto(item) {

    const productoExistente = productos.find(product => product.nombre === `${item.nombre}`) ; 
    console.log(productoExistente);
    
    if (productoExistente === undefined) {
        productos.push(item);
        //Aleta 
        Swal.fire({
            title: `Se ha agregado Aceite de ${item.nombre} al carrito`
        })
        let listado = document.getElementById("menu");
        listado.innerHTML = ""; 

        //Recorro el array para obtener los productos sin repetirlos 
        let productosMap = productos.map(producto => {
        return [JSON.stringify(producto), producto]
        });
        let productoMapArr = new Map(productosMap); // Pares de clave y valor
        let unicos = [...productoMapArr.values()]; // Conversión a un array
        
        let total = productos.reduce((sum, value) => (typeof value.precio == "number" ? sum + value.precio : sum), 0);
        pintarProductos(unicos);
        contador.innerHTML = productos.length;
        guardarCarrito();
        $('.total_precio').html(`TOTAL $${total}`);

    } else if (productoExistente.id === item.id) {
        Swal.fire({
            title: `El producto ya se encuentra en el carrito`
        })
    }

    if (item.stock == 0) {
        Swal.fire('El producto está agotado');
    } 
}

function eliminarProducto(id){
    console.log(productos);
}


//Función para obtener los datos guardados del carrito
function obtenerCarrito() {
    let productosString = localStorage.getItem("productos");
    let carrito = JSON.parse(productosString) || [];
    productos = carrito;

    let total = productos.reduce((sum, value) => (typeof value.precio == "number" ? sum + value.precio : sum), 0);
    contador.innerHTML = productos.length;

    //Recorro el array para obtener los productos sin repetirlos 
    let productosMap = productos.map(producto => {
        return [JSON.stringify(producto), producto]
    });
    let productoMapArr = new Map(productosMap); // Pares de clave y valor
    let unicos = [...productoMapArr.values()]; // Conversión a un array
    
    console.log('todos:' + JSON.stringify(productos))
    console.log('sin repetir:' + JSON.stringify(unicos));

    let btn = $('#shop');

    if (productosString === null) {
        texto.html("El carrito esta vacio");
        btn.attr("disabled");
        btn.css({ 'background-color': 'gray', 'border': '1px solid gray' });
    } else {
        pintarProductos(unicos);
        $('.total_precio').html(`Total  $${total}`);
    }

}

obtenerCarrito();


