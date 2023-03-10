module.exports = (sequelize, DataTypes) => {
    const clientes = sequelize.define('clientes', {
        idempresa: DataTypes.STRING,
        idcliente: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.STRING,
        },
        idencliente: DataTypes.STRING,
        ruccicliente: DataTypes.STRING,
        nomcliente: DataTypes.STRING,
        dircliente: DataTypes.STRING,
        telfcliente: DataTypes.STRING,
        emailcliente: DataTypes.STRING,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        idsucursal: DataTypes.STRING,
        activo: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        idcliente_pertenece: DataTypes.STRING,
        tipocliente:  DataTypes.STRING
    });

    return clientes;
};