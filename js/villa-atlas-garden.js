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
        'salon': { title: 'Salon Principal', surface: 'Vue Piscine', features: ['Télévision à écran plat', 'Chaînes du câble', 'Vue agréable sur la piscine', 'Canapés confortables'], image: 'villa-atlas-garden/SALON.jpg' },
        'cuisine': { title: 'Cuisine Équipée', surface: 'Entièrement Équipée', features: ['Tous les équipements nécessaires', 'Coin repas convivial', 'Accès à la terrasse', 'Espace de préparation'], image: 'villa-atlas-garden/CUISINE.jpg' },
        'chambre1': { title: 'Suite 1', surface: 'SDB Privative', features: ['Chambre spacieuse', 'Salle de bains privative', 'Linge de lit fourni', 'Serviettes incluses'], image: 'villa-atlas-garden/CHAMBRE1.jpg' },
        'chambre2': { title: 'Suite 2', surface: 'SDB Privative', features: ['Chambre spacieuse', 'Salle de bains privative', 'Linge de lit fourni', 'Serviettes incluses'], image: 'villa-atlas-garden/CHAMBRE2.jpg' },
        'chambre3': { title: 'Suite 3', surface: 'SDB Privative', features: ['Chambre spacieuse', 'Salle de bains privative', 'Linge de lit fourni', 'Serviettes incluses'], image: 'villa-atlas-garden/CHAMBRE3.jpg' },
        'chambre4': { title: 'Suite 4', surface: 'SDB Privative', features: ['Chambre spacieuse', 'Salle de bains privative', 'Linge de lit fourni', 'Serviettes incluses'], image: 'villa-atlas-garden/CHAMBRE4.jpg' },
        'terrasse': { title: 'Terrasse', surface: 'Vue Piscine', features: ['Grande terrasse aménagée', 'Vue directe sur la piscine', 'Idéale pour les repas en plein air', 'Vue sur le jardin'], image: 'villa-atlas-garden/TERRASSE.jpg' },
        'jardin': { title: 'Jardin', surface: 'Privé', features: ['Jardin privatif luxuriant', 'Espace de détente', 'Végétation soignée', 'Ambiance paisible'], image: 'villa-atlas-garden/JARDIN.jpg' },
        'piscine': { title: 'Piscine Privée', surface: 'Privée', features: ['Piscine privée', 'Entourée du jardin', 'Idéale pour se détendre', 'Transats disponibles'], image: 'villa-atlas-garden/PISCINE.jpg' },
        'parking': { title: 'Parking', surface: 'Gratuit', features: ['Parking privé gratuit', 'Sur place', 'Sécurisé', 'Accès facile'], image: 'villa-atlas-garden/PARC.jpg' },
        'aire-jeux': { title: 'Aire de Jeux', surface: 'Enfants', features: ['Aire de jeux pour enfants', 'Équipements sécurisés', 'Espace dédié', 'Surveillance facile'], image: 'villa-atlas-garden/JEUX.jpg' }
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

        if (lowerInput.includes('villa') || lowerInput.includes('maison') || lowerInput.includes('propriété') || lowerInput.includes('lauriers')) {
            response = "La Villa LES LAURIERS est une propriété de 220 m² située à Marrakech, offrant 4 suites avec salles de bains privatives, une piscine privée et un jardin.";
        } else if (lowerInput.includes('chambre') || lowerInput.includes('lit') || lowerInput.includes('dormir') || lowerInput.includes('suite')) {
            response = "La villa dispose de 4 suites spacieuses, chacune avec sa propre salle de bains privative. Linge de lit et serviettes sont fournis.";
        } else if (lowerInput.includes('piscine') || lowerInput.includes('bassin') || lowerInput.includes('nager')) {
            response = "La villa possède une piscine privée entourée d'un jardin, idéale pour se détendre en toute intimité.";
        } else if (lowerInput.includes('jardin') || lowerInput.includes('extérieur')) {
            response = "La villa dispose d'un jardin privatif luxuriant avec terrasse aménagée offrant une vue sur la piscine.";
        } else if (lowerInput.includes('services') || lowerInput.includes('petit-déjeuner') || lowerInput.includes('déjeuner') || lowerInput.includes('wifi')) {
            response = "Un petit-déjeuner à la carte est servi sur place. WiFi gratuit, climatisation, chauffage et parking gratuit sont inclus.";
        } else if (lowerInput.includes('localisation') || lowerInput.includes('où') || lowerInput.includes('adresse') || lowerInput.includes('distance')) {
            response = "La villa se trouve à 12 km du Palais de la Bahia, 13 km du Jardin Majorelle, et à 17 km de l'aéroport Marrakech-Ménara.";
        } else if (lowerInput.includes('contact') || lowerInput.includes('téléphone') || lowerInput.includes('email') || lowerInput.includes('réserver')) {
            response = "Vous pouvez nous joindre au +212 5 24 00 00 00, par email à contact@atlasprestigevillas.com, ou via le bouton WhatsApp en haut de la page.";
        } else if (lowerInput.includes('bonjour') || lowerInput.includes('salut') || lowerInput.includes('hello')) {
            response = "Bonjour ! Bienvenue sur la page de la Villa LES LAURIERS. Comment puis-je vous aider à découvrir cette propriété à Marrakech ?";
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