const cabasientoController = require('../controllers/cabasiento');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/cabasiento', md_auth.auth, cabasientoController.create);
    app.get('/api/cabasiento/:id', md_auth.auth, cabasientoController.getOne);
    app.put('/api/cabasiento/:id', md_auth.auth, cabasientoController.update);
    app.get('/api/cabasientos/:id', md_auth.auth, cabasientoController.getAll);
    app.delete('/api/cabasientos/delete/:id', md_auth.auth, cabasientoController.borrar);
}