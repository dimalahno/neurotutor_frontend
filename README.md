---

# NeuroTutor Frontend (React + Vite + TypeScript + MUI)

Минимальный фронтенд для MVP NeuroTutor.
Стек: **React + TypeScript + Vite + Material UI**.

---

## 🚀 Быстрый старт

### 1. Установить Node.js (LTS)

Скачать: [https://nodejs.org](https://nodejs.org)
Проверить:

```bash
node -v
npm -v
```

---

## 📦 Установка зависимостей

```bash
cd neurotutor_frontend
npm install
```

---

## ▶️ Запуск проекта (dev)

```bash
npm run dev
```

После запуска:

```
http://localhost:5173
```

---

## 🗂️ Структура проекта

```
frontend/
  src/
    App.tsx
    main.tsx
    index.css
  public/
  vite.config.ts
  package.json
  tsconfig.json
```

Основные библиотеки:

* React + TypeScript
* Vite (быстрая сборка)
* Material UI (`@mui/material`, `@mui/icons-material`)
* Emotion (`@emotion/react`, `@emotion/styled`)

---

## 🧱 Темизация MUI

Входной файл `main.tsx` содержит:

* `<ThemeProvider>`
* `createTheme()` с цветами бренда
* `<CssBaseline />`

---

## 🛠 Сборка Production

```bash
npm run build
```

Артефакты появятся в:

```
dist/
```

---

## 🧼 Дополнительно

* можно подключить React Router
* можно создать layout с MUI (`AppBar`, `Container`)
* API-клиент для FastAPI добавляется через axios / fetch

---

