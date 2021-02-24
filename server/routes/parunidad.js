const parunidadController = require('../controllers').parunidad;
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/parunidad', md_auth.auth, parunidadController.create);
    app.get('/api/parunidad/:id', md_auth.auth, parunidadController.getOne);
    app.put('/api/parunidad/:id', md_auth.auth, parunidadController.update);
    app.get('/api/parunidades/:id', md_auth.auth, parunidadController.getAll);
    app.delete('/api/parunidad/delete/:id', md_auth.auth, parunidadController.borrar);
}

    