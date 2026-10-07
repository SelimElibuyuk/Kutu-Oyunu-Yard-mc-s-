export interface GameFAQ {
  question: string;
  answer: string;
  pageRef?: string;
}

export interface SetupStep {
  title: string;
  description: string;
  tip?: string;
}

export interface TurnPhase {
  phase: string;
  description: string;
}

export interface GameData {
  id: string;
  title: string;
  tagline: string;
  category: string;
  players: string;
  minPlayers: number;
  maxPlayers: number;
  duration: string;
  age: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor' | 'Kolay - Orta';
  accentColor: string;
  bgGradient: string;
  badge: string;
  description: string;
  winCondition: string;
  setupSteps: SetupStep[];
  turnPhases: TurnPhase[];
  faqs: GameFAQ[];
  quickPrompts: string[];
  rulesKnowledge: string;
}

export const GAMES_DATA: Record<string, GameData> = {
  catan: {
    id: 'catan',
    title: 'Catan',
    tagline: 'Adanın fatihi ol, ticaret yap, yerleşimlerini büyüt!',
    category: 'Strateji & Ticaret',
    players: '3-4 Kişi (Genişleme ile 5-6)',
    minPlayers: 3,
    maxPlayers: 4,
    duration: '60-90 dk',
    age: '10+',
    difficulty: 'Orta',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-600 to-orange-700',
    badge: 'En Popüler',
    description: 'Catan adasında ham maddeleri (odun, tuğla, koyun, buğday, demir) toplayıp yollar, köyler ve şehirler inşa ederek ilk 10 zafere ulaşan oyuncu kazanır.',
    winCondition: 'Kendi sıranızda ilk olarak 10 Zafer Puanına (ZP) ulaşmak.',
    setupSteps: [
      {
        title: 'Haritayı Hazırlayın',
        description: '19 altıgen arazi kartını karıştırıp deniz çerçevesinin içine rastgele dizin. Sayı pullarını A-Q harf sırasına göre dıştan içe doğru spiral dizin. Çöl arazisine sayı pulu konmaz.',
        tip: 'Kırmızı sayılar (6 ve 8) yan yana gelmemelidir!'
      },
      {
        title: 'Hırsızı Yerleştirin',
        description: 'Gri hırsız piyonunu çöl arazisine koyun.'
      },
      {
        title: 'Başlangıç Köyleri & Yolları',
        description: 'Zar atarak en yüksek atan ilk başlar. Saat yönünde herkes sırayla 1 köy ve bitişiğine 1 yol koyar. Son oyuncu 2. köy ve yolunu koyduktan sonra bu kez ters saat yönünde herkes 2. köy ve yolunu yerleştirir.',
        tip: 'İki köy arasında en az 2 yol (2 köşe) boşluk olma kuralını unutmayın!'
      },
      {
        title: 'Başlangıç Kaynakları',
        description: 'Her oyuncu, İKİNCİ kurduğu köye komşu olan arazilerden birer adet ham madde kartı alır.'
      }
    ],
    turnPhases: [
      {
        phase: '1. Kaynak Üretimi (Zar Atma)',
        description: 'İki zarı atın. Çıkan sayıya sahip arazilerin köşesinde köyü olan herkes 1, şehri olan herkes 2 ham madde alır. 7 gelirse hırsız devreye girer.'
      },
      {
        phase: '2. Ticaret (Takas)',
        description: 'Sadece sırası olan oyuncu diğer oyuncularla veya liman/banka ile (4:1 veya limana göre 3:1 / 2:1) takas yapabilir. Diğer oyuncular kendi aralarında takas yapamaz.'
      },
      {
        phase: '3. İnşa & Gelişim Kartı Oynama',
        description: 'Yol (1 Odun, 1 Tuğla), Köy (1 Odun, 1 Tuğla, 1 Koyun, 1 Buğday), Şehir (2 Buğday, 3 Demir), Gelişim Kartı (1 Koyun, 1 Buğday, 1 Demir) satın alınabilir.'
      }
    ],
    quickPrompts: [
      'Zarda 7 gelince tam olarak ne yapıyoruz?',
      'En uzun yol nasıl kesilir veya el değiştirir?',
      'Gelişim kartını aldığım tur hemen oynayabilir miyim?',
      'İki köy arasında kaç yol mesafesi olmalı?',
      'Liman ticareti nasıl çalışır?'
    ],
    faqs: [
      {
        question: 'Zarda 7 gelince ne olur?',
        answer: '1. Elinde 7\'den fazla kart olan (8 ve üzeri) herkes kartlarının YARISINI (yuvarlama aşağı) bankaya atar.\n2. Zarı atan oyuncu hırsızı istediği bir araziye taşır.\n3. Hırsızın konduğu arazide köyü/şehri olan bir oyuncunun elinden görmeden rastgele 1 kart çeker.\n4. Hırsızın olduğu araziden o sayı atılsa bile kimse kaynak alamaz!',
        pageRef: 'Kural Kitapçığı Syf 6'
      },
      {
        question: 'En uzun ticaret yolu nasıl çalışır ve nasıl bozulur?',
        answer: 'En az 5 kesintisiz yola ilk ulaşan 2 Zafer Puanlık "En Uzun Ticaret Yolu" kartını alır. Başka biri daha uzun yol yaparsa kart ona geçer. Rakip oyuncu sizin yolunuzun ortasındaki boş bir kavşağa kurala uygun köy dikerse yolunuz ikiye bölünür!',
        pageRef: 'Kural Kitapçığı Syf 8'
      },
      {
        question: 'Gelişim kartını aldığım tur oynayabilir miyim?',
        answer: 'HAYIR. Satın aldığınız bir gelişim kartını aynı turda oynayamazsınız (bir sonraki turunuzda oynayabilirsiniz). İstisna: Satın aldığınız kart "Zafer Puanı" ise ve bu kartla 10 puana ulaşıyorsanız hemen açıklayıp oyunu bitirebilirsiniz.',
        pageRef: 'Kural Kitapçığı Syf 5'
      },
      {
        question: 'Bir turda kaç gelişim kartı oynayabilirim?',
        answer: 'Kendi sıranızda yalnızca 1 adet gelişim kartı oynayabilirsiniz. Ancak Şövalye kartını zar atmadan ÖNCE de oynayabilirsiniz.',
        pageRef: 'Kural Kitapçığı Syf 5'
      },
      {
        question: 'Köy mesafe kuralı nedir?',
        answer: 'Bir köy veya şehir, haritadaki herhangi bir başka köy veya şehirden en az İKİ KAVŞAK (yani en az 2 yol kenarı) uzakta olmalıdır. Kendi köyleriniz için de rakiplerin köyleri için de bu kural geçerlidir.',
        pageRef: 'Kural Kitapçığı Syf 4'
      }
    ],
    rulesKnowledge: `
Catan Kuralları Tam Bilgi Bankası:
- Amaç: 10 Zafer Puanına ilk ulaşan kazanır.
- Puanlar: Köy = 1 ZP, Şehir = 2 ZP, En Uzun Ticaret Yolu = 2 ZP (min 5 yol), En Büyük Ordu = 2 ZP (min 3 şövalye kartı), Zafer Puanı Gelişim Kartı = 1 ZP.
- 7 Atılınca: 8+ kartı olanlar yarısını atar. Hırsız hareket eder, komşu birinden 1 kart çalınır.
- Ticaret: Sadece sırası olan oyuncu dahil olabilir. Banka oranı 4:1'dir. 3:1 jenerik liman veya 2:1 özel liman kullanılabilir.
- İnşaat masrafları: Yol (1 Tuğla, 1 Odun), Köy (1 Tuğla, 1 Odun, 1 Buğday, 1 Koyun), Şehir (Var olan köyü yükseltir: 2 Buğday, 3 Demir), Gelişim Kartı (1 Koyun, 1 Buğday, 1 Demir).
`
  },
  carcassonne: {
    id: 'carcassonne',
    title: 'Carcassonne',
    tagline: 'Orta Çağ şehirlerini, yollarını ve manastırlarını inşa et!',
    category: 'Karo Yerleştirme',
    players: '2-5 Kişi',
    minPlayers: 2,
    maxPlayers: 5,
    duration: '35-45 dk',
    age: '7+',
    difficulty: 'Kolay',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-600 to-teal-700',
    badge: 'Yeni Başlayanlar İçin İdeal',
    description: 'Oyuncular sırayla bir arazi karosu çeker, var olan haritaya mantıklı şekilde ekler ve üzerine piyonunu (meeple) koyarak şehir, yol, manastır veya tarla sahiplenir.',
    winCondition: 'Oyun sonunda karolar bittiğinde en yüksek puana sahip olmak.',
    setupSteps: [
      {
        title: 'Başlangıç Karosu',
        description: 'Arka yüzü koyu renkli olan başlangıç karosunu masanın tam ortasına koyun.',
        tip: 'Diğer tüm karoların arkası açık renklidir.'
      },
      {
        title: 'Karoları Karıştırın',
        description: 'Kalan 71 karoyu yüzü kapalı karıştırıp deste veya yığınlar halinde oyuncuların erişebileceği yere koyun.'
      },
      {
        title: 'Piyonları (Meeple) Dağıtın',
        description: 'Her oyuncu seçtiği renkten 8 piyon alır. 1 piyonunu puan tablosunun 0 hanesine koyar. Kalan 7 piyon elinde kalır.'
      }
    ],
    turnPhases: [
      {
        phase: '1. Karo Çek ve Yerleştir',
        description: 'Kapalı desteden 1 karo çekin. Var olan karolara yol-yola, şehir-şehire, çayır-çayıra denk gelecek şekilde bitişik yerleştirin.'
      },
      {
        phase: '2. Piyon Koy (İsteğe Bağlı)',
        description: 'Yeni koyduğunuz karonun üzerindeki bir yola (haydut), şehre (şövalye) veya manastıra (keşiş) piyon koyabilirsiniz. Dikkat: Bağlandığı yapıda zaten başka bir piyon varsa koyamazsınız!'
      },
      {
        phase: '3. Puanlama & Piyonu Geri Alma',
        description: 'Eğer bir yol, şehir veya manastır tamamlandıysa hemen puanlanır ve piyon sahibine geri döner.'
      }
    ],
    quickPrompts: [
      'Manastır ne zaman tamamlanır ve kaç puan verir?',
      'İki farklı oyuncunun piyonu aynı şehirde nasıl buluşur?',
      'Şehir ve yol tamamlanınca kaç puan eder?',
      'Piyonlarım biterse ne yaparım?',
      'Oyun sonu puanlaması nasıl hesaplanır?'
    ],
    faqs: [
      {
        question: 'Manastır ne zaman tamamlanır ve kaç puan verir?',
        answer: 'Bir manastır karosu, etrafındaki 8 karenin tamamı karolarla çevrelendiğinde (toplam 9 karo olunca) tamamlanır ve sahibine tam 9 PUAN kazandırır. Piyon sahibine geri döner.',
        pageRef: 'Kural Kitapçığı Syf 3'
      },
      {
        question: 'Aynı şehirde veya yolda iki farklı oyuncunun piyonu olabilir mi?',
        answer: 'EVET, ama doğrudan aynı yere koyarak değil! İki oyuncu başlangıçta ayrı ayrı parçalara piyon koymuşsa ve sonradan çekilen bir karo bu iki bağımsız şehri/yolu birleştirirse aynı yerde bulunurlar. En çok piyonu olan tam puanı alır, eşitlik varsa her iki oyuncu da tam puan alır!',
        pageRef: 'Kural Kitapçığı Syf 4'
      },
      {
        question: 'Şehir puanı nasıl hesaplanır?',
        answer: 'Oyun içi tamamlanan şehir: Her karo 2 puan, her kalkan (arma) simgesi ekstra 2 puan.\nOyun sonu yarım kalan şehir: Her karo 1 puan, her kalkan 1 puan.',
        pageRef: 'Kural Kitapçığı Syf 4'
      },
      {
        question: 'Piyonum bittiğinde ne olur?',
        answer: 'Elinizde piyon kalmadıysa karo koymaya devam edersiniz ama yeni yapı sahiplenemezsiniz. Tamamlanan bir yapıdan piyonunuz geri dönene kadar beklemeniz gerekir.',
        pageRef: 'Kural Kitapçığı Syf 2'
      }
    ],
    rulesKnowledge: `
Carcassonne Kuralları:
- Yol: Karo başına 1 puan. Her iki ucu da kapandığında (köy, şehir veya döngü) biter.
- Şehir: Tamamlandığında karo başına 2 puan + arma başına 2 puan. Oyun sonu tamamlanmamışsa karo başına 1 puan + arma başına 1 puan.
- Manastır: 8 komşusu dolunca 9 puan. Oyun sonu komşu karo sayısı + 1 puan.
- Çiftçiler (Tarla kuralı - opsiyonel temel seviye): Oyun sonuna kadar tarlada kalır, beslediği her tamamlanmış şehir için 3 puan kazandırır.
`
  },
  'ticket-to-ride': {
    id: 'ticket-to-ride',
    title: 'Ticket to Ride: Europe',
    tagline: 'Avrupa raylarında tren rotalarını kur, biletlerini tamamla!',
    category: 'Rota & Set Toplama',
    players: '2-5 Kişi',
    minPlayers: 2,
    maxPlayers: 5,
    duration: '60-80 dk',
    age: '8+',
    difficulty: 'Kolay - Orta',
    accentColor: '#3b82f6',
    bgGradient: 'from-blue-600 to-indigo-800',
    badge: 'Aile & Arkadaşlar İçin',
    description: 'Avrupa şehirleri arasında renkli tren vagon kartlarını toplayarak rotaları ele geçirin ve gizli varış biletlerinizdeki şehirleri birbirine bağlayın.',
    winCondition: 'Oyun sonunda rotalardan, tamamlanan biletlerden ve en uzun trenden en çok puanı toplamak.',
    setupSteps: [
      {
        title: 'Tren ve İstasyonları Dağıtın',
        description: 'Her oyuncu seçtiği renkten 45 vagon ve 3 tren istasyonu alır. Puan işaretçisi 0 hanesine konur.'
      },
      {
        title: 'Başlangıç Tren Kartları',
        description: 'Tren destesi karıştırılır. Her oyuncuya 4 kapalı kart dağıtılır. Masaya 5 kart açık olarak serilir.'
      },
      {
        title: 'Görev Biletleri (Destinations)',
        description: 'Her oyuncuya 1 adet uzun rota bileti (mavi arkalı) ve 3 normal rota bileti dağıtılır. Herkes en az 2 tanesini saklamak ZORUNDADIR (kalanları kutuya kaldırır).'
      }
    ],
    turnPhases: [
      {
        phase: 'Kendi Sıranızda Bu 4 Eylemden BİRİNİ Seçin:',
        description: '1. Tren Kartı Çek: Masadan veya kapalı desteden 2 kart çek (Açık Lokomotif çekersen sadece 1 kart alabilirsin).\n2. Rota Satın Al: İstenen renk ve sayıda tren kartını atarak o hatta kendi vagonlarını diz.\n3. Yeni Görev Biletleri Çek: 3 bilet çek, en az 1 tanesini sakla.\n4. İstasyon İnşa Et: Bir şehre istasyon kurarak rakibin rotasını kullan.'
      }
    ],
    quickPrompts: [
      'Tünel (Tunnel) kurarken kart çektirme kuralı nedir?',
      'Lokomotif (Joker) kartı çekerken kural nedir?',
      'Feribot (Ferry) hatları nasıl inşa edilir?',
      'İstasyon ne işe yarar ve nasıl kullanılır?',
      'Bileti tamamlayamazsam ne kadar ceza alırım?'
    ],
    faqs: [
      {
        question: 'Tünel (Tunnel) inşaatı nasıl çalışır?',
        answer: 'Tünel inşa etmek istediğinizde gereken sayıda kartı ortaya koyarsınız. Ardından desteden 3 KART AÇILIR. Açılan 3 kart içinde sizin oynadığınız renkle (veya Lokomotif ile) eşleşen her kart için elinizden 1 EKSTRA o renkten kart vermelisiniz. Veremezseniz veya vermek istemezseniz kartlarınız elinize geri döner, turunuz yanar.',
        pageRef: 'Kural Kitapçığı Syf 5'
      },
      {
        question: 'Açık duran Lokomotif (Joker) kartını nasıl alabilirim?',
        answer: 'Masada açık duran 5 karttan bir Lokomotif kartı alırsanız, o tur İKİNCİ kartı çekemezsiniz. Eğer kapalı desteden şansınıza Lokomotif gelirse ikinci kartı da çekebilirsiniz.',
        pageRef: 'Kural Kitapçığı Syf 4'
      },
      {
        question: 'Tamamlanamayan bilet ne olur?',
        answer: 'Oyun sonunda eğer biletteki iki şehir arasında kesintisiz kendi tren hattınız yoksa (veya istasyonla bağlanmadıysa), o biletin puanı kadar EKSİ PUAN hanenize yazılır!',
        pageRef: 'Kural Kitapçığı Syf 7'
      },
      {
        question: 'İstasyon nasıl kullanılır ve maliyeti nedir?',
        answer: 'İstasyon, başka bir oyuncunun o şehre giren 1 rotasını kendi biletiniz için ödünç kullanmanızı sağlar. 1. istasyon: 1 kart, 2. istasyon: aynı renkten 2 kart, 3. istasyon: aynı renkten 3 kart. Kullanmadığınız her istasyon oyun sonu +4 puan kazandırır.',
        pageRef: 'Kural Kitapçığı Syf 6'
      }
    ],
    rulesKnowledge: `
Ticket to Ride Europe Kuralları:
- Rota Puanları: 1 vagon=1p, 2=2p, 3=4p, 4=7p, 6=15p, 8=21p.
- Feribotlar: Üzerinde lokomotif simgesi olan yerlere mutlaka lokomotif kartı konulmalıdır.
- Oyun Bitişi: Bir oyuncunun elinde 2 veya daha az vagon kaldığında son tur başlar.
- En Uzun Rota: Oyun sonu en uzun kesintisiz hatta sahip oyuncu 10 bonus puan alır.
`
  },
  avalon: {
    id: 'avalon',
    title: 'The Resistance: Avalon',
    tagline: 'Kral Arthur\'un şövalyeleri mi, Mordred\'in hainleri mi?',
    category: 'Sosyal Çıkarım & Gizli Roller',
    players: '5-10 Kişi',
    minPlayers: 5,
    maxPlayers: 10,
    duration: '30-45 dk',
    age: '13+',
    difficulty: 'Orta',
    accentColor: '#8b5cf6',
    bgGradient: 'from-purple-700 to-slate-900',
    badge: 'Blöf & Dedektiflik',
    description: 'İyiler (Arthur taraftarları) 3 görevi başarıyla tamamlamaya çalışırken, aralarına sızmış kötüler (Mordred yandaşları) görevleri gizlice sabote etmeye çalışır.',
    winCondition: 'İyiler: 3 görevi başarmak ve Merlin\'in suikasta kurban gitmemesi. Kötüler: 3 görevi sabote etmek veya Merlin\'i bulup öldürmek.',
    setupSteps: [
      {
        title: 'Rol Dağılımını Ayarlayın',
        description: 'Oyuncu sayısına göre iyi/kötü sayısını belirleyin (Örn: 5 kişi = 3 İyi, 2 Kötü / 7 kişi = 4 İyi, 3 Kötü). Merlin ve Suikastçi (Assassin) mutlaka dahil edilmelidir.'
      },
      {
        title: 'Gece Evresi (Gözleri Kapatma Seremonisi)',
        description: 'Lider herkesin gözünü kapattırır:\n1. "Kötüler gözlerini açsın ve birbirini tanısın... Kötüler gözlerini kapatsın."\n2. "Kötüler baş parmaklarını kaldırsın... Merlin gözünü açsın ve kötüleri görsün... Merlin gözünü kapatsın, baş parmaklar insin."\n3. "Herkes gözlerini açabilir."'
      }
    ],
    turnPhases: [
      {
        phase: '1. Takım Önerisi',
        description: 'Lider, o görev için gereken sayıda oyuncuyu seçer ve takım piyonlarını onlara verir.'
      },
      {
        phase: '2. Takım Oylaması (Açık Oy)',
        description: 'Herkes aynı anda Onay veya Ret kartını açar. Çoğunluk "Onay" derse görev başlar. Ret çıkarsa liderlik saat yönünde devreder (Üst üste 5 ret = Kötüler otomatik kazanır).'
      },
      {
        phase: '3. Görev Oylaması (Gizli Oy)',
        description: 'Sadece takıma seçilenler gizlice Başarı veya Başarısızlık kartı atar. Kartlar karıştırılıp açılır. 1 TANE BİLE Başarısızlık varsa görev çöker (İstisna: 7+ kişilik oyunda 4. görev için 2 başarısızlık gerekir).'
      }
    ],
    quickPrompts: [
      'İyiler görevde Başarısızlık (Fail) atabilir mi?',
      'Merlin nasıl kazanır veya nasıl öldürülür?',
      'Percival ve Morgana rolleri nasıl çalışır?',
      'Görev oylamasında eşitlik olursa ne olur?',
      'Üst üste kaç ret verilirse kötüler kazanır?'
    ],
    faqs: [
      {
        question: 'İyi karakterler görev kartında Başarısızlık (Fail) atabilir mi?',
        answer: 'KESİNLİKLE HAYIR! İyilik tarafındaki hiçbir oyuncu asla Başarısızlık kartı atamaz. Sadece kötü karakterler Başarısızlık veya Başarı kartı atma seçeneğine sahiptir.',
        pageRef: 'Kural Kitapçığı Syf 4'
      },
      {
        question: 'Merlin\'in öldürülmesi (Suikast) anı ne zamandır?',
        answer: 'Eğer İyiler 3 görevi başarıyla tamamlarsa oyun hemen bitmez! Kötüler kimin Merlin olduğunu tartışır ve Suikastçi tek bir kişiyi işaret eder. Eğer işaret edilen kişi gerçekten Merlin ise, kötüler oyunu tersine çevirip KAZANIR!',
        pageRef: 'Kural Kitapçığı Syf 5'
      },
      {
        question: 'Percival kimi görür?',
        answer: 'Percival gece evresinde baş parmağını kaldıran iki kişiyi görür: Merlin ve Morgana! Ancak hangisinin gerçek Merlin, hangisinin sahte (Morgana) olduğunu bilmez, oyun içinde ayırt etmelidir.',
        pageRef: 'Kural Kitapçığı Syf 6'
      },
      {
        question: '5. Takım oylaması reddedilirse ne olur?',
        answer: 'Aynı görev için takımlar üst üste 5 kez reddedilirse (Ret sayacı 5\'e ulaşırsa), krallık kaosa sürüklenir ve Kötüler oyunu anında kazanır!',
        pageRef: 'Kural Kitapçığı Syf 3'
      }
    ],
    rulesKnowledge: `
Avalon Kuralları:
- Oyuncu Dağılımı:
  5 Oyuncu: 3 İyi, 2 Kötü
  6 Oyuncu: 4 İyi, 2 Kötü
  7 Oyuncu: 4 İyi, 3 Kötü (4. görev 2 fail ister)
  8 Oyuncu: 5 İyi, 3 Kötü (4. görev 2 fail ister)
  9 Oyuncu: 6 İyi, 3 Kötü (4. görev 2 fail ister)
  10 Oyuncu: 6 İyi, 4 Kötü (4. görev 2 fail ister)
- Oberon: Kötüdür ama diğer kötüleri bilmez ve kötüler onu görmez (sadece Merlin görür).
- Mordred: Kötüdür ama Merlin onu göremez.
`
  },
  'exploding-kittens': {
    id: 'exploding-kittens',
    title: 'Exploding Kittens',
    tagline: 'Patlayan kediden kaç, son ayakta kalan oyuncu ol!',
    category: 'Parti & Rus Ruleti',
    players: '2-5 Kişi',
    minPlayers: 2,
    maxPlayers: 5,
    duration: '15-20 dk',
    age: '7+',
    difficulty: 'Kolay',
    accentColor: '#ef4444',
    bgGradient: 'from-rose-600 to-red-700',
    badge: 'Hızlı & Eğlenceli',
    description: 'Kart çekme destesinde gizlenmiş patlayan kediyi çekmemek için elinizdeki hamle kartlarını oynayın. Kediyi çeken ve etkisiz hale getiremeyen elenir!',
    winCondition: 'Patlamadan hayatta kalan son kişi olmak.',
    setupSteps: [
      {
        title: 'Patlayan Kedileri Ayırın',
        description: 'Tüm Exploding Kitten ve Defuse (İmha) kartlarını desteden ayırın.'
      },
      {
        title: 'Başlangıç Elini Dağıtın',
        description: 'Her oyuncuya 1 adet Defuse kartı ve desteden kapalı 7 kart verin (toplam 8 kart).'
      },
      {
        title: 'Desteyi Hazırlayın',
        description: 'Oyuncu sayısının 1 EKSİĞİ kadar Exploding Kitten kartını ve kalan fazla Defuse kartlarını desteye karıştırın.'
      }
    ],
    turnPhases: [
      {
        phase: '1. Kart Oyna (İsteğe Bağlı)',
        description: 'Elinizden istediğiniz kadar kart oynayabilirsiniz (Pas geçmek de serbesttir).'
      },
      {
        phase: '2. Turu Bitir (ZORUNLU KART ÇEK)',
        description: 'Sıranızı bitirmek için çekme destesinin EN ÜSTÜNDEN 1 kart çekmek zorundasınız. (Eğer "Skip" veya "Attack" oynamadıysanız).'
      }
    ],
    quickPrompts: [
      'Patlayan Kedi çekince Defuse nasıl kullanılır?',
      'Nope (Hayır) kartı hangi durumlarda oynanır?',
      'Attack (Saldırı) kartı gelince ne yapmalıyım?',
      'Eşleşen 2 veya 3 kedi kartı ne işe yarar?',
      'Defuse kartı kullandıktan sonra kedi nereye konur?'
    ],
    faqs: [
      {
        question: 'Patlayan Kedi çekince ne olur ve Defuse nereye gider?',
        answer: 'Patlayan kedi çektiğinizde elinizde Defuse (İmha) kartı varsa onu atık destesine atarsınız. Ardından Patlayan Kedi kartını, diğer oyunculara göstermeden destenin İSTEDİĞİNİZ bir yerine gizlice sokarsınız (en üste, en alta veya ortaya)!',
        pageRef: 'Kural Kitapçığı Syf 2'
      },
      {
        question: 'Nope kartı başka bir Nope kartını iptal edebilir mi?',
        answer: 'EVET! Bir Nope kartına karşı başka bir oyuncu "Nope" atabilir (Çifte Hayır), bu durumda ilk hamle tekrar geçerli olur. Nope kartı Patlayan Kedi veya Defuse hariç her şeye atılabilir.',
        pageRef: 'Kural Kitapçığı Syf 3'
      },
      {
        question: 'Attack kartı oynanınca ne olur?',
        answer: 'Sıranız kart çekmeden anında biter. Sıradaki oyuncu üst üste 2 TUR oynamak (yani 2 kez kart çekmek) zorunda kalır!',
        pageRef: 'Kural Kitapçığı Syf 3'
      }
    ],
    rulesKnowledge: `
Exploding Kittens Kuralları:
- Kart Çiftleri: 2 adet aynı özel olmayan kedi kartı oynarsanız başka bir oyuncunun elinden rastgele 1 kart çalarsınız. 3 adet aynı kart oynarsanız adını söylediğiniz kartı (örneğin Defuse) vermesini istersiniz.
- See the Future: Destenin en üstündeki 3 karta gizlice bakmanızı sağlar.
- Shuffle: Desteyi karıştırır.
- Favor: Başka bir oyuncu size elinden seçtiği 1 kartı vermek zorundadır.
`
  },
  splendor: {
    id: 'splendor',
    title: 'Splendor',
    tagline: 'Mücevher tüccarı ol, madenleri işlet, soyluları etkile!',
    category: 'Motor Kurma & Strateji',
    players: '2-4 Kişi',
    minPlayers: 2,
    maxPlayers: 4,
    duration: '30 dk',
    age: '10+',
    difficulty: 'Kolay - Orta',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-600 to-blue-700',
    badge: 'Taktiksel & Akıcı',
    description: 'Rönesans döneminin zengin tüccarları olarak mücevher çipleri toplayın, maden ve ulaşım kartları satın alarak sürekli indirim sağlayın ve soyluların ziyaretini kazanın.',
    winCondition: 'İlk olarak 15 prestij puanına ulaşmak ve tur sonunda en yüksek puanda kalmak.',
    setupSteps: [
      {
        title: 'Gelişim Kartlarını Açın',
        description: 'Seviye 1 (yeşil), Seviye 2 (sarı) ve Seviye 3 (mavi) destelerini alt alta dizin. Her seviyeden yan yana 4\'er kart açın.'
      },
      {
        title: 'Soylu Karoları',
        description: 'Oyuncu sayısının 1 fazlası kadar soylu karosunu (örn: 3 oyuncu için 4 soylu) masanın en üstüne açın.'
      },
      {
        title: 'Mücevher Çipleri',
        description: '4 oyuncu için tüm çipler (7\'şer adet), 3 oyuncu için 5\'er adet, 2 oyuncu için 4\'er adet çip koyun. 5 altın çipi her zaman masada durur.'
      }
    ],
    turnPhases: [
      {
        phase: 'Sıranızda Yalnızca 1 Eylem Seçin:',
        description: '1. Farklı renkte 3 mücevher çipi al.\n2. Aynı renkten 2 mücevher çipi al (O renkten destede en az 4 çip varsa).\n3. Bir kart rezerve et ve 1 Altın (Joker) çip al (Elde max 3 rezerve).\n4. Masadan veya elinizden 1 gelişim kartı satın al.'
      }
    ],
    quickPrompts: [
      'Aynı renkten 2 çip ne zaman alabilirim?',
      'Bir oyuncu en fazla kaç çip tutabilir?',
      'Soylular nasıl kazanılır?',
      'Altın (Gold) çipi nasıl alınır?',
      'Oyun ne zaman biter?'
    ],
    faqs: [
      {
        question: 'Elde en fazla kaç mücevher çipi tutulabilir?',
        answer: 'Turunuzun sonunda elinizde en fazla 10 ÇİP (altınlar dahil) bulunabilir. 10\'dan fazlaysa fazlalıkları istediğiniz renkte bankaya geri bırakmalısınız.',
        pageRef: 'Kural Kitapçığı Syf 2'
      },
      {
        question: 'Soylu ziyareti nasıl çalışır?',
        answer: 'Turunuzun sonunda, önünüzde açık duran kartlardaki bonus mücevherler soylunun şartını karşılıyorsa o soylu kendiliğinden size gelir (+3 puan). Soylular çip harcatmaz, sadece sahip olduğunuz kartlara bakar. Bir turda en fazla 1 soylu gelebilir.',
        pageRef: 'Kural Kitapçığı Syf 3'
      },
      {
        question: 'Aynı renkten 2 çip alma şartı nedir?',
        answer: 'Bir renkten 2 çip alabilmeniz için, o rengin yığınında ALMADAN ÖNCE EN AZ 4 ÇİP bulunuyor olması şarttır. 3 veya daha az çip kalmışsa 2 tane alamazsınız.',
        pageRef: 'Kural Kitapçığı Syf 2'
      }
    ],
    rulesKnowledge: `
Splendor Kuralları:
- Bonus İndirim: Satın aldığınız her kart üzerindeki mücevher rengi, bundan sonra alacağınız kartlar için kalıcı 1 çip indirim sağlar.
- Oyun Bitişi: Bir oyuncu 15 veya daha fazla puana ulaştığında o tur herkes eşit sayıda oynamış olacak şekilde tamamlanır. En çok puanı olan kazanır. Eşitlikte en az kart satın alan kazanır.
`
  }
};
