const usuarios = require('../models').usuarios;
const jwt = require('../services/jwt');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');
var nJwt = require('njwt');
var config = require('../config/config');
var secret = config.token_secret;

function create(req, res) {

    const usuarioIngresado = req.body.usuario;
    usuarios.findOne({
            where: {
                usuario: req.body.usuario
            }
        })
        .then(usuario => {
            if (usuario) {
                console.log("El usuario ya existe");
                res.status(500).send({ message: "El nombre de usuario ya existe" });
            } else {
                usuarios.create(req.body)
                    .then(usuario => {
                        res.status(200).send({ usuario });
                    })
                    .catch(err => {
                        res.status(500).send({ err });
                    })
            }
        })
}

function login(req, res) {
    usuarios.findOne({
            where: {
                usuario: req.body.usuario,
                password: req.body.password
            }
        })
        .then(usuario => {
            if (usuario) {
                if (req.body.token) {
                    res.status(200).send({
                        token: jwt.createToken(usuario),
                        usuario: usuario,
                        menu: getMenuFrontEnd(usuario.idrol.toString())
                    });
                } else {
                    res.status(200).send({
                        usuario: usuario,
                        menu: getMenuFrontEnd(usuario.idrol.toString())
                    });
                }
            } else {
                res.status(401).send({ message: "Acceso no autorizado" })
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrió un error al buscar el Usuario." } + err);
        })

}

function getAll(req, res) {
    usuarios.findAll()
        .then(usuarios => {
            res.status(200).send({ usuarios });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar los usuarios" });
            console.log(err);
        })
}

function auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: "La petición no tiene la cabecera de autenticación" });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');
    var payload = nJwt.verify(token, secret, (err, verifiedJwt) => {
        if (err) {
            return res.status(401).send({ message: "Acceso no autorizado." });
        } else {
            res.json({
                verifiedJwt
            });
            next();
        }
    })
}


module.exports = {
    create,
    login,
    getAll,
    auth
}