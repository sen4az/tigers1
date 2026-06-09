import { Bot } from 'grammy';
import { config, isOperator } from './config.js';

export const bot = new Bot(config.botToken);

bot.command('start', async (ctx) => {
  const id = ctx.from?.id;
  if (isOperator(id)) {
    await ctx.reply('Operator console connected.\nNew exchange tickets will arrive here.');
  } else {
    await ctx.reply('Welcome to Tigers One Exchange.\nOpen the app to start an exchange.');
  }
});

bot.command('whoami', async (ctx) => {
  const id = ctx.from?.id;
  await ctx.reply(`Your Telegram ID: ${id}\nRole: ${isOperator(id) ? 'operator' : 'client'}`);
});

bot.catch((err) => { console.error('[bot] error:', err); });