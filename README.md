# RHM Chatbot UI - Hướng dẫn cài đặt và chạy

## Tổng quan

RHM Chatbot UI là một ứng dụng web frontend được xây dựng bằng Next.js 15 để tương tác với chatbot y tế. Ứng dụng hỗ trợ xác thực người dùng, quản lý vai trò, và giao diện chat thời gian thực.

## Công nghệ sử dụng

- **Framework**: Next.js 15.5.0 với React 19.1.0
- **Ngôn ngữ**: TypeScript
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: Radix UI
- **Authentication**: Custom auth với JWT
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Themes**: next-themes (hỗ trợ dark/light mode)
- **Icons**: Lucide React
- **Markdown**: react-markdown với remark-gfm

## Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 hoặc **yarn** >= 1.22.0
- **Backend API**: Cần có backend API chạy trên port 8000 (mặc định)

## Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd chatbot-rhm-ui
```

### 2. Cài đặt dependencies

```bash
npm install
```

hoặc

```bash
yarn install
```

### 3. Cấu hình biến môi trường

Tạo file `.env.local` trong thư mục gốc của project:

```env
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# NextAuth Configuration (nếu cần)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

**Lưu ý**: Nếu backend API chạy trên port khác, hãy thay đổi `NEXT_PUBLIC_API_URL` cho phù hợp.

### 4. Cấu hình Backend API

Đảm bảo backend API đang chạy và có các endpoints sau:

- `POST /api/auth/login` - Đăng nhập
- `GET /api/roles` - Lấy danh sách vai trò
- `GET /api/threads` - Lấy danh sách cuộc trò chuyện
- `POST /api/threads` - Tạo cuộc trò chuyện mới
- `GET /api/threads/{threadId}` - Lấy chi tiết cuộc trò chuyện
- `PUT /api/threads/{threadId}/rename` - Đổi tên cuộc trò chuyện
- `DELETE /api/threads/{threadId}` - Xóa cuộc trò chuyện
- `POST /api/chat` - Gửi tin nhắn chat

## Chạy ứng dụng

### Development Mode

```bash
npm run dev
```

hoặc

```bash
yarn dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Production Build

```bash
# Build ứng dụng
npm run build

# Chạy production server
npm run start
```

## Cấu trúc thư mục

```
chatbot-rhm-ui/
├── app/                          # Next.js App Router
│   ├── components/              # Shared components
│   │   ├── ClientCookiesProvider.tsx
│   │   ├── mode-toggle.tsx
│   │   └── ThemeProvider.tsx
│   ├── dashboard/               # Dashboard pages và components
│   │   ├── components/          # Dashboard-specific components
│   │   │   ├── app-sidebar.tsx  # Sidebar navigation
│   │   │   ├── chat-input.tsx   # Chat input component
│   │   │   ├── chat-messages.tsx # Chat messages display
│   │   │   ├── chat.tsx         # Main chat component
│   │   │   ├── header.tsx       # Dashboard header
│   │   │   ├── nav-threads.tsx  # Thread navigation
│   │   │   └── nav-user.tsx     # User navigation
│   │   ├── new-chat/           # New chat page
│   │   ├── thread/[threadId]/  # Dynamic thread pages
│   │   ├── layout.tsx          # Dashboard layout
│   │   └── page.tsx            # Dashboard home page
│   ├── login/                  # Login page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/                 # Reusable UI components
│   └── ui/                    # Shadcn/ui components
├── hooks/                     # Custom React hooks
├── lib/                       # Utilities và services
│   ├── auth-context.tsx       # Authentication context
│   ├── chat-api.js           # Chat API client
│   ├── chat-context.tsx      # Chat state management
│   ├── roles-service.ts      # Role management service
│   └── utils.ts              # Utility functions
├── types/                     # TypeScript type definitions
│   ├── auth.ts               # Authentication types
│   ├── chat.ts               # Chat types
│   └── role.ts               # Role types
├── assets/                    # Static assets
├── public/                    # Public files
└── middleware.ts              # Next.js middleware for auth
```

## Tính năng chính

### 1. Xác thực người dùng (Authentication)
- Đăng nhập bằng email/password
- JWT token authentication
- Middleware bảo vệ routes
- Auto redirect sau khi đăng nhập/đăng xuất
- Session persistence với localStorage và cookies

### 2. Quản lý vai trò (Role Management)
- Hỗ trợ nhiều vai trò người dùng
- Role selection trong chat
- Dynamic role loading từ API

### 3. Giao diện Chat
- Real-time messaging
- Thread management (tạo, đổi tên, xóa)
- Message history
- Markdown support trong tin nhắn
- Suggestions và summary từ API
- Responsive design

### 4. UI/UX Features
- Dark/Light theme toggle
- Responsive sidebar
- Modern UI với Radix components
- Loading states
- Error handling

## API Integration

Ứng dụng tương tác với backend qua các API endpoints:

### Authentication
```javascript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Response
{
  "access_token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Chat
```javascript
// Send message
POST /api/chat
{
  "message": "Tôi bị đau đầu",
  "role": "default",
  "session_id": "thread-id"
}
```

### Threads
```javascript
// Get threads
GET /api/threads

// Create thread
POST /api/threads
{
  "name": "Cuộc trò chuyện mới"
}
```

## Troubleshooting

### 1. Lỗi kết nối API
- Kiểm tra backend API có đang chạy không
- Xác nhận `NEXT_PUBLIC_API_URL` trong `.env.local`
- Kiểm tra CORS settings trên backend

### 2. Lỗi authentication
- Xóa localStorage: `localStorage.clear()`
- Xóa cookies và thử đăng nhập lại
- Kiểm tra JWT token có hợp lệ không

### 3. Lỗi build
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### 4. Lỗi TypeScript
```bash
# Check types
npx tsc --noEmit
```

## Scripts có sẵn

```json
{
  "dev": "next dev --turbopack",     // Development với Turbopack
  "build": "next build --turbopack", // Production build
  "start": "next start",             // Start production server
  "lint": "eslint"                   // Run ESLint
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |
| `NEXTAUTH_SECRET` | NextAuth secret key | - |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |

## Browser Support

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## Performance Optimizations

- Turbopack được enable cho development và build
- React 19 với concurrent features
- Code splitting với Next.js App Router
- Image optimization với Next.js Image component
- CSS optimization với Tailwind CSS

## Security Features

- JWT token authentication
- HTTP-only cookies cho session
- CSRF protection với middleware
- Input sanitization
- XSS protection

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Deployment
```bash
npm run build
npm run start
```

## Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Tạo Pull Request

## Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra documentation này
2. Xem issues trên GitHub
3. Tạo issue mới với thông tin chi tiết

---

**Phiên bản**: 0.1.0  
**Cập nhật lần cuối**: September 2025
