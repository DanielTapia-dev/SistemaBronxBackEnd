module.exports = (sequelize, DataTypes) => {
    const parempresa = sequelize.define('parempresa', {
        idempresa: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        ambiente: DataTypes.STRING,        
        wsdl1: DataTypes.STRING,
        wsdl2: DataTypes.STRING,
        clientessuc: DataTypes.BOOLEAN,
        activo: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
    }, {
        freezeTableName: true
    });
    return parempresa;
}