// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBscnBKFbjded9cS6Dg2Xzi35yHBejgp5Q",
    authDomain: "casamento-59280.firebaseapp.com",
    projectId: "casamento-59280",
    storageBucket: "casamento-59280.firebasestorage.app",
    messagingSenderId: "1078460802675",
    appId: "1:1078460802675:web:f95d0a4fc19c3799abac06"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const authPopup = document.getElementById('auth-popup');
const authCard = authPopup.querySelector('.popup-card');
const authForm = document.getElementById('auth-form');
const authError = document.getElementById('auth-error');
const adminContent = document.getElementById('admin-content');
const adminRsvpList = document.getElementById('admin-rsvp-list');
const adminGiftList = document.getElementById('admin-gift-list');
const secretLoginTrigger = document.getElementById('secret-login-trigger');
const authLogoutButton = document.getElementById('auth-logout');
const authCancelButton = document.getElementById('auth-cancel');
const authCloseButton = authPopup.querySelector('.popup-close');
const giftQrcodePopup = document.getElementById('gift-qrcode-popup');
const giftQrcodeCloseButton = document.getElementById('gift-qrcode-close');
const backgroundMusic = document.getElementById('background-music');

function playBackgroundMusic() {
    if (!backgroundMusic || !backgroundMusic.paused) {
        return;
    }

    backgroundMusic.volume = 0.7;
    backgroundMusic.play().catch(() => {
        document.addEventListener('click', playBackgroundMusic, { once: true });
        document.addEventListener('touchstart', playBackgroundMusic, { once: true });
    });
}

window.addEventListener('load', playBackgroundMusic);

