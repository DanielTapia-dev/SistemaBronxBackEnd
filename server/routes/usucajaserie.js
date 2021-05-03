const usucajaserieController = require('../controllers/usucajaserie');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/usucajaserie', md_auth.auth, usucajaserieController.create);
    app.get('/api/usucajaserie/:id/:idempresa', md_auth.auth, usucajaserieController.getOne);
    app.get('/api/usucajaserieone/:id', md_auth.auth, usucajaserieController.getOneSec); 
    app.put('/api/usucajaserie/:id', md_auth.auth, usucajaserieController.update);
    app.get('/api/usucajaseries/:id', md_auth.auth, usucajaserieController.getAll);
    app.delete('/api/usucajaseries/delete/:id', md_auth.auth, usucajaserieController.borrar);
}