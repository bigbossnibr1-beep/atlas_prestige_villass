document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    const tabBtns = document.querySelectorAll('.tab-btn');
    const villaCards = document.querySelectorAll('.villa-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            villaCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    const applyFiltersBtn = document.getElementById('applyFilters');
    applyFiltersBtn.addEventListener('click', () => {
        const type = document.getElementById('filterType').value;
        const rooms = document.getElementById('filterRooms').value;
        const price = document.getElementById('filterPrice').value;
        villaCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardRooms = parseInt(card.getAttribute('data-rooms'));
            const cardPrice = parseInt(card.getAttribute('data-price'));
            let matchType = (type === 'all' || cardCategory === type);
            let matchRooms = (rooms === 'all' || cardRooms >= parseInt(rooms));
            let matchPrice = true;
            if (price === '1000') matchPrice = cardPrice < 1000;
            else if (price === '1500') matchPrice = cardPrice >= 1000 && cardPrice <= 1500;
            else if (price === '2500') matchPrice = cardPrice > 1500 && cardPrice <= 2500;
            else if (price === '3500') matchPrice = cardPrice > 2500;
            if (matchType && matchRooms && matchPrice) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.5s forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');

    chatbotToggle.addEventListener('click', () => chatbotWindow.classList.toggle('active'));
    chatbotClose.addEventListener('click', () => chatbotWindow.classList.remove('active'));

    const getCurrentTime = () => {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    };

    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerHTML = `<p>${text}</p><span class="message-time">${getCurrentTime()}</span>`;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const processBotResponse = (input) => {
        const lowerInput = input.toLowerCase();
        let response = "Je vous invite à contacter notre conciergerie au +212 5 24 00 00 00 pour une assistance personnalisée.";

        if (lowerInput.includes('prix') || lowerInput.includes('tarif') || lowerInput.includes('coût') || lowerInput.includes('combien')) {
            response = "Nos villas sont proposées à partir de 900 MAD par nuit. Les tarifs varient selon la catégorie (Familiale, Prestige, Luxe, Ultras Luxe, VIP), la saison et les services inclus. Souhaitez-vous un devis détaillé ?";
        } else if (lowerInput.includes('réserv') || lowerInput.includes('book') || lowerInput.includes('louer')) {
            response = "Pour réserver, vous pouvez utiliser le bouton 'Réserver' en haut de la page ou nous contacter directement. Un acompte de 30% est requis pour confirmer toute réservation.";
        } else if (lowerInput.includes('chef') || lowerInput.includes('cuisin') || lowerInput.includes('manger') || lowerInput.includes('repas')) {
            response = "Oui, nous proposons un service de chef cuisinier privé pour préparer des repas gastronomiques (marocains ou internationaux) directement dans votre villa. C'est un service très apprécié de nos clients.";
        } else if (lowerInput.includes('contact') || lowerInput.includes('téléphone') || lowerInput.includes('email') || lowerInput.includes('joindre')) {
            response = "Vous pouvez nous joindre au +212 5 24 00 00 00 ou par email à contact@atlasprestigevillas.com. Notre équipe est disponible 24h/24 et 7j/7.";
        } else if (lowerInput.includes('bonjour') || lowerInput.includes('salut') || lowerInput.includes('hello') || lowerInput.includes('bonsoir')) {
            response = "Bonjour ! Bienvenue chez Atlas Prestige Villas. Comment puis-je vous aider à organiser votre séjour de luxe à Marrakech ?";
        }

        setTimeout(() => {
            addMessage(response, 'bot');
        }, 800);
    };

    const handleSend = () => {
        const text = chatbotInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatbotInput.value = '';
            processBotResponse(text);
        }
    };

    chatbotSend.addEventListener('click', handleSend);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
    
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');

const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});

overlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

});