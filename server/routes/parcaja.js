const parcajaController = require('../controllers/parcaja');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/parcaja', md_auth.auth, parcajaController.create);
    app.get('/api/parcaja/:id', md_auth.auth, parcajaController.getOne);
    app.put('/api/parcaja/:id', md_auth.auth, parcajaController.update);
    app.get('/api/parcajas/:id', md_auth.auth, parcajaController.getAll);
    app.delete('/api/parcaja/delete/:id', md_auth.auth, parcajaController.borrar);
}