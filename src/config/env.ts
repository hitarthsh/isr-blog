export const config = {
  wordpress: {
    apiUrl: process.env.WORDPRESS_API_URL || 'https://your-wordpress-site.com/wp-json/wp/v2',
    username: process.env.WORDPRESS_USERNAME || '',
    password: process.env.WORDPRESS_PASSWORD || '',
  },
  ghost: {
    apiUrl: process.env.GHOST_API_URL || 'https://your-ghost-site.com',
    contentApiKey: process.env.GHOST_CONTENT_API_KEY || '',
  },
  isr: {
    revalidateTime: parseInt(process.env.ISR_REVALIDATE_TIME || '60'), // Default to 1 minute for dynamic content
  },
} as const;
