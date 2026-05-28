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
        qrcodeImage: 'Fotos/qrcodeAirfryer.jpeg'
    },
    {
        id: 'assadeiras',
        name: 'Assadeiras',
        description: 'Conjunto de assadeiras versáteis para forno',
        price: '180',
        image: 'Fotos/assadeiras.jpeg',
        qrcodeImage: 'Fotos/qrcodeassadeiras.jpeg'
    },
    {
        id: 'boleira-e-queijeira',
        name: 'Boleira e Queijeira',
        description: 'Conjunto elegante para servir bolos e queijos',
        price: '150',
        image: 'Fotos/boleiraequeijeira.jpeg',
        qrcodeImage: 'Fotos/qrcodeboleiraequeijeira.jpeg'
    },
    {
        id: 'cafeteira',
        name: 'Cafeteira',
        description: 'Cafeteira para começar o dia com aroma fresco',
        price: '289',
        image: 'Fotos/cafeteira.jpeg',
        qrcodeImage: 'Fotos/qrcodecafeteira.jpeg'
    },
    {
        id: 'geladeira',
        name: 'Geladeira',
        description: 'Geladeira moderna para sua cozinha',
        price: '3199',
        image: 'Fotos/geladeira.jpeg',
        qrcodeImage: 'Fotos/qrcodegeladeira.jpeg'
    },
    {
        id: 'maquina-lavar',
        name: 'Máquina de Lavar',
        description: 'Máquina de lavar com tecnologia avançada',
        price: '4099',
        image: 'Fotos/maquina.jpeg',
        qrcodeImage: 'Fotos/qrcodemaquina.jpeg'
    },
    {
        id: 'microondas',
        name: 'Microondas',
        description: 'Microondas prático para sua cozinha',
        price: '550',
        image: 'Fotos/microondas.jpeg',
        qrcodeImage: 'Fotos/qrcodemicroondas.jpeg'
    },
    {
        id: 'forno',
        name: 'Forno',
        description: 'Forno elétrico para assados e gratinados',
        price: '400',
        image: 'Fotos/forno.jpeg',
        qrcodeImage: 'Fotos/qrcodeforno.jpeg'
    },
    {
        id: 'climatizador',
        name: 'Climatizador',
        description: 'Climatizador refrescante para dias quentes',
        price: '349',
        image: 'Fotos/climatizador.jpeg',
        qrcodeImage: 'Fotos/qrcodeclimatizador.jpeg'
    },
    {
        id: 'depurador-de-ar',
        name: 'Depurador de Ar',
        description: 'Depurador de ar para uma cozinha mais limpa',
        price: '350',
        image: 'Fotos/depuradordear.jpeg',
        qrcodeImage: 'Fotos/qrcodedepuradordear.jpeg'
    },
    {
        id: 'cortinas',
        name: 'Cortinas',
        description: 'Cortinas elegantes para sala ou quarto',
        price: '299,90',
        image: 'Fotos/cortinas.jpeg',
        qrcodeImage: 'Fotos/qrcodecortinas.jpeg'
    },
    {
        id: 'cama',
        name: 'Cama',
        description: 'Cama confortável para noites mais tranquilas',
        price: '1900',
        image: 'Fotos/cama.jpeg',
        qrcodeImage: 'Fotos/qrcodecama.jpeg'
    },
    {
        id: 'roupas-de-cama',
        name: 'Roupas de Cama',
        description: 'Conjunto de roupas de cama premium',
        price: '180',
        image: 'Fotos/roupasdecama.jpeg',
        qrcodeImage: 'Fotos/qrcoderoupasdecama.jpeg'
    },
    {
        id: 'edredom-queen',
        name: 'Edredom Queen',
        description: 'Edredom queen size macio e aconchegante',
        price: '229',
        image: 'Fotos/edredonquenn.jpeg',
        qrcodeImage: 'Fotos/qrcodeedredonqueen.jpeg'
    },
    {
        id: 'sofa',
        name: 'Sofá',
        description: 'Sofá confortável para a sala',
        price: '1800',
        image: 'Fotos/sofa.jpeg',
        qrcodeImage: 'Fotos/qrcodesofa.jpeg'
    },
    {
        id: 'mesa',
        name: 'Mesa',
        description: 'Mesa elegante para a sala de jantar',
        price: '1700',
        image: 'Fotos/mesa.jpeg',
        qrcodeImage: 'Fotos/qrcodemesa.jpeg'
    },
    {
        id: 'tapete-para-sala',
        name: 'Tapete para Sala',
        description: 'Tapete aconchegante para a sala',
        price: '150',
        image: 'Fotos/tapeteparasala.jpeg',
        qrcodeImage: 'Fotos/qrcodetapeteparasala.jpeg'
    },
    {
        id: 'tv',
        name: 'TV',
        description: 'TV para momentos de cinema em casa',
        price: '2100',
        image: 'Fotos/tv.jpeg',
        qrcodeImage: 'Fotos/qrcodetv.jpeg'
    },
    {
        id: 'talheres',
        name: 'Talheres',
        description: 'Jogo de talheres elegante para a mesa',
        price: '327',
        image: 'Fotos/talheres.jpeg',
        qrcodeImage: 'Fotos/qrcodetalheres.jpeg'
    },
    {
        id: 'tacas-de-sobremesa',
        name: 'Taças de Sobremesa',
        description: 'Conjunto de taças delicadas para sobremesa',
        price: '80',
        image: 'Fotos/tacasdesobremesa.jpeg',
        qrcodeImage: 'Fotos/qrcodetacasdesobremesa.jpeg'
    },
    {
        id: 'jogo-de-copos',
        name: 'Jogo de Copos',
        description: 'Jogo de copos para bebidas e festas',
        price: '40',
        image: 'Fotos/jogodecopos.jpeg',
        qrcodeImage: 'Fotos/qrcodejogodecopos.jpeg'
    },
    {
        id: 'jogo-de-facas',
        name: 'Jogo de Facas',
        description: 'Jogo completo de facas para cozinha',
        price: '90',
        image: 'Fotos/jogodefacas.jpeg',
        qrcodeImage: 'Fotos/qrcodejogodefacas.jpeg'
    },
    {
        id: 'jogo-de-jantar',
        name: 'Jogo de Jantar',
        description: 'Jogo de jantar completo para receber amigos',
        price: '250',
        image: 'Fotos/jogodejantar .jpeg',
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
        qrcodeImage: 'Fotos/qrcodepanelaarroz.jpeg'
    },
    {
        id: 'panela-de-pressao',
        name: 'Panela de Pressão',
        description: 'Panela de pressão para cozinhar com rapidez',
        price: '100',
        image: 'Fotos/paneladepressao.jpeg',
        qrcodeImage: 'Fotos/qrcodepaneladepressao.jpeg'
    },
    {
        id: 'utensilios-de-cozinha',
        name: 'Utensílios de Cozinha',
        description: 'Utensílios essenciais para preparar receitas',
        price: '140',
        image: 'Fotos/utensiliosdecozinha.jpeg',
        qrcodeImage: 'Fotos/qrcodeutensiliosdecozinha.jpeg'
    },
    {
        id: 'mixer',
        name: 'Mixer',
        description: 'Mixer portátil para suas receitas',
        price: '180',
        image: 'Fotos/mixer.jpeg',
        qrcodeImage: 'Fotos/qrcodemixer.jpeg'
    },
    {
        id: 'fruteira',
        name: 'Fruteira',
        description: 'Fruteira bonita para decorar a mesa',
        price: '80',
        image: 'Fotos/fruteira.jpeg',
        qrcodeImage: 'Fotos/qrcodefruteira.jpeg'
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
        qrcodeImage: 'Fotos/qrcodeferro.jpeg'
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
        qrcodeImage: 'Fotos/qrcodeportatemperos.jpeg'
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
        qrcodeImage: 'Fotos/qrcodemoveisplanejadoscozinha.jpeg'
    },
    {
        id: 'moveis-planejados-quarto',
        name: 'Móveis Planejados Quarto',
        description: 'Móveis planejados para quarto com estilo',
        price: '10000',
        image: 'Fotos/moveisplanejadosquarto.jpeg',
        qrcodeImage: 'Fotos/qrcodemoveisplanejadosquarto.jpeg'
    },
    {
        id: 'passagem',
        name: 'Passagem',
        description: 'Passagem para viagem de lua de mel',
        price: '800',
        image: 'Fotos/passagem.jpeg',
        qrcodeImage: 'Fotos/qrcodepassagem.jpeg'
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

async function sendGiftReservationEmail({ name, email, gift }) {
    if (!emailjsConfig.giftTemplateId || emailjsConfig.giftTemplateId === 'SEU_GIFT_TEMPLATE_ID') {
        console.warn('[EmailJS] Template do presente não foi configurado.');
        return false;
    }

    if (emailjsConfig.giftTemplateId === emailjsConfig.rsvpTemplateId) {
        console.warn('[EmailJS] O template do presente deve ser diferente do RSVP para evitar conflitos.');
        return false;
    }

    const qrCodeUrl = gift.qrcodeImage
        ? new URL(gift.qrcodeImage, window.location.href).href
        : '';

    const templateParams = {
        subject: `Reserva de presente - ${gift.name}`,
        to_email: email,
        to_name: name,
        email,
        user_email: email,
        gift_name: gift.name,
        gift_description: gift.description,
        gift_price: `R$ ${gift.price}`,
        gift_qr_url: qrCodeUrl,
        qr_code_image: qrCodeUrl,
        couple_names: 'Priscila e Marconi',
        payment_instruction: 'Escaneie o QR Code para realizar o pagamento do presente reservado.',
        from_name: 'Priscila e Marconi',
        reply_to: email
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
