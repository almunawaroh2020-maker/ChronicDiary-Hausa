CHRONICDIARY HAUSA VOICE DEMO — VERCEL DEPLOYMENT

CONTENTS
- index.html: your existing ChronicDiary interface with Hausa language selection, N-ATLaS translation, Hausa speech playback, and API-based voice transcription.
- api/naija.js: Vercel serverless proxy. The API key is NOT stored in the HTML.
- vercel.json: Vercel function configuration.

DEPLOY
1. Extract the ZIP. The extracted folder must contain index.html, vercel.json, and the api folder at its top level.
2. Deploy with Vercel CLI from that folder (Windows PowerShell or terminal):
   npm install -g vercel
   cd path\to\ChronicDiary_Hausa_Demo
   vercel
   Follow the prompts to create/link the Vercel project. For production, run: vercel --prod
   Alternatively, push this folder to GitHub and import that repository in Vercel.
3. In Vercel, open Project → Settings → Environment Variables.
4. Add:
   Name: NAIJA_ASR_KEY
   Value: YOUR_NEW_NAIJA_SPEECH_API_KEY
   Environment: Production (also Preview if needed)
5. Save, then redeploy the project. The API key must not be pasted into index.html.
6. Open the deployed HTTPS URL on Chrome, choose Hausa, and allow microphone access.

DEMO FEATURES
- English / Hausa language selector.
- Hausa text-to-speech for Listen buttons and the measurement/user-guidance pages.
- Hausa/English voice recording and transcription using the selected language.
- Translate button beside every enhanced text/select/textarea voice control. Translation is shown separately; choose Use translation to replace the field.
- Condition selection has voice dictation and translation controls.
- English fallback remains available.

IMPORTANT DEMO NOTES
- The API key shared in the chat should be treated as exposed. Revoke it and create a fresh key in the Naija Speech dashboard, then add the fresh key as NAIJA_ASR_KEY in Vercel.
- This demo uses a Vercel serverless function to keep the key out of the browser.
- Voice recording is limited to 45 seconds in the interface and about 2.8 MB per upload because of Vercel request-size limits.
- The speech API supports Hausa and English. Select the language actually being spoken before recording; automatic language detection is not available.
- API translation is not a substitute for professional review. Verify all clinical Hausa translations with a fluent Hausa-speaking health professional before real-world use.
- The existing ChronicDiary data model and local browser storage have not been redesigned by this integration.
- Do not enter real patient data into this demonstration.

TEST CHECKLIST
[ ] Vercel deployment opens over HTTPS.
[ ] NAIJA_ASR_KEY environment variable is set and project redeployed.
[ ] Choose Hausa; open Profile & Guidance → Measurement instructions; Hausa translation appears.
[ ] Press Saurari umarnin; Hausa audio plays.
[ ] Enable microphone; dictate a short Hausa sentence into a diary note; transcript appears in the field.
[ ] Press Translate; English translation appears separately; Use translation inserts it.
[ ] Switch to English; English dictation and browser read-aloud still work.
[ ] Check translation/read controls beside medication, diary, activity and measurement fields.
