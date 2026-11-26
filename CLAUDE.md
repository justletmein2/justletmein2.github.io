# Instruções para o Claude neste repositório

- Fale em português com o Lucas. Ele não é programador: explique em termos simples.
- Este é o portal (justletmein2.github.io): só uma página com botões para os jogos.
  Cada jogo é um site separado, com repositório próprio:
  - Forma Palavras: `justletmein2/forma-palavras` → /forma-palavras/
  - Pé na Tábua: `justletmein2/pe-na-tabua` → /pe-na-tabua/
  - Cripta de Cristal: `justletmein2/cripta-de-cristal` → /cripta-de-cristal/
  - Torre Bamba: `justletmein2/torre-bamba` → /torre-bamba/
  - Palhetada: `justletmein2/palhetada` → /palhetada/
- Não crie aqui pastas com o mesmo nome dos jogos (`forma-palavras`, `pe-na-tabua`, `cripta-de-cristal`, `torre-bamba`, `palhetada`):
  isso taparia o site do jogo.
- Nunca coloque o Aura Battle (`duels-game`) aqui sem o Lucas pedir.
- `main` é o que está no ar (publicado pelo GitHub Actions, pasta `site/`).

## Portal com o boneco

- `site/index.html` + `site/hub.js`: a "sala" com a TV e o boneco do jogador. Tocar num jogo mostra na TV
  e o boneco reage (falas em `FALAS` no hub.js); tocar de novo entra no jogo. A sala encolhe ao rolar.
- O boneco, a animação (piscar/falar) e a tela de personalizar vêm do Forma Palavras:
  `/forma-palavras/js/avatar.js`, `boneco-vivo.js` e `boneco-editor.js`. O perfil é um só
  (Firebase `cacapalavras/profiles/{uid}`), então personalizar aqui muda em todos os jogos.
- Jogo novo: um bloco `<a class="jogo" data-jogo=...>` no index.html e as falas dele no hub.js.

## Compartilhar

- Botão de compartilhar no topo (esquerda) e o cartão "Chama alguém pra jogar" (WhatsApp/compartilhar + copiar link).
  No celular usa a lista de apps do sistema; no PC abre o WhatsApp Web.
- A prévia do link (WhatsApp etc.) vem das tags `og:` no `<head>` e da imagem `site/compartilhar.jpg` (1200x630, < 300 KB).
  Mudou a imagem? Troque o nome do arquivo (o WhatsApp guarda a prévia antiga por um tempo).
