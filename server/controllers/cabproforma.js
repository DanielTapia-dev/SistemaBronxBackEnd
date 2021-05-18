const { Pool, Client } = require('pg');
const cabproforma = require("../models").cabproforma;
const configuracion = require('../config/configpg').config;

const config = {
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    database: 'contable'
};

const pool = new Pool(configuracion);

function create(req, res) {
    cabproforma
        .create(req.body)
        .then((cabproforma) => {
            res.status(200).send({ cabproforma });
        })
        .catch((err) => {
            res.status(500).send({ err });
        });
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;
    cabproforma
        .findOne({
            where: {
                secmovcab: id,
            },
        })
        .then((proforma) => {
            proforma
                .update(body)
                .then(() => {
                    res.status(200).send({ proforma });
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
    cabproforma
        .findOne({
            where: {
                secmovcab: id,
            },
        })
        .then((proforma) => {
            res.status(200).send(proforma);
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrió un error al buscar la proforma." + err });
        });
}

function getAll(req, res) {
    var idEmpresa = req.params.id;
    cabproforma
        .findAll({
            where: {
                idempresa: idEmpresa,
            },
        })
        .then((cabproforma) => {
            res.status(200).send({ cabproforma });
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrio un error al buscar los cabproforma" });
        });
}

function borrar(req, res) {
    var id = req.params.id;
    var body = req.body;
    cabproforma
        .findOne({
            where: {
                secmovcab: id,
            },
        })
        .then((proforma) => {
            proforma
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

function reportesProformas(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var fechaIni = req.params.fechaIni;
    var fechaFin = req.params.fechaFin;
    var estado = req.params.estado;

    const consulta = pool.query(`SELECT pro.idempresa, pro.secmovcab, 
  pro.idsucursal, suc.nomsucursal, 
  pro.idcliente, cli.nomcliente,
  pro.fechaingreso, pro.fechaaprob, pro.subsindesc, 
  pro.porcdescuento, pro.descuento, pro.subtotal, pro.subtotaliva0, pro.subtotaliva12, 
  pro.total, pro.crepor, pro.modpor, pro."createdAt", pro."updatedAt", 
  pro.estado, pro.iva0, pro.iva12, pro.abono
  FROM cabproforma pro, clientes cli, parsucursal suc
  where pro.idcliente = cli.idcliente 
  and pro.idsucursal = suc.idsucursal
  and pro.idempresa = '` + idEmpresa + `'
  and pro.estado = '` + estado + `' 
  and (pro."createdAt" between '` + fechaIni + `' and '` + fechaFin + `');`).then((reportesProformas) => {
        res.send(reportesProformas.rows);
    }).catch((err) => {
        res
            .status(500)
            .send({ message: "Ocurrio un error al realizar el reporte" + err });
    });
}



module.exports = {
    create,
    update,
    getAll,
    borrar,
    getOne,
    reportesProformas
};