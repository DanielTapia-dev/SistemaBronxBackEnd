const detmovimientosController = require('../controllers/detmovimientos');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/detmovimiento', md_auth.auth, detmovimientosController.create);
    app.get('/api/detmovimiento/:id', md_auth.auth, detmovimientosController.getOne);
    app.put('/api/detmovimiento/:id', md_auth.auth, detmovimientosController.update);
    app.get('/api/detmovimientos/:id', md_auth.auth, detmovimientosController.getAll);
    app.delete('/api/detmovimientos/delete/:id', md_auth.auth, detmovimientosController.borrar);
}