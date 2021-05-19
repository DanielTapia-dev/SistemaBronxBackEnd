const { Pool, Client } = require("pg");
const cabmovfac = require("../models").cabmovfac;
const empresa = require("../models").empresa;
const xml2js = require("xml2js");
var SignedXml = require("xml-crypto").SignedXml,
    fs = require("fs");
var forge = require("node-forge");
const clientes = require("../models").clientes;
const detmovimientos = require("../models").detmovimientos;
const parimpuesto = require("../models").parimpuesto;
const fetch = require("node-fetch");
var cron = require("node-cron");
const nodemailer = require("nodemailer");
const transporter = require("../config/mailer.js");
const PdfPrinter = require("pdfmake");
const configuracion = require("../config/configpg").config;
/* const Txt = require('pdfmake-wrapper');
const Img = require('pdfmake-wrapper'); */
const pdfFonts = require("pdfmake/build/vfs_fonts");
const pdfMake = require("pdfmake/build/pdfmake");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

//cron.schedule('0 0 * * *')

//*************************************** PROCESO DE 12PM INCOMPLETO TERMINAR************************************ */
cron.schedule("0 0 * * *", () => {
    const actualizarNumeroDeAutorizacion = pool
        .query(
            `SELECT secmovcab,"EstadoRecepcionSRI", "EstadoAutorizacionSRI", claveacceso
    FROM public.cabmovfac
    WHERE "EstadoRecepcionSRI"='RECIBIDA'
    AND "EstadoAutorizacionSRI" = 'EN PROCESO';`
        )
        .then((res) => {
            var url2 =
                "https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl";
            for (let index = 0; index < res.rows.length; index++) {
                console.log(res.rows[index].claveacceso);
                var ConsultaDeAutorizacionEmpaquetado =
                    `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                                                <Body>
                                                    <autorizacionComprobante xmlns="http://ec.gob.sri.ws.autorizacion">
                                                        <claveAccesoComprobante xmlns="">` +
                    res.rows[index].claveacceso +
                    `</claveAccesoComprobante>
                                                    </autorizacionComprobante>
                                                </Body>
                                            </Envelope>`;
                fetch(url2, {
                        method: "POST",
                        body: ConsultaDeAutorizacionEmpaquetado,
                        // -- or --
                        // body : JSON.stringify({
                        // user : document.getElementById('user').value,
                        // ...
                        // })
                    })
                    .then(
                        (response) => response.text() // .json(), etc.
                        // same as function(response) {return response.text();}
                    )
                    .then((xml) => {
                        var DomParser = require("dom-parser");
                        parser = new DomParser();
                        xmlDoc = parser.parseFromString(xml, "text/xml");
                        var respuestaAutorizacion =
                            xmlDoc.getElementsByTagName("estado")[0].childNodes[0].text;
                        /*  console.log(res.rows[index].secmovcab + "POR QUE NO VALE");
                                             console.log(xmlDoc.getElementsByTagName("estado")[0].childNodes[0].text); */
                        if (
                            xmlDoc.getElementsByTagName("estado")[0].childNodes[0].text ===
                            "AUTORIZADO"
                        ) {
                            var claveAutorizacion =
                                xmlDoc.getElementsByTagName("numeroAutorizacion")[0]
                                .childNodes[0].text;
                            const actualizarNumeroDeAutorizacion = pool
                                .query(
                                    `UPDATE public.cabmovfac
                                                                        SET numautosri='${claveAutorizacion}', "EstadoAutorizacionSRI" = 'AUTORIZADO' WHERE secmovcab=${res.rows[index].secmovcab}`
                                )
                                .then((detallesFinal) => {
                                    console.log(detallesFinal.rows + " Facturada correctamente");
                                });
                        } else {
                            var estado =
                                xmlDoc.getElementsByTagName("estado")[0].childNodes[0].text;
                            const actualizarNumeroDeAutorizacion = pool
                                .query(
                                    `UPDATE public.cabmovfac
                                                                        SET "EstadoAutorizacionSRI" = '${estado}' WHERE secmovcab=${res.rows[index].secmovcab}`
                                )
                                .then((detallesFinal) => {
                                    console.log("Facturada correctamente " + estado);
                                });
                        }
                    });
            }
        });
});
//********FIN DE PROCESO 12PM */
/* const { sequelize } = require('sequelize');
const producto = require("../models").producto; */

