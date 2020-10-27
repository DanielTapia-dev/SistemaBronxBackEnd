module.exports = (sequelize, DataTypes) => {
    const contplancuentas = sequelize.define('contplancuentas', {
        idempresa: DataTypes.STRING,
        idcuenta: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        nomcuenta: DataTypes.STRING,
        nivelcuenta: DataTypes.STRING,
        cuentapadre: DataTypes.STRING,
        tipocuenta: DataTypes.BOOLEAN,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        activo: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        freezeTableName: true
    });

    return contplancuentas;
}