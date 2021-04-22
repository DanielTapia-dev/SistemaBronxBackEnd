const planestructuraController = require('../controllers').planestructura;
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/planestructura', md_auth.auth, planestructuraController.create);
    app.put('/api/planestructura/:id', md_auth.auth, planestructuraController.update);
    app.get('/api/planestructura/:id', md_auth.auth, planestructuraController.getAll);
}