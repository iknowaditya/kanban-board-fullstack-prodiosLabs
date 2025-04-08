# 🧠 Kanban Board App

A modern and minimal **Kanban Board** application built with **React**, **Express**, and **MongoDB**. It features:

- ✅ Drag-and-Drop tasks across lists (DND)
- 🔐 JWT-based Authentication (Access & Refresh Tokens)
- 🚦 Task Priority Badges (Low, Medium, High)
- 📝 Task Editing with due dates and descriptions
- 🔥 Real-time Toast Notifications
- 🌐 `.env`-based Backend URL configuration
- 🎨 Fully Responsive with modern UI using TailwindCSS

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/174b332a-0430-4802-826c-e95dc99aee75)

> (Add images or GIFs of the board UI here if available)

---

## 🚀 Tech Stack

### Frontend

- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Axios](https://axios-http.com/)
- [@dnd-kit](https://dndkit.com/) – Drag and Drop

### Backend

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- JWT Auth with refresh tokens

---

## 📁 Folder Structure (Frontend)



---

## 🔧 Environment Variables

Create a `.env` file in the **frontend root (`client/.env`)**:

```env
VITE_API_BASE_URL=http://localhost:5000/api

✅ Features

🧩 Drag-and-drop tasks between columns

🗓️ Add/edit due dates

🚨 Priority tagging with color badges

✨ Real-time toast notifications (using react-hot-toast)

🔐 Auth with login/register/logout using JWT

☁️ Easy deployment-ready structure


🔐 Authentication Flow
JWT access token stored in memory

Refresh token stored in HTTP-only cookies

Refresh token automatically renews access token

Protected routes with Bearer token headers


📌 API Endpoints (Backend)
Base URL: http://localhost:5000/api

Auth
POST /auth/register

POST /auth/login

POST /auth/logout

GET /auth/refresh

Tasks
GET /tasks/:listId

POST /tasks

PUT /tasks/:id

DELETE /tasks/:id

Lists
GET /lists

POST /lists

PUT /lists/:id

DELETE /lists/:id

