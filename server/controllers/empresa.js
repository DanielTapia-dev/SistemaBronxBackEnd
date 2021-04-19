const empresa = require('../models').empresa;

function create(req, res) {
    empresa.create(req.body).then(empresa => {
        res.status(200).send({ empresa });
    }).catch(err => {
        res.status(500).send({ err });
    })
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;

    empresa.findOne({
            where: {
                idempresa: id
            }
        })
        .then(emp => {
            emp.update(body)
                .then(() => {
                    res.status(200).send({ emp });
                })
                .catch(erro => {
                    res.status(500).send({ message: "Ocurrio un error al actualizar la empresa" });
                })
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al actualizar el empresa" });
        });
}

function getAll(req, res) {
    var idEmpresa = req.params.id;
    empresa
      .findAll({
        where: {
          idempresa: idEmpresa,
        },
      })
      .then((empresa) => {
        res.status(200).send({ empresa });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Ocurrio un error al buscar la empresa" });
      });
  }


function getOne(req, res) {
    var id = req.params.id;
    empresa.findOne({
            where: {
                idempresa: id,
            },
        })
        .then((emp) => {
            res.status(200).send(emp);
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrió un error al buscar la empresa." + err });
        });
}

module.exports = {
    create,
    update,
    getAll,
    getOne
}