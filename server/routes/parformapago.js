const parformapagoController = require('../controllers').parformapago;

module.exports = (app) => {
    app.post('/api/parformapago', parformapagoController.create);
    app.put('/api/parformapago/:id', parformapagoController.update);
    app.get('/api/parformapagos', parformapagoController.getAll);
}