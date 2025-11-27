# BanglaBaari - E-commerce Platform (Frontend)

A modern online marketplace for buying and selling products. Built with Next.js and Express.js.

---

## Links

**Live Site:** [https://bb-frontend-eight.vercel.app](https://bb-frontend-eight.vercel.app)  
**Admin Dashboard:** [https://bb-frontend-eight.vercel.app/admin/login](https://bb-frontend-eight.vercel.app/admin/login)  
**GitHub:** [https://github.com/mdasifmahmuddev/bb-frontend](https://github.com/mdasifmahmuddev/bb-frontend)  
**Backend API:** [https://bb-backend-delta.vercel.app](https://bb-backend-delta.vercel.app)

---

## Quick Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Google OAuth credentials

### Installation

**Frontend Setup**
```bash
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
| `/admin/login` | Public | Admin login |
| `/admin/dashboard` | Admin | Admin dashboard |

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

**Admin Features**
- Separate admin dashboard at `/admin/login`
- Manage all products
- User management
- Admin-only access control

**UI/UX**
- Hover effects on cards
- Toast notifications
- Loading states
- Mobile-friendly navigation

---

## Admin Access

**Admin Login:** [https://bb-frontend-eight.vercel.app/admin/login](https://bb-frontend-eight.vercel.app/admin/login)

Use admin credentials from backend `.env` to access dashboard.

---
 