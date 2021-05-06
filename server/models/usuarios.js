module.exports = (sequelize, DateTypes) => {
    const usuarios = sequelize.define('usuarios', {
        idempresa: DateTypes.STRING,
        idusuario: {
            autoIncrement: true,
            primaryKey: true,
            type: DateTypes.INTEGER
        },
        usuario: DateTypes.STRING,
        password: DateTypes.STRING,
        idrol: DateTypes.INTEGER,
        activo: DateTypes.BOOLEAN,
        crepor: DateTypes.INTEGER,
        modpor: DateTypes.INTEGER,
        createdAt: DateTypes.DATE,
        updatedAt: DateTypes.DATE,
        nomusuario: DateTypes.STRING,
        emailusuario: DateTypes.STRING,
    });

    return usuarios;

}