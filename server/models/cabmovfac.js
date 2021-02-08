module.exports = (sequelize, DataTypes) => {
    const cabmovfac = sequelize.define('cabmovfac', {
        secmovcab: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        idcaja: DataTypes.STRING,
        idserie: DataTypes.STRING,
        idcliente: DataTypes.STRING,
        fechaingreso: DataTypes.DATE,
        fechaaprob: DataTypes.DATE,
        numfactura: DataTypes.STRING,
        numautosri: DataTypes.STRING,
        fechaautsri: DataTypes.DATE,
        subsindesc: DataTypes.FLOAT,
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
        porcdescuento: DataTypes.INTEGER
    }, {
        freezeTableName: true
    });

    return cabmovfac;
}