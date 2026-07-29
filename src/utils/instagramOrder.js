import { INSTAGRAM_USERNAME } from "../config";

// Instagram (a differenza di WhatsApp) non supporta il pre-riempimento del
// testo di un DM tramite link: si può solo aprire la conversazione.
// Per questo il messaggio con l'ordine viene copiato negli appunti, così
// l'utente deve solo incollarlo (Ctrl+V / tieni premuto e Incolla) in chat.
export function buildOrderMessage(items) {
  const lines = items.map((item) => `- ${item.title} x${item.qty}`);

  return [
    "Ciao! Vorrei ordinare:",
    "",
    ...lines,
    "",
    "Fatemi sapere prezzo, disponibilità e come procedere per pagamento e spedizione.",
    "",
    "Nome e indirizzo di spedizione:",
  ].join("\n");
}

export async function copyOrderToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function openInstagramDm() {
  window.open(`https://ig.me/m/${INSTAGRAM_USERNAME}`, "_blank", "noopener,noreferrer");
}
