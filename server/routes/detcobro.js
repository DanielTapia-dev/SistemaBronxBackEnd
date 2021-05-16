const detcobroController = require('../controllers/detcobro');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/detcobro', md_auth.auth, detcobroController.create);
    app.get('/api/detcobro/:id', md_auth.auth, detcobroController.getOne);
    app.get('/api/detcobro/:id/:idempresa', md_auth.auth, detcobroController.getDetCobro);
    app.put('/api/detcobro/:id', md_auth.auth, detcobroController.update);
    app.get('/api/detcobros/:id', md_auth.auth, detcobroController.getAll);
    app.delete('/api/detcobros/delete/:id', md_auth.auth, detcobroController.borrar);
}