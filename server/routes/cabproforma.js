const cabproformaController = require('../controllers/cabproforma');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/cabproforma', md_auth.auth, cabproformaController.create);
    app.get('/api/cabproforma/:id', md_auth.auth, cabproformaController.getOne);
    app.put('/api/cabproforma/:id', md_auth.auth, cabproformaController.update);
    app.get('/api/cabproformas/:id', md_auth.auth, cabproformaController.getAll);
    app.delete('/api/cabproformas/delete/:id', md_auth.auth, cabproformaController.borrar);
    app.get('/api/reporproforma/:idEmpresa/:fechaIni/:fechaFin/:estado', cabproformaController.reportesProformas);
   
}
