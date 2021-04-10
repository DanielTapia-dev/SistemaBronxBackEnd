const usuariosController = require('../controllers').usuarios;
const md_auth = require('../controllers/usuarios');

module.exports = (app) => {
    app.post('/api/usuario', md_auth.auth, usuariosController.create);
    app.put('/api/usuario/:id', md_auth.auth, usuariosController.update);
    app.post('/api/login', usuariosController.login);
    app.get('/api/usuarios/:id', md_auth.auth, usuariosController.getAll);
    app.get('/api/comprobar', md_auth.auth);
    app.delete('/api/usuario/delete/:id', md_auth.auth, usuariosController.borrar);
}