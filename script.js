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
const authForm = document.getElementById('auth-form');
const authError = document.getElementById('auth-error');
const adminContent = document.getElementById('admin-content');
const adminRsvpList = document.getElementById('admin-rsvp-list');
const adminGiftList = document.getElementById('admin-gift-list');
const secretLoginTrigger = document.getElementById('secret-login-trigger');
const authLogoutButton = document.getElementById('auth-logout');
const authCancelButton = document.getElementById('auth-cancel');

// Configuração do EmailJS
// Preencha estes valores com os dados da sua conta EmailJS.
const emailjsConfig = {
    publicKey: "e_9h-QCHc2hp9EaBc",
    serviceId: "service_l5smfqp",
    templateId: "template_4a4ndt6"
};

if (window.emailjs && emailjsConfig.publicKey !== "SEU_PUBLIC_KEY") {
    emailjs.init({
        publicKey: emailjsConfig.publicKey
    });
}

function openAuthModal() {
    authError.textContent = '';
    authForm.reset();
    authForm.classList.remove('hidden');
    adminContent.classList.add('hidden');
    authPopup.classList.add('active');
    authPopup.setAttribute('aria-hidden', 'false');
}

function closeAuthModal() {
    authPopup.classList.remove('active');
    authPopup.setAttribute('aria-hidden', 'true');
}

function showAuthError(message) {
    authError.textContent = message;
}

function hideAdminContent() {
    authForm.classList.remove('hidden');
    adminContent.classList.add('hidden');
}

async function showAdminData() {
    authForm.classList.add('hidden');
    adminContent.classList.remove('hidden');
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
                return `<li><strong>${item.name}</strong> — ${status}${item.guests ? ` (${item.guests} convidados)` : ''}</li>`;
            }).join('')
            : '<li>Nenhuma confirmação encontrada.</li>';

        adminGiftList.innerHTML = selectedSnapshot.docs.length
            ? selectedSnapshot.docs.map(doc => {
                const item = doc.data();
                const giftLabel = giftNames[item.giftId] || item.giftId || 'Presente reservado';
                return `<li><strong>${giftLabel}</strong> — ${item.selectedBy || 'Anônimo'}</li>`;
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

document.querySelectorAll('.popup-close, .popup-button').forEach(button => {
    button.addEventListener('click', closePopup);
});

document.getElementById('rsvp-popup').addEventListener('click', (event) => {
    if (event.target.id === 'rsvp-popup') {
        closePopup();
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
        emailjsConfig.templateId !== "SEU_TEMPLATE_ID";

    if (!emailIsConfigured) {
        console.warn('EmailJS ainda não está configurado. Preencha publicKey, serviceId e templateId.');
        return;
    }

    const attendingText = attending === 'yes' ? 'Sim, vou comparecer' : 'Não vou poder comparecer';

    await emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, {
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

// Função para carregar lista de presentes
async function loadGifts() {
    const giftList = document.getElementById('gift-list');
    try {
        const snapshot = await db.collection('gifts').get();
        snapshot.forEach(doc => {
            const gift = doc.data();
            const giftItem = document.createElement('div');
            giftItem.className = 'gift-item';
            giftItem.innerHTML = `
                <h3>${gift.name}</h3>
                <p>${gift.description}</p>
                <p>R$ ${gift.price}</p>
                <button onclick="selectGift('${doc.id}')">Selecionar</button>
            `;
            giftList.appendChild(giftItem);
        });
    } catch (error) {
        console.error('Erro ao carregar presentes:', error);
        // Fallback: lista estática
        giftList.innerHTML = `
            <div class="gift-item">
                <h3>Jogo de Talheres</h3>
                <p>Conjunto completo para jantar</p>
                <p>R$ 200</p>
                <button>Selecionar</button>
            </div>
            <div class="gift-item">
                <h3>Vinho Tinto</h3>
                <p>Garrafa especial</p>
                <p>R$ 50</p>
                <button>Selecionar</button>
            </div>
        `;
    }
}

// Função para selecionar presente
async function selectGift(giftId) {
    try {
        await db.collection('selectedGifts').add({
            giftId,
            selectedBy: 'Anônimo', // Pode ser melhorado
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert('Presente selecionado!');
    } catch (error) {
        console.error('Erro ao selecionar presente:', error);
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
