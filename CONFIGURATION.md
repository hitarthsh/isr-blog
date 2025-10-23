# Configuration Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# WordPress Configuration
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
WORDPRESS_USERNAME=your-username
WORDPRESS_PASSWORD=your-application-password

# Ghost Configuration
GHOST_API_URL=https://your-ghost-site.com
GHOST_CONTENT_API_KEY=your-ghost-content-api-key

# CreativityCoder Configuration
ISR_REVALIDATE_TIME=3600
```

## WordPress Setup

1. **Enable REST API**: Ensure your WordPress site has the REST API enabled (default in WordPress 4.7+)
2. **Create Application Password**:
   - Go to WordPress Admin → Users → Your Profile
   - Scroll down to "Application Passwords"
   - Create a new application password
   - Use this password in the `WORDPRESS_PASSWORD` variable

## Ghost Setup

1. **Enable Content API**: Ensure your Ghost site has the Content API enabled
2. **Generate API Key**:
   - Go to Ghost Admin → Settings → Integrations
   - Create a new integration
   - Copy the Content API key
   - Use this key in the `GHOST_CONTENT_API_KEY` variable

## CreativityCoder Configuration

- **ISR_REVALIDATE_TIME**: Time in seconds between content revalidation (default: 3600 = 1 hour)
- Lower values = more frequent updates but higher server load
- Higher values = less frequent updates but better performance

## Testing Configuration

After setting up your environment variables, test the configuration:

1. Start the development server: `npm run dev`
2. Visit `/api/posts` to test WordPress integration
3. Visit `/api/posts?source=ghost` to test Ghost integration
4. Check the browser console for any API errors
