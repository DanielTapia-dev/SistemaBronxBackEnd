const detasientoController = require('../controllers/detasiento');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/detasiento', md_auth.auth, detasientoController.create);
    app.get('/api/detasiento/:id', md_auth.auth, detasientoController.getOne);
    app.put('/api/detasiento/:id', md_auth.auth, detasientoController.update);
    app.get('/api/detasientos/:id', md_auth.auth, detasientoController.getAll);
    app.delete('/api/detasientos/delete/:id', md_auth.auth, detasientoController.borrar);
}