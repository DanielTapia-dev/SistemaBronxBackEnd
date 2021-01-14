const parserieController = require('../controllers/parserie');
const md_auth = require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/parserie', md_auth.auth, parserieController.create);
    app.get('/api/parserie/:id', md_auth.auth, parserieController.getOne);
    app.put('/api/parserie/:id', md_auth.auth, parserieController.update);
    app.get('/api/parseries/:id', md_auth.auth, parserieController.getAll);
    app.delete('/api/parserie/delete/:id', md_auth.auth, parserieController.borrar);
}