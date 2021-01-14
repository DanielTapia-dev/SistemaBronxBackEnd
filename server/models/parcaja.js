module.exports = (sequelize, DataTypes) => {
    const parcaja = sequelize.define('parcaja', {
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        idserie: DataTypes.STRING,
        idcaja: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        nomcaja: DataTypes.STRING,        
        activo: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
    }, {
        freezeTableName: true
    });
    return parcaja;
}