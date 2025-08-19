require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 대상 그룹
const TARGET_GROUP = '@havogazshar';

// 골목명 → thread id 매핑
const alleyThreads = {
  "Andijon": 4294967693,
  "Ok rovvot (Bekguzar)": 4294967694,
  "Birlashgan": 4294967695,
  "Birlik": 4294967696,
  "Bobosaddin": 4294967697,
  "Bobur": 4294967698,
  "A.Bakirov (Bog`I eram)": 4294967699,
  "Bogishamol": 4294967700,
  "X.Axmedov(Buyuk ipak Yuli)": 4294967701,
  "Buyuk Turon": 4294967702,
  "Gayrat": 4294967703,
  "Guliston": 4294967704,
  "Gumbaz": 4294967705,
  "Dalvarzin": 4294967706,
  "Damarik": 4294967707,
  "Dexkonobod": 4294967708,
  "Dustlik": 4294967709,
  "Yorboshi": 4294967710,
  "Jumabozar": 4294967711,
  "Islomobod": 4294967712,
  "Ishchilar": 4294967713,
  "Kengash": 4294967714,
  "Kayrogochtagi": 4294967715,
  "Kalandarxona": 4294967716,
  "Kusharik t": 4294967717,
  "Madaniyat": 4294967718,
  "Maydonbozar": 4294967719,
  "Maorif": 4294967720,
  "Ma'rifat": 4294967721,
  "Mexnat t": 4294967722,
  "Mexnat sh": 4294967723,
  "Mirpustin": 4294967724,
  "Mustakillik": 4294967725,
  "X.Kodirov(Navbaxor)": 4294967726,
  "Navruz": 4294967727,
  "Nayzaqayrag`och": 4294967728,
  "Na'muna": 4294967729,
  "Obod": 4294967730,
  "Paxtakor": 4294967731,
  "Sadda": 4294967732,
  "Sadda t": 4294967733,
  "Sanoat": 4294967734,
  "Tojik(Saxovat)": 4294967735,
  "Xakikat (Soglom turmush)": 4294967736,
  "Soy": 4294967737,
  "Taxtakuprik": 4294967738,
  "Tukkizarik": 4294967739,
  "Sulton Jura(Uzbegim)": 4294967740,
  "Uzbekiston": 4294967741,
  "Uzgarish": 4294967742,
  "Uygur tuman": 4294967743,
  "Uygurbod": 4294967744,
  "Ittifok (Xamdustlik)": 4294967745,
  "Xuja tuman": 4294967746,
  "Xursandlik": 4294967747,
  "Xutanarik": 4294967748,
  "Sa'diy (Xamkorlik)": 4294967749,
  "Muxamad Aliboy": 4294967750,
  "Chem": 4294967751,
  "Chulpon 100 y": 4294967752,
  "Shodlik": 4294967753,
  "Erkin": 4294967754,
  "Yangi turmush": 4294967755,
  "Yangi chek": 4294967756,
  "Yaxshi": 4294967757
};

// 골목 리스트 (키보드용)
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
  ["Sa'diy (Xamkorlik)", "Muxamad Aliboy"],
  ["Chem","Chulpon 100 y"],
  ["Shodlik","Erkin"],
  ["Yangi turmush","Yangi chek"],
  ["Yaxshi",""]
];

// 사용자가 선택한 골목
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

// 사진 수신 및 그룹 전송 (thread 포함)
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const photoId = msg.photo[msg.photo.length - 1].file_id;
  const user = msg.from;
  const username = user.username ? `@${user.username}` : `${user.first_name} ${user.last_name || ''}`.trim();

  if (!selectedAlley) {
    return bot.sendMessage(chatId, '⚠️ Iltimos, Shahar MFYni tanlang');
  }

  const threadId = alleyThreads[selectedAlley]; // 매핑된 thread id 찾기

  if (!threadId) {
    await bot.sendMessage(chatId, `⚠️ Bu MFY uchun thread_id topilmadi: ${selectedAlley}`);
    selectedAlley = null;
    return;
  }

  try {
    await bot.sendPhoto(TARGET_GROUP, photoId, {
      caption: `📌 MFY: ${selectedAlley}\n👤 User: ${username}\n🕒 Vaqt: ${new Date().toLocaleString()}`,
      message_thread_id: threadId
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
