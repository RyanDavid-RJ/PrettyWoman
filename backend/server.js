const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
// NOVOS:
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const porta = process.env.PORT || 3000;

// Permite que o seu HTML (Frontend) converse com a API sem bloqueios de segurança
app.use(cors());

// Permite que a API receba os dados das coordenadas em formato JSON
app.use(express.json());

// Cria a pasta "uploads" automaticamente se ela não existir
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// Configuração do Multer (Cria o nome do arquivo com a data atual para não repetir)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// PERMISSÃO MÁGICA: Permite que o frontend acesse a pasta uploads livremente
app.use('/uploads', express.static('uploads'));

// 1. Criando a conexão com o banco de dados (Preparado para a Nuvem com SSL e POOL)
const conexao = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'alunolab', 
    database: process.env.DB_NAME || 'power_soccer',
    port: process.env.DB_PORT || 3303,
    ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : null,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 2. Testando a conexão na hora que o servidor ligar (CORRIGIDO PARA POOL)
conexao.getConnection((erro, connection) => {
    if (erro) {
        console.error('❌ Erro ao conectar no MySQL:', erro.message);
        return;
    }
    console.log('✅ Conexão com o banco power_soccer estabelecida com sucesso!');
    connection.release(); // Libera a conexão de volta para o Pool
});

// 3. Rota de teste para ver se a API está viva
app.get('/', (req, res) => {
    res.json({ mensagem: 'A API do Scout Power Soccer está rodando!' });
});

// Rota para salvar a ação do jogo
app.post('/api/eventos', (req, res) => {
    const { partida_id, atleta_id, usuario_id, minuto_video, tipo_acao, coord_x, coord_y, jogador_entrou_id } = req.body;
    
    const sql = `INSERT INTO eventos_scout (partida_id, atleta_id, usuario_id, periodo, minuto_video, tipo_acao, coord_x, coord_y, jogador_entrou_id) 
                 VALUES (?, ?, ?, '1º Tempo', ?, ?, ?, ?, ?)`;
    
    conexao.query(sql, [partida_id, atleta_id, usuario_id, minuto_video, tipo_acao, coord_x || null, coord_y || null, jogador_entrou_id || null], (erro, resultados) => {
        if (erro) {
            console.error('Erro ao salvar no banco:', erro);
            return res.status(500).json({ erro: 'Erro interno ao salvar' });
        }
        res.status(201).json({ mensagem: 'Ação salva!', id_registro: resultados.insertId });
    });
});

// Rota para buscar as Estatísticas Globais dos Jogadores
app.get('/api/estatisticas', (req, res) => {
    const sql = `
        SELECT 
            a.nome AS atleta,
            SUM(CASE WHEN e.tipo_acao = 'Passe Certo' THEN 1 ELSE 0 END) AS passes_certos,
            SUM(CASE WHEN e.tipo_acao = 'Passe Errado' THEN 1 ELSE 0 END) AS passes_errados,
            SUM(CASE WHEN e.tipo_acao = 'Interceptação' THEN 1 ELSE 0 END) AS interceptacoes,
            SUM(CASE WHEN e.tipo_acao = 'Finalização' THEN 1 ELSE 0 END) AS finalizacoes,
            SUM(CASE WHEN e.tipo_acao = 'Gol' THEN 1 ELSE 0 END) AS gols
        FROM atletas a
        LEFT JOIN eventos_scout e ON a.id = e.atleta_id
        GROUP BY a.id, a.nome
        ORDER BY gols DESC, passes_certos DESC;
    `;

    conexao.query(sql, (erro, resultados) => {
        if (erro) {
            console.error('Erro ao buscar estatísticas:', erro);
            return res.status(500).json({ erro: 'Erro interno' });
        }
        res.json(resultados);
    });
});

