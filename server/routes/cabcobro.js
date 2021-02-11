const cabcobroController = require('../controllers/cabcobro');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/cabcobro', md_auth.auth, cabcobroController.create);
    app.get('/api/cabcobro/:id', md_auth.auth, cabcobroController.getOne);
    app.put('/api/cabcobro/:id', md_auth.auth, cabcobroController.update);
    app.get('/api/cabcobros/:id', md_auth.auth, cabcobroController.getAll);
    app.delete('/api/cabcobros/delete/:id', md_auth.auth, cabcobroController.borrar);
}