// Presentes padrão com imagens
const defaultGifts = [
    {
        id: 'airfryer',
        name: 'Airfryer',
        description: 'Airfryer prática para fritar com menos óleo',
        price: '400',
        image: 'Fotos/Airfryer.jpeg',
        qrcodeImage: 'Fotos/qrcodeAirfryer.jpeg',
        pixKey: '00020126500014br.gov.bcb.pix0114+55319838789910210Air fryer 5204000053039865406400.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514550128850300017br.gov.bcb.brcode01051.0.06304DC4C'
    },
    {
        id: 'assadeiras',
        name: 'Assadeiras',
        description: 'Conjunto de assadeiras versáteis para forno',
        price: '180',
        image: 'Fotos/assadeiras.jpeg',
        qrcodeImage: 'Fotos/qrcodeassadeiras.jpeg',
        pixKey: '00020126510014br.gov.bcb.pix0114+55319838789910211Assadeiras 5204000053039865406180.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514380513350300017br.gov.bcb.brcode01051.0.06304F6B6'
    },
    {
        id: 'boleira-e-queijeira',
        name: 'Boleira e Queijeira',
        description: 'Conjunto elegante para servir bolos e queijos',
        price: '150',
        image: 'Fotos/boleiraequeijeira.jpeg',
        pixKey: '00020126600014br.gov.bcb.pix0114+55319838789910220Boleira e queijeira 5204000053039865406150.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514522971850300017br.gov.bcb.brcode01051.0.06304B9E5',
        qrcodeImage: 'Fotos/qrcodeboleiraequeijeira.jpeg'
    },
    {
        id: 'cafeteira',
        name: 'Cafeteira',
        description: 'Cafeteira para começar o dia com aroma fresco',
        price: '289',
        image: 'Fotos/cafeteira.jpeg',
        qrcodeImage: 'Fotos/qrcodecafeteira.jpeg',
        pixKey: '00020126500014br.gov.bcb.pix0114+55319838789910210Cafeteira 5204000053039865406289.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514331546150300017br.gov.bcb.brcode01051.0.063048F2B'
    },
    {
        id: 'geladeira',
        name: 'Geladeira',
        description: 'Geladeira moderna para sua cozinha',
        price: '3199',
        image: 'Fotos/geladeira.jpeg',
        qrcodeImage: 'Fotos/qrcodegeladeira.jpeg',
        pixKey: '00020126500014br.gov.bcb.pix0114+55319838789910210Geladeira 52040000530398654073199.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052513474632550300017br.gov.bcb.brcode01051.0.0630415691'
    },
    {
        id: 'maquina-lavar',
        name: 'Máquina de Lavar',
        description: 'Máquina de lavar com tecnologia avançada',
        price: '4099',
        image: 'Fotos/maquina.jpeg',
        qrcodeImage: 'Fotos/qrcodemaquina.jpeg',
        pixKey: '00020126560014br.gov.bcb.pix0114+55319838789910216Maquina de lavar52040000530398654074099.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052513522705150300017br.gov.bcb.brcode01051.0.0630476CF'
    },
    {
        id: 'microondas',
        name: 'Microondas',
        description: 'Microondas prático para sua cozinha',
        price: '550',
        image: 'Fotos/microondas.jpeg',
        qrcodeImage: 'Fotos/qrcodemicroondas.jpeg',
        pixKey: '00020126500014br.gov.bcb.pix0114+55319838789910210Microondas5204000053039865406550.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052513550288050300017br.gov.bcb.brcode01051.0.06304DBD8'
    },
    {
        id: 'forno',
        name: 'Forno',
        description: 'Forno elétrico para assados e gratinados',
        price: '400',
        image: 'Fotos/forno.jpeg',
        qrcodeImage: 'Fotos/qrcodeforno.jpeg',
        pixKey: '00020126540014br.gov.bcb.pix0114+55319838789910214Forno eletrico5204000053039865406400.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052513560531250300017br.gov.bcb.brcode01051.0.06304A8BB'
    },
    {
        id: 'climatizador',
        name: 'Climatizador',
        description: 'Climatizador refrescante para dias quentes',
        price: '349',
        image: 'Fotos/climatizador.jpeg',
        qrcodeImage: 'Fotos/qrcodeclimatizador.jpeg',
        pixKey: '00020126530014br.gov.bcb.pix0114+55319838789910213Climatizador 5204000053039865406349.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052515040544450300017br.gov.bcb.brcode01051.0.063047846'
    },
    {
        id: 'depurador-de-ar',
        name: 'Depurador de Ar',
        description: 'Depurador de ar para uma cozinha mais limpa',
        price: '350',
        image: 'Fotos/depuradordear.jpeg',
        pixKey: '00020126560014br.gov.bcb.pix0114+55319838789910216Depurador de ar 5204000053039865406350.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514344668050300017br.gov.bcb.brcode01051.0.0630429EC',
        qrcodeImage: 'Fotos/qrcodedepuradordear.jpeg'
    },
    {
        id: 'cortinas',
        name: 'Cortinas',
        description: 'Cortinas elegantes para sala ou quarto',
        price: '299,90',
        image: 'Fotos/cortinas.jpeg',
        qrcodeImage: 'Fotos/qrcodecortinas.jpeg',
        pixKey: '00020126490014br.gov.bcb.pix0114+55319838789910209Cortinas 5204000053039865406299.905802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052515025274550300017br.gov.bcb.brcode01051.0.06304BE62'
    },
    {
        id: 'cama',
        name: 'Cama',
        description: 'Cama confortável para noites mais tranquilas',
        price: '1900',
        image: 'Fotos/cama.jpeg',
        qrcodeImage: 'Fotos/qrcodecama.jpeg',
        pixKey: '00020126490014br.gov.bcb.pix0114+55319838789910209Cama box 52040000530398654071900.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052513535913450300017br.gov.bcb.brcode01051.0.063045560'
    },
    {
        id: 'roupas-de-cama',
        name: 'Roupas de Cama',
        description: 'Conjunto de roupas de cama premium',
        price: '180',
        image: 'Fotos/roupasdecama.jpeg',
        qrcodeImage: 'Fotos/qrcoderoupasdecama.jpeg',
        pixKey: '00020126550014br.gov.bcb.pix0114+55319838789910215Roupas de cama 5204000053039865406180.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052515020281350300017br.gov.bcb.brcode01051.0.06304724A'
    },
    {
        id: 'edredom-queen',
        name: 'Edredom Queen',
        description: 'Edredom queen size macio e aconchegante',
        price: '229',
        image: 'Fotos/edredonquenn.jpeg',
        qrcodeImage: 'Fotos/qrcodeedredonqueen.jpeg',
        pixKey: '00020126540014br.gov.bcb.pix0114+55319838789910214Edredon queen 5204000053039865406229.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514584651750300017br.gov.bcb.brcode01051.0.06304DCB5'
    },
    {
        id: 'sofa',
        name: 'Sofá',
        description: 'Sofá confortável para a sala',
        price: '1800',
        image: 'Fotos/sofa.jpeg',
        pixKey: '00020126450014br.gov.bcb.pix0114+55319838789910205Sofa 52040000530398654071800.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514294836450300017br.gov.bcb.brcode01051.0.06304E1CE',
        qrcodeImage: 'Fotos/qrcodesofa.jpeg'
    },
    {
        id: 'mesa',
        name: 'Mesa',
        description: 'Mesa elegante para a sala de jantar',
        price: '1700',
        image: 'Fotos/mesa.jpeg',
        qrcodeImage: 'Fotos/qrcodemesa.jpeg',
        pixKey: '00020126450014br.gov.bcb.pix0114+55319838789910205Mesa 52040000530398654071700.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514303816650300017br.gov.bcb.brcode01051.0.063045451'
    },
    {
        id: 'tapete-para-sala',
        name: 'Tapete para Sala',
        description: 'Tapete aconchegante para a sala',
        price: '150',
        image: 'Fotos/tapeteparasala.jpeg',
        qrcodeImage: 'Fotos/qrcodetapeteparasala.jpeg',
        pixKey: '00020126470014br.gov.bcb.pix0114+55319838789910207Tapete 5204000053039865406150.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514513276550300017br.gov.bcb.brcode01051.0.063046283'
    },
    {
        id: 'tv',
        name: 'TV',
        description: 'TV para momentos de cinema em casa',
        price: '2100',
        image: 'Fotos/tv.jpeg',
        qrcodeImage: 'Fotos/qrcodetv.jpeg',
        pixKey: '00020126420014br.gov.bcb.pix0114+55319838789910202Tv52040000530398654072100.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514282654350300017br.gov.bcb.brcode01051.0.063044509'
    },
    {
        id: 'talheres',
        name: 'Talheres',
        description: 'Jogo de talheres elegante para a mesa',
        price: '327',
        image: 'Fotos/talheres.jpeg',
        pixKey: '00020126490014br.gov.bcb.pix0114+55319838789910209Talheres 5204000053039865406327.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514355186950300017br.gov.bcb.brcode01051.0.06304CDDB',
        qrcodeImage: 'Fotos/qrcodetalheres.jpeg'
    },
    {
        id: 'tacas-de-sobremesa',
        name: 'Taças de Sobremesa',
        description: 'Conjunto de taças delicadas para sobremesa',
        price: '80',
        image: 'Fotos/tacasdesobremesa.jpeg',
        pixKey: '00020126590014br.gov.bcb.pix0114+55319838789910219Tacas de sobremesa 520400005303986540580.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514371858450300017br.gov.bcb.brcode01051.0.06304CA8C',
        qrcodeImage: 'Fotos/qrcodetacasdesobremesa.jpeg'
    },
    {
        id: 'jogo-de-copos',
        name: 'Jogo de Copos',
        description: 'Jogo de copos para bebidas e festas',
        price: '40',
        image: 'Fotos/jogodecopos.jpeg',
        qrcodeImage: 'Fotos/qrcodejogodecopos.jpeg',
        pixKey: '00020126540014br.gov.bcb.pix0114+55319838789910214Jogo de copos 520400005303986540540.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514224332550300017br.gov.bcb.brcode01051.0.0630433FD'
    },
    {
        id: 'jogo-de-facas',
        name: 'Jogo de Facas',
        description: 'Jogo completo de facas para cozinha',
        price: '90',
        image: 'Fotos/jogodefacas.jpeg',
        qrcodeImage: 'Fotos/qrcodejogodefacas.jpeg',
        pixKey: '00020126540014br.gov.bcb.pix0114+55319838789910214Jogo de facas 520400005303986540590.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514384752050300017br.gov.bcb.brcode01051.0.06304BBBC'
    },
    {
        id: 'jogo-de-jantar',
        name: 'Jogo de Jantar',
        description: 'Jogo de jantar completo para receber amigos',
        price: '250',
        image: 'Fotos/jogodejantar .jpeg',
        pixKey: '00020126550014br.gov.bcb.pix0114+55319838789910215Jogo de jantar 5204000053039865406250.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052513595544350300017br.gov.bcb.brcode01051.0.06304B240',
        qrcodeImage: 'Fotos/qrcodejogodejantar.jpeg'
    },
    {
        id: 'jogo-de-panelas',
        name: 'Jogo de Panelas',
        description: 'Jogo de panelas resistente para cozinhar',
        price: '550',
        image: 'Fotos/jogodepanelas.jpeg',
        qrcodeImage: 'Fotos/qrcodejogodepanelas.jpeg'
    },
    {
        id: 'panelasidade-arroz',
        name: 'Panela de Arroz',
        description: 'Panela de arroz prática e rápida',
        price: '200',
        image: 'Fotos/panelaarroz.jpeg',
        qrcodeImage: 'Fotos/qrcodepanelaarroz.jpeg',
        pixKey: '00020126360014br.gov.bcb.pix0114+55319838789915204000053039865406200.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514572975550300017br.gov.bcb.brcode01051.0.063044E09',
    },
    {
        id: 'panela-de-pressao',
        name: 'Panela de Pressão',
        description: 'Panela de pressão para cozinhar com rapidez',
        price: '100',
        image: 'Fotos/paneladepressao.jpeg',
        pixKey: '00020126580014br.gov.bcb.pix0114+55319838789910218Panela de pressao 5204000053039865406100.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514455594950300017br.gov.bcb.brcode01051.0.0630472A0',
        qrcodeImage: 'Fotos/qrcodepaneladepressao.jpeg'
    },
    {
        id: 'utensilios-de-cozinha',
        name: 'Utensílios de Cozinha',
        description: 'Utensílios essenciais para preparar receitas',
        price: '140',
        image: 'Fotos/utensiliosdecozinha.jpeg',
        qrcodeImage: 'Fotos/qrcodeutensiliosdecozinha.jpeg',
        pixKey: '00020126620014br.gov.bcb.pix0114+55319838789910222Utensilios de cozinha 5204000053039865406140.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514445424450300017br.gov.bcb.brcode01051.0.06304D0A5'
    },
    {
        id: 'mixer',
        name: 'Mixer',
        description: 'Mixer portátil para suas receitas',
        price: '180',
        image: 'Fotos/mixer.jpeg',
        qrcodeImage: 'Fotos/qrcodemixer.jpeg',
        pixKey: '00020126460014br.gov.bcb.pix0114+55319838789910206Mixer 5204000053039865406180.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514233349450300017br.gov.bcb.brcode01051.0.06304A19E'
    },
    {
        id: 'fruteira',
        name: 'Fruteira',
        description: 'Fruteira bonita para decorar a mesa',
        price: '80',
        image: 'Fotos/fruteira.jpeg',
        qrcodeImage: 'Fotos/qrcodefruteira.jpeg',
        pixKey: '00020126490014br.gov.bcb.pix0114+55319838789910209Fruteira 520400005303986540580.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514465685850300017br.gov.bcb.brcode01051.0.063049621'
    },
    {
        id: 'batedeira',
        name: 'Batedeira',
        description: 'Batedeira prática para preparar receitas e massas',
        price: '150',
        image: 'Fotos/batedeira.jpeg',
        qrcodeImage: 'Fotos/qrcodebatedeira.jpeg'
    },
    {
        id: 'bule',
        name: 'Bule',
        description: 'Bule elegante para servir chás e cafés',
        price: '80',
        image: 'Fotos/bule.jpeg',
        qrcodeImage: 'Fotos/qrcodebule.jpeg'
    },
    {
        id: 'ferro',
        name: 'Ferro',
        description: 'Ferro de passar roupa com mais praticidade',
        price: '130',
        image: 'Fotos/ferro.jpeg',
        qrcodeImage: 'Fotos/qrcodeferro.jpeg',
        pixKey: '00020126550014br.gov.bcb.pix0114+55319838789910215Ferro eletrico 5204000053039865406170.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514473245250300017br.gov.bcb.brcode01051.0.06304F3F6',
    },
    {
        id: 'filtro-de-agua',
        name: 'Filtro de Água',
        description: 'Filtro de água para uma rotina mais saudável',
        price: '300',
        image: 'Fotos/filtrodeagua.jpeg',
        qrcodeImage: 'Fotos/qrcodefiltrodeagua.jpeg'
    },
    {
        id: 'garrafa-de-cafe',
        name: 'Garrafa de Café',
        description: 'Garrafa térmica para manter o café quente',
        price: '70',
        image: 'Fotos/garrafadecafe.jpeg',
        qrcodeImage: 'Fotos/qrcodegarrafadecafe.jpeg'
    },
    {
        id: 'jogo-de-bandejas',
        name: 'Jogo de Bandejas',
        description: 'Conjunto de bandejas para servir com estilo',
        price: '160',
        image: 'Fotos/jogodebandejas.jpeg',
        qrcodeImage: 'Fotos/qrcodejogodebandejas.jpeg'
    },
    {
        id: 'jogo-de-tigelas',
        name: 'Jogo de Tigelas',
        description: 'Jogo de tigelas versátil para o dia a dia',
        price: '60',
        image: 'Fotos/jogodetigelas.jpeg',
        qrcodeImage: 'Fotos/qrcodejogodetigelas.jpeg'
    },
    {
        id: 'porta-temperos',
        name: 'Porta Temperos',
        description: 'Porta temperos organizado para a cozinha',
        price: '60',
        image: 'Fotos/portatemperos.jpeg',
        qrcodeImage: 'Fotos/qrcodeportatemperos.jpeg',
        pixKey: '00020126550014br.gov.bcb.pix0114+55319838789910215Porta temperos 520400005303986540560.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052711591724550300017br.gov.bcb.brcode01051.0.06304796F'
    },
    {
        id: 'tábua-de-frios',
        name: 'Tábua de Frios',
        description: 'Tábua elegante para servir frios e petiscos',
        price: '40',
        image: 'Fotos/tabuadefrios.jpeg',
        qrcodeImage: 'Fotos/qrcodetabuadefrios.jpeg'
    },
    {
        id: 'moveis-planejados-cozinha',
        name: 'Móveis Planejados Cozinha',
        description: 'Móveis planejados para aproveitar o espaço da cozinha',
        price: '5000',
        image: 'Fotos/moveisplanejadoscozinha.jpeg',
        pixKey: '00020126660014br.gov.bcb.pix0114+55319838789910226Moveis planejados cozinha 52040000530398654075000.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514252381150300017br.gov.bcb.brcode01051.0.063042B9D',
        qrcodeImage: 'Fotos/qrcodemoveisplanejadoscozinha.jpeg'
    },
    {
        id: 'moveis-planejados-quarto',
        name: 'Móveis Planejados Quarto',
        description: 'Móveis planejados para quarto com estilo',
        price: '10000',
        image: 'Fotos/moveisplanejadosquarto.jpeg',
        pixKey: '00020126650014br.gov.bcb.pix0114+55319838789910225Moveis planejados quarto 520400005303986540810000.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514273284150300017br.gov.bcb.brcode01051.0.06304C253',
        qrcodeImage: 'Fotos/qrcodemoveisplanejadosquarto.jpeg'
    },
    {
        id: 'passagem',
        name: 'Passagem',
        description: 'Passagem para viagem de lua de mel',
        price: '800',
        image: 'Fotos/passagem.jpeg',
        qrcodeImage: 'Fotos/qrcodepassagem.jpeg',
        pixKey: '00020126600014br.gov.bcb.pix0114+55319838789910220Passagem lua de mel 5204000053039865406800.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052515044929450300017br.gov.bcb.brcode01051.0.063043C3C'
    },
    {
        id: 'passeios-lua-de-mel',
        name: 'Passeios de Lua de Mel',
        description: 'Passeios românticos para a lua de mel',
        price: '3000',
        image: 'Fotos/passeiosluademel.jpeg',
        qrcodeImage: 'Fotos/qrocdepasseiosluademel.jpeg'
    },
    {
        id: 'toalha-de-banho',
        name: 'Toalha de Banho',
        description: 'Toalha felpuda e macia para o banheiro',
        price: '200',
        image: 'Fotos/toalhadebanho.jpeg',
        pixKey: '00020126570014br.gov.bcb.pix0114+55319838789910217Toalhas de banho 5204000053039865406200.005802BR5923PRISCILA CANAZART SILVA6014BELO HORIZONTE62580520SAN2026052514322063150300017br.gov.bcb.brcode01051.0.0630459AE',
        qrcodeImage: 'Fotos/qrcodetoalhadebanho.jpeg'
    }
];

