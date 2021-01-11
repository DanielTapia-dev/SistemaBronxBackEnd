const parimpuestoController = require('../controllers').parimpuesto;
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/parimpuesto', md_auth.auth, parimpuestoController.create);
    app.put('/api/parimpuesto/:id', md_auth.auth, parimpuestoController.update);
    app.get('/api/parimpuestos', md_auth.auth, parimpuestoController.getAll);
}