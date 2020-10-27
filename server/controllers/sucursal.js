const sucursal = require('../models').sucursal;

function create(req, res) {
    sucursal.create(req.body).then(sucursal => {
        res.status(200).send({ sucursal });
    }).catch(err => {
        res.status(500).send({ err });
    })
}

module.exports = {
    create
}