const sucursalController = require('../controllers').parsucursal;

module.exports = (app) => {
    app.post('/api/sucursal', sucursalController.create);
    app.put('/api/sucursal/:id', sucursalController.update);
    app.get('/api/sucursales', sucursalController.getAll);
}