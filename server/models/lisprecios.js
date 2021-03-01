module.exports = (sequelize, DataTypes) => {
    const lisprecios = sequelize.define('lisprecios', {
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        secpre: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        idproducto: DataTypes.INTEGER,
        lisprecio: DataTypes.INTEGER,
        precio:DataTypes.FLOAT,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        activo: DataTypes.BOOLEAN,
    }, {
        freezeTableName: true
    });
    return lisprecios;
}