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
        razonsocial: DataTypes.STRING,
        logoempresa: DataTypes.STRING,
        monempresa: DataTypes.STRING,
        decempresa: DataTypes.INTEGER,
        telf1empresa: DataTypes.STRING,
        telf2empresa: DataTypes.STRING,
        email1empresa: DataTypes.STRING,
        email2empresa: DataTypes.STRING,
        contabilidad: DataTypes.STRING,
        ambiente: DataTypes.STRING,
        wsdl1: DataTypes.STRING,
        wsdl2: DataTypes.STRING,
        clientessuc: DataTypes.BOOLEAN,
        productossuc: DataTypes.BOOLEAN,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        nomcomercial: DataTypes.STRING,
        modeloFE: DataTypes.STRING,
        activo: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        logobase64: DataTypes.STRING,
        logonegrobase64: DataTypes.STRING
    }, {
        freezeTableName: true
    });

    return empresa;
}