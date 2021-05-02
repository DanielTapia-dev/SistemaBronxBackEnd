const detproforma = require("../models").detproforma;

function create(req, res) {
    detproforma
        .create(req.body)
        .then((detproforma) => {
            res.status(200).send({ detproforma });
        })
        .catch((err) => {
            res.status(500).send({ err });
        });
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;
    detproforma
        .findOne({
            where: {
                secmovdet: id,
            },
        })
        .then((dproforma) => {
            dproforma
                .update(body)
                .then(() => {
                    res.status(200).send({ dproforma });
                })
                .catch((erro) => {
                    res
                        .status(500)
                        .send({ message: "Ocurrio un error al actualizar la proforma" });
                });
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrio un error al actualizar la proforma" });
        });
}

function getOne(req, res) {
    var id = req.params.id;
    detproforma
        .findOne({
            where: {
                secmovdet: id,
            },
        })
        .then((dproforma) => {
            res.status(200).send(dproforma);
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrió un error al buscar la proforma." + err });
        });
}

function getAll(req, res) {
    var secmovcab = req.params.id;
    detproforma
        .findAll({
            where: {
                secmovcab: secmovcab,
            },
        })
        .then((detproforma) => {
            res.status(200).send({ detproforma });
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrio un error al buscar los detproforma" });
        });
}


function borrar(req, res) {
    var id = req.params.id;
    var body = req.body;
    detproforma
        .findOne({
            where: {
                secmovdet: id,
            },
        })
        .then((dproforma) => {
            dproforma
                .destroy(body)
                .then(() => {
                    res.status(200).send({ message: "Proforma eliminado" });
                })
                .catch((erro) => {
                    res
                        .status(500)
                        .send({ message: "Ocurrio un error al borrar la proforma" });
                });
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrio un error al borrar la proforma" });
        });
}

module.exports = {
    create,
    update,
    getAll,
    borrar,
    getOne
};