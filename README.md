# WeWillDone - Todo App

Todo application built with Vue.js and Node.js

## 🚀 Features

- ✅ User authentication (Register/Login)
- ✅ Create, read, update, delete todos
- ✅ Filter todos (All/Pending/Completed)
- ✅ Real-time todo statistics
- ✅ Responsive design

## 🛠 Tech Stack

**Frontend:**
- Vue.js 3 + TypeScript
- Tailwind CSS
- Axios for API calls

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite Database
- JWT Authentication
- bcryptjs for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- pnpm

### Backend Setup
```bash
cd backend
pnpm install
cp .env.example .env
npx prisma generate
npx prisma db push
pnpm run dev
```

### Frontend Setup
```bash
cd frontend
pnpm install
cp .env.example .env
pnpm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_jwt_secret_here
SALT=10
PORT=3000
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Todos (Protected)
- `GET /api/todos` - Get all todos
- `GET /api/todos/pending` - Get pending todos
- `GET /api/todos/completed` - Get completed todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## 🔒 Authentication

- JWT tokens stored in localStorage
- Automatic token validation
- Protected routes with middleware
- Auto-redirect on token expiry

## 📱 Usage

1. **Register** a new account or **Login** with existing credentials
2. **Add todos** using the input field
3. **Toggle completion** by clicking the checkbox
4. **Filter todos** using the tabs (All/Pending/Completed)
5. **Delete todos** using the trash icon
6. **Logout** using the logout button

## 🏗 Project Structure

```
wewilldone/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── config/
│   └── prisma/
└── frontend/
    ├── src/
    │   ├── views/
    │   ├── api/
    │   └── router/
    └── public/
```

## 🚦 Development

**Start Backend:**
```bash
cd backend && pnpm run dev
```

**Start Frontend:**
```bash
cd frontend && pnpm run dev
```

**View Database:**
```bash
cd backend && npx prisma studio
```

## 📝 License

MIT License