function EnviarFacturaElectronica(detalles, empresa, cliente, totales, claveAcceso, fechaHoraAutorizacion) {
    console.log('HOLAAAAAAAAA AMIGOS SOY MICKY MOUSE' + totales.subtotal);
    const consultaFormasPago = pool.query(
            `SELECT F.nomformapago, DC.valorcobro
            FROM detcobro DC, cabcobro CC,parformapago F, cabmovfac FAC 
            WHERE FAC.secmovcab = CC.secmovcab AND
                  CC.seccabcob = DC.seccabcob AND
                  DC.idformapago = F.idformapago AND
                  FAC.claveacceso = '${claveAcceso}';`
        )
        .then((detallesFormaPago) => {
            var bodyFormasPago = [];
            bodyFormasPago.push([
                { text: "Forma de Pago", style: "tableHeader" },
                { text: "Cantidad", style: "tableHeader" },
            ]);
            detallesFormaPago.rows.forEach((element) => {
                var aux = [element.nomformapago, element.valorcobro];
                bodyFormasPago.push(aux);
            });
            var puntoEmision = totales.numfactura[0] + totales.numfactura[1] + totales.numfactura[2];
            var puntoFacturacion = totales.numfactura[3] + totales.numfactura[4] + totales.numfactura[5];
            var secuencial = totales.numfactura[6] + totales.numfactura[7] + totales.numfactura[8] + totales.numfactura[9] + totales.numfactura[10] + totales.numfactura[11] + totales.numfactura[12] + totales.numfactura[13] + totales.numfactura[14];
            var body = [];
            body.push([
                { text: "Código", style: "tableHeader" },
                { text: "Descripción", style: "tableHeader" },
                { text: "Cantidad", style: "tableHeader" },
                { text: "Precio Unitario", style: "tableHeader" },
                { text: "Descuento", style: "tableHeader" },
                { text: "Precio Total", style: "tableHeader" },
            ]);
            detalles.forEach((element) => {
                //CONSULTAR AQUI EL PRECIO DE CADA PRODUCTO
                console.log(element.idproducto);
                if (element.iva12 != 0) {
                    var ivaFinal = element.iva12;
                } else {
                    var ivaFinal = "0.00";
                }
                var aux = [element.idproducto.toString(), element.nomproducto.toString(), element.cantidad.toString(), element.precio.toString(), "0", element.subtotal.toString()];
                body.push(aux);
            });
            if (empresa.contabilidad === false) {
                var contabilidad = 'NO';
            } else {
                var contabilidad = 'SI';
            }
            var bodySumatoria = [
                [{ text: "Subtotal:" }, { text: `${totales.subtotal.toString()}` }],
                [{ text: "Descuento:" }, { text: `0.00` }],
                [{ text: "Subtotal 0%:" }, { text: `${totales.subtotaliva0.toString()}` }],
                [{ text: "Subtotal: 12%:" }, { text: `${totales.subtotaliva12.toString()}` }],
                [{ text: "IVA 12:" }, { text: `${totales.iva12.toString()}` }],
                [{ text: "Valor a Pagar:" }, { text: `${totales.total.toString()}` }],
            ];
            var documentDefinition = {
                pageMargins: [10, 10, 10, 10],
                content: [{
                        canvas: [{
                            type: "rect",
                            x: 0,
                            y: 0,
                            w: 290,
                            h: 310,
                            r: 5,
                            lineColor: "black",
                        }, ],
                        absolutePosition: { x: 280, y: 20 },
                    },
                    {
                        image: "logo",
                        width: 250,
                        absolutePosition: { x: 20, y: 40 },
                    },
                    {
                        canvas: [{
                            type: "rect",
                            x: 0,
                            y: 0,
                            w: 250,
                            h: 150,
                            r: 5,
                            lineColor: "black",
                        }, ],
                        absolutePosition: { x: 20, y: 180 },
                    },
                    {
                        text: [
                            { text: "R.U.C.:    ", fontSize: 14, bold: true },
                            { text: empresa.rucciempresa.toString(), fontSize: 14, bold: false },
                            { text: "\n\nFACTURA", fontSize: 15, bold: true },
                            { text: "\n\nNo. ", fontSize: 14, bold: true },
                            { text: `${puntoEmision}-${puntoFacturacion}-${secuencial}`, fontSize: 14, bold: false },
                            { text: "\n\nNÚMERO DE AUTORIZACIÓN: ", fontSize: 12, bold: true },
                            {
                                text: `\n${claveAcceso}`,
                                fontSize: 9.8,
                                bold: false,
                            },
                            {
                                text: "\n\nFECHA Y HORA DE \nAUTORIZACIÓN           ",
                                fontSize: 11,
                                bold: true,
                            },
                            { text: `${fechaHoraAutorizacion}`, fontSize: 11, bold: false },
                            { text: "\n\nAMBIENTE:  ", fontSize: 11, bold: true },
                            { text: `${empresa.ambiente}`, fontSize: 11, bold: false },
                            { text: "\n\nEMISIÓN:  ", fontSize: 11, bold: true },
                            { text: "NORMAL", fontSize: 11, bold: false },
                            { text: "\n\nCLAVE DE ACCESO ", fontSize: 11, bold: true },
                        ],
                        layout: "headerLineOnly",
                        absolutePosition: { x: 290, y: 25 },
                    },
                    {
                        text: [
                            { text: "Laboratorios RedLab", fontSize: 10, bold: true },
                            { text: "\n", fontSize: 1, bold: true },
                            { text: "\nDirección \nMatriz: ", fontSize: 9, bold: true },
                            {
                                text: `${empresa.dirempresa}`,
                                fontSize: 9,
                                bold: false,
                            },
                            { text: "\n", fontSize: 1, bold: true },
                            { text: "\nDirección \nSucursal: ", fontSize: 9, bold: true },
                            {
                                text: "SANCHEZ DE ORELLANA Y EMILIO SANDOVAL",
                                fontSize: 9,
                                bold: false,
                            },
                            { text: "\n", fontSize: 1, bold: true },
                            {
                                text: "\nCONTRIBUYENTE ESPECIAL RESOLUCION: ",
                                fontSize: 9,
                                bold: true,
                            },
                            { text: "0000", fontSize: 9, bold: false },
                            { text: "\n", fontSize: 1, bold: true },
                            {
                                text: "\nOBLIGADO A LLEVAR CONTABILIDAD: ",
                                fontSize: 9,
                                bold: true,
                            },
                            { text: contabilidad, fontSize: 9, bold: false },
                        ],
                        layout: "headerLineOnly",
                        absolutePosition: { x: 25, y: 185 },
                    },
                    {
                        image: "barcode",
                        width: 270,
                        absolutePosition: { x: 290, y: 280 },
                    },
                    {
                        canvas: [{
                            type: "rect",
                            x: 0,
                            y: 0,
                            w: 550,
                            h: 30,
                            r: 5,
                            lineColor: "black",
                        }, ],
                        absolutePosition: { x: 20, y: 340 },
                    },
                    {
                        text: [{
                                text: "Razón Social/Nombres y Apellidos:  ",
                                fontSize: 9,
                                bold: true,
                            },
                            {
                                text: `${cliente.nomcliente}     `,
                                fontSize: 9,
                                bold: false,
                            },
                            { text: "RUC/CI: ", fontSize: 9, bold: true },
                            { text: `${cliente.ruccicliente}`, fontSize: 9, bold: false },
                            { text: "\nFecha Emisión:  ", fontSize: 9, bold: true },
                            { text: `${totales.createdAt}`, fontSize: 9, bold: false },
                        ],
                        absolutePosition: { x: 25, y: 345 },
                    },
                    {
                        style: "tableDescripcionProductos",
                        table: {
                            widths: [80, 200, 51, 61, 51, 54],
                            headerRows: 1,
                            body: body
                        },
                    },
                    {
                        style: "tableTotales",
                        table: {
                            widths: [80, 80],
                            body: bodySumatoria
                        },
                    },
                    {
                        style: "tableFormasDePago",
                        table: {
                            widths: [80, 100],
                            headerRows: 1,
                            body: bodyFormasPago
                        },
                    },
                    {
                        style: "lineaFirma",
                        canvas: [{ type: "line", x1: 0, y1: 0, x2: 180, y2: 0, lineWidth: 1 }],
                    },

                    {
                        style: "lineaFirmaTexto",
                        text: [{ text: "Firma Jefe de Agencia", fontSize: 9, bold: true }],
                        layout: "headerLineOnly",
                    },
                ],
                images: {
                    barcode: "data:image/jpeg;base64,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dZCN/wB1Rkn8PWugsLjU/G3jvRtY/wCEe1LRtM0aOZvN1OIQzTySLt2BMkhQOc98VpvYXeofF9Ly4tJhYaXpeLaZkPltPK/z7TjBIVQD6ZqmruKf9bv8f1Fe12v6e34HNeM9Bg8HfDzQdIjurqPw5aXaLqzwzbJZYmyW75ILnlV5x0HFV/h1J4ebx9NF8P7if/hHUsS1/DJJJ5fnFhsKLKd+7G7Jxiun+IOn6kdS8O67Z6WdXttJuJJLnT0AMjhl2rIgPDMhyQOvPFZ2myX3i74i6X4gg8Nalolpp1vMlxcalAIJrreMLHtySVB+bJ/TuRd5Nvz/AC/q3n9wpJKKX9b/AJlf4g2/iKTWtDu7y/gh0hNes4raxtgS0uXB8yVj3GDhRxznORXaeJvBXh7xitsNe0/7WLXcYf30ke3djP3GGeg61m/EOyur218Pi0tppzFrtnLIIoy2xFc5Y46Adz0rY8WXF7aeEdXn06Cae+W0k8iOFCzs5UhcAck5qL2pvyb/ACRaV5rzX6s84+Hvgnw5P43vfE2h6ebPS9NkezscTSP9olAKyyksx+XkqAOOp617BWJ4P0hdB8HaRpgQo0FqgkBHO8jLZ99xNbdaSVvd7EJ397uFFFFSMKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z",
                    logo: `${empresa.logobase64}`,
                },
                styles: {
                    inicios: {
                        fontSize: 12,
                        bold: true,
                    },
                    header: {
                        fontSize: 16,
                        bold: true,
                    },
                    bigger: {
                        fontSize: 15,
                        italics: true,
                    },
                    tableDescripcionProductos: {
                        fontSize: 9,
                        margin: [9, 364, 9, 4],
                    },
                    tableTotales: {
                        fontSize: 9,
                        margin: [381, 0, 10, 4],
                    },
                    tableFormasDePago: {
                        fontSize: 9,
                        margin: [9, 0, 0, 0],
                    },
                    tableBody: {
                        fontSize: 9,
                        alignment: "right",
                    },
                    tableHeader: {
                        fontSize: 9,
                        alignment: "center",
                    },
                    lineaFirma: {
                        margin: [381, 0, 10, 4],
                    },
                    lineaFirmaTexto: {
                        margin: [430, 0, 10, 4],
                    },
                },
            };
            const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
            pdfDocGenerator.getBase64((data) => {
                enviarEmail(data);
                //console.log(data);
            });
        });
}

async function enviarEmail(data) {
    await transporter.transporter.sendMail({
        from: '"RedLab" <alejodanny94@gmail.com>', // sender address
        to: "gorlekk@gmail.com", // list of receivers
        subject: "Factura Electrónica", // plain text body
        html: `
        <b>Esta es la factura electronica</b>
        `, // html body
        attachments: [{
            filename: "prueba.pdf",
            content: data,
            encoding: "base64",
        }, ],
    });
}

const pool = new Pool(configuracion);
//const client = new Client(config);

/* 
    //console.log('Prueba de funcionamiento');
    //console.log(res.rows);
} */

