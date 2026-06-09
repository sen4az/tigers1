import { app } from './server.js';
import { bot } from './bot.js';
import { config } from './config.js';

app.listen(config.port, () => {
  console.log(`[http] listening on http://localhost:${config.port}`);
  console.log(`[http] health: http://localhost:${config.port}/health`);
});

bot.start({
  onStart: (info) => {
    console.log(`[bot] @${info.username} started (long polling)`);
    if (config.operatorIds.length === 0) {
      console.warn('[bot] OPERATOR_IDS is empty — set it in .env to test as operator.');
    }
  },
});

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());