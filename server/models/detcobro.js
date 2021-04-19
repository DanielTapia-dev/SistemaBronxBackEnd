module.exports = (sequelize, DataTypes) => {
    const detcobro = sequelize.define('detcobro', {
        secdetcob: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        seccabcob: DataTypes.INTEGER,
        idformapago: DataTypes.STRING,
        valorcobro: DataTypes.FLOAT,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        estado: DataTypes.STRING,
    }, {
        freezeTableName: true
    });

    return detcobro;
}