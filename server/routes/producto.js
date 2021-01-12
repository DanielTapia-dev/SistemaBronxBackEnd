const productoController = require('../controllers/producto');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/producto', md_auth.auth, productoController.create);
    app.get('/api/producto/:id', md_auth.auth, productoController.getOne);
    app.put('/api/producto/:id', md_auth.auth, productoController.update);
    app.get('/api/productos/:id', md_auth.auth, productoController.getAll);
    app.delete('/api/productos/delete/:id', md_auth.auth, productoController.borrar);
}