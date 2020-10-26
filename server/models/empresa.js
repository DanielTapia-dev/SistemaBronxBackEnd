module.exports = (sequelize, DataTypes) => {
    const empresa = sequelize.define('empresa', {
        idempresa: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        nomempresa: DataTypes.STRING,
        rucciempresa: DataTypes.STRING,
        paisempresa: DataTypes.STRING,
        dirempresa: DataTypes.STRING,
        logoempresa: DataTypes.STRING,
        monempresa: DataTypes.STRING,
        decempresa: DataTypes.INTEGER,
        telf1empresa: DataTypes.STRING,
        telf2empresa: DataTypes.STRING,
        email1empresa: DataTypes.STRING,
        email2empresa: DataTypes.STRING,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        nomcomercial: DataTypes.STRING,
        activo: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        freezeTableName: true
    });

    return empresa;
}