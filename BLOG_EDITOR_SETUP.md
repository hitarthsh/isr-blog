# Blog Editor Connection Setup

This guide will help you connect your blog platform to WordPress and Ghost CMS editors.

## Quick Start

1. **Access Admin Panel**: Visit `/admin` in your browser
2. **Configure Connections**: Use the connection test tools to verify your credentials
3. **Follow Setup Guide**: Use the built-in setup guide for step-by-step instructions

## Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```env
# WordPress Configuration
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
WORDPRESS_USERNAME=your-username
WORDPRESS_PASSWORD=your-application-password

# Ghost Configuration
GHOST_API_URL=https://your-ghost-site.com
GHOST_CONTENT_API_KEY=your-ghost-content-api-key

# CreativityCoder Configuration (optional)
ISR_REVALIDATE_TIME=3600
```

## WordPress Setup

### Step 1: Enable REST API

- The WordPress REST API is enabled by default in WordPress 4.7+
- If using an older version, update WordPress or install a REST API plugin

### Step 2: Create Application Password

1. Log in to your WordPress Admin dashboard
2. Go to **Users → Your Profile**
3. Scroll down to **"Application Passwords"** section
4. Enter a name for your application (e.g., "Blog Platform")
5. Click **"Add New Application Password"**
6. Copy the generated password (format: `xxxx xxxx xxxx xxxx xxxx xxxx`)

### Step 3: Configure Environment Variables

Add these to your `.env.local` file:

- `WORDPRESS_API_URL`: Your WordPress site URL + `/wp-json/wp/v2`
- `WORDPRESS_USERNAME`: Your WordPress username
- `WORDPRESS_PASSWORD`: The application password you created

## Ghost CMS Setup

### Step 1: Enable Content API

- The Ghost Content API is enabled by default in Ghost 2.0+
- Make sure your Ghost site is up to date

### Step 2: Generate API Key

1. Log in to your Ghost Admin dashboard
2. Go to **Settings → Integrations**
3. Click **"Add custom integration"**
4. Enter a name for your integration (e.g., "Blog Platform")
5. Click **"Create integration"**
6. Copy the **Content API Key** (format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### Step 3: Configure Environment Variables

Add these to your `.env.local` file:

- `GHOST_API_URL`: Your Ghost site URL (without trailing slash)
- `GHOST_CONTENT_API_KEY`: The Content API key you generated

## Testing Connections

### Using the Admin Panel

1. Visit `/admin` in your browser
2. Use the **"Test Connections"** button to check current configuration
3. Use the **Connection Configuration** tools to test new credentials before saving

### Using the API

```bash
# Test all connections
curl http://localhost:3000/api/admin/test-connections

# Test WordPress credentials
curl -X POST http://localhost:3000/api/admin/test-connections \
  -H "Content-Type: application/json" \
  -d '{
    "action": "test-credentials",
    "platform": "wordpress",
    "credentials": {
      "apiUrl": "https://your-site.com/wp-json/wp/v2",
      "username": "your-username",
      "password": "your-app-password"
    }
  }'

# Test Ghost credentials
curl -X POST http://localhost:3000/api/admin/test-connections \
  -H "Content-Type: application/json" \
  -d '{
    "action": "test-credentials",
    "platform": "ghost",
    "credentials": {
      "apiUrl": "https://your-ghost-site.com",
      "contentApiKey": "your-api-key"
    }
  }'
```

## Troubleshooting

### Common WordPress Issues

- **401 Unauthorized**: Check your username and application password
- **404 Not Found**: Verify your API URL includes `/wp-json/wp/v2`
- **403 Forbidden**: Ensure the user has proper permissions

### Common Ghost Issues

- **401 Unauthorized**: Check your Content API key
- **404 Not Found**: Verify your Ghost site URL
- **403 Forbidden**: Ensure the Content API is enabled

### General Issues

- **Environment variables not loading**: Restart your development server
- **CORS errors**: Check if your CMS allows requests from your domain
- **Rate limiting**: Some APIs have rate limits; wait and try again

## Features

### Admin Panel Features

- **Real-time Connection Testing**: Test credentials before saving
- **Connection Status Monitoring**: See which platforms are connected
- **Detailed Error Messages**: Get specific error information for debugging
- **Interactive Setup Guide**: Step-by-step instructions for each platform

### API Features

- **Unified Content Access**: Access WordPress and Ghost content through a single API
- **Incremental Static Regeneration**: Automatic content updates with CreativityCoder
- **Advanced Search**: Search across all connected platforms
- **Type Safety**: Full TypeScript support for all APIs

## Security Notes

- Never commit your `.env.local` file to version control
- Use application passwords for WordPress, not your regular password
- Regularly rotate your API keys
- Monitor your API usage for unusual activity

## Support

If you encounter issues:

1. Check the admin panel for detailed error messages
2. Verify your credentials using the connection test tools
3. Ensure your CMS platforms are properly configured
4. Check the browser console for additional error details

For more information, visit the admin panel at `/admin` for interactive setup guidance.