function facturaElectronica(req, res) {
    var id = req.params.id;

    cabmovfac
        .findOne({
            where: {
                secmovcab: id,
            },
        })
        .then((movfactura) => {
            empresa
                .findOne({
                    where: {
                        idempresa: movfactura.idempresa,
                    },
                })
                .then((emp) => {
                    clientes
                        .findOne({
                            where: {
                                idcliente: movfactura.idcliente,
                            },
                        })
                        .then((cliente) => {
                            const consulta = pool
                                .query(
                                    `SELECT D.idempresa, D.idsucursal, I.idimpuesto, I.porcimpuesto, I."codigoSRI", I."codporcentajeSRI", D.secmovcab, D.idproducto, P.nomproducto, D.cantidad, D.precio, D.subsindesc, D.porcdescuento, D.descuento, D.subtotal, D.iva0, D.iva12, D.total
                            FROM detmovimientos D, producto P, parimpuesto I
                            WHERE D.secmovcab=` +
                                    movfactura.secmovcab +
                                    `AND D.idproducto = P.idproducto
                            AND P.idimpuesto = I.idimpuesto;`
                                )
                                .then((detallesFinal) => {
                                    //console.log(detallesFinal.rows);
                                    parimpuesto
                                        .findAll({
                                            where: {
                                                idempresa: movfactura.idempresa,
                                            },
                                        })
                                        .then((parimpuesto) => {
                                            //console.log(productos);
                                            var totalSinImpuestos;
                                            var detalle = [];
                                            var obj = {};
                                            var i = 0;
                                            detallesFinal.rows.forEach((element) => {
                                                //CONSULTAR AQUI EL PRECIO DE CADA PRODUCTO
                                                if (element.iva12 != 0) {
                                                    var ivaFinal = element.iva12;
                                                } else {
                                                    var ivaFinal = "0.00";
                                                }
                                                //console.log(i + element.idproducto);
                                                i++;
                                                obj = {
                                                    codigoPrincipal: element.idproducto,
                                                    descripcion: element.nomproducto.toUpperCase(),
                                                    cantidad: element.cantidad,
                                                    precioUnitario: element.precio,
                                                    descuento: "0",
                                                    precioTotalSinImpuesto: element.subtotal,
                                                    impuestos: {
                                                        impuesto: [{
                                                            codigo: element.codigoSRI,
                                                            codigoPorcentaje: element.codporcentajeSRI,
                                                            tarifa: element.porcimpuesto,
                                                            baseImponible: element.subtotal,
                                                            valor: ivaFinal,
                                                        }, ],
                                                    },
                                                };
                                                detalle.push(obj);
                                            });
                                            for (let index = 0; index < detalle.length; index++) {
                                                //console.log(detalle[index]);
                                            }

                                            /* for (let d in detalle) {
                                                                                        console.log(d.codigoPrincipal);
                                                                                    } */
                                            parimpuesto.forEach((element) => {
                                                //console.log(element.nomimpuesto);
                                            });
                                            //console.log("Este es..................... " + parimpuesto[0].codporcentajeSRI);
                                            //Proceso para encontrar los productos y realizar proceso de sumas
                                            if (movfactura != null) {
                                                //CONSULTA DE CLIENTE

                                                //FIN DE CONSULTA DE DATOS DEL CLIENTE
                                                //PROCESO PARA FACTURACION ELECTRONICA
                                                var fechaNumeroAutorizacion =
                                                    moment().format("DDMMYYYY");
                                                var fechaCabeceraFactura =
                                                    moment().format("DD/MM/YYYY");
                                                var puntoEmision =
                                                    movfactura.numfactura[0] +
                                                    movfactura.numfactura[1] +
                                                    movfactura.numfactura[2];
                                                var puntoFacturacion =
                                                    movfactura.numfactura[3] +
                                                    movfactura.numfactura[4] +
                                                    movfactura.numfactura[5];
                                                var secuencial =
                                                    movfactura.numfactura[6] +
                                                    movfactura.numfactura[7] +
                                                    movfactura.numfactura[8] +
                                                    movfactura.numfactura[9] +
                                                    movfactura.numfactura[10] +
                                                    movfactura.numfactura[11] +
                                                    movfactura.numfactura[12] +
                                                    movfactura.numfactura[13] +
                                                    movfactura.numfactura[14];
                                                var ambiente = emp.ambiente;
                                                //console.log(detmovimientos);

                                                //Inicio de algoritmo para crear la clave de acceso
                                                var claveAcceso =
                                                    fechaNumeroAutorizacion +
                                                    "01" +
                                                    "1706610738001" +
                                                    "1" +
                                                    puntoEmision +
                                                    puntoFacturacion +
                                                    secuencial +
                                                    "12345678" +
                                                    "1";
                                                var multiplicador =
                                                    "765432765432765432765432765432765432765432765432";
                                                var resultadoClavePorMultiplicador = 0;
                                                for (let i = 0; i < claveAcceso.length; i++) {
                                                    resultadoClavePorMultiplicador =
                                                        resultadoClavePorMultiplicador +
                                                        claveAcceso[i] * multiplicador[i];
                                                }
                                                var residuoClave = resultadoClavePorMultiplicador % 11;
                                                var DigitoVerificador = 11 - residuoClave;
                                                if (DigitoVerificador == 11) {
                                                    DigitoVerificador = 0;
                                                } else if (DigitoVerificador == 10) {
                                                    DigitoVerificador = 1;
                                                }

                                                claveAcceso += DigitoVerificador;

                                                //Fin de algoritmo para crear la clave de acceso

                                                var impuesto0;
                                                var impuesto12;

                                                parimpuesto.forEach((element) => {
                                                    if (element.idimpuesto == "IM1") {
                                                        impuesto0 = element.dataValues;
                                                    } else if (element.idimpuesto == "IM2") {
                                                        impuesto12 = element.dataValues;
                                                    }
                                                });

                                                if (cliente.idencliente === "CS") {
                                                    var tipoIdentificacionComprador = "07";
                                                } else if (cliente.idencliente === "Cedula") {
                                                    var tipoIdentificacionComprador = "05";
                                                } else if (cliente.idencliente === "RUC") {
                                                    var tipoIdentificacionComprador = "04";
                                                } else if (cliente.idencliente === "PASAPORTE") {
                                                    var tipoIdentificacionComprador = "06";
                                                } else if (
                                                    cliente.idencliente === "IDENTIFICACION DELEXTERIOR"
                                                ) {
                                                    var tipoIdentificacionComprador = "08";
                                                }

                                                //console.log('ESTE ES EL RESULTADO DE LA CLAVE DE ACCESO ' + claveAcceso);

                                                if (emp.contabilidad == true) {
                                                    var contabilidad = "SI";
                                                } else {
                                                    var contabilidad = "NO";
                                                }
                                                if (emp.ambiente == "pruebas") {
                                                    ambiente = 1;
                                                } else {
                                                    ambiente = 2;
                                                }
                                                //ARMADO DE XML
                                                const xmlObject = {
                                                    factura: {
                                                        $: {
                                                            id: "comprobante",
                                                            version: "1.0.0",
                                                        },
                                                        infoTributaria: {
                                                            ambiente: ambiente,
                                                            tipoEmision: "1",
                                                            razonSocial: emp.razonsocial.toUpperCase(),
                                                            nombreComercial: emp.razonsocial.toUpperCase(),
                                                            ruc: emp.rucciempresa,
                                                            claveAcceso: claveAcceso,
                                                            codDoc: "01",
                                                            estab: puntoEmision,
                                                            ptoEmi: puntoFacturacion,
                                                            secuencial: secuencial,
                                                            dirMatriz: emp.dirempresa.toUpperCase(),
                                                            regimenMicroempresas: "CONTRIBUYENTE RÉGIMEN MICROEMPRESAS",
                                                        },
                                                        infoFactura: {
                                                            fechaEmision: fechaCabeceraFactura,
                                                            dirEstablecimiento: emp.dirempresa.toUpperCase(),
                                                            obligadoContabilidad: contabilidad.toUpperCase(),
                                                            tipoIdentificacionComprador: tipoIdentificacionComprador,
                                                            razonSocialComprador: cliente.nomcliente.toUpperCase(),
                                                            identificacionComprador: cliente.ruccicliente,
                                                            direccionComprador: cliente.dircliente.toUpperCase(),
                                                            totalSinImpuestos: movfactura.subtotal,
                                                            totalDescuento: "0.00",
                                                            totalConImpuestos: {
                                                                totalImpuesto: [{
                                                                        codigo: impuesto0.codigoSRI,
                                                                        codigoPorcentaje: impuesto0.codporcentajeSRI,
                                                                        baseImponible: movfactura.subtotaliva0,
                                                                        tarifa: impuesto0.porcimpuesto,
                                                                        valor: movfactura.iva0,
                                                                    },
                                                                    {
                                                                        codigo: impuesto12.codigoSRI,
                                                                        codigoPorcentaje: impuesto12.codporcentajeSRI,
                                                                        baseImponible: movfactura.subtotaliva12,
                                                                        tarifa: impuesto12.porcimpuesto,
                                                                        valor: movfactura.iva12,
                                                                    },
                                                                ],
                                                            },
                                                            propina: "0.00",
                                                            importeTotal: movfactura.total,
                                                            moneda: emp.monempresa.toUpperCase(),
                                                        },
                                                        detalles: {
                                                            detalle,
                                                        },
                                                    },
                                                };
                                                const builder = new xml2js.Builder({
                                                    xmldec: { version: "1.0", encoding: "UTF-8" },
                                                });
                                                const xml = builder.buildObject(xmlObject);
                                                //console.log(xml);

                                                fs.appendFile(
                                                    "facturas/factura" + id + ".xml",
                                                    "",
                                                    (err) => {
                                                        if (err) throw err;
                                                        //console.log('Archivo creado correctamente');
                                                    }
                                                );

                                                fs.writeFileSync("facturas/factura" + id + ".xml", xml);
                                                //console.log('Se ha escrito en el archivo');

                                                fs.readFile("FirmaCorrecta.pfx", (err, data) => {
                                                    if (err) throw err;
                                                    var archivop12 = data;
                                                    var xmlbase64 = firmarComprobante(
                                                        archivop12,
                                                        "Solsito2204",
                                                        xml,
                                                        id
                                                    );

                                                    // Inicio de consumo de servicio post con EndPoint del SRI
                                                    var EmpaquetadoXML =
                                                        `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                                                <Body>
                                                    <validarComprobante xmlns="http://ec.gob.sri.ws.recepcion">
                                                        <xml xmlns="">
                                                            ` +
                                                        xmlbase64 +
                                                        `
                                                        </xml>
                                                    </validarComprobante>
                                                </Body>
                                                </Envelope>`;
                                                    var ConsultaDeAutorizacionEmpaquetado =
                                                        `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                                                <Body>
                                                    <autorizacionComprobante xmlns="http://ec.gob.sri.ws.autorizacion">
                                                        <claveAccesoComprobante xmlns="">` +
                                                        claveAcceso +
                                                        `</claveAccesoComprobante>
                                                    </autorizacionComprobante>
                                                </Body>
                                            </Envelope>`;
                                                    const url1 = emp.wsdl1;
                                                    const url2 = emp.wsdl2;
                                                    fetch(url1, {
                                                            method: "POST",
                                                            body: EmpaquetadoXML,
                                                            // -- or --
                                                            // body : JSON.stringify({
                                                            // user : document.getElementById('user').value,
                                                            // ...
                                                            // })
                                                        })
                                                        .then(
                                                            (response) => response.text() // .json(), etc.
                                                            // same as function(response) {return response.text();}
                                                        )
                                                        .then((xml) => {
                                                            var DomParser = require("dom-parser");
                                                            parser = new DomParser();
                                                            xmlDoc = parser.parseFromString(xml, "text/xml");
                                                            var respuestaRecepcion =
                                                                xmlDoc.getElementsByTagName("estado")[0]
                                                                .childNodes[0].text;
                                                            console.log(
                                                                xmlDoc.getElementsByTagName("estado")[0]
                                                                .childNodes[0].text
                                                            );
                                                            if (
                                                                xmlDoc.getElementsByTagName("estado")[0]
                                                                .childNodes[0].text === "RECIBIDA"
                                                            ) {
                                                                fetch(url2, {
                                                                        method: "POST",
                                                                        body: ConsultaDeAutorizacionEmpaquetado,
                                                                        // -- or --
                                                                        // body : JSON.stringify({
                                                                        // user : document.getElementById('user').value,
                                                                        // ...
                                                                        // })
                                                                    })
                                                                    .then(
                                                                        (response) => response.text() // .json(), etc.
                                                                        // same as function(response) {return response.text();}
                                                                    )
                                                                    .then((xml) => {
                                                                        var DomParser = require("dom-parser");
                                                                        parser = new DomParser();
                                                                        xmlDoc = parser.parseFromString(
                                                                            xml,
                                                                            "text/xml"
                                                                        );
                                                                        var respuestaAutorizacion =
                                                                            xmlDoc.getElementsByTagName("estado")[0]
                                                                            .childNodes[0].text;
                                                                        console.log(
                                                                            xmlDoc.getElementsByTagName("estado")[0]
                                                                            .childNodes[0].text
                                                                        );
                                                                        if (
                                                                            xmlDoc.getElementsByTagName("estado")[0]
                                                                            .childNodes[0].text === "AUTORIZADO"
                                                                        ) {
                                                                            var claveAutorizacion =
                                                                                xmlDoc.getElementsByTagName(
                                                                                    "numeroAutorizacion"
                                                                                )[0].childNodes[0].text;
                                                                            var fechaHoraAutorizacion =
                                                                                xmlDoc.getElementsByTagName(
                                                                                    "fechaAutorizacion"
                                                                                )[0].childNodes[0].text;
                                                                            // send mail with defined transport object
                                                                            EnviarFacturaElectronica(
                                                                                detallesFinal.rows,
                                                                                emp,
                                                                                cliente,
                                                                                movfactura,
                                                                                claveAcceso,
                                                                                fechaHoraAutorizacion
                                                                            );
                                                                        } else {
                                                                            var claveAutorizacion = claveAcceso;
                                                                        }
                                                                        console.log(movfactura.secmovcab);
                                                                        console.log(claveAcceso);
                                                                        const actualizarNumeroDeAutorizacion = pool
                                                                            .query(
                                                                                `UPDATE public.cabmovfac
                                                                        SET claveacceso = ` +
                                                                                claveAcceso +
                                                                                ` ,numautosri='` +
                                                                                claveAutorizacion +
                                                                                `', "EstadoRecepcionSRI" = '` +
                                                                                respuestaRecepcion +
                                                                                `', "EstadoAutorizacionSRI" = '` +
                                                                                respuestaAutorizacion +
                                                                                `' 
                                                                         WHERE secmovcab=` +
                                                                                movfactura.secmovcab +
                                                                                `;`
                                                                            )
                                                                            .then((detallesFinal) => {
                                                                                console.log(
                                                                                    detallesFinal +
                                                                                    " Facturada correctamente"
                                                                                );
                                                                            });
                                                                    });
                                                            }
                                                        });

                                                    //Fin del consumo de servicio post al SRI
                                                });
                                                //FIN DEL PROCESO FACTURACION ELECTRONICA
                                            } else {
                                                res.status(200).send({
                                                    message: "No se encontro los detalles de las enviada",
                                                });
                                                //0103326336S
                                            }
                                            res
                                                .status(200)
                                                .send("Envío de factura electronica correctamente");
                                        })
                                        .catch((err) => {
                                            res.status(500).send({
                                                message: "Ocurrio un error al buscar los impuestos",
                                            });
                                        });
                                })
                                .catch((err) => {
                                    console.log("Error al buscar los detalles: " + err);
                                });
                        })
                        .catch((err) => {
                            res.status(500).send({
                                message: "Ocurrió un error al buscar el cliente." + err,
                            });
                        });
                })
                .catch((err) => {
                    res
                        .status(500)
                        .send({ message: "Ocurrió un error al buscar la empresa." + err });
                });
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrió un error al buscar la factura." + err });
        });
}

