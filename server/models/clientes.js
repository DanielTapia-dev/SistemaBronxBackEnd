module.exports=(sequelize,DataTypes)=>{
    const clientes=sequelize.define('clientes',{
        idempresa: DataTypes.STRING,
        idcliente: {
            primaryKey:true,
            type:DataTypes.STRING,
        },
        idencliente: DataTypes.STRING,
        ruccicliente: DataTypes.STRING,
        nocliente: DataTypes.STRING,
        dircliente: DataTypes.STRING,
        teflcliente: DataTypes.STRING,
        emailcliente: DataTypes.STRING,
        crepor: DataTypes.INTEGER,
        modpor: DataTypes.INTEGER,
        idsucursal: DataTypes.STRING,
        activo: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    return clientes;
}