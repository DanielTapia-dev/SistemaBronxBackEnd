const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'alejodanny94@gmail.com', // generated ethereal user
        pass: 'kdcohbpaenxcfvxe', // generated ethereal password
    },
});

transporter.verify().then(() => {
    console.log('Ready for send emails');
});

/* async function enviarEmail() {
    await transporter.sendMail({
        from: '"Email de prueba" <alejodanny94@gmail.com>', // sender address
        to: "gorlekk@gmail.com", // list of receivers
        subject: "Prueba", // plain text body
        html: `
        <b>Hola amigo este es un email de prueba a ver si estamos funcionando</b>
        `, // html body
    });
} */

module.exports = {
    transporter
};