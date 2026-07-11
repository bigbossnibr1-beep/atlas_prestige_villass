document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
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

        if (lowerInput.includes('prix') || lowerInput.includes('tarif') || lowerInput.includes('coût') || lowerInput.includes('combien')) {
            response = "Nos tarifs varient selon le service demandé. Par exemple, un chef privé commence à 150€ par repas, et un chauffeur à 80€ par demi-journée. Souhaitez-vous un devis détaillé pour un service spécifique ?";
        } else if (lowerInput.includes('réserv') || lowerInput.includes('book') || lowerInput.includes('réserver')) {
            response = "Pour réserver un service, vous pouvez utiliser le formulaire de contact sur cette page, nous appeler, ou nous écrire sur WhatsApp. Nous vous répondrons sous 2 heures.";
        } else if (lowerInput.includes('chef') || lowerInput.includes('cuisin') || lowerInput.includes('manger') || lowerInput.includes('repas')) {
            response = "Nous proposons un service de chef cuisinier privé exceptionnel. Nos chefs peuvent préparer des menus marocains traditionnels ou des cuisines internationales, directement dans votre villa, avec des produits frais du marché.";
        } else if (lowerInput.includes('services') || lowerInput.includes('prestation') || lowerInput.includes('offre')) {
            response = "Nous offrons une gamme complète de services : chef privé, personnel de maison, chauffeur, conciergerie VIP, sécurité, spa à domicile, et organisation d'événements ou d'excursions. Que souhaitez-vous réserver ?";
        } else if (lowerInput.includes('contact') || lowerInput.includes('téléphone') || lowerInput.includes('email') || lowerInput.includes('joindre') || lowerInput.includes('whatsapp')) {
            response = "Vous pouvez nous joindre au +212 5 24 00 00 00, par email à contact@atlasprestigevillas.com, ou via WhatsApp. Notre équipe est disponible 24h/24 et 7j/7.";
        } else if (lowerInput.includes('bonjour') || lowerInput.includes('salut') || lowerInput.includes('hello') || lowerInput.includes('bonsoir')) {
            response = "Bonjour ! Bienvenue chez Atlas Prestige Villas. Comment puis-je vous aider à sublimer votre séjour à Marrakech aujourd'hui ?";
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