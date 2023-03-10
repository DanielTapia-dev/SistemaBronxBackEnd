const contplancuentasController = require('../controllers').contplancuentas;
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/contplancuentas', md_auth.auth, contplancuentasController.create);
    app.put('/api/contplancuentas/:id', md_auth.auth, contplancuentasController.update);
    app.get('/api/contplancuentas/:id', md_auth.auth, contplancuentasController.getAll);
    app.get('/api/contplancuentasmov/:id', md_auth.auth, contplancuentasController.getAllMov);
    app.delete('/api/contplancuentas/delete/:id', md_auth.auth, contplancuentasController.borrar);
    app.get('/api/cuenta/:id', md_auth.auth, contplancuentasController.getOne);
}