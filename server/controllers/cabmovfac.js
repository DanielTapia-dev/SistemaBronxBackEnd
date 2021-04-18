const cabmovfac = require("../models").cabmovfac;
const empresa = require('../models').empresa;
const xml2js = require('xml2js');
var SignedXml = require('xml-crypto').SignedXml,
    fs = require('fs');
var forge = require('node-forge');
const clientes = require("../models").clientes;

function facturaElectronica(req, res) {
    var id = req.params.id;
    var idempresa = req.body.idempresa

    cabmovfac
        .findOne({
            where: {
                secmovcab: id,
            },
        })
        .then((movfactura) => {
            empresa.findOne({
                    where: {
                        idempresa: idempresa,
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
                                if (emp.contabilidad == true) {
                                    var contabilidad = 'SI';
                                } else {
                                    var contabilidad = 'NO';
                                }

                                //ARMADO DE XML
                                const xmlObject = {
                                    factura: {
                                        $: {
                                            id: "comprobante",
                                            version: "1.0.0"
                                        },
                                        infoTributaria: {
                                            ambiente: "1",
                                            tipoEmision: "1",
                                            razonSocial: emp.razonsocial,
                                            nombreComercial: emp.nomcomercial,
                                            ruc: emp.rucciempresa,
                                            claveAcceso: "1004202101170661073800110030010000000101234567819",
                                            codDoc: "01",
                                            estab: puntoEmision,
                                            ptoEmi: puntoFacturacion,
                                            secuencial: secuencial,
                                            dirMatriz: emp.dirempresa,
                                            regimenMicroempresas: "CONTRIBUYENTE RÉGIMEN MICROEMPRESAS"
                                        },
                                        infoFactura: {
                                            fechaEmision: fechaCabeceraFactura,
                                            dirEstablecimiento: emp.dirempresa,
                                            obligadoContabilidad: contabilidad,
                                            tipoIdentificacionComprador: "05",
                                            razonSocialComprador: cliente.nomcliente,
                                            identificacionComprador: cliente.ruccicliente,
                                            direccionComprador: cliente.dircliente,
                                            totalSinImpuestos: "50.00",
                                            totalDescuento: "0.00",
                                            codDocReembolso: "00",
                                            totalConImpuestos: {
                                                totalImpuesto: [{
                                                    codigo: "2",
                                                    codigoPorcentaje: "0",
                                                    descuentoAdicional: "0.00",
                                                    baseImponible: "50.00",
                                                    valor: "00.00",
                                                }]
                                            },
                                            propina: "0.00",
                                            importeTotal: "50.00",
                                            moneda: "DOLAR"
                                        },
                                        detalles: {
                                            detalle: [{
                                                    codigoPrincipal: "001",
                                                    descripcion: "SOPORTE TECNICO",
                                                    cantidad: "1",
                                                    precioUnitario: "20",
                                                    descuento: "0",
                                                    precioTotalSinImpuesto: "20.00",
                                                    impuestos: {
                                                        impuesto: [{
                                                            codigo: "2",
                                                            codigoPorcentaje: "0",
                                                            tarifa: "00.00",
                                                            baseImponible: "20.00",
                                                            valor: "00.00"
                                                        }]
                                                    },
                                                },
                                                {
                                                    codigoPrincipal: "002",
                                                    descripcion: "SOPORTE TECNICO 2",
                                                    cantidad: "1",
                                                    precioUnitario: "30",
                                                    descuento: "0",
                                                    precioTotalSinImpuesto: "30.00",
                                                    impuestos: {
                                                        impuesto: [{
                                                            codigo: "2",
                                                            codigoPorcentaje: "0",
                                                            tarifa: "00.00",
                                                            baseImponible: "30.00",
                                                            valor: "00.00"
                                                        }]
                                                    },
                                                },
                                            ]
                                        }
                                    }
                                }
                                const builder = new xml2js.Builder({ xmldec: { 'version': '1.0', 'encoding': 'UTF-8' } });
                                const xml = builder.buildObject(xmlObject);
                                console.log(xml);

                                fs.appendFile('facturas/factura' + id + '.xml', '', (err) => {
                                    if (err) throw err;
                                    console.log('Archivo creado correctamente');
                                })

                                fs.writeFileSync('facturas/factura' + id + '.xml', xml);
                                console.log('Se ha escrito en el archivo');

                                fs.readFile('FirmaCorrecta.pfx', (err, data) => {
                                    if (err) throw err;
                                    var archivop12 = data;
                                    firmarComprobante(archivop12, 'Solsito2204', xml, id);
                                });

                                //FIN DEL PROCESO FACTURACION ELECTRONICA        
                                //res.status(200).send({ message: 'Factura ' + movfactura.secmovcab + ' a sido firmada y enviada correctamente' });
                                res.status(200).send({ message: "Facturado correctamente factura" });
                            } else {
                                res.status(200).send({ message: 'No se encontro la factura enviada' });
                                //0103326336S
                            }
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

function BuscarCliente(idcliente) {
    //CONSULTA DE DATOS DEL CLIENTE
    clientes
        .findOne({
            where: {
                idcliente: idcliente,
            },
        })
        .then((cliente) => {
            //console.log("ESTE ES TU CLIENTE DESDE EL METODO: " + cliente.nomcliente);
            var clienteEncontrado = cliente;
            console.log(clienteEncontrado.nomcliente);
            return cliente.nomcliente;
        })
        .catch((err) => {
            return err;
        });
}

function armadoXml() {

}

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

    console.log(btoa(pkcs8));
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

    console.log(sha1_comprobante);

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

    return comprobante.replace(/(<[^<]+)$/, xades_bes + '$1');
}

//FUNCION ERRONEA CORREGIR -- NO ESTA GENERANDO BIEN EL HASH

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