// Configuração do EmailJS
// Mantidos os IDs e chaves já configurados para cada fluxo do sistema.
const emailjsConfig = {
    publicKey: "e_9h-QCHc2hp9EaBc",
    privateKey: "cF4elVHxiflv2AjwZtZlN",
    serviceId: "service_l5smfqp",
    rsvpTemplateId: "template_4a4ndt6",
    giftTemplateId: "template_h20b92e"
};

function isEmailJsReady() {
    return Boolean(window.emailjs) &&
        typeof window.emailjs.send === 'function' &&
        emailjsConfig.publicKey &&
        emailjsConfig.publicKey !== 'SEU_PUBLIC_KEY' &&
        emailjsConfig.serviceId &&
        emailjsConfig.serviceId !== 'SEU_SERVICE_ID';
}

function getEmailJsOptions() {
    return {
        publicKey: emailjsConfig.publicKey
    };
}

function logEmailJsStatus(label) {
    if (isEmailJsReady()) {
        console.log(`[EmailJS] ${label} pronto.`, emailjsConfig);
    } else {
        console.warn(`[EmailJS] ${label} não está disponível. Verifique a configuração do EmailJS.`);
    }
}

if (window.emailjs && emailjsConfig.publicKey && emailjsConfig.publicKey !== 'SEU_PUBLIC_KEY') {
    emailjs.init({ publicKey: emailjsConfig.publicKey });
    logEmailJsStatus('Inicialização');
} else {
    logEmailJsStatus('Inicialização');
}

