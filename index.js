require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const admin = require("firebase-admin");

// -----------------------------
// Firebase Configuration
// -----------------------------

// Download your Firebase service-account JSON from:
// Firebase Console → Project Settings → Service Accounts
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

  // Placeholder for your Firebase Realtime Database URL
  databaseURL:
    process.env.FIREBASE_DATABASE_URL ||
    "https://zoro-zip-default-rtdb.firebaseio.com"
});

const db = admin.database();

// -----------------------------
// Discord Configuration
// -----------------------------

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// -----------------------------
// Bot Ready
// -----------------------------

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log("🤖 Discord → Firebase bot is running");
});

// -----------------------------
// Listen for Messages
// -----------------------------

client.on("messageCreate", async (message) => {
  try {
    // Ignore messages from other bots
    if (message.author.bot) return;

    // Only listen to the specified Discord channel
    if (message.channel.id !== process.env.DISCORD_CHANNEL_ID) {
      return;
    }

    const messageData = {
      discordMessageId: message.id,
      channelId: message.channel.id,
      channelName: message.channel.name,

      userId: message.author.id,
      username: message.author.username,
      displayName: message.member?.displayName || message.author.username,

      content: message.content,

      timestamp: Date.now(),
      discordTimestamp: message.createdAt.toISOString()
    };

    // Save to Firebase
    const newMessageRef = db.ref("discordMessages").push();

    await newMessageRef.set(messageData);

    console.log("✅ Message saved to Firebase:");
    console.log(messageData);

  } catch (error) {
    console.error("❌ Failed to save message:", error);
  }
});

// -----------------------------
// Login
// -----------------------------

client.login(
  process.env.DISCORD_BOT_TOKEN || "MTUxOTc2NTAxMjQ2NDQwNjY0OA.GVkSYs.1audWDLJ3sw4cK1V-LNBEPqx056KDN45IjXcvs"
);