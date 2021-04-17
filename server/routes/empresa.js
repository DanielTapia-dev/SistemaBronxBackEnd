const empresasController = require('../controllers').empresa;
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/empresa', md_auth.auth, empresasController.create);
    app.put('/api/empresa/:id', md_auth.auth, empresasController.update);
    app.get('/api/empresas', md_auth.auth, empresasController.getAll);
    app.get('/api/empresaUnica/:id', md_auth.auth, empresasController.getOne);
}