function comprobarAutorizacion(req, res) {
    console.log('llega papa');
    var url2 = "https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl";
    var id = req.params.id;
    var ConsultaDeAutorizacionEmpaquetado =
        `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                                                <Body>
                                                    <autorizacionComprobante xmlns="http://ec.gob.sri.ws.autorizacion">
                                                        <claveAccesoComprobante xmlns="">` +
        id.toString() +
        `</claveAccesoComprobante>
                                                    </autorizacionComprobante>
                                                </Body>
                                            </Envelope>`;
    const consultaFactura = pool.query(
            `SELECT FAC.secmovcab, EMP.rucciempresa, EMP.contabilidad,FAC.numfactura,EMP.ambiente,EMP.dirempresa,EMP.contabilidad,CLI.nomcliente,CLI.ruccicliente,FAC."createdAt",FAC.subtotal,FAC.subtotaliva0,FAC.subtotaliva12,FAC.iva12,FAC.total,EMP.logobase64
        FROM empresa EMP, cabmovfac FAC, clientes CLI
        WHERE FAC.numautosri = '${id}' AND FAC.idcliente = CLI.idcliente AND FAC.idempresa = EMP.idempresa;`
        )
        .then(datosfactura => {
            //console.log(datosfactura.rows['secmovcab']);
            const consultaDetalle = pool.query(
                    `SELECT D.secmovcab, D.idproducto, D.cantidad, D.precio, P.nomproducto, D.subtotal
             FROM detmovimientos D, producto P
             WHERE D.idproducto = P.idproducto AND D.secmovcab = '${datosfactura.rows[0].secmovcab}';`
                )
                .then(datosdetalle => {
                    fetch(url2, {
                            method: "POST",
                            body: ConsultaDeAutorizacionEmpaquetado,
                            // -- or --
                            // body : JSON.stringify({
                            // user : document.getElementById('user').value,
                            // ...
                            // })
                        })
                        .then(
                            (response) => response.text() // .json(), etc.
                            // same as function(response) {return response.text();}
                        )
                        .then((xml) => {
                            var DomParser = require("dom-parser");
                            parser = new DomParser();
                            xmlDoc = parser.parseFromString(
                                xml,
                                "text/xml"
                            );
                            var respuestaAutorizacion =
                                xmlDoc.getElementsByTagName("estado")[0]
                                .childNodes[0].text;
                            if (
                                xmlDoc.getElementsByTagName("estado")[0]
                                .childNodes[0].text === "AUTORIZADO"
                            ) {
                                var claveAutorizacion =
                                    xmlDoc.getElementsByTagName(
                                        "numeroAutorizacion"
                                    )[0].childNodes[0].text;
                                var fechaHoraAutorizacion =
                                    xmlDoc.getElementsByTagName(
                                        "fechaAutorizacion"
                                    )[0].childNodes[0].text;
                                // send mail with defined transport object
                                const consultaFormasPago = pool.query(
                                        `SELECT F.nomformapago, DC.valorcobro
                    FROM detcobro DC, cabcobro CC,parformapago F, cabmovfac FAC 
                    WHERE FAC.secmovcab = CC.secmovcab AND
                          CC.seccabcob = DC.seccabcob AND
                          DC.idformapago = F.idformapago AND
                          FAC.claveacceso = '${id}';`
                                    )
                                    .then(detallesFormaPago => {
                                        var bodyFormasPago = [];
                                        bodyFormasPago.push([
                                            { text: "Forma de Pago", style: "tableHeader" },
                                            { text: "Cantidad", style: "tableHeader" },
                                        ]);
                                        detallesFormaPago.rows.forEach((element) => {
                                            var aux = [element.nomformapago.toString(), element.valorcobro.toString()];
                                            bodyFormasPago.push(aux);
                                        });
                                        var puntoEmision = datosfactura.rows[0].numfactura[0] + datosfactura.rows[0].numfactura[1] + datosfactura.rows[0].numfactura[2];
                                        var puntoFacturacion = datosfactura.rows[0].numfactura[3] + datosfactura.rows[0].numfactura[4] + datosfactura.rows[0].numfactura[5];
                                        var secuencial = datosfactura.rows[0].numfactura[6] + datosfactura.rows[0].numfactura[7] + datosfactura.rows[0].numfactura[8] + datosfactura.rows[0].numfactura[9] + datosfactura.rows[0].numfactura[10] + datosfactura.rows[0].numfactura[11] + datosfactura.rows[0].numfactura[12] + datosfactura.rows[0].numfactura[13] + datosfactura.rows[0].numfactura[14];
                                        var body = [];
                                        body.push([
                                            { text: "Código", style: "tableHeader" },
                                            { text: "Descripción", style: "tableHeader" },
                                            { text: "Cantidad", style: "tableHeader" },
                                            { text: "Precio Unitario", style: "tableHeader" },
                                            { text: "Descuento", style: "tableHeader" },
                                            { text: "Precio Total", style: "tableHeader" },
                                        ]);
                                        datosdetalle.rows.forEach((element) => {
                                            //CONSULTAR AQUI EL PRECIO DE CADA PRODUCTO
                                            console.log(element.idproducto);
                                            if (element.iva12 != 0) {
                                                var ivaFinal = element.iva12;
                                            } else {
                                                var ivaFinal = "0.00";
                                            }
                                            var aux = [element.idproducto.toString(), element.nomproducto.toString(), element.cantidad.toString(), element.precio.toString(), "0", element.subtotal.toString()];
                                            body.push(aux);
                                            console.log(aux);
                                        });
                                        if (datosfactura.rows[0].contabilidad == false) {
                                            var contabilidad = 'NO';
                                        } else {
                                            var contabilidad = 'SI';
                                        }
                                        var bodySumatoria = [
                                            [{ text: "Subtotal:" }, { text: `${datosfactura.rows[0].subtotal.toString()}` }],
                                            [{ text: "Descuento:" }, { text: `0.00` }],
                                            [{ text: "Subtotal 0%:" }, { text: `${datosfactura.rows[0].subtotaliva0.toString()}` }],
                                            [{ text: "Subtotal: 12%:" }, { text: `${datosfactura.rows[0].subtotaliva12.toString()}` }],
                                            [{ text: "IVA 12:" }, { text: `${datosfactura.rows[0].iva12.toString()}` }],
                                            [{ text: "Valor a Pagar:" }, { text: `${datosfactura.rows[0].total.toString()}` }],
                                        ];
                                        var documentDefinition = {
                                            pageMargins: [10, 10, 10, 10],
                                            content: [{
                                                    canvas: [{
                                                        type: "rect",
                                                        x: 0,
                                                        y: 0,
                                                        w: 290,
                                                        h: 310,
                                                        r: 5,
                                                        lineColor: "black",
                                                    }, ],
                                                    absolutePosition: { x: 280, y: 20 },
                                                },
                                                {
                                                    image: "logo",
                                                    width: 250,
                                                    absolutePosition: { x: 20, y: 40 },
                                                },
                                                {
                                                    canvas: [{
                                                        type: "rect",
                                                        x: 0,
                                                        y: 0,
                                                        w: 250,
                                                        h: 150,
                                                        r: 5,
                                                        lineColor: "black",
                                                    }, ],
                                                    absolutePosition: { x: 20, y: 180 },
                                                },
                                                {
                                                    text: [
                                                        { text: "R.U.C.:    ", fontSize: 14, bold: true },
                                                        { text: datosfactura.rows[0].rucciempresa.toString(), fontSize: 14, bold: false },
                                                        { text: "\n\nFACTURA", fontSize: 15, bold: true },
                                                        { text: "\n\nNo. ", fontSize: 14, bold: true },
                                                        { text: `${puntoEmision}-${puntoFacturacion}-${secuencial}`, fontSize: 14, bold: false },
                                                        { text: "\n\nNÚMERO DE AUTORIZACIÓN: ", fontSize: 12, bold: true },
                                                        {
                                                            text: `\n${claveAutorizacion}`,
                                                            fontSize: 9.8,
                                                            bold: false,
                                                        },
                                                        {
                                                            text: "\n\nFECHA Y HORA DE \nAUTORIZACIÓN           ",
                                                            fontSize: 11,
                                                            bold: true,
                                                        },
                                                        { text: `${fechaHoraAutorizacion}`, fontSize: 11, bold: false },
                                                        { text: "\n\nAMBIENTE:  ", fontSize: 11, bold: true },
                                                        { text: `${datosfactura.rows[0].ambiente}`, fontSize: 11, bold: false },
                                                        { text: "\n\nEMISIÓN:  ", fontSize: 11, bold: true },
                                                        { text: "NORMAL", fontSize: 11, bold: false },
                                                        { text: "\n\nCLAVE DE ACCESO ", fontSize: 11, bold: true },
                                                    ],
                                                    layout: "headerLineOnly",
                                                    absolutePosition: { x: 290, y: 25 },
                                                },
                                                {
                                                    text: [
                                                        { text: "Laboratorios RedLab", fontSize: 10, bold: true },
                                                        { text: "\n", fontSize: 1, bold: true },
                                                        { text: "\nDirección \nMatriz: ", fontSize: 9, bold: true },
                                                        {
                                                            text: `${datosfactura.rows[0].dirempresa}`,
                                                            fontSize: 9,
                                                            bold: false,
                                                        },
                                                        { text: "\n", fontSize: 1, bold: true },
                                                        { text: "\nDirección \nSucursal: ", fontSize: 9, bold: true },
                                                        {
                                                            text: "SANCHEZ DE ORELLANA Y EMILIO SANDOVAL",
                                                            fontSize: 9,
                                                            bold: false,
                                                        },
                                                        { text: "\n", fontSize: 1, bold: true },
                                                        {
                                                            text: "\nCONTRIBUYENTE ESPECIAL RESOLUCION: ",
                                                            fontSize: 9,
                                                            bold: true,
                                                        },
                                                        { text: "0000", fontSize: 9, bold: false },
                                                        { text: "\n", fontSize: 1, bold: true },
                                                        {
                                                            text: "\nOBLIGADO A LLEVAR CONTABILIDAD: ",
                                                            fontSize: 9,
                                                            bold: true,
                                                        },
                                                        { text: contabilidad, fontSize: 9, bold: false },
                                                    ],
                                                    layout: "headerLineOnly",
                                                    absolutePosition: { x: 25, y: 185 },
                                                },
                                                {
                                                    image: "barcode",
                                                    width: 270,
                                                    absolutePosition: { x: 290, y: 280 },
                                                },
                                                {
                                                    canvas: [{
                                                        type: "rect",
                                                        x: 0,
                                                        y: 0,
                                                        w: 550,
                                                        h: 30,
                                                        r: 5,
                                                        lineColor: "black",
                                                    }, ],
                                                    absolutePosition: { x: 20, y: 340 },
                                                },
                                                {
                                                    text: [{
                                                            text: "Razón Social/Nombres y Apellidos:  ",
                                                            fontSize: 9,
                                                            bold: true,
                                                        },
                                                        {
                                                            text: `${datosfactura.rows[0].nomcliente}     `,
                                                            fontSize: 9,
                                                            bold: false,
                                                        },
                                                        { text: "RUC/CI: ", fontSize: 9, bold: true },
                                                        { text: `${datosfactura.rows[0].ruccicliente}`, fontSize: 9, bold: false },
                                                        { text: "\nFecha Emisión:  ", fontSize: 9, bold: true },
                                                        { text: `${datosfactura.rows[0].createdAt}`, fontSize: 9, bold: false },
                                                    ],
                                                    absolutePosition: { x: 25, y: 345 },
                                                },
                                                {
                                                    style: "tableDescripcionProductos",
                                                    table: {
                                                        widths: [80, 200, 51, 61, 51, 54],
                                                        headerRows: 1,
                                                        body: body
                                                    },
                                                },
                                                {
                                                    style: "tableTotales",
                                                    table: {
                                                        widths: [80, 80],
                                                        body: bodySumatoria
                                                    },
                                                },
                                                {
                                                    style: "tableFormasDePago",
                                                    table: {
                                                        widths: [80, 100],
                                                        headerRows: 1,
                                                        body: bodyFormasPago
                                                    },
                                                },
                                                {
                                                    style: "lineaFirma",
                                                    canvas: [{ type: "line", x1: 0, y1: 0, x2: 180, y2: 0, lineWidth: 1 }],
                                                },

                                                {
                                                    style: "lineaFirmaTexto",
                                                    text: [{ text: "Firma Jefe de Agencia", fontSize: 9, bold: true }],
                                                    layout: "headerLineOnly",
                                                },
                                            ],
                                            images: {
                                                barcode: "data:image/jpeg;base64,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dZCN/wB1Rkn8PWugsLjU/G3jvRtY/wCEe1LRtM0aOZvN1OIQzTySLt2BMkhQOc98VpvYXeofF9Ly4tJhYaXpeLaZkPltPK/z7TjBIVQD6ZqmruKf9bv8f1Fe12v6e34HNeM9Bg8HfDzQdIjurqPw5aXaLqzwzbJZYmyW75ILnlV5x0HFV/h1J4ebx9NF8P7if/hHUsS1/DJJJ5fnFhsKLKd+7G7Jxiun+IOn6kdS8O67Z6WdXttJuJJLnT0AMjhl2rIgPDMhyQOvPFZ2myX3i74i6X4gg8Nalolpp1vMlxcalAIJrreMLHtySVB+bJ/TuRd5Nvz/AC/q3n9wpJKKX9b/AJlf4g2/iKTWtDu7y/gh0hNes4raxtgS0uXB8yVj3GDhRxznORXaeJvBXh7xitsNe0/7WLXcYf30ke3djP3GGeg61m/EOyur218Pi0tppzFrtnLIIoy2xFc5Y46Adz0rY8WXF7aeEdXn06Cae+W0k8iOFCzs5UhcAck5qL2pvyb/ACRaV5rzX6s84+Hvgnw5P43vfE2h6ebPS9NkezscTSP9olAKyyksx+XkqAOOp617BWJ4P0hdB8HaRpgQo0FqgkBHO8jLZ99xNbdaSVvd7EJ397uFFFFSMKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z",
                                                logo: `${datosfactura.rows[0].logobase64}`,
                                            },
                                            styles: {
                                                inicios: {
                                                    fontSize: 12,
                                                    bold: true,
                                                },
                                                header: {
                                                    fontSize: 16,
                                                    bold: true,
                                                },
                                                bigger: {
                                                    fontSize: 15,
                                                    italics: true,
                                                },
                                                tableDescripcionProductos: {
                                                    fontSize: 9,
                                                    margin: [9, 364, 9, 4],
                                                },
                                                tableTotales: {
                                                    fontSize: 9,
                                                    margin: [381, 0, 10, 4],
                                                },
                                                tableFormasDePago: {
                                                    fontSize: 9,
                                                    margin: [9, 0, 0, 0],
                                                },
                                                tableBody: {
                                                    fontSize: 9,
                                                    alignment: "right",
                                                },
                                                tableHeader: {
                                                    fontSize: 9,
                                                    alignment: "center",
                                                },
                                                lineaFirma: {
                                                    margin: [381, 0, 10, 4],
                                                },
                                                lineaFirmaTexto: {
                                                    margin: [430, 0, 10, 4],
                                                },
                                            },
                                        };
                                        const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
                                        pdfDocGenerator.getBase64((data) => {
                                            enviarEmail(data);
                                            //console.log(data);
                                        });

                                        res.status(200).send({ message: "La factura ha sido autorizada y enviada." });
                                    });
                            } else {
                                res.status(200).send({ message: "Hay un error con la factura." });
                            }
                        }).catch((err) => {
                            res.status(500).send({ message: "Ocurrió un error al autorizar la factura." + err });
                        });
                }).catch((err) => {
                    res
                        .status(500)
                        .send({ message: "Ocurrió un error al buscar los detalles." + err });
                });;
        }).catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrió un error al buscar la factura." + err });
        });;
}

