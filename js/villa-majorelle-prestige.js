document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => { item.style.display = 'none'; }, 400);
                }
            });
        });
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightboxImg.src = item.getAttribute('data-src');
            lightboxCaption.textContent = item.querySelector('.gallery-overlay span').textContent;
            lightbox.style.display = 'flex';
        });
    });

    lightboxClose.addEventListener('click', () => { lightbox.style.display = 'none'; });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.style.display = 'none'; });

    const roomData = {
        'salon': { title: 'Salon Commun', surface: 'Vue Jardin', features: ['Salon spacieux et accueillant', 'Vue sur le jardin', 'Canapés confortables', 'TV écran plat'], image: 'villa-majorelle-prestige/SALON.jpg' },
        'salle-a-manger': { title: 'Salle à Manger', surface: '45 m²', features: ['Table pour 10 personnes', 'Vue sur le jardin', 'Lustre élégant', 'Accès cuisine'], image: 'villa-majorelle-prestige/MANGER.jpg' },
        'cuisine': { title: 'Cuisine', surface: 'Équipée', features: ['Cuisine entièrement équipée', 'Électroménager moderne', 'Espace de préparation', 'Accès terrasse'], image: 'villa-majorelle-prestige/CUISINE.jpg' },
        'billard': { title: 'Salle de Billard', surface: 'Divertissement', features: ['Table de billard professionnelle', 'Espace détente', 'Éclairage d\'ambiance', 'Canapés confortables'], image: 'villa-majorelle-prestige/JEUX.jpg' },
        'chambre-1': { title: 'Chambre 1', surface: 'Lit Double', features: ['Lit double confortable', 'Salle de bain privative avec douche', 'Articles de toilette gratuits', 'Climatisation'], image: 'villa-majorelle-prestige/CHAMBRE1.jpg' },
        'chambre-2': { title: 'Chambre 2', surface: 'Lit Double', features: ['Lit double confortable', 'Salle de bain privative avec douche', 'Articles de toilette gratuits', 'Climatisation'], image: 'villa-majorelle-prestige/CHAMBRE2.jpg' },
        'chambre-3': { title: 'Chambre 3', surface: 'Lit Double', features: ['Lit double confortable', 'Salle de bain privative avec douche', 'Articles de toilette gratuits', 'Climatisation'], image: 'villa-majorelle-prestige/CHAMBRE3.jpg' },
        'chambre-4': { title: 'Chambre 4', surface: 'Lit Double', features: ['Lit double confortable', 'Climatisation', 'Vue sur le jardin', 'Rangements'], image: 'villa-majorelle-prestige/CHAMBRE4.jpg' },
        'chambre-5': { title: 'Chambre 5', surface: 'Avec Balcon', features: ['Lit double avec balcon', 'Vue sur le jardin', 'Climatisation', 'Articles de toilette gratuits'], image: 'villa-majorelle-prestige/CHAMBRE5.jpg' },
        'sdb-1': { title: 'Salle de Bain 1', surface: 'Privative', features: ['Douche moderne', 'Articles de toilette gratuits', 'Serviettes fournies', 'Miroir lumineux'], image: 'villa-majorelle-prestige/SDB1.jpg' },
        'sdb-2': { title: 'Salle de Bain 2', surface: 'Privative', features: ['Douche moderne', 'Articles de toilette gratuits', 'Serviettes fournies', 'Sèche-cheveux'], image: 'villa-majorelle-prestige/SDB2.jpg' },
        'sdb-3': { title: 'Salle de Bain 3', surface: 'Privative', features: ['Douche moderne', 'Articles de toilette gratuits', 'Serviettes fournies', 'Ventilation'], image: 'villa-majorelle-prestige/SDB3.jpg' },
        'terrasse': { title: 'Terrasse', surface: 'Vue Jardin', features: ['Grande terrasse aménagée', 'Vue sur le jardin', 'Idéale pour les repas', 'Mobilier d\'extérieur'], image: 'villa-majorelle-prestige/TERRASSE.jpg' },
        'jardin': { title: 'Jardin', surface: 'Privé', features: ['Jardin privatif luxuriant', 'Espace de détente', 'Végétation soignée', 'Ambiance paisible'], image: 'villa-majorelle-prestige/JARDINN.jpg' },
        'piscine': { title: 'Piscine Extérieure', surface: 'Privée', features: ['Piscine extérieure privée', 'Entourée du jardin', 'Transats disponibles', 'Eau cristalline'], image: 'villa-majorelle-prestige/PISCINE.jpg' }
    };

    const roomZones = document.querySelectorAll('.room-zone');
    const modal = document.getElementById('roomModal');
    const modalClose = document.querySelector('.modal-close');

    roomZones.forEach(zone => {
        zone.addEventListener('click', () => {
            const roomId = zone.getAttribute('data-room');
            const data = roomData[roomId];
            if (data) {
                document.getElementById('modal-title').textContent = data.title;
                document.getElementById('modal-surface').textContent = `Surface: ${data.surface}`;
                document.getElementById('modal-img').src = data.image;
                const featuresList = document.getElementById('modal-features');
                featuresList.innerHTML = '';
                data.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature;
                    featuresList.appendChild(li);
                });
                modal.style.display = 'flex';
            }
        });
    });

    modalClose.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

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

        if (lowerInput.includes('villa') || lowerInput.includes('maison') || lowerInput.includes('propriété') || lowerInput.includes('saada')) {
            response = "Dar Saada Private Villa est une propriété de 700 m² située à Marrakech, offrant 5 chambres, 3 salles de bain, une piscine privée et une table de billard.";
        } else if (lowerInput.includes('chambre') || lowerInput.includes('lit') || lowerInput.includes('dormir')) {
            response = "La villa dispose de 5 chambres avec climatisation, chacune avec salle de bain privative, douche et articles de toilette gratuits.";
        } else if (lowerInput.includes('piscine') || lowerInput.includes('bassin') || lowerInput.includes('nager')) {
            response = "La villa possède une piscine extérieure privée entourée d'un jardin, idéale pour se détendre en toute intimité.";
        } else if (lowerInput.includes('billard') || lowerInput.includes('jeu') || lowerInput.includes('divertissement')) {
            response = "La villa dispose d'une table de billard pour des moments de détente et de divertissement en famille ou entre amis.";
        } else if (lowerInput.includes('services') || lowerInput.includes('petit-déjeuner') || lowerInput.includes('navette')) {
            response = "Le petit-déjeuner est servi sur place. Un service de navette aéroport payant est disponible. WiFi gratuit et parking gratuit sont inclus.";
        } else if (lowerInput.includes('localisation') || lowerInput.includes('où') || lowerInput.includes('aéroport') || lowerInput.includes('distance')) {
            response = "La villa est située à Marrakech, à seulement 4 km de l'aéroport Marrakech-Ménara. Un service de navette aéroport peut être organisé.";
        } else if (lowerInput.includes('contact') || lowerInput.includes('téléphone') || lowerInput.includes('email') || lowerInput.includes('réserver')) {
            response = "Vous pouvez nous joindre au +212 5 24 00 00 00, par email à contact@atlasprestigevillas.com, ou via le bouton WhatsApp en haut de la page.";
        } else if (lowerInput.includes('bonjour') || lowerInput.includes('salut') || lowerInput.includes('hello')) {
            response = "Bonjour ! Bienvenue sur la page de Dar Saada Private Villa. Comment puis-je vous aider ?";
        }

        setTimeout(() => addMessage(response, 'bot'), 800);
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
    chatbotInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
    
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