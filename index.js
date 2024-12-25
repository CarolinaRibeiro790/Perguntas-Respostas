//Importa o módulo express e cria uma instância do aplicativo Express (app)
const express = require("express");
const app = express();

//Importa o módulo body-parser, que é um middleware para manipular dados no corpo das requisições HTTP (como POST)
const bodyParser = require('body-parser')

//Configura o body-parser para tratar dados de formulários HTML (urlencoded) e dados em formato JSON (json), permitindo que sejam acessados no req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Conexão com o Banco de Dados 
const connection = require('./database/database')
const perguntaModel = require('./database/pergunta')
const respostaModel = require('./database/resposta')

//const pergunta = require("./database/pergunta");

//Tenta autenticar a conexão com o banco de dados e, se bem-sucedido, exibe uma mensagem de sucesso no console. Caso contrário, exibe uma mensagem de erro
connection.
    authenticate().
    then(() => {
        console.log("Conectado ao banco de dados!")
    })
    .catch((msgErro) => {
        console.log("msgErro")
    })


//Configurações de Visualização: define o EJS como o motor de visualização, permitindo que arquivos .ejs sejam renderizados em respostas.
app.set('view engine', 'ejs');

//Define a pasta public como a pasta de arquivos estáticos (CSS, JS, imagens) que o Express vai servir automaticamente.
app.use(express.static('public'));


//Rota para Deletar uma Resposta: esta rota recebe um id da URL e deleta a resposta correspondente no banco de dados. Após deletar, o usuário é redirecionado para a página anterior
app.get('/resposta/delete/:id', (req, res)=>{
    var id = req.params.id
    respostaModel.destroy({
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect('back')
    })
})

//Rota para Criar uma Resposta: Esta rota POST recebe dados de um formulário para criar uma resposta (corpo) associada a uma pergunta (perguntaId). Ele salva a resposta no banco de dados e redireciona o usuário de volta à página da pergunta.
app.post('/responder', (req, res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta
    
    respostaModel.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/question/' + perguntaId)
    })
})

//Rota para Salvar uma Pergunta: Recebe os dados de um formulário para salvar uma pergunta no banco de dados. Depois de criar a pergunta, redireciona o usuário para a página inicial.
app.post('/savequestion', (req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    // res.send('Formulário Recebido! Titulo: ' + titulo + ' com descrição ' + descricao);
    perguntaModel.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/')
    })
});

//Rota para Exibir a Página de Criação de Pergunta: Renderiza a página para criar uma nova pergunta, usando o arquivo question.ejs
app.get('/question', (req, res) => {
    res.render('question');
});

//Rota para Exibir Detalhes de uma Pergunta Específica:  
//Recebe o id da pergunta na URL, busca a pergunta correspondente no banco de dados e, se encontrada, também busca todas as respostas associadas. Renderiza uma página detalhepergunta.ejs com os detalhes da pergunta e as respostas. Se a pergunta não for encontrada, redireciona o usuário para a página inicial.
app.get('/question/:id', (req, res) => {
    var id = req.params.id

    perguntaModel.findOne({
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) {
            respostaModel.findAll({
                where: { perguntaId: pergunta.id },
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render('detalhepergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        } else {
            res.redirect('/')
        }
    })})


    //Rota para Listar Perguntas na Página Inicial: Esta é a rota para a página inicial (/). Ele busca todas as perguntas no banco de dados e renderiza a página index.ejs, passando as perguntas para serem exibidas.
    app.get('/', (req, res) => {
        //select * from perguntas
        perguntaModel.findAll({ raw: true, order: [['id', 'DESC']] }).then(perguntas => {
            res.render('index', {
                perguntas: perguntas
            })
        })
    });

    //Inicialização do Servidor
    app.listen(8181, function (erro) {
        if (erro) {
            console.log("Erro");
        } else {
            console.log("Servidor iniciado...");
        }
    }); 
