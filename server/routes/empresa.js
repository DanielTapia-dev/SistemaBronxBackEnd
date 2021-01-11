const empresasController = require('../controllers').empresa;

module.exports = (app) => {
    app.post('/api/empresa', md_auth.auth, empresasController.create);
    app.put('/api/empresa/:id', md_auth.auth, empresasController.update);
    app.get('/api/empresas', md_auth.auth, empresasController.getAll);
}