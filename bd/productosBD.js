var conexion=require("./conexion").conexionProductos;
var Producto=require("../modelos/productos");
 
async function mostrarProductos(){
    var products=[]; 
    try{
        var productos = await conexion.get();
        productos.forEach(producto => {
        //console.log(usuario.data());
            var producto1 = new Producto(producto.id, producto.data())
            if(producto1.bandera === 0){
                products.push(producto1.obtenerProducto); 
            }
        });

    }catch(err){
        console.log("Error al mostrar productos " + err)
        products=[];
    }
    return products;
}
 
async function nuevoProducto(newProduct){
    var error=1;
    try{
        var producto1 = new Producto(null,newProduct);
        if(producto1.bandera===0){
            conexion.doc().set(producto1.obtenerProducto);
            error=0;
        }else{
            console.log("Datos incorrectos/producto");
        }
    }catch(err){
        console.log("Error al crear nuevo producto "+err);
    }
    return error;
}
 
 
async function buscarPorId(id){
    var product;
    try{
        var productoBD = await conexion.doc(id).get();
        var productoObjeto= new Producto(productoBD.id,productoBD.data());
        if(productoObjeto.bandera===0){
            product=productoObjeto.obtenerProducto;
        }
    }
    catch(err){
        console.log("Error al concatenar al producto: "+err);
    }
    return product;
}
 
async function modificarProducto(datos){
    var product = new Producto(datos.id,datos);
    var error=1;
    if(product.bandera==0){
        try{    
            await conexion.doc(product.id).set(product.obtenerProducto);
            console.log("Datos modificados / producto");
            error = 0;
        }catch(err){
            console.log("Error al modificar al producto "+err);
        }
    }else{
        console.log("Error, los datos no son validos");
    }
    return error;
}

async function borrarProducto(id){
    var error=1;
    var producto = await buscarPorId(id);

    if(producto!=undefined){
        try{
            await conexion.doc(id).delete();
            console.log("Producto borrado existosamente");
            error=0;

        }catch(err){
            console.log("Error al eliminar producto"+err);
        }
    }
    return error;

}

module.exports={
    mostrarProductos,
    nuevoProducto,
    buscarPorId,
    modificarProducto,
    borrarProducto
}