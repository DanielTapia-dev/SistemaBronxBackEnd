const parfamiliaController = require('../controllers').parfamilia;

module.exports = (app) => {
    app.post('/api/parfamilia', parfamiliaController.create);
    app.put('/api/parfamilia/:id', parfamiliaController.update);
    app.get('/api/parfamilias', parfamiliaController.getAll);
}