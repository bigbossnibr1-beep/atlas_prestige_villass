document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats');
    let animated = false;
    
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target + (stat.parentElement.innerText.includes('%') ? '%' : '+');
                }
            };
            updateCount();
        });
    };
    
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animateStats();
                    animated = true;
                }
            });
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const src = item.getAttribute('data-src');
                lightboxImg.src = src;
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
    }

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
    
    if (chatbotToggle) {
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
            let response = "Je vous invite à contacter notre conciergerie au +212 0767129762 pour une assistance personnalisée.";
            
            if (lowerInput.includes('prix') || lowerInput.includes('tarif') || lowerInput.includes('coût')) {
                response = "Nos villas sont proposées à partir de 900 MAD par nuit. Les tarifs varient selon la saison et les services inclus.";
            } else if (lowerInput.includes('réserv') || lowerInput.includes('book')) {
                response = "Pour réserver, vous pouvez utiliser le bouton 'Réserver maintenant' en haut de la page ou nous contacter directement.";
            } else if (lowerInput.includes('villa')) {
                response = "Nous disposons de 3 villas d'exception : Villa Tilila (1200 MAD), Dar Saada Private Villa (1600 MAD), et Villa de Salah (900 MAD).";
            } else if (lowerInput.includes('service')) {
                response = "Nous proposons des services premium : chef privé, chauffeur, spa, excursions, et conciergerie VIP 24/7.";
            } else if (lowerInput.includes('contact')) {
                response = "Vous pouvez nous joindre au +212 0767129762 ou par email à atlasprestige@gmail.com.";
            } else if (lowerInput.includes('bonjour') || lowerInput.includes('salut')) {
                response = "Bonjour ! Bienvenue chez Atlas Prestige Villas. Comment puis-je vous aider ?";
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
    }

    const authLink = document.getElementById('authLink');
    
    if (authLink) {
        const handleLogout = (e) => {
            e.preventDefault();
            
            if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
                localStorage.removeItem('currentUser');
                
                const notification = document.createElement('div');
                notification.textContent = '✓ Déconnexion réussie. À bientôt !';
                notification.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 30px;
                    background: #0A0A0A;
                    color: #D4AF37;
                    padding: 15px 25px;
                    border-radius: 8px;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 0.9rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    z-index: 9999;
                    border-left: 3px solid #D4AF37;
                `;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transition = 'opacity 0.3s';
                    setTimeout(() => notification.remove(), 300);
                }, 2500);
                
                updateAuthState();
                
                setTimeout(() => window.location.href = 'index.html', 1000);
            }
        };
        
        const updateAuthState = () => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            if (currentUser) {
                authLink.textContent = 'Déconnexion';
                authLink.href = '#';
                authLink.style.color = '#D4AF37';
                
                authLink.removeEventListener('click', handleLogout);
                authLink.addEventListener('click', handleLogout);
            } else {
                authLink.textContent = 'Connexion';
                authLink.href = 'login.html';
                authLink.style.color = '';
                
                authLink.removeEventListener('click', handleLogout);
            }
        };
        
        updateAuthState();
    }
    
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

   