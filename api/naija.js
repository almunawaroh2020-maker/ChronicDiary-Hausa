const MAX_AUDIO_BYTES = 2.8 * 1024 * 1024;
const BASE = 'https://asr.naijallm.com/v1';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: { message: 'Method not allowed.' } });
  const key = process.env.NAIJA_ASR_KEY;
  if (!key) return res.status(503).json({ error: { message: 'Hausa speech is not configured yet. Add NAIJA_ASR_KEY in Vercel Project Settings → Environment Variables, then redeploy.' } });
  try {
    const body = req.body || {};
    const headers = { Authorization: `Bearer ${key}` };
    if (body.action === 'translate') {
      if (!body.text || body.text.length > 2000) return res.status(400).json({ error: { message: 'Text is required and must be 2,000 characters or fewer.' } });
      const upstream = await fetch(`${BASE}/translations`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ text: body.text, source: body.source || 'en', target: body.target || 'ha' }) });
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    }
    if (body.action === 'speech') {
      if (!body.text || body.text.length > 1000) return res.status(400).json({ error: { message: 'Speech text is required and must be 1,000 characters or fewer.' } });
      const upstream = await fetch(`${BASE}/audio/speech`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ input: body.text, language: body.language || 'ha', voice: body.voice || 'hausa_male2', response_format: 'mp3' }) });
      if (!upstream.ok) { let e; try { e = await upstream.json(); } catch (_) { e = { message: 'Text-to-speech service failed.' }; } return res.status(upstream.status).json({ error: e.error || e }); }
      const audio = Buffer.from(await upstream.arrayBuffer());
      return res.status(200).json({ audioBase64: audio.toString('base64'), contentType: upstream.headers.get('content-type') || 'audio/mpeg', voice: upstream.headers.get('x-voice') || body.voice || 'hausa_male2', language: 'ha' });
    }
    if (body.action === 'transcribe') {
      if (!body.audioBase64) return res.status(400).json({ error: { message: 'An audio recording is required.' } });
      const audio = Buffer.from(body.audioBase64, 'base64');
      if (!audio.length || audio.length > MAX_AUDIO_BYTES) return res.status(413).json({ error: { message: 'Recording is empty or exceeds the demo upload limit. Record a shorter clip.' } });
      const form = new FormData();
      const mime = String(body.mimeType || 'audio/webm').split(';')[0];
      const ext = mime.includes('mp4') ? 'm4a' : mime.includes('ogg') ? 'ogg' : mime.includes('wav') ? 'wav' : mime.includes('mpeg') ? 'mp3' : 'webm';
      form.append('file', new Blob([audio], { type: mime }), body.filename || `voice.${ext}`);
      form.append('language', body.language === 'ha' ? 'ha' : 'en');
      const upstream = await fetch(`${BASE}/audio/transcriptions`, { method: 'POST', headers, body: form });
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    }
    return res.status(400).json({ error: { message: 'Unknown action. Use translate, speech or transcribe.' } });
  } catch (error) {
    return res.status(500).json({ error: { message: error?.message || 'Unexpected speech integration error.' } });
  }
};

module.exports.config = { api: { bodyParser: { sizeLimit: '4mb' } } };
