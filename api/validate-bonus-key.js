// Função serverless (Vercel). Roda no servidor — o navegador do aluno nunca vê as chaves válidas.
//
// Configuração necessária no painel da Vercel (Project → Settings → Environment Variables):
//   Nome:  BONUS_ACCESS_KEYS
//   Valor: uma ou mais chaves separadas por vírgula, ex.: BONUS5-6UPZU8,BONUS5-AB12CD
//   (não marcar como NEXT_PUBLIC_ — deve ficar visível só no servidor)
//
// Se você preferir usar só uma chave, pode usar BONUS_ACCESS_KEY no lugar de BONUS_ACCESS_KEYS.
// Depois de criar/alterar a variável, é preciso fazer um novo deploy para ela valer.
//
// Preparado para o futuro: quando você integrar um webhook do checkout, essa mesma função pode
// passar a consultar um banco de dados / KV em vez de uma variável de ambiente fixa, gerando uma
// chave nova por comprador automaticamente — a interface (POST {key} → {valid}) não muda.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ valid: false, error: 'method_not_allowed' });
    return;
  }

  let body = req.body;
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch { body = {}; }
  }

  const key = String((body && body.key) || '').trim();
  if (!key) {
    res.status(400).json({ valid: false, error: 'missing_key' });
    return;
  }

  const raw = process.env.BONUS_ACCESS_KEYS || process.env.BONUS_ACCESS_KEY || '';
  const validKeys = raw.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);

  const valid = validKeys.includes(key.toLowerCase());
  res.status(200).json({ valid });
};
