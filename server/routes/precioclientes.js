const precioclientesController = require('../controllers/precioclientes');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/precioclientes', md_auth.auth, precioclientesController.create);
    app.get('/api/precioclientes/:id', md_auth.auth, precioclientesController.getOne);
    app.put('/api/precioclientes/:id', md_auth.auth, precioclientesController.update);
    app.get('/api/precioclientesall/:id', md_auth.auth, precioclientesController.getAll);
    app.delete('/api/precioclientes/delete/:id', md_auth.auth, precioclientesController.borrar);
}