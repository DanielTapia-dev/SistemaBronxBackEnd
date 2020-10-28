module.exports = (sequelize, DataTypes) => {
    const parunidad = sequelize.define('parunidad', {
        idempresa: DataTypes.STRING,
        idunidad: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        nomunidad: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        activo: DataTypes.BOOLEAN,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        freezeTableName: true
    });

    return parunidad;
}