module.exports = (sequelize, DataTypes) => {
    const detmovimientos = sequelize.define('detmovimientos', {
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        secmovcab: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        idproducto: DataTypes.STRING,
        cantidad: DataTypes.INTEGER,
        precio: DataTypes.FLOAT,
        subsindesc: DataTypes.FLOAT,
        porcdescuento: DataTypes.INTEGER,
        descuento: DataTypes.FLOAT,
        subtotal: DataTypes.FLOAT,
        subtotaliva0: DataTypes.FLOAT,
        subtotaliva12: DataTypes.FLOAT,
        iva0: DataTypes.FLOAT,
        iva12: DataTypes.FLOAT,
        total: DataTypes.FLOAT,
        estado: DataTypes.STRING,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {});
    return detmovimientos;
}