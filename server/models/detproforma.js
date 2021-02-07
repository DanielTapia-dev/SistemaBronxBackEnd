module.exports = (sequelize, DataTypes) => {
    const detproforma = sequelize.define('detproforma', {
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        secmovdet: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        secmovcab: DataTypes.INTEGER,
        idproducto: DataTypes.STRING,
        cantidad: DataTypes.INTEGER,
        precio: DataTypes.FLOAT,
        subsindesc: DataTypes.FLOAT,
        porcdescuento: DataTypes.INTEGER,
        descuento: DataTypes.FLOAT,
        subtotal: DataTypes.FLOAT,    
        iva0: DataTypes.FLOAT,
        iva12: DataTypes.FLOAT,
        total: DataTypes.FLOAT,
        estado: DataTypes.STRING,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        estado: DataTypes.STRING
    }, {
        freezeTableName: true
    });

    return detproforma;
}