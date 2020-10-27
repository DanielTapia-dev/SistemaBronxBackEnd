module.exports = (sequelize, DataTypes) => {
    const sucursal = sequelize.define('parsucursal', {
        idempresa: DataTypes.STRING,
        idsucursal: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        nomsucursal: DataTypes.STRING,
        activo: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        freezeTableName: true
    });

    return sucursal;
}