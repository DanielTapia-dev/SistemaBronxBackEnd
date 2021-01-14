module.exports = (sequelize, DataTypes) => {
    const parserie = sequelize.define('parserie', {
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        idserie: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        tipserie: DataTypes.STRING,        
        ptoemision: DataTypes.STRING,
        ptofacturacion: DataTypes.STRING,
        secuencia: DataTypes.FLOAT,
        activo: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
    }, {
        freezeTableName: true
    });
    return parserie;
}