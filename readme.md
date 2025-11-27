# BanglaBaari - E-commerce Platform

A modern online marketplace for buying and selling products. Built with Next.js and Express.js.

---

## Links

**Live Site:** [https://bb-frontend-eight.vercel.app](https://bb-frontend-eight.vercel.app)  
**GitHub:** [https://github.com/mdasifmahmuddev/bb-frontend](https://github.com/mdasifmahmuddev/bb-frontend)

---

## Quick Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Google OAuth credentials

### Installation

**Backend Setup**
```bash
cd backend
npm install
```

Create `.env`:
```env
MONGODB_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
npm start
```

**Frontend Setup**
```bash
cd frontend
npm install
```

Create `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Tech Stack

**Frontend:** Next.js 14, NextAuth.js, Tailwind CSS  
**Backend:** Express.js, MongoDB  
**Hosting:** Vercel

---

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Login/Register |
| `/products` | Public | All products |
| `/products/[id]` | Public | Product details |
| `/add-product` | Protected | Add product |
| `/manage-products` | Protected | Manage products |

---

## Landing Page (7 Sections)

1. **Navbar** - Logo, 4+ links, login/register (dropdown after login with user info, add product, manage products)
2. **Hero** - Headline, subtitle, CTA button
3. **Categories** - Product categories with cards
4. **Trending Products** - Featured items grid
5. **Why Choose Us** - Platform benefits
6. **Winter Banner** - Seasonal promotion
7. **Footer** - Links and copyright

---

## Features

**Public**
- Browse and search products
- View product details (image, title, description, price)
- Filter by category
- Responsive on all devices

**Protected (Login Required)**
- Google OAuth authentication
- Add products (title, description, price, image)
- Manage your listings
- Delete products

**UI/UX**
- Hover effects on cards
- Toast notifications
- Loading states
- Mobile-friendly navigation

---

## API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/products` | No |
| GET | `/api/products/:id` | No |
| POST | `/api/products` | Yes |
| DELETE | `/api/products/:id` | Yes |

---

 