function openAuthModal() {
    authError.textContent = '';
    authForm.reset();
    authForm.classList.remove('hidden');
    adminContent.classList.add('hidden');
    authCard.classList.remove('admin-mode');
    authPopup.classList.add('active');
    authPopup.setAttribute('aria-hidden', 'false');
}

function closeAuthModal() {
    authPopup.classList.remove('active');
    authPopup.setAttribute('aria-hidden', 'true');
    authCard.classList.remove('admin-mode');
}

function showAuthError(message) {
    authError.textContent = message;
}

function hideAdminContent() {
    authForm.classList.remove('hidden');
    adminContent.classList.add('hidden');
    authCard.classList.remove('admin-mode');
}

async function showAdminData() {
    authForm.classList.add('hidden');
    adminContent.classList.remove('hidden');
    authCard.classList.add('admin-mode');
    authError.textContent = '';
}

async function loadAdminData() {
    adminRsvpList.innerHTML = '<li>Carregando...</li>';
    adminGiftList.innerHTML = '<li>Carregando...</li>';

    try {
        const [rsvpSnapshot, giftsSnapshot, selectedSnapshot] = await Promise.all([
            db.collection('rsvp').orderBy('timestamp', 'desc').get(),
            db.collection('gifts').get(),
            db.collection('selectedGifts').orderBy('timestamp', 'desc').get()
        ]);

        const giftNames = {};
        giftsSnapshot.forEach(doc => {
            giftNames[doc.id] = doc.data().name || 'Presente';
        });

        adminRsvpList.innerHTML = rsvpSnapshot.docs.length
            ? rsvpSnapshot.docs.map(doc => {
                const item = doc.data();
                const status = item.attending === 'yes' ? 'Vai' : 'Não vai';
                const guests = item.guests ? `${item.guests} convidados` : '';
                return `<li><span><strong>${item.name}</strong>${guests ? `<small>${guests}</small>` : ''}</span><span>${status}</span></li>`;
            }).join('')
            : '<li>Nenhuma confirmação encontrada.</li>';

        adminGiftList.innerHTML = selectedSnapshot.docs.length
            ? selectedSnapshot.docs.map(doc => {
                const item = doc.data();
                const giftLabel = giftNames[item.giftId] || item.giftId || 'Presente reservado';
                const emailDisplay = item.selectedEmail ? ` (${item.selectedEmail})` : '';
                return `<li><span><strong>${giftLabel}</strong></span><span>${item.selectedBy || 'Anônimo'}${emailDisplay}</span></li>`;
            }).join('')
            : '<li>Nenhuma reserva de presente encontrada.</li>';
    } catch (error) {
        console.error('Erro ao carregar dados secretos:', error);
        adminRsvpList.innerHTML = '<li>Erro ao carregar lista de presença.</li>';
        adminGiftList.innerHTML = '<li>Erro ao carregar reservas de presente.</li>';
    }
}

