module.exports = (sequelize, DataTypes) => {
    const tabprecio = sequelize.define('tabprecio', {
        lisprecio: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        activo: DataTypes.BOOLEAN,
    }, {
        freezeTableName: true
    });
    return tabprecio;
}