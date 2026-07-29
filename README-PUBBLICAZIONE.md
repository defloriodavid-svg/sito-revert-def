# Pubblicazione REVERT su Vercel

## Impostazioni Vercel
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Dominio reale
Prima del deploy definitivo aggiungi in Vercel, in **Settings → Environment Variables**:

`VITE_SITE_URL=https://dominio-reale.it`

Il valore deve iniziare con `https://` e non deve terminare con `/`. Dopo averlo modificato, esegui un Redeploy. La build genera automaticamente `sitemap.xml` e `robots.txt` con il dominio impostato.

## Indicizzazione Google
Dopo che il dominio è collegato e il sito è online:
1. aggiungi la proprietà dominio in Google Search Console;
2. invia `https://dominio-reale.it/sitemap.xml`;
3. usa Controllo URL sulla home e richiedi l'indicizzazione;
4. verifica che `/robots.txt` e `/sitemap.xml` si aprano nel browser.

Google decide autonomamente tempi e posizionamento. Il progetto fornisce la base tecnica per scansione e indicizzazione.
