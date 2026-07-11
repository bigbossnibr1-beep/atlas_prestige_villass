document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
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
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
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

    lightboxClose.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    const roomData = {
        'salon': { title: 'Salon Principal', surface: 'Vue Ville', features: ['Télévision à écran plat', 'Coin salon confortable', 'Vue sur la ville', 'Climatisation'], image: 'villa-royal-prestige/SALON.jpg' },
        'restaurant': { title: 'Restaurant', surface: 'Gastronomique', features: ['Cuisine raffinée', 'Produits locaux', 'Service attentionné', 'Ambiance élégante'], image: 'villa-royal-prestige/RESTE.jpg' },
        'cuisine': { title: 'Cuisine Équipée', surface: 'Équipée', features: ['Réfrigérateur', 'Machine à café', 'Électroménager moderne', 'Espace de préparation'], image: 'villa-royal-prestige/CUISINE.jpg' },
        'bar': { title: 'Bar', surface: 'Cocktails', features: ['Sélection de cocktails', 'Boissons premium', 'Ambiance lounge', 'Service attentionné'], image: 'villa-royal-prestige/BAR.png' },
        'chambre-1': { title: 'Chambre 1', surface: 'Lit Double', features: ['Lit double confortable', 'Salle de bain privative avec bidet', 'Articles de toilette gratuits', 'Climatisation'], image: 'villa-royal-prestige/CHAMBRE1.jpg' },
        'chambre-2': { title: 'Chambre 2', surface: 'Lit Double', features: ['Lit double confortable', 'Salle de bain privative avec bidet', 'Articles de toilette gratuits', 'Climatisation'], image: 'villa-royal-prestige/CHAMBRE2.jpg' },
        'chambre-3': { title: 'Chambre 3', surface: 'Lit Double', features: ['Lit double confortable', 'Salle de bain privative avec bidet', 'Articles de toilette gratuits', 'Climatisation'], image: 'villa-royal-prestige/CHAMBRE3.jpg' },
        'chambre-4': { title: 'Chambre 4', surface: 'Lit double', features: ['Lit double confortable', 'Climatisation', 'Vue sur le jardin', 'Rangements'], image: 'villa-royal-prestige/CHAMBRE4.jpg' },
        'sdb-1': { title: 'Salle de Bain 1', surface: 'Avec Bidet', features: ['Douche moderne', 'Bidet', 'Articles de toilette gratuits', 'Serviettes fournies'], image: 'villa-royal-prestige/SDB1.jpg' },
        'sdb-2': { title: 'Salle de Bain 2', surface: 'Avec Bidet', features: ['Douche moderne', 'Bidet', 'Articles de toilette gratuits', 'Serviettes fournies'], image: 'villa-royal-prestige/SDB2.jpg' },
        'sdb-3': { title: 'Salle de Bain 3', surface: 'Avec Bidet', features: ['Douche moderne', 'Bidet', 'Articles de toilette gratuits', 'Serviettes fournies'], image: 'villa-royal-prestige/SDB3.jpg' },
        'piscine': { title: 'Piscine Intérieure', surface: 'Chauffée', features: ['Piscine intérieure chauffée', 'Nage en toute saison', 'Éclairage sous-marin', 'Ambiance relaxante'], image: 'villa-royal-prestige/PISCINE.jpg' },
        'jardin': { title: 'Jardin', surface: 'Privé', features: ['Jardin privatif luxuriant', 'Espace de détente', 'Végétation soignée', 'Ambiance paisible'], image: 'villa-royal-prestige/JARDIN.jpg' },
        'terrasse': { title: 'Terrasse', surface: 'Vue Ville', features: ['Grande terrasse aménagée', 'Vue sur la ville', 'Idéale pour les repas', 'Mobilier d\'extérieur'], image: 'villa-royal-prestige/TERRASSE.jpg' }
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

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');

    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    const getCurrentTime = () => {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    };

    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerHTML = `
            <p>${text}</p>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const processBotResponse = (input) => {
        const lowerInput = input.toLowerCase();
        let response = "Je vous invite à contacter notre conciergerie au +212 5 24 00 00 00 pour une assistance personnalisée.";

        if (lowerInput.includes('villa') || lowerInput.includes('maison') || lowerInput.includes('propriété') || lowerInput.includes('elyana')) {
            response = "Villa Elyana est une propriété de 1000 m² située à Marrakech, offrant 4 chambres, 3 salles de bain, une piscine intérieure et un restaurant.";
        } else if (lowerInput.includes('chambre') || lowerInput.includes('lit') || lowerInput.includes('dormir')) {
            response = "La villa dispose de 4 chambres avec climatisation, chacune avec salle de bain privative avec bidet et articles de toilette gratuits.";
        } else if (lowerInput.includes('piscine') || lowerInput.includes('bassin') || lowerInput.includes('nager')) {
            response = "La villa possède une piscine intérieure chauffée, permettant de nager en toute saison, quel que soit le climat extérieur.";
        } else if (lowerInput.includes('restaurant') || lowerInput.includes('bar') || lowerInput.includes('manger')) {
            response = "La villa dispose d'un restaurant gastronomique servant une cuisine raffinée et d'un bar proposant des cocktails premium.";
        } else if (lowerInput.includes('services') || lowerInput.includes('petit-déjeuner') || lowerInput.includes('navette')) {
            response = "Le petit-déjeuner buffet, à la carte ou continental est servi sur place. Une navette aéroport payante est disponible. WiFi gratuit 20 Mb/s et parking gratuit sont inclus.";
        } else if (lowerInput.includes('localisation') || lowerInput.includes('où') || lowerInput.includes('aéroport') || lowerInput.includes('distance')) {
            response = "La villa est située à Marrakech, à 21 km du Palais de la Bahia et de la Place Jemaa el-Fna, et à 21 km de l'aéroport Marrakech-Ménara.";
        } else if (lowerInput.includes('contact') || lowerInput.includes('téléphone') || lowerInput.includes('email') || lowerInput.includes('réserver')) {
            response = "Vous pouvez nous joindre au +212 5 24 00 00 00, par email à contact@atlasprestigevillas.com, ou via le bouton WhatsApp en haut de la page.";
        } else if (lowerInput.includes('bonjour') || lowerInput.includes('salut') || lowerInput.includes('hello')) {
            response = "Bonjour! Bienvenue sur la page de Villa Elyana. Comment puis-je vous aider?";
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
        if (e.key === 'Enter') {
            handleSend();
        }
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