// Rota para buscar os lances de uma partida específica (para redesenhar o mapa)
app.get('/api/eventos/partida/:id', (req, res) => {
    const idPartida = req.params.id;
    const sql = `
        SELECT e.*, a.nome AS nome_atleta 
        FROM eventos_scout e
        JOIN atletas a ON e.atleta_id = a.id
        WHERE e.partida_id = ?
    `;
    
    conexao.query(sql, [idPartida], (erro, resultados) => {
        if (erro) return res.status(500).json({ erro: 'Erro ao buscar lances' });
        res.json(resultados);
    });
});

// Rota para deletar um lance específico
app.delete('/api/eventos/:id', (req, res) => {
    const idLance = req.params.id;
    const sql = 'DELETE FROM eventos_scout WHERE id = ?';

    conexao.query(sql, [idLance], (erro, resultados) => {
        if (erro) {
            console.error('Erro ao deletar:', erro);
            return res.status(500).json({ erro: 'Erro ao deletar o lance' });
        }
        res.json({ mensagem: 'Lance deletado com sucesso!' });
    });
});

// Rota para ATUALIZAR (Alterar) um lance
app.put('/api/eventos/:id', (req, res) => {
    const idLance = req.params.id;
    const { tipo_acao, minuto_video } = req.body;
    
    const sql = 'UPDATE eventos_scout SET tipo_acao = ?, minuto_video = ? WHERE id = ?';

    conexao.query(sql, [tipo_acao, minuto_video, idLance], (erro, resultados) => {
        if (erro) return res.status(500).json({ erro: 'Erro ao atualizar' });
        res.json({ mensagem: 'Lance atualizado com sucesso!' });
    });
});

// Rota para CADASTRAR JOGADOR com foto
app.post('/api/atletas', upload.single('foto'), (req, res) => {
    const { nome, numero_camisa } = req.body;
    
    // Se o cara mandou foto, guarda o caminho. Se não, fica null
    const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Cadastra fixo na equipe 1 (Seleção Brasileira) por enquanto
    const sql = 'INSERT INTO atletas (nome, numero_camisa, equipe_id, foto) VALUES (?, ?, 1, ?)';
    
    conexao.query(sql, [nome, numero_camisa, fotoPath], (erro, resultados) => {
        if (erro) {
            console.error('Erro ao cadastrar jogador:', erro);
            return res.status(500).json({ erro: 'Erro interno ao salvar jogador' });
        }
        res.status(201).json({ mensagem: 'Atleta cadastrado com sucesso!', id: resultados.insertId });
    });
});

// Rota para BUSCAR todos os atletas cadastrados
app.get('/api/atletas', (req, res) => {
    const sql = 'SELECT * FROM atletas ORDER BY id ASC';
    conexao.query(sql, (erro, resultados) => {
        if (erro) {
            console.error('Erro ao buscar atletas:', erro);
            return res.status(500).json({ erro: 'Erro ao buscar atletas' });
        }
        res.json(resultados);
    });
});

// ==========================================
// NOVAS ROTAS: PERFIL DO JOGADOR
// ==========================================

// 1. Busca as Estatísticas de UM jogador específico
app.get('/api/estatisticas/atleta/:id', (req, res) => {
    const idAtleta = req.params.id;
    const sql = `
        SELECT 
            a.id, a.nome, a.numero_camisa, a.foto,
            SUM(CASE WHEN e.tipo_acao = 'Passe Certo' THEN 1 ELSE 0 END) AS passes_certos,
            SUM(CASE WHEN e.tipo_acao = 'Passe Errado' THEN 1 ELSE 0 END) AS passes_errados,
            SUM(CASE WHEN e.tipo_acao = 'Interceptação' THEN 1 ELSE 0 END) AS interceptacoes,
            SUM(CASE WHEN e.tipo_acao = 'Finalização' THEN 1 ELSE 0 END) AS finalizacoes,
            SUM(CASE WHEN e.tipo_acao = 'Gol' THEN 1 ELSE 0 END) AS gols
        FROM atletas a
        LEFT JOIN eventos_scout e ON a.id = e.atleta_id
        WHERE a.id = ?
        GROUP BY a.id;
    `;
    conexao.query(sql, [idAtleta], (erro, resultados) => {
        if (erro) return res.status(500).json({ erro: 'Erro interno' });
        res.json(resultados[0] || {});
    });
});

