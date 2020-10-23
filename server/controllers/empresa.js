const empresa=require('../models').empresa;

function create(req,res) {
    empresa.create(req.body).then(empresa=>{
        res.status(200).send({empresa});
    }).catch(err=>{
        res.status(500).send({err});
    })
}

function getAll(req, res) {
    empresa.findAll()
        .then(empresa => {
            res.status(200).send({empresa});
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar las empresa" });
        })
}

module.exports={
    create, 
    getAll
}