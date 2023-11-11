var ruta=require("express").Router();
var subirArchivo=require("../middlewares/middlewares").subirArchivo;
var {usuario, admin} = require("../middlewares/passwords")
var fs = require("fs");
var path = require("path");
const { log } = require("console");
var {mostrarUsuarios, nuevoUsuario, buscarPorId, modificarUsuario,borrarUsuario, login}=require("../bd/usuariosBD");
//const { log } = require("console");

//login //////////////////////////////////////////////
ruta.get("/login", (req,res)=>{
    
    res.render("usuario/login");
});

ruta.post("/login", async(req,res)=>{
    var user = await login(req.body);
    if(user === 1){
        if(user.admin){
            req.session.admin=req.body.usuario;
            res.redirect("/");
        }else{
            req.session.usuario=req.body.usuario;
            res.redirect("/");
        }
        
    }else if(user === 0){
        res.status(400).send({ error: "Contraseña no valida" });
    }else if(user === undefined){
        res.status(400).send({ error: "El usuario no existe" });
    }
});
//login //////////////////////////////////////////////

//logout//-//-/-/-/-/-/-/-/-/-
ruta.get("/logout",(req,res)=>{    
    req.session=null;
    res.redirect("/");
});

//mostrar usuario //////////////////////////////////////////////
ruta.get("/",usuario,async(req,res)=>{
    var users = await mostrarUsuarios();
    res.render("usuario/principal",{users})
});
//////////////////////////////////////////////



//nuevo usuario  //////////////////////////////////////////////
ruta.get("/nuevoUsuario",(req,res)=>{
    res.render("usuario/nuevo");
});
 
ruta.post("/nuevoUsuario",subirArchivo(),async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error = await nuevoUsuario(req.body);
    res.redirect("/login");
   
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
//editar usuario ///-/-/-/-/--/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/



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
        res.redirect("/");
    }catch(error){
        console.log("Error al borrar usuario: "+error);
    }
});
 

module.exports=ruta;