var conexion=require('./conexion').conexionUsuarios;
var Usuario=require('../modelos/usuarios');
var {generarPassword, validarPassword} = require("../middlewares/passwords");    
const { log } = require("console");
//var fs = require("fs");
//fs.unlinkSync("")

async function mostrarUsuarios(){
    var users=[]; 
    try{
        var usuarios = await conexion.get();
        usuarios.forEach(usuario => {
        //console.log(usuario.data());
            var usuario1 = new Usuario(usuario.id, usuario.data())
            if(usuario1.bandera == 0){
                users.push(usuario1.obtenerUsuario); 
            }
      
        });

    }catch(err){
        console.log("Error al mostrar usuarios " + err)
        users=[];
    }
    return users; 
}

async function nuevoUsuario(datos){
    var error=1;
    var {salt,hash} = generarPassword(datos.password);
    datos.salt=salt;
    datos.password=hash;
    try{
        var usuario1 = new Usuario(null,datos);
        if(usuario1.bandera==0){
            conexion.doc().set(usuario1.obtenerUsuario);
            error=0;
        }else{
            console.log("datos de usuario incorrectos");
        }
    }catch(err){
        console.log("Error al crear nuevo usuario "+err);
    }
    return error;
}


async function login(datos){
    var user;
    var usuarioBd = await conexion.where("usuario","==",datos.usuario).get();
    if(usuarioBd.empty){
        console.log("usuario no existe");
        return user;
    }else{
        usuarioBd.forEach((doc) => {
            var validP = validarPassword(datos.password,doc.data().salt,doc.data().password);
            if(validP===false){
                console.log("PASSWORD INCORRECTO");
                user=0; //return user;
            }else{
                console.log("SI SE VALIDO")
                user=1;
            }
        });
    }
    return user;
}



async function buscarPorId(id){ //error al concatenar al usuario: Error: Value for argument "documentPath" is not a valid resource path. Path must be a non-empty string.
    var user;
    try{
        var usuarioBD = await conexion.doc(id).get();
        //var usuarioBD = await conexion.where("usuario","==",datos.usuario).get(); 
        var usuarioObjeto= new Usuario(usuarioBD.id,usuarioBD.data());
        if(usuarioObjeto.bandera==0){
            user=usuarioObjeto.obtenerUsuario;
        }
    }
    catch(err){
        console.log("Error al recuperar al usuario: "+err);
    }
    return user;
}
 

async function modificarUsuario(datos){
    var error=1;
    var user = await buscarPorId(datos.id); 
    if(user!=undefined){
        if(datos.password===""){
            datos.password===datos.passwordAnt;
        }else{
            var {salt,hash} = generarPassword(datos.password);
            datos.salt=salt;
            datos.password=hash;
        }
        var user = new Usuario(datos.id,datos);
        if(user.bandera===0){
            try{    
                await conexion.doc(user.id).set(user.obtenerUsuario);
                
                console.log("Datos modificados");
                error = 0;
            }catch(err){
                console.log("Error al modificar al usuario "+err);
            }
        }else{
            console.log("Error, los datos no son validos");
        }
    }
    return error;
}
 
async function borrarUsuario(id){
    var error = 1;
    var user = await buscarPorId(id);
    if(user!=undefined){
        try{
            await conexion.doc(id).delete();
            
            console.log("Usuario borrado existosamente");
            error = 0;
    
        }catch(err){
            console.log("Error al eliminar al usuario"+err);
        }
    }
    return error;

}

module.exports={
    mostrarUsuarios,
    nuevoUsuario,
    buscarPorId,
    modificarUsuario,
    borrarUsuario,
    login
}