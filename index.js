require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 대상 그룹 (@havojazshar)
const TARGET_GROUP = '@havogazshar';

// 골목 리스트 데이터
const alleyList = [
  ["Andijon", "Ok rovvot (Bekguzar)"],
  ["Birlashgan", "Birlik"],
  ["Bobosaddin", "Bobur"],
  ["A.Bakirov (Bog`I eram)", "Bogishamol"],
  ["X.Axmedov(Buyuk ipak Yuli)", "Buyuk Turon"],
  ["Gayrat", "Guliston"],
  ["Gumbaz", "Dalvarzin"],
  ["Damarik", "Dexkonobod"],
  ["Dustlik", "Yorboshi"],
  ["Jumabozar", "Islomobod"],
  ["Ishchilar", "Kengash"],
  ["Kayrogochtagi", "Kalandarxona"],
  ["Kusharik t", "Madaniyat"],
  ["Maydonbozar", "Maorif"],
  ["Ma'rifat", "Mexnat t"],
  ["Mexnat sh", "Mirpustin"],
  ["Mustakillik", "X.Kodirov(Navbaxor)"],
  ["Navruz", "Nayzaqayrag`och"],
  ["Na'muna", "Obod"],
  ["Paxtakor", "Sadda"],
  ["Sadda t", "Sanoat"],
  ["Tojik(Saxovat)", "Xakikat (Soglom turmush)"],
  ["Soy", "Taxtakuprik"],
  ["Tukkizarik", "Sulton Jura(Uzbegim)"],
  ["Uzbekiston", "Uzgarish"],
  ["Uygur tuman", "Uygurbod"],
  ["Ittifok (Xamdustlik)", "Xuja tuman"],
  ["Xursandlik", "Xutanarik"],
  ["Sa'diy (Xamkorlik)","Muxamad Aliboy"],
  ["Chem","Chulpon 100 y"],
  ["Shodlik","Erkin"],
  ["Yangi turmush","Yangi chek"],
  ["Yaxshi",""]
];

// 사용자가 선택한 골목 임시 저장
let selectedAlley = null;

// /start 명령어 처리
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || '사용자';
  
  bot.sendMessage(chatId, `Salom, ${userName}! O'zingiz yashaydigon MFYni tanlang va unga oid rasmni botga yuboring.`, {
    reply_markup: {
      keyboard: [[{ text: "Andijon Shahar MFY lar" }]],
      resize_keyboard: true
    }
  });
});

// 골목 리스트 표시
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === 'Andijon Shahar MFY lar') {
    const keyboard = alleyList.map(pair => [
      { text: pair[0] }, 
      { text: pair[1] }
    ]);
    
    bot.sendMessage(chatId, 'Kerakli MFYni tanlang:', {
      reply_markup: {
        keyboard: keyboard,
        resize_keyboard: true
      }
    });
  }

  // 골목 선택 처리
  if (alleyList.some(pair => pair.includes(text))) {
    selectedAlley = text;
    bot.sendMessage(chatId, `Rasmni yuklang`, {
      reply_markup: { remove_keyboard: true }
    });
  }
});

// 사진 수신 및 그룹 전송 처리
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const photoId = msg.photo[msg.photo.length - 1].file_id;
  const user = msg.from;
  const username = user.username ? `@${user.username}` : `${user.first_name} ${user.last_name || ''}`.trim();

  if (!selectedAlley) {
    return bot.sendMessage(chatId, '⚠️ Iltimos, Shahar MFYni tanlang');
  }

  try {
    // 그룹으로 사진 전송 (토픽 없음)
    await bot.sendPhoto(TARGET_GROUP, photoId, {
      caption: `📌 MFY: ${selectedAlley}\n👤 User: ${username}\n🕒 Vaqt: ${new Date().toLocaleString()}
    });

    await bot.sendMessage(chatId, '✅ Bajarildi', {
      reply_markup: {
        keyboard: [[{ text: "Andijon Shahar MFY lar" }]],
        resize_keyboard: true
      }
    });

  } catch (error) {
    console.error('Xatolik:', error);
    bot.sendMessage(chatId, '❌ Iltimos rasmni qayta junating');
  }

  selectedAlley = null;
});

// 오류 처리
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});
