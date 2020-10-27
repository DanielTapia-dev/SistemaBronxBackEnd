module.exports = (sequelize, DataTypes) => {
    const planestructura = sequelize.define('planestructura', {
        idempresa: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        estr1cuenta: DataTypes.INTEGER,
        estr2cuenta: DataTypes.INTEGER,
        estr3cuenta: DataTypes.INTEGER,
        estr4cuenta: DataTypes.INTEGER,
        estr5cuenta: DataTypes.INTEGER,
        estr6cuenta: DataTypes.INTEGER,
        sepestrucuenta: DataTypes.STRING,
        longcuenta: DataTypes.INTEGER,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        freezeTableName: true
    });

    return planestructura;
}