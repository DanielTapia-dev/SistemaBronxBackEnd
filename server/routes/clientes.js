const clientesController = require('../controllers').clientes;

module.exports = (app) => {
    app.post('/api/cliente', clientesController.create);
    app.put('/api/cliente/:id', clientesController.update);
    app.get('/api/clientes', clientesController.getAll);
}