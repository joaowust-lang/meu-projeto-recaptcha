require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/enviar', async (req, res) => {
  const { nome, email, token } = req.body;

  if (!token) {
    return res.status(400).json({ sucesso: false, mensagem: 'Token reCAPTCHA ausente.' });
  }

  try {
    // Valida o token junto aos servidores do Google
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const googleResponse = await fetch(verifyUrl, { method: 'POST' });
    const googleData = await googleResponse.json();

    if (googleData.success) {
      // Aqui você processa o formulário (envia e-mail, salva no banco, etc.)
      console.log(`Dados válidos recebidos de: ${nome} (${email})`);
      return res.json({ sucesso: true, mensagem: 'Formulário enviado com sucesso!' });
    } else {
      return res.status(400).json({ sucesso: false, mensagem: 'Falha na verificação do reCAPTCHA.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
