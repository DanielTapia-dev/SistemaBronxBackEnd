const parimpuestoController = require('../controllers').parimpuesto;

module.exports = (app) => {
    app.post('/api/parimpuesto', parimpuestoController.create);
    app.put('/api/parimpuesto/:id', parimpuestoController.update);
    app.get('/api/parimpuestos', parimpuestoController.getAll);
}