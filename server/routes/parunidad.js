const parunidadController = require('../controllers').parunidad;

module.exports = (app) => {
    app.post('/api/parunidad', parunidadController.create);
    app.put('/api/parunidad/:id', parunidadController.update);
    app.get('/api/parunidades', parunidadController.getAll);
}