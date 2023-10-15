var ruta=require("express").Router();
var {mostrarUsuarios, nuevoUsuario, buscarPorId, modificarUsuario,borrarUsuario}=require("../bd/usuariosBD");

ruta.get("/api/",async(req,res)=>{
    var users = await mostrarUsuarios();
    if(users.length>0){
       res.status(200).json(users); 
    }else{ 
        res.status(400).json("Usuarios no encontrados");
    }
});
 
/*ruta.get("/nuevoUsuario",(req,res)=>{
    res.render("usuario/nuevo");
});*/
 
ruta.post("/api/nuevoUsuario",async(req,res)=>{
   var error = await nuevoUsuario(req.body);
   if(error==0){
    res.status(200).json("Usuario Registrado Correctamente");
   }else{
    res.status(400).json("Error al registrar usuario");
   }
});

ruta.get("/api/buscarUsuarioPorId/:id", async(req,res)=>{
    var user = await buscarPorId(req.params.id);
    if(user!=undefined){
        res.status(200).json(user);
    }else{
        res.status(400).json("Usuario no encontrado");
    }
})

ruta.post("/api/editarUsuario", async (req,res)=>{
    var error = await modificarUsuario(req.body);
    //res.redirect("/");
    if(error==0){
        res.status(200).json("Cambios Guardados Correctamente");
    }else{
        res.status(400).json("Error al actualizar");
    }
});
 
ruta.get("/api/borrarUsuario/:id",async(req,res)=>{
    
    var error = await borrarUsuario(req.params.id);
    if(error==0){
        res.status(200).json("Usuario borrado :D");
    }else{
        res.status(400).json("Error al borrar");
    }

}); 
 
 
module.exports=ruta;