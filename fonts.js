const pdfFonts = require('pdfmake/build/vfs_fonts.js');
const pdfMake = require('pdfmake/build/pdfmake.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

module.exports = {
    Roboto: {
        normal: Buffer.from(
            require("pdfmake/build/vfs_fonts.js").pdfMake.vfs["Roboto-Regular.ttf"], "base64"
        ),
        bold: Buffer.from(
            require("pdfmake/build/vfs_fonts.js").pdfMake.vfs["Roboto-Medium.ttf"], "base64"
        )
    }
};