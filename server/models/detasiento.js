module.exports = (sequelize, DataTypes) => {
    const detasiento = sequelize.define('detasiento', {
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        seccabasi: DataTypes.INTEGER,
        secdetasi: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        idcuenta: DataTypes.STRING,
        debe: DataTypes.FLOAT,
        haber: DataTypes.FLOAT,
        estado: DataTypes.STRING,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    }, {
        freezeTableName: true
    });

    return detasiento;
}