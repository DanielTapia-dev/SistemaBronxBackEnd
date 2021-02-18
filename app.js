const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//Configurar CORS
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Cabeceras
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Controll-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    res.header('Allow', 'GET,POST,OPTIONS,PUT,DELETE');
    next();
});

//Rutas\
require('./server/routes/usuarios')(app);
require('./server/routes/clientes')(app);
require('./server/routes/empresa')(app);
require('./server/routes/parsucursal')(app);
require('./server/routes/planestructura')(app);
require('./server/routes/contplancuentas')(app);
require('./server/routes/parformapago')(app);
require('./server/routes/parfamilia')(app);
require('./server/routes/parunidad')(app);
require('./server/routes/parimpuesto')(app);
require('./server/routes/producto')(app);
require('./server/routes/parserie')(app);
require('./server/routes/parcaja')(app);
require('./server/routes/cabproforma')(app);
require('./server/routes/detproforma')(app);
require('./server/routes/cabmovfac')(app);
require('./server/routes/detmovimientos')(app);
require('./server/routes/cabcobro')(app);
require('./server/routes/detcobro')(app);
require('./server/routes/cabasiento')(app);
require('./server/routes/detasiento')(app);
require('./server/routes/usucajaserie')(app);
require('./server/routes/parempresa')(app);

app.get('*', (req, res) => {
    res.status(200).send({ message: "Bienvenido al servidor de Facturacion" });
});



module.exports = app;