async function handleAuthSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();

    if (!email || !password) {
        showAuthError('Preencha e-mail e senha.');
        return;
    }

    try {
        await auth.signInWithEmailAndPassword(email, password);
        await loadAdminData();
        await showAdminData();
    } catch (error) {
        console.error('Erro de autenticação:', error);
        showAuthError('Login inválido. Verifique seus dados e tente novamente.');
    }
}

async function handleAuthLogout() {
    try {
        await auth.signOut();
    } finally {
        closeAuthModal();
    }
}

secretLoginTrigger.addEventListener('click', openAuthModal);
authLogoutButton.addEventListener('click', handleAuthLogout);
authCancelButton.addEventListener('click', closeAuthModal);
authCloseButton.addEventListener('click', closeAuthModal);
authPopup.addEventListener('click', event => {
    if (event.target === authPopup) {
        closeAuthModal();
    }
});

authForm.addEventListener('submit', handleAuthSubmit);

function activateTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(tabButton => {
        tabButton.classList.toggle('active', tabButton.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === tabId);
    });
}

function showPopup(title, message) {
    const popup = document.getElementById('rsvp-popup');
    document.getElementById('popup-title').textContent = title;
    document.getElementById('popup-message').textContent = message;
    popup.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
}

function closePopup() {
    const popup = document.getElementById('rsvp-popup');
    popup.classList.remove('active');
    popup.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('#rsvp-popup .popup-close, #rsvp-popup .popup-button').forEach(button => {
    button.addEventListener('click', closePopup);
});

document.getElementById('rsvp-popup').addEventListener('click', (event) => {
    if (event.target.id === 'rsvp-popup') {
        closePopup();
    }
});

// Event listeners para QR code popup
function closeGiftQrCodePopup() {
    giftQrcodePopup.classList.remove('active');
    giftQrcodePopup.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('#gift-qrcode-popup .popup-close, #gift-qrcode-close').forEach(button => {
    button.addEventListener('click', closeGiftQrCodePopup);
});

giftQrcodePopup.addEventListener('click', (event) => {
    if (event.target.id === 'gift-qrcode-popup') {
        closeGiftQrCodePopup();
    }
});

// Navegação entre abas
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        activateTab(button.dataset.tab);
    });
});