const sendHttpRequest = (method, url, data) => {
    const promise = new Promise((resolve, reject) => {});
    return promise;
};

function firmarComprobante(mi_contenido_p12, mi_pwd_p12, comprobante, id) {
    var archivo = "facturas/factura" + id + ".xml";
    var arrayUint8 = new Uint8Array(mi_contenido_p12);
    var p12B64 = forge.util.binary.base64.encode(arrayUint8);
    var p12Der = forge.util.decode64(p12B64);
    var p12Asn1 = forge.asn1.fromDer(p12Der);

    var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, mi_pwd_p12);

    var certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
    var cert = certBags[forge.oids.certBag][0].cert;
    var pkcs8bags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
    var pkcs8 = pkcs8bags[forge.oids.pkcs8ShroudedKeyBag][0];
    var key = pkcs8.key;

    //console.log(btoa(pkcs8));
    if (key == null) {
        key = pkcs8.asn1;
    }

    certificateX509_pem = forge.pki.certificateToPem(cert);

    certificateX509 = certificateX509_pem;
    certificateX509 = certificateX509.substr(certificateX509.indexOf("\n"));
    certificateX509 = certificateX509.substr(
        0,
        certificateX509.indexOf("\n-----END CERTIFICATE-----")
    );

    certificateX509 = certificateX509
        .replace(/\r?\n|\r/g, "")
        .replace(/([^\0]{76})/g, "$1\n");

    //Pasar certificado a formato DER y sacar su hash:
    certificateX509_asn1 = forge.pki.certificateToAsn1(cert);
    certificateX509_der = forge.asn1.toDer(certificateX509_asn1).getBytes();
    certificateX509_der_hash = sha1_base64(certificateX509_der);

    //Serial Number
    var X509SerialNumber = parseInt(cert.serialNumber, 16);

    exponent = hexToBase64(key.e.data[0].toString(16));
    modulus = bigint2base64(key.n);

    var sha1_comprobante = sha1_base64_utf8(
        comprobante.replace('<?xml version="1.0" encoding="UTF-8"?>\n', "")
    );

    var xmlns =
        'xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"';

    //numeros involucrados en los hash:

    //var Certificate_number = 1217155;//p_obtener_aleatorio(); //1562780 en el ejemplo del SRI
    //var Certificate_number = "1832130"; //1562780 en el ejemplo del SRI
    var Certificate_number = p_obtener_aleatorio();
    //var Signature_number = 1021879;//p_obtener_aleatorio(); //620397 en el ejemplo del SRI
    //var Signature_number = "53083"; //620397 en el ejemplo del SRI
    var Signature_number = p_obtener_aleatorio();
    //var SignedProperties_number = 1006287;//p_obtener_aleatorio(); //24123 en el ejemplo del SRI
    //var SignedProperties_number = "500004"; //24123 en el ejemplo del SRI
    var SignedProperties_number = p_obtener_aleatorio();
    //numeros fuera de los hash:

    //var SignedInfo_number = 696603;//p_obtener_aleatorio(); //814463 en el ejemplo del SRI
    //var SignedInfo_number = "436599"; //814463 en el ejemplo del SRI
    var SignedInfo_number = p_obtener_aleatorio();
    //var SignedPropertiesID_number = 77625;//p_obtener_aleatorio(); //157683 en el ejemplo del SRI
    //var SignedPropertiesID_number = "757322"; //157683 en el ejemplo del SRI
    var SignedPropertiesID_number = p_obtener_aleatorio();
    //var Reference_ID_number = 235824;//p_obtener_aleatorio(); //363558 en el ejemplo del SRI
    //var Reference_ID_number = "873278"; //363558 en el ejemplo del SRI
    var Reference_ID_number = p_obtener_aleatorio();
    //var SignatureValue_number = 844709;//p_obtener_aleatorio(); //398963 en el ejemplo del SRI
    //var SignatureValue_number = "705423"; //398963 en el ejemplo del SRI
    var SignatureValue_number = p_obtener_aleatorio();
    //var Object_number = 621794;//p_obtener_aleatorio(); //231987 en el ejemplo del SRI
    //var Object_number = "696740"; //231987 en el ejemplo del SRI
    var Object_number = p_obtener_aleatorio();

    var SignedProperties = "";

    SignedProperties +=
        '<etsi:SignedProperties Id="Signature' +
        Signature_number +
        "-SignedProperties" +
        SignedProperties_number +
        '">'; //SignedProperties
    SignedProperties += "<etsi:SignedSignatureProperties>";
    SignedProperties += "<etsi:SigningTime>";

    //SignedProperties += '2016-12-24T13:46:43-05:00';//moment().format('YYYY-MM-DD\THH:mm:ssZ');
    //SignedProperties += "2021-04-09T22:22:36-05:00";
    SignedProperties += moment().format("YYYY-MM-DDTHH:mm:ssZ");

    SignedProperties += "</etsi:SigningTime>";
    SignedProperties += "<etsi:SigningCertificate>";
    SignedProperties += "<etsi:Cert>";
    SignedProperties += "<etsi:CertDigest>";
    SignedProperties +=
        '<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
    SignedProperties += "</ds:DigestMethod>";
    SignedProperties += "<ds:DigestValue>";

    SignedProperties += certificateX509_der_hash;

    SignedProperties += "</ds:DigestValue>";
    SignedProperties += "</etsi:CertDigest>";
    SignedProperties += "<etsi:IssuerSerial>";
    SignedProperties += "<ds:X509IssuerName>";
    SignedProperties +=
        "CN=AC BANCO CENTRAL DEL ECUADOR,L=QUITO,OU=ENTIDAD DE CERTIFICACION DE INFORMACION-ECIBCE,O=BANCO CENTRAL DEL ECUADOR,C=EC";
    SignedProperties += "</ds:X509IssuerName>";
    SignedProperties += "<ds:X509SerialNumber>";

    SignedProperties += X509SerialNumber;

    SignedProperties += "</ds:X509SerialNumber>";
    SignedProperties += "</etsi:IssuerSerial>";
    SignedProperties += "</etsi:Cert>";
    SignedProperties += "</etsi:SigningCertificate>";
    SignedProperties += "</etsi:SignedSignatureProperties>";
    SignedProperties += "<etsi:SignedDataObjectProperties>";
    SignedProperties +=
        '<etsi:DataObjectFormat ObjectReference="#Reference-ID-' +
        Reference_ID_number +
        '">';
    SignedProperties += "<etsi:Description>";

    SignedProperties += "contenido comprobante";

    SignedProperties += "</etsi:Description>";
    SignedProperties += "<etsi:MimeType>";
    SignedProperties += "text/xml";
    SignedProperties += "</etsi:MimeType>";
    SignedProperties += "</etsi:DataObjectFormat>";
    SignedProperties += "</etsi:SignedDataObjectProperties>";
    SignedProperties += "</etsi:SignedProperties>"; //fin SignedProperties

    SignedProperties_para_hash = SignedProperties.replace(
        "<etsi:SignedProperties",
        "<etsi:SignedProperties " + xmlns
    );

    var sha1_SignedProperties = sha1_base64(SignedProperties_para_hash);

    var KeyInfo = "";

    KeyInfo += '<ds:KeyInfo Id="Certificate' + Certificate_number + '">';
    KeyInfo += "\n<ds:X509Data>";
    KeyInfo += "\n<ds:X509Certificate>\n";

    //CERTIFICADO X509 CODIFICADO EN Base64
    KeyInfo += certificateX509;

    KeyInfo += "\n</ds:X509Certificate>";
    KeyInfo += "\n</ds:X509Data>";
    KeyInfo += "\n<ds:KeyValue>";
    KeyInfo += "\n<ds:RSAKeyValue>";
    KeyInfo += "\n<ds:Modulus>\n";

    //MODULO DEL CERTIFICADO X509
    KeyInfo += modulus;

    KeyInfo += "\n</ds:Modulus>";
    KeyInfo += "\n<ds:Exponent>";

    //KeyInfo += 'AQAB';
    KeyInfo += exponent;

    KeyInfo += "</ds:Exponent>";
    KeyInfo += "\n</ds:RSAKeyValue>";
    KeyInfo += "\n</ds:KeyValue>";
    KeyInfo += "\n</ds:KeyInfo>";

    KeyInfo_para_hash = KeyInfo.replace("<ds:KeyInfo", "<ds:KeyInfo " + xmlns);

    var sha1_certificado = sha1_base64(KeyInfo_para_hash);

    var SignedInfo = "";

    SignedInfo +=
        '<ds:SignedInfo Id="Signature-SignedInfo' + SignedInfo_number + '">';
    SignedInfo +=
        '\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315">';
    SignedInfo += "</ds:CanonicalizationMethod>";
    SignedInfo +=
        '\n<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1">';
    SignedInfo += "</ds:SignatureMethod>";
    SignedInfo +=
        '\n<ds:Reference Id="SignedPropertiesID' +
        SignedPropertiesID_number +
        '" Type="http://uri.etsi.org/01903#SignedProperties" URI="#Signature' +
        Signature_number +
        "-SignedProperties" +
        SignedProperties_number +
        '">';
    SignedInfo +=
        '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
    SignedInfo += "</ds:DigestMethod>";
    SignedInfo += "\n<ds:DigestValue>";

    //HASH O DIGEST DEL ELEMENTO <etsi:SignedProperties>';
    SignedInfo += sha1_SignedProperties;

    SignedInfo += "</ds:DigestValue>";
    SignedInfo += "\n</ds:Reference>";
    SignedInfo += '\n<ds:Reference URI="#Certificate' + Certificate_number + '">';
    SignedInfo +=
        '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
    SignedInfo += "</ds:DigestMethod>";
    SignedInfo += "\n<ds:DigestValue>";

    //HASH O DIGEST DEL CERTIFICADO X509
    SignedInfo += sha1_certificado;

    SignedInfo += "</ds:DigestValue>";
    SignedInfo += "\n</ds:Reference>";
    SignedInfo +=
        '\n<ds:Reference Id="Reference-ID-' +
        Reference_ID_number +
        '" URI="#comprobante">';
    SignedInfo += "\n<ds:Transforms>";
    SignedInfo +=
        '\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature">';
    SignedInfo += "</ds:Transform>";
    SignedInfo += "\n</ds:Transforms>";
    SignedInfo +=
        '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
    SignedInfo += "</ds:DigestMethod>";
    SignedInfo += "\n<ds:DigestValue>";

    //HASH O DIGEST DE TODO EL ARCHIVO XML IDENTIFICADO POR EL id="comprobante"

    //VALOR ERRONEO 1

    SignedInfo += sha1_comprobante;

    //console.log(sha1_comprobante);

    SignedInfo += "</ds:DigestValue>";
    SignedInfo += "\n</ds:Reference>";
    SignedInfo += "\n</ds:SignedInfo>";

    SignedInfo_para_firma = SignedInfo.replace(
        "<ds:SignedInfo",
        "<ds:SignedInfo " + xmlns
    );

    var md = forge.md.sha1.create();
    md.update(SignedInfo_para_firma, "utf8");

    var signature = btoa(key.sign(md))
        .match(/.{1,76}/g)
        .join("\n");

    var xades_bes = "";

    //INICIO DE LA FIRMA DIGITAL
    xades_bes +=
        "<ds:Signature " + xmlns + ' Id="Signature' + Signature_number + '">';
    xades_bes += "\n" + SignedInfo;

    xades_bes +=
        '\n<ds:SignatureValue Id="SignatureValue' + SignatureValue_number + '">\n';

    //VALOR DE LA FIRMA (ENCRIPTADO CON LA LLAVE PRIVADA DEL CERTIFICADO DIGITAL)

    //VALOR ERRONEO POSICION 2
    xades_bes += signature;

    xades_bes += "\n</ds:SignatureValue>";

    xades_bes += "\n" + KeyInfo;

    xades_bes +=
        '\n<ds:Object Id="Signature' +
        Signature_number +
        "-Object" +
        Object_number +
        '">';
    xades_bes +=
        '<etsi:QualifyingProperties Target="#Signature' + Signature_number + '">';

    //ELEMENTO <etsi:SignedProperties>';
    xades_bes += SignedProperties;

    xades_bes += "</etsi:QualifyingProperties>";
    xades_bes += "</ds:Object>";
    xades_bes += "</ds:Signature>";

    //FIN DE LA FIRMA DIGITAL

    fs.writeFileSync(archivo, comprobante.replace(/(<[^<]+)$/, xades_bes + "$1"));

    //Inicio de conversión del archivo en base64

    var archivoString = comprobante.replace(/(<[^<]+)$/, xades_bes + "$1");
    var base = new Buffer.from(archivoString);
    var archivoBase64 = base.toString("base64");

    //Fin de conversión del archivo en base64

    return archivoBase64;
}

