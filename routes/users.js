module.exports = function (app, gestorBD) {
  app.get("/users", function (req, res) {
    let name = req.query.name;
    let surname = req.query.surname;
    let email = req.query.email;
    if (name == null) name = "";
    if (surname == null) surname = "";
    if (email == null) email = "";
    let criterio = {
      $and: [
        { nombre: { $regex: ".*" + name + ".*" } },
        { apellido: { $regex: ".*" + surname + ".*" } },
        { email: { $regex: ".*" + email + ".*" } }
      ]
    };
    gestorBD.obtenerItem(criterio, "usuarios", function (usuarios) {
      if (usuarios == null) {
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al obtener la lista de usuarios, intentelo de nuevo más tarde",
          },
        });
      } else {
        res.send({ status: 200, data: { usuarios: usuarios } });
      }
    });
  });

  app.post("/users", function (req, res) {
    //TODO hacer validador y encriptar la contraseña
    gestorBD.insertarItem(req.body, "usuarios", function (usuario) {
      if (usuario == null) {
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al insertar el usuario, intentelo de nuevo más tarde",
          },
        });
      } else {
        res.send({
          status: 200,
          data: { msg: "Usuario añadido correctamente" },
        });
      }
    });
  });

  app.delete("/users", function (req, res) {
    let criterio = { _id: gestorBD.mongo.ObjectID(req.body.id) };
    gestorBD.eliminarItem(criterio, "usuarios", function (result) {
      if (result == null) {
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al borrar el usuario, intentelo de nuevo más tarde",
          },
        });
      } else {
        res.send({
          status: 200,
          data: { msg: "Usuario eliminado correctamente" },
        });
      }
    });
  });

  app.get("/users/:id", function (req, res) {
    let criterio = { _id: gestorBD.mongo.ObjectID(req.params.id) };
    gestorBD.obtenerItem(criterio, "usuarios", function (usuario) {
      if (usuario == null) {
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error inesperado, intentelo de nuevo más tarde",
          },
        });
      } else {
        console.log(usuario);
        res.send({ status: 200, data: { usuario: usuario } });
      }
    });
  });

  app.put("/users/:id", function (req, res) {
    let criterio = { _id: gestorBD.mongo.ObjectID(req.params.id) };
    let nuevoUsuario = req.body;
    gestorBD.modificarItem(
      criterio,
      nuevoUsuario,
      "usuarios",
      function (result) {
        if (result == null)
          res.send({
            Error: {
              status: 500,
              data: "Se ha producido un error al editar el usuario, intentelo de nuevo más tarde",
            },
          });
        else {
          res.send({
            status: 200,
            data: { msg: "Usuario editado correctamente" },
          });
        }
      }
    );
  });

  app.get("/findUser", function (req, res) {
    let query = req.query.namesurnameuser;
    let criterio = {
      $or: [
        { nombre: { $regex: ".*" + query + ".*" } },
        { apellido: { $regex: ".*" + query + ".*" } },
      ],
    };
    gestorBD.obtenerItem(criterio, "usuarios", function (usuarios) {
      if (usuarios == null) {
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al obtener la lista de usuarios, intentelo de nuevo más tarde",
          },
        });
      } else {
        res.send({ status: 200, data: { usuarios: usuarios } });
      }
    });
  });

  app.get("/findUserByEmail/:email", function (req, res) {
    let email = req.params.email;
    let criterio = { email: email };
    gestorBD.obtenerItem(criterio, "usuarios", function (usuario) {
      if (usuario == null) {
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al obtener el usuario, intentelo de nuevo más tarde o con otro email",
          },
        });
      } else {
        res.send({ status: 200, data: { usuarios: usuario } });
      }
    });
  });

  app.get("/findUserById/:id", function (req, res) {
    let criterio = { _id: gestorBD.mongo.ObjectID(req.params.id) };
    gestorBD.obtenerItem(criterio, "usuarios", function (usuario) {
      if (usuario == null) {
        res.send({
          Error: {
            status: 500,
            data: "Se ha producido un error al obtener el usuario, intentelo de nuevo más tarde o con otro email",
          },
        });
      } else {
        res.send({ status: 200, data: { usuario: usuario } });
      }
    });
  });
};
