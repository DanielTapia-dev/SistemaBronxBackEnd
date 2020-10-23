const clientesController=require('../controllers').clientes;

module.exports=(app)=>{
    app.post('/api/cliente',clientesController.create);
    app.get('/api/clientes', clientesController.getAll);
}