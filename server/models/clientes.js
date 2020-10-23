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
        telfcliente: DataTypes.STRING,
        emailcliente: DataTypes.STRING,
        crepor: DataTypes.INTEGER,
        fechacre: DataTypes.DATE,
        modpor: DataTypes.INTEGER,
        fechamod: DataTypes.DATE,
        estacliente: DataTypes.INTEGER,
        idsucursal: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    return clientes;
}