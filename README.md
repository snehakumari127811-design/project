# Viral Raja - Video Streaming Platform

A modern, fast, and scalable adult video streaming platform built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Public Features (No Login Required)
- Browse videos by category
- Search videos
- Watch videos with HD streaming
- Like videos
- Comment on videos
- Report inappropriate content
- Trending, latest, and recommended sections
- Mobile-responsive design
- Age verification gate

### Admin Features (Authenticated Access)
- Admin dashboard with analytics
- Upload and manage videos
- Moderate comments
- Review and manage reports
- Delete videos and comments
- Category management
- View engagement metrics

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (database is already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. The environment variables are already configured in `.env`

3. Run the development server:
```bash
npm run dev
```

## Admin Access

### Setting Up an Admin Account

Since admin accounts use Supabase Authentication, you need to create an admin user:

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Users
3. Click "Add User" or "Invite User"
4. Enter admin email and password
5. The admin can then sign in at the Admin Portal (accessible via the "Admin" link at the bottom right)

### Admin Portal Features

**Dashboard**
- View total videos, views, likes, and pending reports
- Quick access to all admin functions

**Upload Video**
- Add new videos with title, description, category
- Set video URL and thumbnail URL
- Specify duration

**Video Management**
- View all uploaded videos
- Delete videos
- View video statistics

**Report Management**
- Review user-submitted reports
- Mark reports as reviewed, resolved, or ignored
- Take action on reported content

**Comment Moderation**
- View all comments
- Hide inappropriate comments
- Delete spam or offensive comments

## Database Schema

The platform uses the following tables:

- `admins` - Admin user accounts
- `categories` - Video categories
- `videos` - Video metadata and URLs
- `comments` - User comments on videos
- `likes` - Video likes (tracked by IP)
- `reports` - User-submitted reports

## Security Features

- Row Level Security (RLS) enabled on all tables
- Admin-only write access to videos and categories
- Public read access for content
- IP-based like tracking to prevent spam
- Comment moderation system
- Report review system

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for future file uploads)
- **Build Tool**: Vite

## Usage

### For Public Users

1. Accept age verification (18+)
2. Browse videos on homepage
3. Use search or categories to filter
4. Click any video to watch
5. Like, comment, or report videos
6. No account required for basic features

### For Admins

1. Click "Admin" link at bottom right
2. Sign in with admin credentials
3. Access dashboard to manage platform
4. Upload videos, moderate content, review reports
5. View analytics and engagement metrics

## Development

Build for production:
```bash
npm run build
```

Run type checking:
```bash
npm run typecheck
```

Run linter:
```bash
npm run lint
```

## License

All rights reserved © 2026 Viral Raja

## Important Notes

- This platform is intended for legal adult content only
- All content must comply with applicable laws
- Implement proper DMCA takedown procedures
- Ensure age verification compliance
- Regular moderation is essential
- Follow platform usage policies

## Support

For issues or questions, contact the development team or refer to the documentation.
