const cabmovfacController = require('../controllers/cabmovfac');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.get('/api/cabmovfac/fe/:id', md_auth.auth, cabmovfacController.facturaElectronica);
    app.post('/api/cabmovfac', md_auth.auth, cabmovfacController.create);
    app.get('/api/cabmovfac/:id', md_auth.auth, cabmovfacController.getOne);
    app.put('/api/cabmovfac/:id', md_auth.auth, cabmovfacController.update);
    app.get('/api/cabmovfacs/:id', md_auth.auth, cabmovfacController.getAll);
    app.delete('/api/cabmovfacs/delete/:id', md_auth.auth, cabmovfacController.borrar);
}