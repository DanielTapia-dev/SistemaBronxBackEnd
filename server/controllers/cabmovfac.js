const { Pool, Client } = require('pg');
const cabmovfac = require("../models").cabmovfac;
const empresa = require('../models').empresa;
const xml2js = require('xml2js');
var SignedXml = require('xml-crypto').SignedXml,
    fs = require('fs');
var forge = require('node-forge');
const clientes = require("../models").clientes;
const detmovimientos = require("../models").detmovimientos;
const parimpuesto = require('../models').parimpuesto;
const fetch = require("node-fetch");
/* const { sequelize } = require('sequelize');
const producto = require("../models").producto; */

const config = {
    user: 'postgres',
    host: 'localhost',
    password: 'dannyalejo7123tapia',
    database: 'contable'
};

const pool = new Pool(config);
//const client = new Client(config);

/* const getProductos = async() => {
    const res = await pool.query(`SELECT D.idempresa, D.idsucursal, D.secmovcab, D.idproducto, P.nomproducto, D.cantidad, D.precio, D.subsindesc, D.porcdescuento, D.descuento, D.subtotal, D.iva0, D.iva12, D.total
	FROM detmovimientos D, producto P
	WHERE D.secmovcab=77 AND D.idproducto = P.idproducto;`);
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
            empresa.findOne({
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
                            const consulta = pool.query(`SELECT D.idempresa, D.idsucursal, I.idimpuesto, I.porcimpuesto, I."codigoSRI", I."codporcentajeSRI", D.secmovcab, D.idproducto, P.nomproducto, D.cantidad, D.precio, D.subsindesc, D.porcdescuento, D.descuento, D.subtotal, D.iva0, D.iva12, D.total
                            FROM detmovimientos D, producto P, parimpuesto I
                            WHERE D.secmovcab=` + movfactura.secmovcab + `AND D.idproducto = P.idproducto
                            AND P.idimpuesto = I.idimpuesto;`).then((detallesFinal) => {
                                //console.log(detallesFinal.rows);
                                parimpuesto.findAll({
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


                                        detallesFinal.rows.forEach(element => {
                                            //CONSULTAR AQUI EL PRECIO DE CADA PRODUCTO
                                            if (element.iva12 != 0) {
                                                var ivaFinal = element.iva12;
                                            } else {
                                                var ivaFinal = '0.00';
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
                                                        valor: ivaFinal
                                                    }]
                                                }

                                            }
                                            detalle.push(obj);
                                        });
                                        for (let index = 0; index < detalle.length; index++) {
                                            //console.log(detalle[index]);
                                        }

                                        /* for (let d in detalle) {
                                            console.log(d.codigoPrincipal);
                                        } */
                                        parimpuesto.forEach(element => {
                                            //console.log(element.nomimpuesto);
                                        });
                                        //console.log("Este es..................... " + parimpuesto[0].codporcentajeSRI);
                                        //Proceso para encontrar los productos y realizar proceso de sumas
                                        if (movfactura != null) {
                                            //CONSULTA DE CLIENTE


                                            //FIN DE CONSULTA DE DATOS DEL CLIENTE   
                                            //PROCESO PARA FACTURACION ELECTRONICA
                                            var fechaNumeroAutorizacion = moment().format('DDMMYYYY');
                                            var fechaCabeceraFactura = moment().format('DD/MM/YYYY');
                                            var puntoEmision = movfactura.numfactura[0] + movfactura.numfactura[1] + movfactura.numfactura[2];
                                            var puntoFacturacion = movfactura.numfactura[3] + movfactura.numfactura[4] + movfactura.numfactura[5];
                                            var secuencial = movfactura.numfactura[6] + movfactura.numfactura[7] + movfactura.numfactura[8] + movfactura.numfactura[9] + movfactura.numfactura[10] + movfactura.numfactura[11] + movfactura.numfactura[12] + movfactura.numfactura[13] + movfactura.numfactura[14];
                                            var ambiente = emp.ambiente;
                                            //console.log(detmovimientos);


                                            //Inicio de algoritmo para crear la clave de acceso
                                            var claveAcceso = fechaNumeroAutorizacion + '01' + '1706610738001' + '1' + puntoEmision + puntoFacturacion + secuencial + '12345678' + '1';
                                            var multiplicador = '765432765432765432765432765432765432765432765432';
                                            var resultadoClavePorMultiplicador = 0;
                                            for (let i = 0; i < claveAcceso.length; i++) {
                                                resultadoClavePorMultiplicador = resultadoClavePorMultiplicador + (claveAcceso[i] * multiplicador[i]);
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

                                            parimpuesto.forEach(element => {
                                                if (element.idimpuesto == 'IM1') {
                                                    impuesto0 = element.dataValues;
                                                } else if (element.idimpuesto == 'IM2') {
                                                    impuesto12 = element.dataValues;
                                                }
                                            });

                                            //console.log('ESTE ES EL RESULTADO DE LA CLAVE DE ACCESO ' + claveAcceso);

                                            if (emp.contabilidad == true) {
                                                var contabilidad = 'SI';
                                            } else {
                                                var contabilidad = 'NO';
                                            }
                                            if (emp.ambiente == 'pruebas') {
                                                ambiente = 1;
                                            } else {
                                                ambiente = 2;
                                            }
                                            //ARMADO DE XML
                                            const xmlObject = {
                                                factura: {
                                                    $: {
                                                        id: "comprobante",
                                                        version: "1.0.0"
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
                                                        regimenMicroempresas: "CONTRIBUYENTE RÉGIMEN MICROEMPRESAS"
                                                    },
                                                    infoFactura: {
                                                        fechaEmision: fechaCabeceraFactura,
                                                        dirEstablecimiento: emp.dirempresa.toUpperCase(),
                                                        obligadoContabilidad: contabilidad.toUpperCase(),
                                                        tipoIdentificacionComprador: "05",
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
                                                                }
                                                            ]
                                                        },
                                                        propina: "0.00",
                                                        importeTotal: movfactura.total,
                                                        moneda: emp.monempresa.toUpperCase()
                                                    },
                                                    detalles: {
                                                        detalle
                                                    }
                                                }
                                            }
                                            const builder = new xml2js.Builder({ xmldec: { 'version': '1.0', 'encoding': 'UTF-8' } });
                                            const xml = builder.buildObject(xmlObject);
                                            //console.log(xml);

                                            fs.appendFile('facturas/factura' + id + '.xml', '', (err) => {
                                                if (err) throw err;
                                                //console.log('Archivo creado correctamente');
                                            })

                                            fs.writeFileSync('facturas/factura' + id + '.xml', xml);
                                            //console.log('Se ha escrito en el archivo');

                                            fs.readFile('FirmaCorrecta.pfx', (err, data) => {
                                                if (err) throw err;
                                                var archivop12 = data;
                                                var xmlbase64 = firmarComprobante(archivop12, 'Solsito2204', xml, id);

                                                // Inicio de consumo de servicio post con EndPoint del SRI
                                                var EmpaquetadoXML = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                                                <Body>
                                                    <validarComprobante xmlns="http://ec.gob.sri.ws.recepcion">
                                                        <xml xmlns="">
                                                            ` + xmlbase64 + `
                                                        </xml>
                                                    </validarComprobante>
                                                </Body>
                                                </Envelope>`
                                                var ConsultaDeAutorizacionEmpaquetado = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                                                <Body>
                                                    <autorizacionComprobante xmlns="http://ec.gob.sri.ws.autorizacion">
                                                        <claveAccesoComprobante xmlns="">` + claveAcceso + `</claveAccesoComprobante>
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
                                                }).then(
                                                    response => response.text() // .json(), etc.
                                                    // same as function(response) {return response.text();}
                                                ).then(
                                                    (xml) => {
                                                        var DomParser = require('dom-parser');
                                                        parser = new DomParser();
                                                        xmlDoc = parser.parseFromString(xml, "text/xml");
                                                        console.log(xmlDoc.getElementsByTagName("estado")[0].childNodes[0].text);
                                                        if (xmlDoc.getElementsByTagName("estado")[0].childNodes[0].text === 'RECIBIDA') {
                                                            fetch(url2, {
                                                                method: "POST",
                                                                body: ConsultaDeAutorizacionEmpaquetado,
                                                                // -- or --
                                                                // body : JSON.stringify({
                                                                // user : document.getElementById('user').value,
                                                                // ...
                                                                // })
                                                            }).then(
                                                                response => response.text() // .json(), etc.
                                                                // same as function(response) {return response.text();}
                                                            ).then(
                                                                (xml) => {
                                                                    var DomParser = require('dom-parser');
                                                                    parser = new DomParser();
                                                                    xmlDoc = parser.parseFromString(xml, "text/xml");
                                                                    console.log(xmlDoc.getElementsByTagName("estado")[0].childNodes[0].text);
                                                                    if (xmlDoc.getElementsByTagName("estado")[0].childNodes[0].text === 'AUTORIZADO') {
                                                                        const actualizarNumeroDeAutorizacion = pool.query(`UPDATE public.cabmovfac
                                                                        SET numautosri=` + claveAcceso + `
                                                                        WHERE secmovcab=` + movfactura.secmovcab + `;`).then((detallesFinal) => {
                                                                            console.log(detallesFinal + ' Facturada correctamente');
                                                                        })
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                );

                                                //Fin del consumo de servicio post al SRI
                                            });
                                            //FIN DEL PROCESO FACTURACION ELECTRONICA        
                                        } else {
                                            res.status(200).send({ message: 'No se encontro los detalles de las enviada' });
                                            //0103326336S
                                        }
                                        res.status(200).send("Envío de factura electronica correctamente");
                                    })
                                    .catch(err => {
                                        res.status(500).send({ message: "Ocurrio un error al buscar los impuestos" });
                                    })
                            }).catch((err) => {
                                console.log('Error al buscar los detalles: ' + err);
                            });;
                        })
                        .catch((err) => {
                            res
                                .status(500)
                                .send({ message: "Ocurrió un error al buscar el cliente." + err });
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

const sendHttpRequest = (method, url, data) => {
    const promise = new Promise((resolve, reject) => {

    });
    return promise;
};

function firmarComprobante(mi_contenido_p12, mi_pwd_p12, comprobante, id) {
    var archivo = 'facturas/factura' + id + '.xml';
    var arrayUint8 = new Uint8Array(mi_contenido_p12);
    var p12B64 = forge.util.binary.base64.encode(arrayUint8);
    var p12Der = forge.util.decode64(p12B64);
    var p12Asn1 = forge.asn1.fromDer(p12Der);

    var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, mi_pwd_p12);

    var certBags = p12.getBags({ bagType: forge.pki.oids.certBag })
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
    certificateX509 = certificateX509.substr(certificateX509.indexOf('\n'));
    certificateX509 = certificateX509.substr(0, certificateX509.indexOf('\n-----END CERTIFICATE-----'));

    certificateX509 = certificateX509.replace(/\r?\n|\r/g, '').replace(/([^\0]{76})/g, '$1\n');

    //Pasar certificado a formato DER y sacar su hash:
    certificateX509_asn1 = forge.pki.certificateToAsn1(cert);
    certificateX509_der = forge.asn1.toDer(certificateX509_asn1).getBytes();
    certificateX509_der_hash = sha1_base64(certificateX509_der);

    //Serial Number
    var X509SerialNumber = parseInt(cert.serialNumber, 16);

    exponent = hexToBase64(key.e.data[0].toString(16));
    modulus = bigint2base64(key.n);


    var sha1_comprobante = sha1_base64_utf8(comprobante.replace('<?xml version="1.0" encoding="UTF-8"?>\n', ''));

    var xmlns = 'xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"';


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


    var SignedProperties = '';

    SignedProperties += '<etsi:SignedProperties Id="Signature' + Signature_number + '-SignedProperties' + SignedProperties_number + '">'; //SignedProperties
    SignedProperties += '<etsi:SignedSignatureProperties>';
    SignedProperties += '<etsi:SigningTime>';

    //SignedProperties += '2016-12-24T13:46:43-05:00';//moment().format('YYYY-MM-DD\THH:mm:ssZ');
    //SignedProperties += "2021-04-09T22:22:36-05:00";
    SignedProperties += moment().format('YYYY-MM-DD\THH:mm:ssZ');

    SignedProperties += '</etsi:SigningTime>';
    SignedProperties += '<etsi:SigningCertificate>';
    SignedProperties += '<etsi:Cert>';
    SignedProperties += '<etsi:CertDigest>';
    SignedProperties += '<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
    SignedProperties += '</ds:DigestMethod>';
    SignedProperties += '<ds:DigestValue>';

    SignedProperties += certificateX509_der_hash;

    SignedProperties += '</ds:DigestValue>';
    SignedProperties += '</etsi:CertDigest>';
    SignedProperties += '<etsi:IssuerSerial>';
    SignedProperties += '<ds:X509IssuerName>';
    SignedProperties += 'CN=AC BANCO CENTRAL DEL ECUADOR,L=QUITO,OU=ENTIDAD DE CERTIFICACION DE INFORMACION-ECIBCE,O=BANCO CENTRAL DEL ECUADOR,C=EC';
    SignedProperties += '</ds:X509IssuerName>';
    SignedProperties += '<ds:X509SerialNumber>';

    SignedProperties += X509SerialNumber;

    SignedProperties += '</ds:X509SerialNumber>';
    SignedProperties += '</etsi:IssuerSerial>';
    SignedProperties += '</etsi:Cert>';
    SignedProperties += '</etsi:SigningCertificate>';
    SignedProperties += '</etsi:SignedSignatureProperties>';
    SignedProperties += '<etsi:SignedDataObjectProperties>';
    SignedProperties += '<etsi:DataObjectFormat ObjectReference="#Reference-ID-' + Reference_ID_number + '">';
    SignedProperties += '<etsi:Description>';

    SignedProperties += 'contenido comprobante';

    SignedProperties += '</etsi:Description>';
    SignedProperties += '<etsi:MimeType>';
    SignedProperties += 'text/xml';
    SignedProperties += '</etsi:MimeType>';
    SignedProperties += '</etsi:DataObjectFormat>';
    SignedProperties += '</etsi:SignedDataObjectProperties>';
    SignedProperties += '</etsi:SignedProperties>'; //fin SignedProperties

    SignedProperties_para_hash = SignedProperties.replace('<etsi:SignedProperties', '<etsi:SignedProperties ' + xmlns);

    var sha1_SignedProperties = sha1_base64(SignedProperties_para_hash);


    var KeyInfo = '';

    KeyInfo += '<ds:KeyInfo Id="Certificate' + Certificate_number + '">';
    KeyInfo += '\n<ds:X509Data>';
    KeyInfo += '\n<ds:X509Certificate>\n';

    //CERTIFICADO X509 CODIFICADO EN Base64 
    KeyInfo += certificateX509;

    KeyInfo += '\n</ds:X509Certificate>';
    KeyInfo += '\n</ds:X509Data>';
    KeyInfo += '\n<ds:KeyValue>';
    KeyInfo += '\n<ds:RSAKeyValue>';
    KeyInfo += '\n<ds:Modulus>\n';

    //MODULO DEL CERTIFICADO X509
    KeyInfo += modulus;

    KeyInfo += '\n</ds:Modulus>';
    KeyInfo += '\n<ds:Exponent>';

    //KeyInfo += 'AQAB';
    KeyInfo += exponent;

    KeyInfo += '</ds:Exponent>';
    KeyInfo += '\n</ds:RSAKeyValue>';
    KeyInfo += '\n</ds:KeyValue>';
    KeyInfo += '\n</ds:KeyInfo>';

    KeyInfo_para_hash = KeyInfo.replace('<ds:KeyInfo', '<ds:KeyInfo ' + xmlns);

    var sha1_certificado = sha1_base64(KeyInfo_para_hash);


    var SignedInfo = '';

    SignedInfo += '<ds:SignedInfo Id="Signature-SignedInfo' + SignedInfo_number + '">';
    SignedInfo += '\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315">';
    SignedInfo += '</ds:CanonicalizationMethod>';
    SignedInfo += '\n<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1">';
    SignedInfo += '</ds:SignatureMethod>';
    SignedInfo += '\n<ds:Reference Id="SignedPropertiesID' + SignedPropertiesID_number + '" Type="http://uri.etsi.org/01903#SignedProperties" URI="#Signature' + Signature_number + '-SignedProperties' + SignedProperties_number + '">';
    SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
    SignedInfo += '</ds:DigestMethod>';
    SignedInfo += '\n<ds:DigestValue>';

    //HASH O DIGEST DEL ELEMENTO <etsi:SignedProperties>';
    SignedInfo += sha1_SignedProperties;

    SignedInfo += '</ds:DigestValue>';
    SignedInfo += '\n</ds:Reference>';
    SignedInfo += '\n<ds:Reference URI="#Certificate' + Certificate_number + '">';
    SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
    SignedInfo += '</ds:DigestMethod>';
    SignedInfo += '\n<ds:DigestValue>';

    //HASH O DIGEST DEL CERTIFICADO X509
    SignedInfo += sha1_certificado;

    SignedInfo += '</ds:DigestValue>';
    SignedInfo += '\n</ds:Reference>';
    SignedInfo += '\n<ds:Reference Id="Reference-ID-' + Reference_ID_number + '" URI="#comprobante">';
    SignedInfo += '\n<ds:Transforms>';
    SignedInfo += '\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature">';
    SignedInfo += '</ds:Transform>';
    SignedInfo += '\n</ds:Transforms>';
    SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
    SignedInfo += '</ds:DigestMethod>';
    SignedInfo += '\n<ds:DigestValue>';

    //HASH O DIGEST DE TODO EL ARCHIVO XML IDENTIFICADO POR EL id="comprobante" 

    //VALOR ERRONEO 1

    SignedInfo += sha1_comprobante;

    //console.log(sha1_comprobante);

    SignedInfo += '</ds:DigestValue>';
    SignedInfo += '\n</ds:Reference>';
    SignedInfo += '\n</ds:SignedInfo>';

    SignedInfo_para_firma = SignedInfo.replace('<ds:SignedInfo', '<ds:SignedInfo ' + xmlns);

    var md = forge.md.sha1.create();
    md.update(SignedInfo_para_firma, 'utf8');

    var signature = btoa(key.sign(md)).match(/.{1,76}/g).join("\n");


    var xades_bes = '';

    //INICIO DE LA FIRMA DIGITAL 
    xades_bes += '<ds:Signature ' + xmlns + ' Id="Signature' + Signature_number + '">';
    xades_bes += '\n' + SignedInfo;

    xades_bes += '\n<ds:SignatureValue Id="SignatureValue' + SignatureValue_number + '">\n';

    //VALOR DE LA FIRMA (ENCRIPTADO CON LA LLAVE PRIVADA DEL CERTIFICADO DIGITAL) 

    //VALOR ERRONEO POSICION 2
    xades_bes += signature;

    xades_bes += '\n</ds:SignatureValue>';

    xades_bes += '\n' + KeyInfo;

    xades_bes += '\n<ds:Object Id="Signature' + Signature_number + '-Object' + Object_number + '">';
    xades_bes += '<etsi:QualifyingProperties Target="#Signature' + Signature_number + '">';

    //ELEMENTO <etsi:SignedProperties>';
    xades_bes += SignedProperties;

    xades_bes += '</etsi:QualifyingProperties>';
    xades_bes += '</ds:Object>';
    xades_bes += '</ds:Signature>';

    //FIN DE LA FIRMA DIGITAL 

    fs.writeFileSync(archivo, comprobante.replace(/(<[^<]+)$/, xades_bes + '$1'));

    //Inicio de conversión del archivo en base64

    var archivoString = comprobante.replace(/(<[^<]+)$/, xades_bes + '$1');
    var base = new Buffer.from(archivoString);
    var archivoBase64 = base.toString('base64');

    //Fin de conversión del archivo en base64

    return archivoBase64;
}


function sha1_base64(txt) {
    var md = forge.md.sha1.create();
    md.update(txt);
    //console.log('Buffer in: ', Buffer);
    return new Buffer.from(md.digest().toHex(), 'hex').toString('base64');

    //return new window.buffer.Buffer(md.digest().toHex(), 'hex').toString('base64');
}


function sha1_base64_utf8(txt) {
    var md = forge.md.sha1.create();
    md.update(txt, 'utf8');
    //console.log('Buffer in: ', Buffer);
    return new Buffer.from(md.digest().toHex(), 'hex').toString('base64');

    //return new window.buffer.Buffer(md.digest().toHex(), 'hex').toString('base64');
}

var btoa = require('btoa');
var moment = require('moment');

function hexToBase64(str) {
    var hex = ('00' + str).slice(0 - str.length - str.length % 2);

    return btoa(String.fromCharCode.apply(null,
        hex.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

function bigint2base64(bigint) {
    var base64 = '';
    base64 = btoa(bigint.toString(16).match(/\w{2}/g).map(function(a) { return String.fromCharCode(parseInt(a, 16)); }).join(""));

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

module.exports = {
    create,
    update,
    getAll,
    borrar,
    getOne,
    facturaElectronica
};