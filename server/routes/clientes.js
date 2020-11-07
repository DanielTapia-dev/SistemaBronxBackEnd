const clientesController = require('../controllers').clientes;
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/cliente', md_auth.auth, clientesController.create);
    app.put('/api/cliente/:id', md_auth.auth, clientesController.update);
    app.get('/api/clientes/:id', md_auth.auth, clientesController.getAll);
}