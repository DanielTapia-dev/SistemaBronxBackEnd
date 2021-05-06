const usuariosController = require('../controllers').usuarios;
const md_auth = require('../controllers/usuarios');

module.exports = (app) => {
    app.post('/api/usuario', md_auth.auth2, usuariosController.create);
    app.put('/api/usuario/:id', md_auth.auth2, usuariosController.update);
    app.post('/api/login', usuariosController.login);
    app.post('/api/secuencial', usuariosController.secuencial);
    app.get('/api/usuarios/:id', md_auth.auth2, usuariosController.getAll);
    app.get('/api/usuario/empresa/:id', md_auth.auth2, usuariosController.getOne);
    app.get('/api/comprobar', md_auth.auth);
    app.delete('/api/usuario/delete/:id', md_auth.auth2, usuariosController.borrar);
    app.get('/api/usuarione/:id', md_auth.auth2, usuariosController.getOneUsuario);
   
}