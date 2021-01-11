const parfamiliaController = require('../controllers').parfamilia;
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/parfamilia', md_auth.auth, parfamiliaController.create);
    app.put('/api/parfamilia/:id', md_auth.auth, parfamiliaController.update);
    app.get('/api/parfamilias', md_auth.auth, parfamiliaController.getAll);
}