function sha1_base64(txt) {
    var md = forge.md.sha1.create();
    md.update(txt);
    //console.log('Buffer in: ', Buffer);
    return new Buffer.from(md.digest().toHex(), "hex").toString("base64");

    //return new window.buffer.Buffer(md.digest().toHex(), 'hex').toString('base64');
}

function sha1_base64_utf8(txt) {
    var md = forge.md.sha1.create();
    md.update(txt, "utf8");
    //console.log('Buffer in: ', Buffer);
    return new Buffer.from(md.digest().toHex(), "hex").toString("base64");

    //return new window.buffer.Buffer(md.digest().toHex(), 'hex').toString('base64');
}

var btoa = require("btoa");
var moment = require("moment");

function hexToBase64(str) {
    var hex = ("00" + str).slice(0 - str.length - (str.length % 2));

    return btoa(
        String.fromCharCode.apply(
            null,
            hex
            .replace(/\r|\n/g, "")
            .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
            .replace(/ +$/, "")
            .split(" ")
        )
    );
}

function bigint2base64(bigint) {
    var base64 = "";
    base64 = btoa(
        bigint
        .toString(16)
        .match(/\w{2}/g)
        .map(function(a) {
            return String.fromCharCode(parseInt(a, 16));
        })
        .join("")
    );

    base64 = base64.match(/.{1,76}/g).join("\n");

    return base64;
}

