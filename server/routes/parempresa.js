const parempresaController = require('../controllers/parempresa');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/parempresa', md_auth.auth, parempresaController.create);
    app.get('/api/parempresa/:id', md_auth.auth, parempresaController.getOne);
    app.put('/api/parempresa/:id', md_auth.auth, parempresaController.update);
    app.get('/api/parempresas/:id', md_auth.auth, parempresaController.getAll);
    app.delete('/api/parempresa/delete/:id', md_auth.auth, parempresaController.borrar);
}