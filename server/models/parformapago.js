module.exports = (sequelize, DataTypes) => {
    const parformapago = sequelize.define('parformapago', {
        idempresa: DataTypes.STRING,
        idformapago: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        nomformapago: DataTypes.STRING,
        idcuenta: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        activo: DataTypes.BOOLEAN,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        freezeTableName: true
    });

    return parformapago;
}