# Environment Configuration Setup

This CreativityCoder application requires environment variables to connect to WordPress and Ghost APIs. Follow these steps to set up your environment:

## 1. Create Environment File

Create a `.env.local` file in the root directory of your project with the following variables:

```bash
# WordPress Configuration
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
WORDPRESS_USERNAME=your_username
WORDPRESS_PASSWORD=your_app_password

# Ghost Configuration
GHOST_API_URL=https://your-ghost-site.com
GHOST_CONTENT_API_KEY=your_ghost_content_api_key

# CreativityCoder Configuration
ISR_REVALIDATE_TIME=3600
```

## 2. WordPress Setup

### Get WordPress API URL

- Your WordPress API URL is typically: `https://your-site.com/wp-json/wp/v2`

### Create Application Password

1. Go to your WordPress admin dashboard
2. Navigate to **Users > Profile**
3. Scroll down to **Application Passwords**
4. Enter an application name (e.g., "CreativityCoder")
5. Click **Add New Application Password**
6. Copy the generated password (it will look like: `xxxx xxxx xxxx xxxx xxxx xxxx`)
7. Use this as your `WORDPRESS_PASSWORD` (without spaces)

## 3. Ghost Setup

### Get Ghost API URL

- Your Ghost API URL is typically: `https://your-ghost-site.com`

### Create Content API Key

1. Go to your Ghost admin dashboard
2. Navigate to **Settings > Integrations**
3. Click **Add custom integration**
4. Give it a name (e.g., "CreativityCoder")
5. Copy the **Content API Key**
6. Use this as your `GHOST_CONTENT_API_KEY`

## 4. Development Mode

If you don't have WordPress or Ghost configured, the application will automatically fall back to sample data for development purposes.

## 5. Restart Development Server

After creating your `.env.local` file, restart your development server:

```bash
npm run dev
```

## Troubleshooting

- Make sure your `.env.local` file is in the root directory
- Ensure there are no spaces around the `=` sign in your environment variables
- WordPress application passwords are different from your regular login password
- Ghost Content API keys are different from Admin API keys
- Check that your WordPress site has the REST API enabled
- Verify that your Ghost site has the Content API enabled

## Security Notes

- Never commit your `.env.local` file to version control
- The `.env.local` file is already included in `.gitignore`
- Use strong, unique application passwords
- Regularly rotate your API keys
