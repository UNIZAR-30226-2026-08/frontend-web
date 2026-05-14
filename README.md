# frontend-web

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white&labelColor=20232a)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

Interfaz web del juego **Magnate**, desarrollada en React + TypeScript con Vite. Proyecto de la asignatura Proyecto Software, grupo 08 - Roberta Williams, UNIZAR 2026.

---

## Stack

- React 18 + TypeScript
- Vite
- pnpm
- WebSockets (comunicación en tiempo real con el backend)

---

## Requisitos previos

- Node.js >= 18
- pnpm
- El backend levantado con Redis corriendo ([repositorio backend](https://github.com/UNIZAR-30226-2026-08/backend))

---

## Instalación

```bash
cd magnate
pnpm install
```

---

## Desarrollo

```bash
pnpm run dev
```

La app queda disponible en `http://localhost:5173`.

Para conectar un segundo jugador desde terminal:

```bash
python3 scripts/client.py --url ws://localhost:8000 --session <sessionid> --player_id 2 --mode public
```

---

## Estructura del proyecto

```
frontend-web/
├── .github/workflows/
├── magnate/
│   └── src/
├── docs/
└── README.md
```

---

## Licencia

MIT
