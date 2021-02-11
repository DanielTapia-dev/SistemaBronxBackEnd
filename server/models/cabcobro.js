module.exports = (sequelize, DataTypes) => {
    const cabcobro = sequelize.define('cabcobro', {
        seccabcob: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        idcliente: DataTypes.STRING,
        secmovcab: DataTypes.INTEGER,
        fechaingreso: DataTypes.DATE,
        fechaaprob: DataTypes.DATE,
        valorcobro: DataTypes.FLOAT,
        retcobro: DataTypes.FLOAT,
        estado: DataTypes.STRING,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    }, {
        freezeTableName: true
    });

    return cabcobro;
}