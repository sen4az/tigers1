import 'dotenv/config';

function required(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`\n[config] Missing required env var: ${name}`);
    console.error('[config] Copy .env.example to .env and fill it in.\n');
    process.exit(1);
  }
  return value;
}

export const config = {
  botToken: required('BOT_TOKEN'),
  port: Number(process.env.PORT || 3000),
  operatorIds: (process.env.OPERATOR_IDS || '')
    .split(',').map((s) => s.trim()).filter(Boolean).map(Number),
  operatorChatId: process.env.OPERATOR_CHAT_ID || null,
};

export function isOperator(telegramId) {
  return config.operatorIds.includes(Number(telegramId));
}