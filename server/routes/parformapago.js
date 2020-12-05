const parformapagoController = require('../controllers').parformapago;
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/parformapago', md_auth.auth, parformapagoController.create);
    app.put('/api/parformapago/:id', md_auth.auth, parformapagoController.update);
    app.get('/api/parformapagos/:id', md_auth.auth, parformapagoController.getAll);
}