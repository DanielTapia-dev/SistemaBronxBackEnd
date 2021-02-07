const detproformaController = require('../controllers/detproforma');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/detproforma', md_auth.auth, detproformaController.create);
    app.get('/api/detproforma/:id', md_auth.auth, detproformaController.getOne);
    app.put('/api/detproforma/:id', md_auth.auth, detproformaController.update);
    app.get('/api/detproformas/:id', md_auth.auth, detproformaController.getAll);
    app.delete('/api/detproformas/delete/:id', md_auth.auth, detproformaController.borrar);
}