function p_obtener_aleatorio() {
    return Math.floor(Math.random() * 999000) + 990;
}

function create(req, res) {
    cabmovfac
        .create(req.body)
        .then((cabmovfac) => {
            res.status(200).send({ cabmovfac });
        })
        .catch((err) => {
            res.status(500).send({ err });
        });
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;
    cabmovfac
        .findOne({
            where: {
                secmovcab: id,
            },
        })
        .then((movfactura) => {
            movfactura
                .update(body)
                .then(() => {
                    res.status(200).send({ movfactura });
                })
                .catch((erro) => {
                    res
                        .status(500)
                        .send({ message: "Ocurrio un error al actualizar la factura" });
                });
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrio un error al actualizar la factura" });
        });
}

function getOne(req, res) {
    var id = req.params.id;
    cabmovfac
        .findOne({
            where: {
                secmovcab: id,
            },
        })
        .then((movfactura) => {
            res.status(200).send(movfactura);
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrió un error al buscar la factura." + err });
        });
}

function getAll(req, res) {
    var idEmpresa = req.params.id;
    cabmovfac
        .findAll({
            where: {
                idempresa: idEmpresa,
            },
        })
        .then((cabmovfac) => {
            res.status(200).send({ cabmovfac });
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrio un error al buscar las facturas" });
        });
}

