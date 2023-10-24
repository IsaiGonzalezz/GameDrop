var ruta=require("express").Router();
var subirArchivo=require("../middlewares/middlewares").subirArchivo;
var fs = require("fs");
var path = require("path");
const { log } = require("console");
var {mostrarUsuarios, nuevoUsuario, buscarPorId, modificarUsuario,borrarUsuario, login}=require("../bd/usuariosBD");
//const { log } = require("console");

//login //////////////////////////////////////////////
ruta.get("/", (req,res)=>{
    
    res.render("usuario/login");
});

ruta.post("/login", async(req,res)=>{
    var user = await login(req.body);
    if(user === 1){
        res.redirect("/mostrarUsuario");
    }else if(user === 0){
        res.status(400).send({ error: "Contraseña no valida" });
    }else if(user === undefined){
        res.status(400).send({ error: "El usuario no existe" });
    }
});
//login //////////////////////////////////////////////


//mostrar usuario //////////////////////////////////////////////
ruta.get("/mostrarUsuario",async(req,res)=>{
    var users = await mostrarUsuarios();
    res.render("usuario/mostrar",{users})
});
//////////////////////////////////////////////



//nuevo usuario  //////////////////////////////////////////////
ruta.get("/nuevoUsuario",(req,res)=>{
    res.render("usuario/nuevo");
});
 
ruta.post("/nuevoUsuario",subirArchivo(),async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error = await nuevoUsuario(req.body);
    res.redirect("/mostrarUsuario");
   
})
//nuevo usuario //////////////////////////////////////////////


//editar usuario //////////////////////////////////////////////
ruta.get("/editarUsuario/:id", async(req,res)=>{
    var user = await buscarPorId(req.params.id);
    res.render("usuario/modificar",{user});
    //res.end();
})

ruta.post("/editarUsuario", subirArchivo(),async (req,res)=>{
    if(req.file!=undefined){
        req.body.foto=req.file.originalname;
    }else{
        req.body.foto=req.foto.fotoVieja;
    }
    var error=await modificarUsuario(req.body);
    res.redirect("/mostrarUsuario");

});
//editar usuario //////////////////////////////////////////////



//borrar usuario //////////////////////////////////////////////
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
        res.redirect("/mostrarUsuario");
    }catch(error){
        console.log("Error al borrar usuario: "+error);
    }
});
 

module.exports=ruta;