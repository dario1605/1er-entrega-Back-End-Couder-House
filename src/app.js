import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname, { PORT } from "./utils.js";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsProductsRouter from "./routes/views.router.js";



const app = express()
app.use(express.json()) //A nuestro servidor le indicamos que vamos a trabajar con json
app.use(express.urlencoded({ extended: true }))//Hacemos que nuestras peticiones puedan ser extendidas


// Iniciar el servidor HTTP
const serverHttp = app.listen(PORT, () =>
  console.log(`Conectado al puerto : ${PORT}`)
);

// Crear una instancia de Socket.IO y vincularla al servidor HTTP
const io = new Server(serverHttp);

// Establecer el objeto "socketio" en la aplicación para que esté disponible en todas las rutas
app.set("socketio", io);

// Configurar el middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(`${__dirname}/public`));

// Configurar el motor de plantillas Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Ruta principal
app.get("/", (req, res) => res.render("index", {name:"Dario"}))
// Rutas para la API de productos y carritos
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
// Ruta para las vistas de productos
app.use("/home", viewsProductsRouter);

// Evento de conexión de Socket.IO
io.on("connection", socket => {
    console.log("Conexion exitosa");
    // Escucha el evento "productList" emitido por el cliente
    socket.on("productList", data => {
       // Emitir el evento "updatedProducts" a todos los clientes conectados
      io.emit("updatedProducts", data);
    });
  });
