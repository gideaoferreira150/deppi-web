# DEPPI-Web

Front-end do DEPPI (Next.js).

    npm install
    npm run dev

Abre em http://localhost:3000.

- **API:** as chamadas passam pelo proxy `/api-proxy`, configurado em `next.config.mjs`.
- **Permissões:** `src/permissoes.js` (menu e rotas por cargo); a checagem fica em `src/app/(painel)/layout.jsx`.
- **Chamadas ao back:** `src/services/api.js` (`ROTAS`, `login`, `buscarResumo`).
- **Telas pendentes:** aparecem como "em construção" em `src/app/(painel)/[tela]/page.jsx`.