function borrar(req, res) {
    var id = req.params.id;
    var body = req.body;
    cabmovfac
        .findOne({
            where: {
                secmovcab: id,
            },
        })
        .then((movfactura) => {
            movfactura
                .destroy(body)
                .then(() => {
                    res.status(200).send({ message: "Factura eliminado" });
                })
                .catch((erro) => {
                    res
                        .status(500)
                        .send({ message: "Ocurrio un error al borrar la factura" });
                });
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrio un error al borrar la factura" });
        });
}

function reportesFacturasClientesContado(req, res) {
    //:idEmpresa/:fechaIni/:fechaFin
    var idEmpresa = req.params.idEmpresa;
    var fechaIni = req.params.fechaIni;
    var fechaFin = req.params.fechaFin;
    var idCaja = req.params.idcaja;

    const consulta = pool
        .query(
            `SELECT fac.idempresa, fac.idsucursal, suc.nomsucursal, 
    fac.idcaja, caj.nomcaja,
    fac.idserie, fac.secmovcab, 
    fac.idcliente, cli.nomcliente, 
    fac.fechaingreso, fac.fechaaprob, fac.numfactura, fac.numautosri, 
    fac.fechaautsri, fac.subsindesc, fac.descuento, fac.subtotal, fac.subtotaliva0, 
    fac.subtotaliva12, fac.iva0, fac.iva12, fac.total, fac.crepor, fac.modpor, fac."createdAt", 
    fac."updatedAt", fac.estado, fac.porcdescuento, fac."EstadoRecepcionSRI", 
    fac."EstadoAutorizacionSRI", fac.secproforma, fac.claveacceso, fac.estadocobro, fac.valorcobro
    FROM cabmovfac fac, parsucursal suc, parcaja caj, clientes cli
    where fac.idsucursal = suc.idsucursal and fac.idcaja = caj.idcaja
    and fac.idcliente = cli.idcliente and cli.tipocliente = 'Contado'
    and fac.estado ='FACTURADA'
    and fac.idempresa = '` +
            idEmpresa +
            `'
    and fac.idcaja = '` +
            idCaja +
            `' 
    and (fac."createdAt" between '` +
            fechaIni +
            `' and '` +
            fechaFin +
            `');`
        )
        .then((reporteFacturas) => {
            res.send(reporteFacturas.rows);
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrio un error al comprobar el reporte" + err });
        });
}

module.exports = {
    create,
    update,
    getAll,
    borrar,
    getOne,
    facturaElectronica,
    reportesFacturasClientesContado,
    comprobarAutorizacion
};