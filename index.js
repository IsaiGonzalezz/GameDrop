var express = require("express");
var path = require("path");
var cors = require ("cors");
var session = require("cookie-session");

require("dotenv").config();

var rutasUsuarios = require("./rutas/usuariosRutas");
var rutasProductos = require("./rutas/productosRutas");
var rutasUsuariosApis = require ("./rutas/usuariosRutasApis");
var rutasProductosApis = require ("./rutas/productosRutasApis");



var app=express();
app.set("view engine","ejs");
app.use(cors());
//app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/",express.static(path.join(__dirname,'/public')));
app.use("/",express.static(path.join(__dirname,'/web')));

app.use(session({
    name:  process.env.SESSION_NAME,
    keys:  [process.env.SESSION_KEYS],
    maxAge: process.env.SESSION_MAX_AGE,

}))



app.use("/",rutasUsuarios);
app.use("/",rutasProductos);
app.use("/",rutasUsuariosApis);
app.use("/",rutasProductosApis); 

var port=process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log("servidor levantado en http://localhost:" +port);
});   