// 2. Busca TODOS os eventos de UM jogador (Para o Mapa de Calor Pessoal)
app.get('/api/eventos/atleta/:id', (req, res) => {
    const idAtleta = req.params.id;
    const sql = 'SELECT * FROM eventos_scout WHERE atleta_id = ? AND coord_x IS NOT NULL';
    conexao.query(sql, [idAtleta], (erro, resultados) => {
        if (erro) return res.status(500).json({ erro: 'Erro ao buscar lances do atleta' });
        res.json(resultados);
    });
});

// 3. Deletar um Jogador
app.delete('/api/atletas/:id', (req, res) => {
    const idAtleta = req.params.id;
    conexao.query('DELETE FROM eventos_scout WHERE atleta_id = ? OR jogador_entrou_id = ?', [idAtleta, idAtleta], () => {
        conexao.query('DELETE FROM atletas WHERE id = ?', [idAtleta], (erro) => {
            if (erro) return res.status(500).json({ erro: 'Erro ao deletar atleta' });
            res.json({ mensagem: 'Atleta deletado com sucesso!' });
        });
    });
});

// ==========================================
// ROTA DE LOGIN (Versão à Prova de Balas)
// ==========================================
app.post('/api/login', (req, res) => {
    console.log("1. Recebi requisição de login:", req.body);
    const { email, nome } = req.body;

    if (!email) {
        console.error("Erro: Email não fornecido pelo Front-end!");
        return res.status(400).json({ sucesso: false, erro: "Email não fornecido" });
    }

    const sqlBusca = 'SELECT * FROM usuarios WHERE email = ?';
    conexao.query(sqlBusca, [email], (err, results) => {
        if (err) {
            console.error("2. ERRO FATAL no BD ao buscar usuário:", err);
            return res.status(500).json({ sucesso: false, erro: "Erro interno no BD" });
        }

        if (results.length > 0) {
            console.log("3. Usuário encontrado no BD:", results[0].nome);
            return res.json({ sucesso: true, usuario: results[0] });
        } else {
            console.log("3. Usuário novo! Tentando cadastrar o email:", email);
            const sqlInsert = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
            
            conexao.query(sqlInsert, [nome || 'Usuário Google', email, 'google-auth'], (err2, resultInsert) => {
                if (err2) {
                    console.error("4. ERRO FATAL ao inserir novo usuário:", err2);
                    return res.status(500).json({ sucesso: false, erro: "Erro ao criar usuário" });
                }
                console.log("4. Sucesso! Novo usuário criado com ID:", resultInsert.insertId);
                return res.json({ sucesso: true, usuario: { id: resultInsert.insertId, nome, email } });
            });
        }
    });
});

// ROTA PARA CRIAR NOVA PARTIDA
app.post('/api/partidas', (req, res) => {
    const { data_jogo, adversario, escalacao } = req.body;
    
    const sql = 'INSERT INTO partidas (data_jogo, adversario, escalacao) VALUES (?, ?, ?)';
    
    conexao.query(sql, [data_jogo, adversario, JSON.stringify(escalacao)], (erro, resultados) => {
        if (erro) {
            console.error('Erro ao criar partida:', erro);
            return res.status(500).json({ erro: 'Erro ao criar partida' });
        }
        res.status(201).json({ mensagem: 'Partida criada!', id_partida: resultados.insertId });
    });
});

// ROTA PARA BUSCAR PARTIDAS ANTERIORES
app.get('/api/partidas', (req, res) => {
    const sql = 'SELECT * FROM partidas ORDER BY data_jogo DESC, id DESC';
    conexao.query(sql, (erro, resultados) => {
        if (erro) return res.status(500).json({ erro: 'Erro ao buscar partidas' });
        res.json(resultados);
    });
});

// 4. Ligando o servidor
app.listen(porta, () => {
    console.log(`🚀 Servidor rodando na porta: ${porta}`);
});