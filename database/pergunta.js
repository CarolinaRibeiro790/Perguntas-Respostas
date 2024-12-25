const sequelize = require('sequelize') //Importa a biblioteca Sequelize
const connection = require('./database') //Importa a conexão com o banco de dados

const pergunta = connection.define('pergunta',{
    titulo:{
        type: sequelize.STRING,
        allowNull: false
        //primaryKey: true;
        //autoIncrement: true
    },
    descricao:{
        type: sequelize.TEXT,
        allowNull: false
    }
})

pergunta.sync({force: false}).then(()=>{
    console.log("Tabela de perguntas criadas.")
})

module.exports = pergunta