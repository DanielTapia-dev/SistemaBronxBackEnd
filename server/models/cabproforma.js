module.exports = (sequelize, DataTypes) => {
    const cabproforma = sequelize.define('cabproforma', {
        secmovcab: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        idcliente: DataTypes.STRING,
        fechaingreso: DataTypes.DATE,
        fechaaprob: DataTypes.DATE,
        subsindesc: DataTypes.FLOAT,
        porcdescuento: DataTypes.INTEGER,
        descuento: DataTypes.FLOAT,
        subtotal: DataTypes.FLOAT,
        subtotaliva0: DataTypes.FLOAT,
        subtotaliva12: DataTypes.FLOAT,
        iva0: DataTypes.FLOAT,
        iva12: DataTypes.FLOAT,
        total: DataTypes.FLOAT,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        estado: DataTypes.STRING,
        abono: DataTypes.FLOAT
    }, {
        freezeTableName: true
    });

    return cabproforma;
}