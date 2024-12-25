const sequelize = require('sequelize') //Importa a biblioteca Sequelize
const connection = require('./database') //Importa a conexão com o banco de dados

const resposta = connection.define('resposta', {
    corpo:{
        type:sequelize.TEXT,
        allowNull: false
    },
    perguntaId:{
        type:sequelize.INTEGER,
        allowNull: false
    }
})

resposta.sync({force: false}).then(()=>{
    console.log("Tabela de respostas criada!")
})

module.exports = resposta