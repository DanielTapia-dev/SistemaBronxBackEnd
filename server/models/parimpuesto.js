module.exports = (sequelize, DataTypes) => {
    const parimpuesto = sequelize.define('parimpuesto', {
        idempresa: DataTypes.STRING,
        idimpuesto: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        fechaini: DataTypes.DATE,
        fechafin: DataTypes.DATE,
        nomimpuesto: DataTypes.STRING,
        porcimpuesto: DataTypes.FLOAT,
        idcuenta: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        activo: DataTypes.BOOLEAN,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        codigoSRI: DataTypes.STRING,
        codporcentajeSRI: DataTypes.STRING
    }, {
        freezeTableName: true
    });

    return parimpuesto;
}