const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// Aumenta o limite de tamanho do corpo da requisição para 50MB
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, './src')));

app.post('/salvar-imagem', (req, res) => {
    const imagemBase64 = req.body.imagem;
    const imagemBuffer = Buffer.from(imagemBase64.split(',')[1], 'base64');
    const datas = Date.now()
    console.log(datas)
    const nomeArquivo = 'imagem_' + datas + '.png';
    const caminhoArquivo = path.join(__dirname, './src/imagens', nomeArquivo);

    fs.writeFile(caminhoArquivo, imagemBuffer, (err) => {
        if (err) {
            console.error('Erro ao salvar imagem:', err);
            res.status(500).send('Erro ao salvar imagem.');
        } else {
            console.log('Imagem salva com sucesso em:', caminhoArquivo);
            const urlImagem = `http://localhost:3000/imagens/${nomeArquivo}`;
            res.json({ url: urlImagem });
        }
    });
});


app.post('/subscribe', (req, res) => {
    const email = req.body.email;
    // Configure o transporte SMTP
    let transporter = nodemailer.createTransport({
        host: 'smtp.casaselu.com.br', // Servidor SMTP
        port: 587, // Porta do servidor SMTP
        secure: false, // true para usar a porta 465 com SSL, false para usar a porta 587 com STARTTLS
        auth: {
            user: 'vendas@casaselu.com.br', // Endereço de e-mail
            pass: '20#Design' // Senha do e-mail
        },
        tls: {
            rejectUnauthorized: false // Desabilita a verificação do nome alternativo do certificado
        }
    });
    
    // Configurações de e-mail
    let mailOptions = {
        from: 'vendas@casaselu.com.br', // Endereço de e-mail do remetente
        to: 'vendas@casaselu.com.br', // Endereço de e-mail do destinatário
        subject: 'Nova inscrição',
        text: `Nova inscrição recebida: ${email}`
    };
    
    // Envie o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Failed to send email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
