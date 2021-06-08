const clientesController = require('../controllers').clientes;
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/cliente', md_auth.auth, clientesController.create);
    app.get('/api/cliente/:id', md_auth.auth, clientesController.getOne);
    app.get('/api/clienteporcedula/:id', md_auth.auth, clientesController.getOnePorCedula);
    app.put('/api/cliente/:id', md_auth.auth, clientesController.update);
    app.get('/api/clientes/:id', md_auth.auth, clientesController.getAll);
    app.delete('/api/clientes/delete/:id', md_auth.auth, clientesController.borrar);
    app.get('/api/clientescredito/:id', md_auth.auth, clientesController.getAllCredito);
}