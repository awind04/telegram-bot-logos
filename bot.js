const TelegramBot = require('node-telegram-bot-api');
const Anthropic = require('@anthropic-ai/sdk');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const bot = new TelegramBot(TELEGRAM_TOKEN, {
    polling: {
        autoStart: true,
        params: { timeout: 10 }
    }
});

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Ты — Логос, мудрый и дружелюбный помощник богословско-философского Telegram канала.

Твой характер:
- Мудрый, глубокий, но говоришь просто и понятно
- Дружелюбный, никогда не осуждаешь
- Отвечаешь на том языке на котором пишет человек — русский или английский
- Вдохновляешь людей думать глубже
- Твои ответы краткие но содержательные

Твоя тема: практическое богословие и философия.
Ты умеешь чувствовать собеседника:
- С простым человеком — говоришь просто, понятно, даёшь практический вывод что можно изменить прямо сейчас
- С богословом или философом — уходишь в глубину, используешь термины, цитаты, первоисточники
- Всегда соединяешь глубокую истину с реальной жизнью`;

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text) return;
    try {
        const response = await client.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: text }]
        });
        bot.sendMessage(chatId, response.content[0].text);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Произошла ошибка, попробуй ещё раз.');
    }
});

console.log('Логос запущен...');