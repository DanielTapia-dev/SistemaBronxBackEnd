module.exports = (sequelize, DataTypes) => {
    const cabasiento = sequelize.define('cabasiento', {
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        seccabasi: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        tipoasi: DataTypes.STRING,
        numasiento: DataTypes.INTEGER,
        descripasi: DataTypes.STRING,
        fechaingreso: DataTypes.DATE,
        fechaaprob: DataTypes.DATE,
        estado: DataTypes.STRING,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    }, {
        freezeTableName: true
    });

    return cabasiento;
}