const empresasController=require('../controllers').empresa;

module.exports=(app)=>{
    app.post('/api/empresa',empresasController.create);
    app.get('/api/empresas', empresasController.getAll);
}