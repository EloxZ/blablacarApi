module.exports = function (app, gestorBD) {
  // Viajes de un pasajero
  function viajesPasajero(req, res) {
    let origen = req.query.origen;
    let destino = req.query.destino;

    if (origen == null) origen = "";
    if (destino == null) destino = "";

    let query = {
      $and: [
        { lugar_salida: { $regex: ".*" + origen + ".*", $options: "i" } },
        { lugar_llegada: { $regex: ".*" + destino + ".*", $options: "i" } },
        { id_pasajeros: { $in: [ req.query.passenger ] } }
      ]
    };


    let criterio = { _id: gestorBD.mongo.ObjectID(req.query.passenger) };

    gestorBD.obtenerItem(criterio, "usuarios", function (resultUser) {
      if (resultUser == null)
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al obtener el usuario, intentelo de nuevo más tarde",
          },
        });
      else {
        gestorBD.obtenerItem(query, "viajes", function (resultTravel) {
          if (resultTravel == null)
            res.send({
              Error: {
                status: 500,
                data: "Se ha producido un error al obtener los viajes del usuario, intentelo de nuevo más tarde",
              },
            });
          else
            res.send({
              status: 200,
              data: { pasajero: resultUser, viajes: resultTravel },
            });
        });
      }
    });
  };

  // Todos los viajes (TODO: Se podrán hacer busquedas sobre ellos)
  app.get("/travels", function (req, res) {
    let origen = req.query.origen;
    let destino = req.query.destino;

    if (origen == null) origen = "";
    if (destino == null) destino = "";

    let criterio = {
      $and: [
        { lugar_salida: { $regex: ".*" + origen + ".*", $options: "i" } },
        { lugar_llegada: { $regex: ".*" + destino + ".*", $options: "i" } }
      ]
    };

    let conductor = req.query.driver;
    let pasajero = req.query.passenger;

    if (conductor != null) {
      viajesConductor(req, res);
    } else if (pasajero != null) {
      viajesPasajero(req, res);
    } else {
      gestorBD.obtenerItem(criterio, "viajes", function (viajes) {
        if (viajes == null)
          res.send({
            Error: {
              status: 500,
              data: "Se ha producido un error al obtener los viajes, intentelo de nuevo más tarde",
            },
          });
        else {
          res.send({ status: 200, data: { viajes: viajes } });
        }
      });
    }
  });

  //Viajes con el id de un conductor concreto
  function viajesConductor(req, res) {
    let origen = req.query.origen;
    let destino = req.query.destino;

    if (origen == null) origen = "";
    if (destino == null) destino = "";

    let query = {
      $and: [
        { lugar_salida: { $regex: ".*" + origen + ".*", $options: "i" } },
        { lugar_llegada: { $regex: ".*" + destino + ".*", $options: "i" } },
        { id_conductor: req.query.driver }
      ]
    };

    let criterio = { _id: gestorBD.mongo.ObjectID(req.query.driver) };
    gestorBD.obtenerItem(criterio, "usuarios", function (resultUser) {
      if (resultUser == null)
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al obtener el conductor, intentelo de nuevo más tarde",
          },
        });
      else {
        gestorBD.obtenerItem(query, "viajes", function (resultTravel) {
          if (resultTravel == null)
            res.send({
              Error: {
                status: 500,
                data: "Se ha producido un error al obtener los viajes del conductor, intentelo de nuevo más tarde",
              },
            });
          else
            res.send({
              status: 200,
              data: { conductor: resultUser, viajes: resultTravel },
            });
        });
      }
    });
  };

  // CRUD de viajes
  app.post("/travels", function (req, res) {
    gestorBD.insertarItem(req.body, "viajes", function (result) {
      if (result == null) {
        console.log("WARN: Fallo al insertar un viaje.");
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al insertar el viaje, intentelo de nuevo más tarde",
          },
        });
      } else {
        res.send({ status: 200, data: { msg: "Viaje insertado" } });
      }
    });
  });

  app.delete("/travels", function (req, res) {
    let criterio = { _id: gestorBD.mongo.ObjectID(req.body.id) };
    gestorBD.eliminarItem(criterio, "viajes", function (result) {
      if (result == null) {
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al borrar el viaje, intentelo de nuevo más tarde",
          },
        });
      } else {
        res.send({ status: 200, data: { msg: "Viaje eliminado" } });
      }
    });
  });

  app.get("/travels/:id", function (req, res) {
    let criterio = { _id: gestorBD.mongo.ObjectID(req.params.id) };
    gestorBD.obtenerItem(criterio, "viajes", function (viaje) {
      if (viaje == null) {
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error inesperado, intentelo de nuevo más tarde",
          },
        });
      } else {
        res.send({ status: 200, data: { viaje: viaje } });
      }
    });
  });

  app.put("/travels/:id", function (req, res) {
    let criterio = { _id: gestorBD.mongo.ObjectID(req.params.id) };
    let nuevoViaje = req.body;
    gestorBD.modificarItem(criterio, nuevoViaje, "viajes", function (result) {
      if (result == null)
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al modificar el viaje, intentelo de nuevo más tarde",
          },
        });
      else {
        res.send({ status: 200, data: { msg: "Editado correctamente" } });
      }
    });
  });
};
