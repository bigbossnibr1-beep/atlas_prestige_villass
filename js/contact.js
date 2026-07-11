
(function() {
    emailjs.init({
        publicKey: "ZGpncak_8M66XAHaJ",
    });
})();

document.addEventListener('DOMContentLoaded', () => {
   
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const nom = document.getElementById('lastName');
        const prenom = document.getElementById('firstName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        
        const fields = [
            { element: nom, regex: /.{2,}/ },
            { element: prenom, regex: /.{2,}/ },
            { element: email, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            { element: phone, regex: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/ },
            { element: subject, regex: /.+/ },
            { element: message, regex: /.{10,}/ }
        ];

        fields.forEach(field => {
            const formGroup = field.element.closest('.form-group');
            if (!field.regex.test(field.element.value.trim())) {
                formGroup.classList.add('error');
                isValid = false;
            } else {
                formGroup.classList.remove('error');
            }
        });

        if (isValid) {
            
            const templateParams = {
                lastName: nom.value,
                firstName: prenom.value,
                email: email.value,
                phone: phone.value,
                subject: subject.value,
                message: message.value
            };

            emailjs.send("service_0gi8s5g", "template_m4ntxph", templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response);
                    formSuccess.classList.add('show');
                    contactForm.reset();
                    setTimeout(() => {
                        formSuccess.classList.remove('show');
                    }, 5000);
                }, function(error) {
                    console.log('FAILED...', error);
                    alert('✗ Erreur lors de l\'envoi. Veuillez réessayer.');
                });
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
        let response = "Je vous invite à contacter notre conciergerie au +212 0767129762 pour une assistance personnalisée.";
        
        if (lowerInput.includes('prix') || lowerInput.includes('tarif') || lowerInput.includes('coût')) {
            response = "Nos tarifs pour les villas débutent à 900 MAD par nuit et varient selon la catégorie, la saison et les services inclus.";
        } else if (lowerInput.includes('réserv') || lowerInput.includes('book')) {
            response = "Pour réserver, vous pouvez utiliser le formulaire de contact ou nous appeler. Un acompte de 30% est requis.";
        } else if (lowerInput.includes('villa') || lowerInput.includes('propriété')) {
            response = "Nous disposons d'une collection exclusive de villas de prestige à Marrakech, de 4 à 15 chambres.";
        } else if (lowerInput.includes('contact') || lowerInput.includes('téléphone') || lowerInput.includes('email')) {
            response = "Vous pouvez nous joindre au +212 0767129762 ou par email à atlasprestige@gmail.com.";
        } else if (lowerInput.includes('services') || lowerInput.includes('chef') || lowerInput.includes('spa')) {
            response = "Nous proposons : chef privé, chauffeur, personnel de maison, spa à domicile, sécurité et événements sur mesure.";
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