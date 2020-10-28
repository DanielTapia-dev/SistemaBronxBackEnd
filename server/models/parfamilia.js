module.exports = (sequelize, DataTypes) => {
    const parfamilia = sequelize.define('parfamilia', {
        idempresa: DataTypes.STRING,
        idfamilia: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        nomfamilia: DataTypes.STRING,
        idcuenta: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        activo: DataTypes.BOOLEAN,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        freezeTableName: true
    });

    return parfamilia;
}