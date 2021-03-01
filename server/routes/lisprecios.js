const lispreciosController = require('../controllers/lisprecios');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/lisprecios', md_auth.auth, lispreciosController.create);
    app.get('/api/lisprecios/:id', md_auth.auth, lispreciosController.getOne);
    app.put('/api/lisprecios/:id', md_auth.auth, lispreciosController.update);
    app.get('/api/lispreciosall/:id', md_auth.auth, lispreciosController.getAll);
    app.delete('/api/lisprecios/delete/:id', md_auth.auth, lispreciosController.borrar);
}