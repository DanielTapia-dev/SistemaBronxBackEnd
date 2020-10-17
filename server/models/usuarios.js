module.exports = (sequelize, DateTypes) => {
    const usuarios = sequelize.define('usuarios', {
        idempresa: DateTypes.STRING,
        idusuario: {
            autoincrement: true,
            primaryKey: true,
            type: DateTypes.INTEGER
        },
        usuario: DateTypes.STRING,
        password: DateTypes.STRING,
        idrol: DateTypes.INTEGER,
        activo: DateTypes.BOOLEAN,
        crepor: DateTypes.STRING,
        modpor: DateTypes.STRING,
        createdat: DateTypes.DATE,
        updatedat: DateTypes.DATE
    });

    return usuarios;

}