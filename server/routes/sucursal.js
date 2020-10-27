const sucursalController = require('../controllers').sucursal;

module.exports = (app) => {
    app.post('/api/sucursal', sucursalController.create);
}