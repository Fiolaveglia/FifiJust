
$(document).ready();

// Variables 
let items = []; // Array para cargar todos los items
let productos = []; // Array para guardar los productos del carrito

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

//Creo los productos 
const bergamota = new Aceite (1,"Bergamota","Cítrico", 1015, 10); 
const naranja = new Aceite (2,"Naranja","Cítrico", 945, 10); 
const limon = new Aceite (3,"Limon", "Cítrico", 965, 5); 
const neroli = new Aceite (4,"Neroli", "Floral", 1590, 8); 
const jazmin = new Aceite (5,"Jazmin", "Floral",1015, 10); 
const geranio = new Aceite (6,"Geranio", "Floral", 1445, 9); 
const manzanilla = new Aceite (7,"Manzanilla", "Floral", 1325, 10); 
const plamarosa = new Aceite (8,"Palmarosa", "Herbal",1495, 10); 
const patchouli = new Aceite (9,"Patchouli", "Herbal", 1495, 10); 
const romero = new Aceite (10,"Romero", "Herbal", 1495, 10); 
const menta = new Aceite (11,"Menta", "Herbal", 1280, 10); 
const eucalipto = new Aceite (12,"Eucalipto", "Herbal", 1175, 10); 

//Agrego los productos creados al array items
items.push(bergamota, naranja, limon, neroli, jazmin, geranio, manzanilla, plamarosa, patchouli, romero, menta, eucalipto); 

// Animación del h1
$("h1").fadeOut("slow", () =>{
    $("h1").fadeIn(3000)
});
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
                            <button class="btn btn-primary" id=${item.idProducto}>Agregar al carrito</button>
                            <span class="precio">${item.precio}</span>
                        </div>`; 
    contenedor.append(tarjeta);  
    document.getElementById(`${item.idProducto}`).addEventListener('click', () => comprarProducto(item)); 
    
}

// Creo la función para guardar el carrito en LocalStorage
function guardarCarrito (){
    let productosString = JSON.stringify(productos); 
    localStorage.setItem("productos", productosString);
} 

let mensaje = document.getElementById("usuario"); 
function comprarProducto(item) {
    if(item.stock == 0) {
        Swal.fire('El producto está agotado'); 
    } else {
        productos.push(item);
        guardarCarrito();
        let total = productos.reduce((sum, value)=> (typeof value.precio == "number" ? sum + value.precio : sum), 0); 
        mensaje.innerHTML = `$${total}<i id='bag' class='fas fa-shopping-bag'>`; 
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

//Menú vertical 
//Creo el evento de click sobre la bolsa para saber cúal es el contenido del carrito
$("#usuario").on("click", function(e){
    $("#menu").toggleClass("show");
});


//Función para obtener los datos guardados del carrito
function obtenerCarrito () {
    let productosString = localStorage.getItem("productos"); 
    let carrito = JSON.parse(productosString) || []; 
    productos = carrito; 
    let total = productos.reduce((sum, value)=> (typeof value.precio == "number" ? sum + value.precio : sum), 0); 
    mensaje.innerHTML = `$${total}<i id='bag' class='fas fa-shopping-bag'>`; 

    for(producto of productos) {
        let listado = document.getElementById("menu"); 
        let lista = document.createElement("li");
        lista.className ="lista_menu";
        lista.innerHTML = `${producto.nombre} - $${producto.precio}`; 
        listado.prepend(lista); 
        $('.total_precio').html(`Total  $${total}`);

    }
}

obtenerCarrito();




