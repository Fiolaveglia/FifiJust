
$(document).ready();

// Variables 
let items = []; // Array para cargar todos los items
let productos = []; // Array para guardar los productos del carrito

//const url = "http://127.0.0.1:5500/js/productos.json";


// Clases 
class Aceite {
    constructor(idProducto, nombre, categoria, precio, stock) {
        this.idProducto = idProducto;
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
    //Por cada item guardado en el array creo un div con la class "card" donde me cree por cada item del array una tarjeta 
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
}})

// Animación del h1
$("h1").fadeOut("slow", () =>{
    $("h1").fadeIn(3000)
});

//Creo el evento de click sobre la bolsa para saber cúal es el contenido del carrito
$("#usuario").on("click", function(e){
    $('#menu').toggleClass("show");
});


// Creo la función para guardar el carrito en LocalStorage
function guardarCarrito (){
    let productosString = JSON.stringify(productos); 
    localStorage.setItem("productos", productosString);
} 

let mensaje = document.getElementById("usuario"); 
let contador = document.getElementById("contador");

function comprarProducto(item) {
    if(item.stock == 0) {
        Swal.fire('El producto está agotado'); 
    } else {
        productos.push(item);
        guardarCarrito();
        let total = productos.reduce((sum, value)=> (typeof value.precio == "number" ? sum + value.precio : sum), 0); 
        contador.innerHTML = productos.length;
        item.stock--;

        let listado = document.getElementById("menu"); 
        let lista = document.createElement("li");
        lista.className ="lista_menu";
        lista.innerHTML = `${item.nombre} - $${item.precio}`; 
        listado.prepend(lista);  
        $('.total_precio').html(`TOTAL $${total}`);

        Swal.fire({
            title:`Se ha agregado Aceite de ${item.nombre} al carrito`
        })

    } 

}

//Función para obtener los datos guardados del carrito
function obtenerCarrito () {
    let productosString = localStorage.getItem("productos"); 
    let carrito = JSON.parse(productosString) || []; 
    productos = carrito; 
    let total = productos.reduce((sum, value)=> (typeof value.precio == "number" ? sum + value.precio : sum), 0); 
    contador.innerHTML = productos.length;
    
    let texto = $('#empty'); 
    let btn = $('#shop'); 

    if (productosString === null) {
        texto.html("El carrito esta vacio");
        btn.attr("disabled");
        btn.css({'background-color':'gray', 'border' : '1px solid gray'});
    } else {
        for(producto of productos) {
            texto.css({'visibility':'hidden'});
            btn.removeAttr("disabled");
            let listado = document.getElementById("menu"); 
            let lista = document.createElement("li");
            lista.className ="lista_menu";
            lista.innerHTML = `${producto.nombre} - $${producto.precio}`; 
            listado.prepend(lista); 
            $('.total_precio').html(`Total  $${total}`);
        }
    
    }

}

obtenerCarrito();


