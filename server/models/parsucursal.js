module.exports = (sequelize, DataTypes) => {
    const parsucursal = sequelize.define('parsucursal', {
        idempresa: DataTypes.STRING,
        idsucursal: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        nomsucursal: DataTypes.STRING,
        activo: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER
    }, {
        freezeTableName: true
    });

    return parsucursal;
}