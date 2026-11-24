# Instruções para o Claude neste repositório

- Fale em português com o Lucas. Ele não é programador: explique em termos simples.
- Este é o portal (justletmein2.github.io): só uma página com botões para os jogos.
  Cada jogo é um site separado, com repositório próprio:
  - Forma Palavras: `justletmein2/forma-palavras` → /forma-palavras/
  - Pé na Tábua: `justletmein2/pe-na-tabua` → /pe-na-tabua/
  - Cripta de Cristal: `justletmein2/cripta-de-cristal` → /cripta-de-cristal/
  - Torre Bamba: `justletmein2/torre-bamba` → /torre-bamba/
  - Palhetada: `justletmein2/palhetada` → /palhetada/ (o repositório ainda não existe: o bloco do jogo está fora de `site/index.html` até ele ir ao ar)
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
