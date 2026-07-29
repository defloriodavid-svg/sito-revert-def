# REVERT Lookbook

Sito statico React/Vite per mostrare la collezione REVERT. Non contiene prezzi, carrello o pagamenti.

## Avvio su Windows

```bash
npm install
npm run dev
```

Apri l'indirizzo mostrato dal terminale, in genere `http://localhost:5173`.

## Dove sostituire o aggiungere immagini

1. Copia i nuovi PNG in `public/images/`.
2. Apri `src/data/products.js`.
3. Modifica il campo `image`, per esempio:

```js
image: "/images/nuova-maglia.png"
```

Per aggiungere un prodotto, duplica uno degli oggetti nell'array `products` e modifica `slug`, `title`, `category`, `image` e `description`.

## Pubblicazione

Il progetto può essere pubblicato su Vercel, Netlify o Cloudflare Pages. Prima esegui:

```bash
npm run build
```
