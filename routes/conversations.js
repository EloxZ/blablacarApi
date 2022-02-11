module.exports = function (app, gestorBD) {
  app.get("/conversation/messages", function (req, res) {
    let criterio = {
      $and: [
        { participantes: req.query.id1 },
        { participantes: req.query.id2 },
      ],
    };
    gestorBD.obtenerItem(
      criterio,
      "conversaciones",
      function (resultConversation) {
        if (resultConversation.length === 0) {
          // Crear una conversacion, devolver los datos y mensajes vacios
          const nuevaConversacion = {
            participantes: [req.query.id1, req.query.id2],
          };
          gestorBD.insertarItem(
            nuevaConversacion,
            "conversaciones",
            (result) => {
              res.send({
                status: 200,
                data: {
                  conversacion: result._id,
                  mensajes: [],
                },
              });
            }
          );
        } else {
          let criterio2 = { conversacion: resultConversation[0]._id.toString() };
          gestorBD.obtenerItem(
            criterio2,
            "mensajes",
            function (resultMensajes) {
              console.log(criterio2);
              if (resultMensajes.length == null)
                res.send({
                  Error: {
                    status: 500,
                    data: "Se ha producido un error al obtener los mensajes, intentelo de nuevo más tarde",
                  },
                });
              else {
                res.send({
                  status: 200,
                  data: {
                    conversacion: resultConversation[0]._id,
                    mensajes: resultMensajes,
                  },
                });
              }
            }
          );
        }
      }
    );
  });

  app.get("/conversations", function (req, res) {
    gestorBD.obtenerItem({}, "conversaciones", function (conversaciones) {
      if (conversaciones == null) {
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al obtener la lista de conversaciones, intentelo de nuevo más tarde",
          },
        });
      } else {
        res.send({ status: 200, data: { conversaciones: conversaciones } });
      }
    });
  });

  app.post("/conversations", function (req, res) {
    //TODO hacer validador y encriptar la contraseña
    gestorBD.insertarItem(req.body, "conversaciones", function (conversacion) {
      if (conversacion == null) {
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al insertar la conversacion, intentelo de nuevo más tarde",
          },
        });
      } else {
        res.send({
          status: 200,
          data: { msg: "conversacion añadida correctamente" },
        });
      }
    });
  });

  app.delete("/conversations", function (req, res) {
    let criterio = { _id: gestorBD.mongo.ObjectID(req.body.id) };
    gestorBD.eliminarItem(criterio, "conversaciones", function (result) {
      if (result == null) {
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al borrar la conversacion, intentelo de nuevo más tarde",
          },
        });
      } else {
        res.send({
          status: 200,
          data: { msg: "conversacion eliminada correctamente" },
        });
      }
    });
  });

  app.get("/conversations/:id", function (req, res) {
    let criterio = { _id: gestorBD.mongo.ObjectID(req.params.id) };
    gestorBD.obtenerItem(criterio, "conversaciones", function (conversacion) {
      if (conversacion == null) {
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error inesperado, intentelo de nuevo más tarde",
          },
        });
      } else {
        res.send({ status: 200, data: { conversacion: conversacion } });
      }
    });
  });

  app.put("/conversations/:id", function (req, res) {
    let criterio = { _id: gestorBD.mongo.ObjectID(req.params.id) };
    let nuevoMensaje = req.body;
    gestorBD.modificarItem(
      criterio,
      nuevoMensaje,
      "conversaciones",
      function (result) {
        if (result == null)
          res.send({
            Error: {
              status: 500,
              data: "Se ha producido un error al editar la conversacion, intentelo de nuevo más tarde",
            },
          });
        else {
          res.send({
            status: 200,
            data: { msg: "conversacion editada correctamente" },
          });
        }
      }
    );
  });
};
