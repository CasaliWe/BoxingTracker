import nodemailer from 'nodemailer';

// Configurar o transportador de e-mail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true, // true para porta 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Template HTML para a recuperação de senha
const passwordResetTemplate = (password: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Senha - VibeBoxing</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid #f0f0f0;
    }
    .header h1 {
      color: #7856FF;
      margin: 0;
    }
    .content {
      padding: 20px 0;
    }
    .password-box {
      background-color: #f0f0f0;
      padding: 15px;
      border-radius: 5px;
      font-size: 18px;
      text-align: center;
      margin: 20px 0;
      letter-spacing: 1px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #f0f0f0;
      color: #777;
      font-size: 12px;
    }
    .button {
      display: inline-block;
      background-color: #7856FF;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>VibeBoxing</h1>
    </div>
    <div class="content">
      <p>Olá,</p>
      <p>Você solicitou a recuperação de senha para sua conta no VibeBoxing.</p>
      <p>Sua nova senha temporária é:</p>
      <div class="password-box">${password}</div>
      <p>Por razões de segurança, recomendamos que você altere esta senha após o login.</p>
      <p>Para alterar sua senha, acesse seu perfil no VibeBoxing e clique em "Alterar minha senha".</p>
      <p style="text-align: center;">
        <a href="http://localhost:5000/login" class="button">Acessar VibeBoxing</a>
      </p>
    </div>
    <div class="footer">
      <p>Esta é uma mensagem automática. Por favor, não responda a este e-mail.</p>
      <p>&copy; 2025 VibeBoxing. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
`;

// Função para enviar e-mail de recuperação de senha
export async function sendPasswordResetEmail(to: string, password: string): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Recuperação de Senha - VibeBoxing',
      html: passwordResetTemplate(password),
    });

    console.log('Email enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return false;
  }
}

// Função para gerar uma senha aleatória
export function generateRandomPassword(length = 8): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}