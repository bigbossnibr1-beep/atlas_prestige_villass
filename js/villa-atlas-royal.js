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
        'salon-principal': { title: 'Salon Principal', surface: '85 m²', features: ['Canapés en lin naturel', 'Cheminée décorative', 'Smart TV 65" dissimulée', 'Plafond en bois de cèdre sculpté'], image: 'villa-atlas-royal/SALON1.jpg' },
        'salle-a-manger': { title: 'Salle à Manger', surface: '45 m²', features: ['Table en bois massif pour 12 personnes', 'Lustre contemporain en laiton', 'Vue panoramique sur le jardin', 'Climatisation discrète'], image: 'villa-atlas-royal/MANGER.jpg' },
        'cuisine': { title: 'Cuisine Équipée', surface: '40 m²', features: ['Îlot central en pierre naturelle', 'Électroménager Miele', 'Cave à vin intégrée', 'Accès direct à la cuisine du personnel'], image: 'villa-atlas-royal/CUISINE.jpg' },
        'chambre-1': { title: 'Chambre 1 - Suite Royale', surface: '30 m²', features: ['Lit King Size avec vue piscine', 'Salle de bain en marbre avec baignoire îlot', 'Dressing walk-in sur mesure', 'Terrasse privée'], image: 'villa-atlas-royal/CHAMBRE1.jpg' },
        'chambre-2': { title: 'Chambre 2', surface: '30 m²', features: ['Lit Queen Size', 'Salle de bain privée avec douche à l\'italienne', 'Vue sur le jardin intérieur', 'Bureau de travail'], image: 'villa-atlas-royal/CHAMBRE2.jpg' },
        'chambre-3': { title: 'Chambre 3', surface: '25 m²', features: ['Deux lits simples pouvant être jumelés', 'Salle de bain privée', 'Placards intégrés', 'Smart TV'], image: 'villa-atlas-royal/CHAMBRE3.jpg' },
        'chambre-4': { title: 'Chambre 4', surface: '30 m²', features: ['Lit Queen Size', 'Salle de bain privée', 'Vue sur la Palmeraie', 'Climatisation individuelle'], image: 'villa-atlas-royal/CHAMBRE4.jpg' },
        'chambre-5': { title: 'Chambre 5', surface: '30 m²', features: ['Lit Queen Size', 'Salle de bain privée', 'Vue montagne', 'Climatisation'], image: 'villa-atlas-royal/CHAMBRE5.jpg' },
        'sdb-1': { title: 'Salle de Bain 1', surface: '15 m²', features: ['Double vasque en marbre', 'Douche à l\'italienne avec pluie tropicale', 'Sèche-serviettes chauffant', 'Produits d\'accueil de luxe'], image: 'villa-atlas-royal/SDB1.jpg' },
        'sdb-2': { title: 'Salle de Bain 2', surface: '15 m²', features: ['Baignoire îlot', 'Douche séparée', 'Éclairage naturel zénithal', 'Sol chauffant'], image: 'villa-atlas-royal/SDB2.jpg' },
        'sdb-3': { title: 'Salle de Bain 3', surface: '15 m²', features: ['Douche à l\'italienne', 'Vasque en marbre', 'Miroir lumineux', 'Serviettes de bain'], image: 'villa-atlas-royal/SDB3.jpg' },
        'sdb-4': { title: 'Salle de Bain 4', surface: '20 m²', features: ['Baignoire et douche', 'Double vasque', 'Éclairage d\'ambiance', 'Produits biologiques'], image: 'villa-atlas-royal/SDB4.jpg' },
        'salle-jeux': { title: 'Salle de Jeux', surface: '30 m²', features: ['Console de jeux dernière génération', 'Table de billard', 'Baby-foot', 'Espace détente avec canapés', 'Smart TV 55"'], image: 'villa-atlas-royal/JEUX.jpg' },
        'terrasse': { title: 'Terrasse Principale', surface: '120 m²', features: ['Salon d\'extérieur en rotin', 'Coin repas avec barbecue', 'Vue imprenable sur la montagne', 'Éclairage d\'ambiance'], image: 'villa-atlas-royal/TERASSE.jpg' },
        'jardin': { title: 'Jardin Privé', surface: 'Privé', features: ['Oliviers centenaires', 'Système d\'arrosage automatique', 'Éclairage paysager', 'Allées en pierre naturelle'], image: 'villa-atlas-royal/JARDIN.jpg' },
        'piscine': { title: 'Piscine Extérieure', surface: 'Privée', features: ['Piscine privée chauffée', 'Vue sur la montagne', 'Transats et parasols premium', 'Éclairage LED nocturne'], image: 'villa-atlas-royal/PISCINE.jpg' },
        'parking': { title: 'Parking Privé', surface: 'Gratuit', features: ['Parking sur place gratuit', 'Portail électrique sécurisé', 'Éclairage automatique', 'Capacité plusieurs véhicules'], image: 'villa-atlas-royal/PARC.jpg' },
        'barbecue': { title: 'Installations Barbecue', surface: 'Extérieur', features: ['Barbecue professionnel', 'Coin repas extérieur', 'Vue sur le jardin', 'Éclairage nocturne'], image: 'villa-atlas-royal/BABEU.jpg' }
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
            response = "La Villa Tilila est une propriété d'exception de 500 m² située à Marrakech, offrant 5 chambres, 4 salles de bain, une piscine privée et un jardin.";
        } else if (lowerInput.includes('chambre') || lowerInput.includes('lit') || lowerInput.includes('dormir')) {
            response = "La villa dispose de 5 chambres luxueuses avec literie haut de gamme. Toutes les chambres sont équipées de salles de bain privées et de climatisation.";
        } else if (lowerInput.includes('piscine') || lowerInput.includes('bassin') || lowerInput.includes('nager')) {
            response = "La villa possède une piscine extérieure privée avec vue sur la montagne, idéale pour se détendre en toute intimité.";
        } else if (lowerInput.includes('jardin') || lowerInput.includes('extérieur')) {
            response = "La villa dispose d'un jardin privatif luxuriant avec piscine, barbecue et terrasse offrant une vue imprenable sur la montagne.";
        } else if (lowerInput.includes('services') || lowerInput.includes('chef') || lowerInput.includes('ménage')) {
            response = "Nous proposons un service de ménage quotidien inclus, ainsi que des services optionnels : chef cuisinier privé, navette aéroport, conciergerie 24/7.";
        } else if (lowerInput.includes('localisation') || lowerInput.includes('où') || lowerInput.includes('adresse')) {
            response = "La villa est située à Marrakech, à 5,7 km du Palais de la Bahia, 8,7 km de la Place Jemaa el-Fna et 11 km de l'aéroport Marrakech-Ménara.";
        } else if (lowerInput.includes('contact') || lowerInput.includes('téléphone') || lowerInput.includes('email') || lowerInput.includes('réserver')) {
            response = "Vous pouvez nous joindre au +212 5 24 00 00 00, par email à contact@atlasprestigevillas.com, ou via le bouton WhatsApp en haut de la page.";
        } else if (lowerInput.includes('bonjour') || lowerInput.includes('salut') || lowerInput.includes('hello')) {
            response = "Bonjour ! Bienvenue sur la page de la Villa Tilila. Comment puis-je vous aider à découvrir cette propriété d'exception ?";
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