const empresasController = require('../controllers').empresa;

module.exports = (app) => {
    app.post('/api/empresa', empresasController.create);
    app.put('/api/empresa/:id', empresasController.update);
    app.get('/api/empresas', empresasController.getAll);
}