document.querySelectorAll('.cover-button').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();

        const cover = document.getElementById('cover');
        const targetTab = button.getAttribute('data-cover-tab');
        const tabs = document.getElementById('tabs');

        if (!targetTab || !cover || cover.classList.contains('cover-hidden')) {
            return;
        }

        activateTab(targetTab);
        document.body.classList.remove('cover-active');
        cover.classList.add('cover-hidden');

        setTimeout(() => {
            cover.classList.add('cover-dismissed');
        }, 600);

        setTimeout(() => {
            if (tabs) {
                tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 250);
    });
});

const guestsInput = document.getElementById('guests');
const guestNamesContainer = document.getElementById('guest-names-container');

function updateGuestNameFields() {
    const count = Math.max(0, Number.parseInt(guestsInput.value, 10) || 0);
    guestNamesContainer.innerHTML = '';

    for (let i = 1; i <= count; i += 1) {
        const field = document.createElement('input');
        field.type = 'text';
        field.className = 'guest-name-input';
        field.placeholder = `Nome do convidado ${i}`;
        field.required = true;
        guestNamesContainer.appendChild(field);
    }
}

guestsInput.addEventListener('input', updateGuestNameFields);
updateGuestNameFields();

// Função para enviar RSVP
document.getElementById('rsvp-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const attending = document.getElementById('attending').value;
    const guestsNumber = Math.max(0, Number.parseInt(document.getElementById('guests').value, 10) || 0);
    const guestNames = Array.from(document.querySelectorAll('.guest-name-input'))
        .map(input => input.value.trim());

    if (guestsNumber > 0 && guestNames.some(guestName => guestName === '')) {
        document.getElementById('rsvp-message').textContent = 'Preencha todos os nomes dos convidados.';
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    document.getElementById('rsvp-message').textContent = '';

    try {
        await db.collection('rsvp').add({
            name,
            email,
            attending,
            guests: guestsNumber,
            guestNames,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        try {
            await sendConfirmationEmail({
                name,
                email,
                attending,
                guests: guestsNumber,
                guestNames
            });
        } catch (emailError) {
            console.error('RSVP salvo, mas houve erro ao enviar o e-mail:', emailError);
        }

        document.getElementById('rsvp-message').textContent = 'Obrigado por confirmar sua presença!';
        showPopup(
            `Obrigado, ${name}!`,
            'Recebemos sua confirmação com muito carinho. Vai ser uma alegria enorme ter você conosco nesse dia tão especial.'
        );
        form.reset();
    } catch (error) {
        console.error('Erro ao enviar RSVP:', error);
        const permissionDenied = error && error.code === 'permission-denied';
        const message = permissionDenied
            ? 'Erro de permissão no Firebase. Verifique as regras do Firestore.'
            : 'Erro ao enviar. Tente novamente.';

        document.getElementById('rsvp-message').textContent = message;
        showPopup(
            'Ops, não conseguimos enviar',
            permissionDenied
                ? 'O formulário está funcionando, mas o banco de dados recusou a gravação. Ajuste as regras do Firestore para permitir novas confirmações.'
                : 'Aconteceu um imprevisto ao confirmar sua presença. Por favor, tente novamente em alguns instantes.'
        );
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar';
    }
});

async function sendEmailFlow(templateId, templateParams) {
    if (!isEmailJsReady()) {
        console.warn('[EmailJS] Fluxo bloqueado porque o EmailJS não está pronto para envio.');
        return false;
    }

    try {
        await emailjs.send(
            emailjsConfig.serviceId,
            templateId,
            templateParams,
            getEmailJsOptions()
        );
        return true;
    } catch (error) {
        console.error('[EmailJS] Falha no envio do fluxo:', error);
        throw error;
    }
}

async function sendConfirmationEmail({ name, email, attending, guests, guestNames = [] }) {
    if (!emailjsConfig.rsvpTemplateId || emailjsConfig.rsvpTemplateId === 'SEU_RSVP_TEMPLATE_ID') {
        console.warn('[EmailJS] Template do RSVP não foi configurado.');
        return false;
    }

    const attendingText = attending === 'yes' ? 'Sim, vou comparecer' : 'Não vou poder comparecer';

    return sendEmailFlow(emailjsConfig.rsvpTemplateId, {
        subject: `Confirmação de presença - ${name}`,
        to_email: email,
        to_name: name,
        email,
        user_email: email,
        guest_name: name,
        guest_email: email,
        attending: attendingText,
        guests: String(guests || '0'),
        guest_names: guestNames.length ? guestNames.join(', ') : 'Nenhum convidado adicional',
        wedding_date: '05 de setembro de 2026',
        couple_names: 'Priscila e Marconi',
        from_name: 'Priscila e Marconi',
        reply_to: email
    });
}

function getGiftField(gift, fieldNames, fallback = '') {
    const sources = Array.isArray(gift) ? gift : [gift];

    for (const source of sources) {
        for (const fieldName of fieldNames) {
            const value = source && source[fieldName];
            if (value !== undefined && value !== null && String(value).trim() !== '') {
                return String(value).trim();
            }
        }
    }

    return fallback;
}

function formatGiftPrice(price) {
    const rawPrice = String(price || '').trim();

    if (!rawPrice) {
        return 'R$ 0';
    }

    return rawPrice.toLowerCase().startsWith('r$') ? rawPrice : `R$ ${rawPrice}`;
}

function getAbsoluteAssetUrl(assetPath) {
    const path = String(assetPath || '').trim();

    if (!path) {
        return '';
    }

    try {
        return encodeURI(new URL(path, window.location.href).href);
    } catch (error) {
        console.warn('[EmailJS] Nao foi possivel montar a URL do ativo:', assetPath, error);
        return path;
    }
}

async function sendGiftReservationEmail({ name, email, gift }) {
    if (!emailjsConfig.giftTemplateId || emailjsConfig.giftTemplateId === 'SEU_GIFT_TEMPLATE_ID') {
        console.warn('[EmailJS] Template do presente não foi configurado.');
        return false;
    }

    if (emailjsConfig.giftTemplateId === emailjsConfig.rsvpTemplateId) {
        console.warn('[EmailJS] O template do presente deve ser diferente do RSVP para evitar conflitos.');
        return false;
    }

    const giftId = getGiftField(gift, ['id', 'giftId']);
    const defaultGift = defaultGifts.find(item => item.id === giftId);
    const giftSources = [gift, defaultGift];
    const giftName = getGiftField(giftSources, ['name', 'gift_name', 'giftName', 'title'], 'Presente');
    const giftDescription = getGiftField(giftSources, ['description', 'gift_description', 'giftDescription', 'descricao'], 'Presente reservado');
    const giftPrice = formatGiftPrice(getGiftField(giftSources, ['price', 'gift_price', 'giftPrice', 'value', 'valor'], '0'));
    const giftQrPath = getGiftField(giftSources, ['qrcodeImage', 'qrCodeImage', 'qr_code_image', 'gift_qr_url', 'qrCodeUrl', 'qrcodeUrl', 'qrUrl']);
    const giftQrUrl = getAbsoluteAssetUrl(giftQrPath);
    const giftPixKey = getGiftField(giftSources, ['pixKey', 'gift_pix_key', 'pix_key', 'pix', 'pixCode', 'codigoPix']);
    const hasPixKey = Boolean(giftPixKey && String(giftPixKey).trim() !== '');

    const templateParams = {
        subject: `Reserva de presente - ${giftName}`,
        to_email: email,
        to_name: name,
        email,
        user_email: email,
        gift_name: giftName,
        gift_description: giftDescription,
        gift_price: giftPrice,
        gift_qr_url: giftQrUrl,
        qr_code_image: giftQrUrl,
        gift_pix_key: giftPixKey,
        has_pix_key: hasPixKey,
        // Compatibilidade: algumas templates/implementações podem usar variações do nome
        pix_key: giftPixKey,
        pixKey: giftPixKey,
        // Valor não-escapado para templates que precisem mostrar exatamente o conteúdo
        gift_pix_key_unescaped: giftPixKey,
        couple_names: 'Priscila e Marconi',
        payment_instruction: 'Escaneie o QR Code para realizar o pagamento do presente reservado.',
        from_name: 'Priscila e Marconi',
        reply_to: email,
        giftName,
        giftDescription,
        giftPrice,
        qrCodeImage: giftQrUrl,
        qrcodeImage: giftQrUrl,
        pixKey: giftPixKey
    };

    console.log('[EmailJS] Enviando reserva de presente com template:', emailjsConfig.giftTemplateId, templateParams);

    try {
        return await sendEmailFlow(emailjsConfig.giftTemplateId, templateParams);
    } catch (error) {
        console.error('[EmailJS] Falha ao enviar email de reserva de presente:', error);
        throw new Error('Não foi possível enviar o email de confirmação do presente. Verifique a configuração do EmailJS.');
    }
}

// Função para carregar lista de presentes
async function loadGifts() {
    const giftList = document.getElementById('gift-list');
    giftList.innerHTML = '<p>Carregando presentes...</p>';

    try {
        const [giftSnapshot, selectedSnapshot] = await Promise.all([
            db.collection('gifts').get(),
            db.collection('selectedGifts').get()
        ]);

        const gifts = new Map();
        // Adiciona presentes padrão
        defaultGifts.forEach(gift => gifts.set(gift.id, gift));
        
        const selectedGifts = {};

        // Adiciona ou mescla presentes do Firebase
        giftSnapshot.forEach(doc => {
            const firebaseGift = {
                id: doc.id,
                ...doc.data()
            };
            
            // Se o presente já existe como padrão, mescla as propriedades
            if (gifts.has(doc.id)) {
                const defaultGift = gifts.get(doc.id);
                gifts.set(doc.id, {
                    ...defaultGift,
                    ...firebaseGift
                });
            } else {
                gifts.set(doc.id, firebaseGift);
            }
        });

        selectedSnapshot.forEach(doc => {
            const item = doc.data();
            const giftId = item.giftId || doc.id;
            selectedGifts[giftId] = item;
        });

        giftList.innerHTML = '';
        gifts.forEach(gift => {
            giftList.appendChild(createGiftItem(gift, selectedGifts[gift.id]));
        });
    } catch (error) {
        console.error('Erro ao carregar presentes:', error);
        // Fallback: lista estática
        defaultGifts.forEach(gift => {
            giftList.appendChild(createGiftItem(gift));
        });
    }
}

function createGiftItem(gift, selectedGift) {
    const giftItem = document.createElement('div');
    giftItem.className = 'gift-item';

    if (selectedGift) {
        giftItem.classList.add('gift-item-reserved');
    }

    // Adicionar imagem se existir
    if (gift.image) {
        const img = document.createElement('img');
        img.src = encodeURI(gift.image);
        img.alt = gift.name || 'Presente';
        img.className = 'gift-item-image';
        giftItem.appendChild(img);
    }

    const title = document.createElement('h3');
    title.textContent = gift.name || 'Presente';

    const description = document.createElement('p');
    description.textContent = gift.description || '';

    const price = document.createElement('p');
    price.className = 'gift-price';
    price.textContent = `R$ ${gift.price || '0'}`;

    const reservation = document.createElement('div');
    reservation.className = 'gift-reservation';

    if (selectedGift) {
        const reservedMessage = document.createElement('p');
        reservedMessage.className = 'gift-reserved-message';
        reservedMessage.textContent = 'Indisponível';
        reservation.appendChild(reservedMessage);
    } else {
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Seu nome';

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.placeholder = 'Seu email';
        emailInput.setAttribute('aria-label', `Email para reservar ${gift.name || 'presente'}`);
        emailInput.required = true;

        const reserveButton = document.createElement('button');
        reserveButton.type = 'button';
        reserveButton.textContent = 'Reservar';
        reserveButton.addEventListener('click', () => selectGift(gift.id, nameInput.value, emailInput.value, gift));

        reservation.append(nameInput, emailInput, reserveButton);
    }

    giftItem.append(title, description, price, reservation);
    return giftItem;
}

// Função para selecionar presente
async function selectGift(giftId, selectedBy, selectedEmail, giftData) {
    const selectedName = String(selectedBy || '').trim();
    const selectedEmailTrimmed = String(selectedEmail || '').trim();

    if (!selectedName) {
        alert('Digite seu nome para reservar o presente.');
        return;
    }

    if (!selectedEmailTrimmed) {
        alert('Digite seu email para reservar o presente.');
        return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(selectedEmailTrimmed)) {
        alert('Digite um email válido.');
        return;
    }

    try {
        const selectedGiftRef = db.collection('selectedGifts').doc(giftId);

        await db.runTransaction(async transaction => {
            const selectedGift = await transaction.get(selectedGiftRef);

            if (selectedGift.exists) {
                throw new Error('gift-already-reserved');
            }

            transaction.set(selectedGiftRef, {
                giftId,
                selectedBy: selectedName,
                selectedEmail: selectedEmailTrimmed,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        });

        try {
            await sendGiftReservationEmail({
                name: selectedName,
                email: selectedEmailTrimmed,
                gift: giftData
            });
        } catch (emailError) {
            console.error('Erro ao enviar email de reserva de presente:', emailError);
            alert(emailError.message || 'Não foi possível enviar o email de confirmação do presente.');
        }

        // Mostrar QR code
        showGiftQrCode(giftData, selectedName, selectedEmailTrimmed);
        
        // Recarregar presentes após sucesso
        setTimeout(() => {
            loadGifts();
        }, 2000);
    } catch (error) {
        console.error('Erro ao selecionar presente:', error);
        const permissionDenied = error && error.code === 'permission-denied';
        alert(error.message === 'gift-already-reserved'
            ? 'Este presente já foi reservado.'
            : permissionDenied
                ? 'Erro de permissão no Firebase. Verifique as regras do Firestore para selectedGifts.'
                : 'Erro ao reservar presente. Tente novamente.');
    }
}

// Função para exibir QR code
function showGiftQrCode(giftData, selectedBy, selectedEmail) {
    try {
        const messageElement = document.getElementById('gift-qrcode-message');
        const imageElement = document.getElementById('gift-qrcode-image');
        const qrcodePopup = document.getElementById('gift-qrcode-popup');
        const qrcodeError = document.getElementById('gift-qrcode-error');
        
        messageElement.textContent = `Presente "${giftData.name}" reservado por ${selectedBy}!`;
        
        // Limpar erro anterior
        if (qrcodeError) qrcodeError.style.display = 'none';
        
        // Exibir imagem do QR code
        if (giftData.qrcodeImage) {
            console.log('Carregando QR code:', giftData.qrcodeImage);
            imageElement.src = encodeURI(giftData.qrcodeImage);
            imageElement.alt = `QR Code do ${giftData.name}`;
            imageElement.style.display = 'block';
        } else {
            console.warn('Nenhuma imagem de QR code definida para:', giftData.name);
            imageElement.style.display = 'none';
            if (qrcodeError) qrcodeError.style.display = 'block';
        }
        
        qrcodePopup.classList.add('active');
        qrcodePopup.setAttribute('aria-hidden', 'false');
    } catch (error) {
        console.error('Erro em showGiftQrCode:', error);
    }
}

// Carregar presentes ao carregar a página
window.addEventListener('load', loadGifts);

// Animações de scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
});

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Função para contagem regressiva
function updateCountdown() {
    const weddingDate = new Date('2026-09-05T00:00:00');
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
        document.getElementById('countdown').innerHTML = 'O grande dia chegou!';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerHTML = `Faltam ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos para o casamento!`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Carrossel de Fotos
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    slides[n].classList.add('active');
    indicators[n].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function goToSlide(n) {
    currentSlide = n;
    showSlide(currentSlide);
}

// Inicializar carrossel
showSlide(0);

// Trocar slide a cada 7 segundos
let carouselInterval = setInterval(nextSlide, 7000);

// Pausar e retomar ao passar mouse sobre o carrossel
const carousel = document.querySelector('.carousel-container');
if (carousel) {
    carousel.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        clearInterval(carouselInterval);
        carouselInterval = setInterval(nextSlide, 7000);
    });
}

// Adicionar listeners aos indicadores
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        goToSlide(index);
    });
});
