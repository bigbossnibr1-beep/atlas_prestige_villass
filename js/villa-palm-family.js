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
        'salon': { title: 'Salon Principal', surface: 'Vue Piscine', features: ['Télévision à écran plat', 'Chaînes satellite et câble', 'Vue agréable sur la piscine', 'Canapés confortables'], image: 'villa-palm-family/salon.jpeg' },
        'cuisine': { title: 'Cuisine Équipée', surface: 'Entièrement Équipée', features: ['Tous les équipements nécessaires', 'Coin repas convivial', 'Accès à la terrasse', 'Espace de préparation'], image: 'villa-palm-family/cuisine.png' },
        'chambre1': { title: 'Chambre 1', surface: 'Lit Double', features: ['Grande chambre avec lit double', 'Salle de bains privative', 'Climatisation', 'Rangements'], image: 'villa-palm-family/chambre1.jpeg' },
        'chambre2': { title: 'Chambre 2', surface: 'Lit Double', features: ['Grande chambre avec lit double', 'Salle de bains privative', 'Climatisation', 'Vue sur le jardin'], image: 'villa-palm-family/chambre2.jpeg' },
        'chambre3': { title: 'Chambre 3', surface: '3 Lits Simples', features: ['Chambre équipée de 3 lits simples', 'Salle de bains privative', 'Idéale pour enfants ou amis', 'Climatisation'], image: 'villa-palm-family/chambre3.jpeg' },
        'sdb1': { title: 'Salle de Bain 1', surface: 'Privative', features: ['Salle de bains privative', 'Équipements modernes', 'Serviettes fournies', 'Produits d\'accueil'], image: 'villa-palm-family/bain1.jpeg' },
        'sdb2': { title: 'Salle de Bain 2', surface: 'Privative', features: ['Salle de bains privative', 'Équipements modernes', 'Serviettes fournies', 'Produits d\'accueil'], image: 'villa-palm-family/bain2.png' },
        'sdb3': { title: 'Salle de Bain 3', surface: 'Privative', features: ['Salle de bains privative', 'Équipements modernes', 'Serviettes fournies', 'Produits d\'accueil'], image: 'villa-palm-family/bain3.png' },
        'sdb4': { title: 'Salle de Bain 4', surface: 'Commune', features: ['Salle de bains commune', 'Équipements modernes', 'Serviettes fournies', 'Accès facile'], image: 'villa-palm-family/bain4.png' },
        'terrasse': { title: 'Terrasse', surface: 'Vue Piscine', features: ['Grande terrasse aménagée', 'Vue directe sur la piscine', 'Idéale pour les repas en plein air', 'Vue sur le jardin'], image: 'villa-palm-family/terrasse.png' },
        'jardin': { title: 'Jardin Paysager', surface: 'Privé', features: ['Magnifique jardin paysager', 'Espace de détente', 'Végétation luxuriante', 'Ambiance paisible'], image: 'villa-palm-family/jardin.png' },
        'piscine': { title: 'Piscine Privée', surface: 'Grande Piscine', features: ['Grande piscine extérieure privée', 'Entourée du jardin paysager', 'Idéale pour se détendre', 'Vue sur les montagnes'], image: 'villa-palm-family/piscine.jpeg' }
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

        if (lowerInput.includes('villa') || lowerInput.includes('maison') || lowerInput.includes('propriété')) {
            response = "La Villa de Salah est une propriété de 220 m² située dans la vallée de Ourika, offrant 3 chambres, 4 salles de bain, une piscine privée et un jardin paysager.";
        } else if (lowerInput.includes('chambre') || lowerInput.includes('lit') || lowerInput.includes('dormir')) {
            response = "La villa dispose de 3 chambres : 2 grandes chambres avec lit double et 1 chambre avec 3 lits simples. Chaque chambre a sa salle de bains privative.";
        } else if (lowerInput.includes('piscine') || lowerInput.includes('bassin') || lowerInput.includes('nager')) {
            response = "La villa possède une grande piscine extérieure privée entourée d'un jardin paysager, idéale pour se détendre avec vue sur les montagnes de l'Atlas.";
        } else if (lowerInput.includes('jardin') || lowerInput.includes('extérieur')) {
            response = "La villa dispose d'un magnifique jardin paysager privé avec terrasse aménagée donnant directement sur la piscine, parfait pour profiter des journées ensoleillées.";
        } else if (lowerInput.includes('services') || lowerInput.includes('chef') || lowerInput.includes('ménage') || lowerInput.includes('petit-déjeuner')) {
            response = "Le petit-déjeuner est inclus. Nous proposons également des services optionnels : chef cuisinier privé, conciergerie 24/7, et transferts.";
        } else if (lowerInput.includes('localisation') || lowerInput.includes('où') || lowerInput.includes('adresse') || lowerInput.includes('ourika')) {
            response = "La villa est située dans la magnifique vallée de Ourika, à environ 35 km du centre de Marrakech, dans un environnement paisible avec vue sur les montagnes de l'Atlas.";
        } else if (lowerInput.includes('contact') || lowerInput.includes('téléphone') || lowerInput.includes('email') || lowerInput.includes('réserver')) {
            response = "Vous pouvez nous joindre au +212 5 24 00 00 00, par email à contact@atlasprestigevillas.com, ou via le bouton WhatsApp en haut de la page.";
        } else if (lowerInput.includes('bonjour') || lowerInput.includes('salut') || lowerInput.includes('hello')) {
            response = "Bonjour ! Bienvenue sur la page de la Villa de Salah. Comment puis-je vous aider à découvrir cette propriété dans la vallée de Ourika ?";
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