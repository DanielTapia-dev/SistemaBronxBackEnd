const clientes=require('../models').clientes;

function create(req,res) {
    clientes.create(req.body).then(clientes=>{
        res.status(200).send({clientes});
    }).catch(err=>{
        res.status(500).send({err});
    })
}

function getAll(req, res) {
    clientes.findAll()
        .then(clientes => {
            res.status(200).send({ clientes });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar los clientes" });
        })
}

module.exports={
    create, 
    getAll
}