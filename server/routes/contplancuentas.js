const contplancuentasController = require('../controllers').contplancuentas;

module.exports = (app) => {
    app.post('/api/contplancuentas', contplancuentasController.create);
    app.put('/api/contplancuentas/:id', contplancuentasController.update);
    app.get('/api/contplancuentas', contplancuentasController.getAll);
}