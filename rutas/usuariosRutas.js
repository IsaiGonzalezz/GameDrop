var ruta=require("express").Router();
var subirArchivo=require("../middlewares/middlewares").subirArchivo;
var fs = require("fs");
const path = require("path");
var {mostrarUsuarios, nuevoUsuario, buscarPorId, modificarUsuario,borrarUsuario}=require("../bd/usuariosBD");
//const { log } = require("console");


ruta.get("/",async(req,res)=>{
    var users = await mostrarUsuarios();
   // console.log(users);
   // res.end();
    res.render("usuario/mostrar",{users})
});
  
ruta.get("/nuevoUsuario",(req,res)=>{
    res.render("usuario/nuevo");
});
 
ruta.post("/nuevoUsuario",subirArchivo(),async(req,res)=>{
   //console.log(req.file.originalname);
    req.body.foto=req.file.originalname;
   //res.end();
    var error = await nuevoUsuario(req.body);
    res.redirect("/");
   
})

ruta.get("/editarUsuario/:id", async(req,res)=>{
    var user = await buscarPorId(req.params.id);
    res.render("usuario/modificar",{user});
    //res.end();
})



ruta.post("/editarUsuario", subirArchivo(),async (req,res)=>{
    //req.body.foto=req.file.originalname;
    //var error = await modificarUsuario(req.body);
    //res.redirect("/");
    try {
            var rutaImagen = path.join(__dirname, "..", "web", "images",req.body.foto);
            if (fs.existsSync(rutaImagen)) {
                fs.unlinkSync(rutaImagen);
                req.body.foto= req.file.originalname;
                var error=await modificarUsuario(req.body);
            }
            res.redirect("/");
    } catch (error) {
        console.error("Error al editar usuario:", error);
    }
    
});

ruta.get("/borrarUsuario/:id",async(req,res)=>{
    /*await borrarUsuario(req.params.id);
    res.redirect("/"); */
    try{
        var usuario = await buscarPorId(req.params.id);
        if(usuario){
            var rutaImagen = path.join(__dirname,"..","web","images",usuario.foto);
            if(fs.existsSync(rutaImagen)){
                fs.unlinkSync(rutaImagen);
            }
            await borrarUsuario(req.params.id);
        }
        res.redirect("/");
    }catch(error){
        console.log("Error al borrar usuario: "+error);
    }
});
 

module.exports=ruta;