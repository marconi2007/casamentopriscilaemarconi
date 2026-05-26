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
const testGift = {
    id: 'teste',
    name: 'Teste',
    description: 'Presente de teste',
    price: '0'
};

// Presentes padrão com imagens
const defaultGifts = [
    {
        id: 'geladeira',
        name: 'Geladeira',
        description: 'Geladeira moderna para sua cozinha',
        price: '3500',
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
        price: '899',
        image: 'Fotos/microondas.jpeg',
        qrcodeImage: 'Fotos/qrcodemicroondas.jpeg'
    },
    {
        id: 'forno',
        name: 'Forno',
        description: 'Forno elétrico para assados e gratinados',
        price: '1299',
        image: 'Fotos/forno.jpeg',
        qrcodeImage: 'Fotos/qrcodeforno.jpeg'
    },
    {
        id: 'climatizador',
        name: 'Climatizador',
        description: 'Climatizador refrescante para dias quentes',
        price: '749',
        image: 'Fotos/climatizador.jpeg',
        qrcodeImage: 'Fotos/qrcodeclimatizador.jpeg'
    },
    {
        id: 'cortinas',
        name: 'Cortinas',
        description: 'Cortinas elegantes para sala ou quarto',
        price: '399',
        image: 'Fotos/cortinas.jpeg',
        qrcodeImage: 'Fotos/qrcodecortinas.jpeg'
    },
    {
        id: 'cama',
        name: 'Cama',
        description: 'Cama confortável para noites mais tranquilas',
        price: '1599',
        image: 'Fotos/cama.jpeg',
        qrcodeImage: 'Fotos/qrcodecama.jpeg'
    },
    {
        id: 'roupas-de-cama',
        name: 'Roupas de Cama',
        description: 'Conjunto de roupas de cama premium',
        price: '499',
        image: 'Fotos/roupasdecama.jpeg',
        qrcodeImage: 'Fotos/qrcoderoupasdecama.jpeg'
    },
    {
        id: 'edredom-queen',
        name: 'Edredom Queen',
        description: 'Edredom queen size macio e aconchegante',
        price: '799',
        image: 'Fotos/edredonquenn.jpeg',
        qrcodeImage: 'Fotos/qrcodeedredonqueen.jpeg'
    },
    {
        id: 'passagem',
        name: 'Passagem',
        description: 'Passagem para viagem de lua de mel',
        price: '1200',
        image: 'Fotos/passagem.jpeg',
        qrcodeImage: 'Fotos/qrcodepassagem.jpeg'
    }
];

// Configuração do EmailJS
// Preencha estes valores com os dados da sua conta EmailJS.
const emailjsConfig = {
    publicKey: "e_9h-QCHc2hp9EaBc",
    serviceId: "service_l5smfqp",
    rsvpTemplateId: "template_4a4ndt6",
    giftTemplateId: "template_4a4ndt6"
};

if (window.emailjs && emailjsConfig.publicKey !== "SEU_PUBLIC_KEY") {
    emailjs.init({
        publicKey: emailjsConfig.publicKey
    });
    console.log('EmailJS inicializado:', emailjsConfig);
} else {
    console.warn('EmailJS não foi inicializado. Verifique se o script do EmailJS está carregando corretamente.');
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
        giftNames[testGift.id] = testGift.name;
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
    button.addEventListener('click', () => {
        const cover = document.getElementById('cover');

        if (cover.classList.contains('cover-hidden')) {
            return;
        }

        activateTab(button.dataset.coverTab);
        document.body.classList.remove('cover-active');
        cover.classList.add('cover-hidden');

        setTimeout(() => {
            cover.classList.add('cover-dismissed');
        }, 600);

        setTimeout(() => {
            document.getElementById('tabs').scrollIntoView({ behavior: 'smooth' });
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

async function sendConfirmationEmail({ name, email, attending, guests, guestNames = [] }) {
    const emailIsConfigured = window.emailjs &&
        emailjsConfig.publicKey !== "SEU_PUBLIC_KEY" &&
        emailjsConfig.serviceId !== "SEU_SERVICE_ID" &&
        emailjsConfig.rsvpTemplateId !== "SEU_RSVP_TEMPLATE_ID";

    if (!emailIsConfigured) {
        console.warn('EmailJS ainda não está configurado. Preencha publicKey, serviceId e rsvpTemplateId.');
        return;
    }

    const attendingText = attending === 'yes' ? 'Sim, vou comparecer' : 'Não vou poder comparecer';

    await emailjs.send(emailjsConfig.serviceId, emailjsConfig.rsvpTemplateId, {
        subject: `Confirmação de presença - ${name}`,
        to_email: email,
        to_name: name,
        email: email,
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
    const emailIsConfigured = window.emailjs &&
        emailjsConfig.publicKey !== "SEU_PUBLIC_KEY" &&
        emailjsConfig.serviceId !== "SEU_SERVICE_ID" &&
        emailjsConfig.giftTemplateId !== "SEU_GIFT_TEMPLATE_ID";

    if (!emailIsConfigured) {
        console.warn('EmailJS ainda não está configurado. Preencha publicKey, serviceId e giftTemplateId.');
        return;
    }

    const qrCodeUrl = gift.qrcodeImage
        ? new URL(gift.qrcodeImage, window.location.href).href
        : '';
    const templateParams = {
        subject: `Reserva de presente - ${gift.name}`,
        to_email: email,
        to_name: name,
        email: email,
        user_email: email,
        gift_name: gift.name,
        gift_description: gift.description,
        gift_price: `R$ ${gift.price}`,
        gift_qr_url: qrCodeUrl,
        qr_code_image: qrCodeUrl,
        from_name: 'Priscila e Marconi',
        reply_to: email
    };

    console.log('Enviando email de reserva de presente:', templateParams);
    await emailjs.send(emailjsConfig.serviceId, emailjsConfig.giftTemplateId, templateParams);
    console.log('Email de reserva de presente enviado com sucesso');
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
        gifts.set(testGift.id, testGift);
        
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
        giftList.innerHTML = '';
        defaultGifts.forEach(gift => {
            giftList.appendChild(createGiftItem(gift));
        });
        giftList.appendChild(createGiftItem(testGift));
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
        img.src = gift.image;
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
        nameInput.setAttribute('aria-label', `Nome para reservar ${gift.name || 'presente'}`);

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
            imageElement.src = giftData.qrcodeImage;
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
