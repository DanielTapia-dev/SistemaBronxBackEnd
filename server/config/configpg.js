/* const config = {
  user: "postgres",
  host: "localhost",
  password: "dannyalejo7123tapia",
  database: "thebronx",
}; */

const config = {
  user: "yagtgymbcvesov",
  host: "ec2-54-157-79-121.compute-1.amazonaws.com",
  password: "8b217138a90568e116f31050328001a6353c765e962319c618ea060d4ba70812",
  database: "d5dt248035saq7",
  ssl: {
    rejectUnauthorized: false,
  },
};

module.exports = {
  config,
};


/* Produccion */

/* 
  {
    "development": {
        "username": "yagtgymbcvesov",
        "password": "8b217138a90568e116f31050328001a6353c765e962319c618ea060d4ba70812",
        "database": "d5dt248035saq7",
        "host": "ec2-54-157-79-121.compute-1.amazonaws.com",
        "dialect": "postgres"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "contable",
        "host": "127.0.0.1",
        "dialect": "postgres"
    },
    "production": {
        "username": "yagtgymbcvesov",
        "password": "8b217138a90568e116f31050328001a6353c765e962319c618ea060d4ba70812",
        "database": "d5dt248035saq7",
        "host": "ec2-54-157-79-121.compute-1.amazonaws.com",
        "dialect": "postgres",
        "dialectOptions": {
            "ssl": {
                "require": true,
                "rejectUnauthorized": false
            }
        }
    },
    "token_secret": "123ABc456r%SERT987o_"
}
*/

/* Pruebas */

/* 
  {
    "development": {
        "username": "postgres",
        "password": "dannyalejo7123tapia",
        "database": "thebronx",
        "host": "localhost",
        "dialect": "postgres"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "contable",
        "host": "127.0.0.1",
        "dialect": "postgres"
    },
    "production": {
        "username": "yagtgymbcvesov",
        "password": "8b217138a90568e116f31050328001a6353c765e962319c618ea060d4ba70812",
        "database": "d5dt248035saq7",
        "host": "ec2-54-157-79-121.compute-1.amazonaws.com",
        "dialect": "postgres",
        "dialectOptions": {
            "ssl": {
                "require": true,
                "rejectUnauthorized": false
            }
        }
    },
    "token_secret": "123ABc456r%SERT987o_"
}
*/