const planestructuraController = require('../controllers').planestructura;

module.exports = (app) => {
    app.post('/api/planestructura', planestructuraController.create);
    app.put('/api/planestructura/:id', planestructuraController.update);
    app.get('/api/planestructuras', planestructuraController.getAll);
}