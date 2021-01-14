module.exports = (sequelize, DataTypes) => {
    const producto = sequelize.define('producto', {
        idempresa: DataTypes.STRING,
        idproducto: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        nomproducto: DataTypes.STRING,
        nomprodcomercial: DataTypes.STRING,
        impnomcomercial: DataTypes.INTEGER,
        idfamilia: DataTypes.STRING,
        idunidad: DataTypes.STRING,
        tipproducto: DataTypes.STRING,
        idimpuesto: DataTypes.STRING,
        precioprodu: DataTypes.FLOAT,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        idsucursal: DataTypes.STRING,
        activo: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        freezeTableName: true
    });

    return producto;
}