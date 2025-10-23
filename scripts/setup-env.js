#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log("🚀 CreativityCoder Environment Setup\n");
  console.log(
    "This script will help you create a .env.local file with the necessary configuration.\n"
  );

  const envPath = path.join(process.cwd(), ".env.local");

  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question(
      "⚠️  .env.local already exists. Do you want to overwrite it? (y/N): "
    );
    if (overwrite.toLowerCase() !== "y" && overwrite.toLowerCase() !== "yes") {
      console.log("Setup cancelled.");
      rl.close();
      return;
    }
  }

  console.log("📝 WordPress Configuration:");
  const wpApiUrl = await question(
    "WordPress API URL (e.g., https://your-site.com/wp-json/wp/v2): "
  );
  const wpUsername = await question("WordPress Username: ");
  const wpPassword = await question("WordPress Application Password: ");

  console.log("\n👻 Ghost Configuration:");
  const ghostApiUrl = await question(
    "Ghost API URL (e.g., https://your-ghost-site.com): "
  );
  const ghostApiKey = await question("Ghost Content API Key: ");

  console.log("\n⚙️  CreativityCoder Configuration:");
  const revalidateTime =
    (await question("Revalidation time in seconds (default: 3600): ")) ||
    "3600";

  const envContent = `# WordPress Configuration
WORDPRESS_API_URL=${wpApiUrl}
WORDPRESS_USERNAME=${wpUsername}
WORDPRESS_PASSWORD=${wpPassword}

# Ghost Configuration
GHOST_API_URL=${ghostApiUrl}
GHOST_CONTENT_API_KEY=${ghostApiKey}

# CreativityCoder Configuration
ISR_REVALIDATE_TIME=${revalidateTime}
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log("\n✅ .env.local file created successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Restart your development server: npm run dev");
    console.log("2. Visit http://localhost:3000/blog to see your content");
    console.log(
      "\n💡 If you don't have WordPress or Ghost configured, the app will show sample data."
    );
  } catch (error) {
    console.error("❌ Error creating .env.local file:", error.message);
  }

  rl.close();
}

setupEnvironment().catch(console.error);
