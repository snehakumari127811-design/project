# Viral Raja Setup Guide

## Quick Start

### 1. Environment Setup

The `.env` file is already configured with your Supabase credentials. The platform is ready to use.

### 2. Database Setup

The database schema has been automatically created with the following tables:
- `admins` - For admin authentication
- `categories` - Video categories (pre-populated)
- `videos` - Video metadata
- `comments` - User comments
- `likes` - Video likes
- `reports` - User reports

### 3. Create Your First Admin User

To access the admin panel, you need to create an admin account:

**Option 1: Using Supabase Dashboard**
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Click **"Add User"**
5. Enter:
   - Email: `admin@viralraja.com` (or your preferred email)
   - Password: Create a strong password
   - Email Confirm: Toggle ON
6. Click **"Create User"**

**Option 2: Using SQL (Advanced)**
```sql
-- In your Supabase SQL Editor, run:
-- This creates a user in the auth system
-- You'll need to use the Supabase Dashboard for this
```

### 4. Access the Admin Panel

1. Open your application
2. Click the **"Admin"** link in the bottom-right corner
3. Sign in with your admin credentials
4. You'll be redirected to the Admin Dashboard

### 5. Upload Your First Video

1. From the Admin Dashboard, click **"Upload Video"**
2. Fill in the video details:
   - **Title**: Enter a descriptive title
   - **Description**: Add video description
   - **Category**: Select from pre-populated categories
   - **Video URL**: Enter the full URL to your video file
     - Example: `https://example.com/videos/sample.mp4`
     - Or use a CDN URL
   - **Thumbnail URL**: Enter the thumbnail image URL
     - Example: `https://example.com/thumbnails/sample.jpg`
   - **Duration**: Enter video duration in seconds
3. Click **"Upload Video"**

### 6. Video Storage Options

For production use, you have several options for hosting videos:

**Option 1: Supabase Storage (Recommended)**
1. Go to Supabase Dashboard → Storage
2. Create a new bucket called `videos`
3. Set it to public
4. Upload your video files
5. Use the generated public URL in the "Video URL" field

**Option 2: External CDN**
- Cloudflare R2
- AWS S3 + CloudFront
- Any CDN service that provides public URLs

**Option 3: Direct URL**
- If you have videos hosted elsewhere, just paste the direct URL

### 7. Managing Categories

Default categories are already created:
- Popular
- Trending
- Featured
- Latest
- Most Viewed
- Recommended

To add custom categories, you can use the Supabase SQL Editor:
```sql
INSERT INTO categories (name, slug) VALUES
  ('Your Category', 'your-category');
```

### 8. Testing the Platform

1. **Public View**:
   - Accept the age verification prompt
   - Browse videos on the homepage
   - Click a video to watch
   - Test like, comment, and report features

2. **Admin View**:
   - Check analytics on dashboard
   - Upload test videos
   - Moderate comments
   - Review reports

## Common Issues

### Can't Sign In to Admin Panel
- Verify your user was created in Supabase Authentication
- Check that email and password are correct
- Ensure your Supabase project is active

### Videos Not Loading
- Check that video URLs are accessible
- Verify URLs are direct links to video files
- Ensure videos are in a web-compatible format (MP4, WebM)
- Check browser console for CORS errors

### Database Errors
- Verify `.env` file has correct Supabase credentials
- Check Supabase project status
- Review Row Level Security policies in Supabase

## Security Checklist

- [ ] Change default admin email
- [ ] Use strong passwords for admin accounts
- [ ] Enable Supabase email verification (optional)
- [ ] Review and test RLS policies
- [ ] Set up proper CORS for video hosting
- [ ] Implement rate limiting for comments/reports
- [ ] Add CAPTCHA to prevent spam (future enhancement)
- [ ] Regular backup of database
- [ ] Monitor for inappropriate content
- [ ] Implement DMCA takedown procedures

## Performance Tips

1. **Use a CDN** for video delivery
2. **Compress thumbnails** to reduce load times
3. **Enable caching** on video files
4. **Use adaptive bitrate streaming** for better user experience
5. **Optimize images** before uploading
6. **Monitor database performance** in Supabase

## Next Steps

1. Customize the design and branding
2. Add more categories relevant to your content
3. Upload initial video library
4. Set up analytics tracking
5. Implement email notifications for reports
6. Add user accounts (optional future feature)
7. Implement subscription/monetization (optional)

## Support

For technical issues:
- Check the browser console for errors
- Review Supabase logs
- Verify all environment variables
- Test with different videos/formats

## Production Deployment

Before going live:
1. Review all security settings
2. Test on multiple devices and browsers
3. Set up proper domain and SSL
4. Configure CDN for global delivery
5. Set up monitoring and alerts
6. Implement backup strategy
7. Review legal compliance
8. Test age verification flow
9. Prepare moderation guidelines
10. Train admin team on platform usage

---

Your Viral Raja platform is now ready to use! Start by creating your admin account and uploading your first videos.
