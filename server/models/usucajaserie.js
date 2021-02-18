module.exports = (sequelize, DataTypes) => {
    const usucajaserie = sequelize.define('usucajaserie', {
        idempresa: DataTypes.STRING,
        idsucursal: DataTypes.STRING,
        sectabla: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        idusuario: DataTypes.INTEGER,        
        idcaja: DataTypes.STRING,
        idserie: DataTypes.STRING,
        activo: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
    }, {
        freezeTableName: true
    });
    return usucajaserie;
}