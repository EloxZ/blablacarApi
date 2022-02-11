module.exports = function (app, gestorBD) {
    app.get("/messages", function (req, res) {
        gestorBD.obtenerItem({}, 'mensajes', function (mensajes) {
            if (mensajes == null) {
                res.send({ Error: { status: 500, data: "Se ha producido un error al obtener la lista de mensajes, intentelo de nuevo más tarde" } })
            } else {
                res.send({status: 200, data: {mensajes: mensajes}});
            }
        });
    });

    app.post('/messages', function (req, res) {
        var cuerpo = req.body;
        cuerpo.stamp = new Date();
        gestorBD.insertarItem(cuerpo, 'mensajes', function (mensaje) {
            if (mensaje == null) {
                console.log("WARN: Fallo al insertar un mensaje")
                res.send({ Error: { status: 500, data: "Se ha producido un error al insertar el mensaje, intentelo de nuevo más tarde" } })
            }
            else {
                res.send({status: 200, data: {msg: 'Mensaje añadido correctamente'}})
            }
        });
    });

    app.delete('/messages', function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.body.id)};
        gestorBD.eliminarItem(criterio, 'mensajes', function(result){
            if (result==null){
                res.send({ Error: { status: 500, data: "Se ha producido un error al borrar el mensaje, intentelo de nuevo más tarde" } })
            }
            else {
                res.send({status: 200, data: {msg: 'Mensaje eliminado correctamente'}})
            }
        })
    });

    app.get('/messages/:id', function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.obtenerItem(criterio, 'mensajes', function(mensaje){
            if(mensaje==null){
                res.send({ Error: { status: 500, data: "Se ha producido un error inesperado, intentelo de nuevo más tarde" } })
            }
            else {
                res.send({status: 200, data: {mensaje: mensaje}})            }
        });        
    })
}