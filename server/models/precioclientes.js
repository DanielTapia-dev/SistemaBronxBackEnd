module.exports = (sequelize, DataTypes) => {
    const precioclientes = sequelize.define('precioclientes', {
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        secprecli: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        idcliente: DataTypes.INTEGER,
        idproducto: DataTypes.INTEGER,
        precio:DataTypes.FLOAT,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        activo: DataTypes.BOOLEAN,
    }, {
        freezeTableName: true
    });
    return precioclientes;
}