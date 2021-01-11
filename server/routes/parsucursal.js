const sucursalController = require('../controllers').parsucursal;
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/sucursal', md_auth.auth, sucursalController.create);
    app.put('/api/sucursal/:id', md_auth.auth, sucursalController.update);
    app.get('/api/sucursales', md_auth.auth, sucursalController.getAll);
}