const cabmovfacController = require("../controllers/cabmovfac");
const md_auth = require("../authenticated/authenticated");

module.exports = (app) => {
    app.get(
        "/api/cabmovfac/fe/:id",
        md_auth.auth,
        cabmovfacController.facturaElectronica
    );
    app.post("/api/cabmovfac", md_auth.auth, cabmovfacController.create);
    app.get("/api/cabmovfac/:id", md_auth.auth, cabmovfacController.getOne);
    app.get("/api/descargarXML/:id", cabmovfacController.descargarXML);
    app.put("/api/cabmovfac/:id", md_auth.auth, cabmovfacController.update);
    app.get("/api/cabmovfacs/:id", md_auth.auth, cabmovfacController.getAll);
    app.get(
        "/api/comprobarAutorizacion/:id",
        md_auth.auth,
        cabmovfacController.comprobarAutorizacion
    );
    //app.get('/api/cabmovfacs/:fechaInicial/:fechaFinal', md_auth.auth, cabmovfacController.reportesFacturasClientesContado);
    app.get(
        "/api/cabmovfacontado/:idEmpresa/:fechaIni/:fechaFin/:idcaja",
        md_auth.auth,
        cabmovfacController.reportesFacturasClientesContado
    );
    app.delete(
        "/api/cabmovfacs/delete/:id",
        md_auth.auth,
        cabmovfacController.borrar
    );
};