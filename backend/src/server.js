import express from 'express';

export const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'tigersone-backend', ts: Date.now() });
});