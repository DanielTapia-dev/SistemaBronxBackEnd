const tabprecioController = require('../controllers/tabprecio');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/tabprecio', md_auth.auth, tabprecioController.create);
    app.get('/api/tabprecio/:id', md_auth.auth, tabprecioController.getOne);
    app.put('/api/tabprecio/:id', md_auth.auth, tabprecioController.update);
    app.get('/api/tabprecios/:id', md_auth.auth, tabprecioController.getAll);
    app.delete('/api/tabprecio/delete/:id', md_auth.auth, tabprecioController.borrar);
}