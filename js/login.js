document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tab = btn.getAttribute('data-tab');
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tab}Form`) {
                    setTimeout(() => form.classList.add('active'), 50);
                }
            });
            
            [loginMessage, registerMessage].forEach(msg => {
                msg.className = 'form-message';
                msg.textContent = '';
            });
        });
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = loginForm.querySelector('.btn-submit');
        setButtonLoading(btn, true);

        setTimeout(() => {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                showMessage(loginMessage, 'Connexion réussie ! Redirection...', 'success');
                setTimeout(() => window.location.href = 'indexx.html', 1500);
            } else {
                showMessage(loginMessage, 'Email ou mot de passe incorrect', 'error');
                shakeForm(loginForm);
            }
            setButtonLoading(btn, false);
        }, 800);
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = registerForm.querySelector('.btn-submit');
        setButtonLoading(btn, true);

        setTimeout(() => {
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            if (password !== confirmPassword) {
                showMessage(registerMessage, 'Les mots de passe ne correspondent pas', 'error');
                shakeForm(registerForm);
                setButtonLoading(btn, false);
                return;
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.email === email)) {
                showMessage(registerMessage, 'Cet email est déjà utilisé', 'error');
                shakeForm(registerForm);
                setButtonLoading(btn, false);
                return;
            }

            const newUser = { 
                name, 
                email, 
                phone, 
                password, 
                createdAt: new Date().toISOString() 
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            showMessage(registerMessage, 'Compte créé avec succès !', 'success');
            
            setTimeout(() => {
                tabBtns[0].click();
                document.getElementById('loginEmail').value = email;
                registerForm.reset();
                setButtonLoading(btn, false);
            }, 2000);
        }, 800);
    });

    
    function showMessage(element, text, type) {
        element.textContent = text;
        element.className = `form-message ${type}`;
    }

    function shakeForm(form) {
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
    }

    function setButtonLoading(btn, isLoading) {
        if (isLoading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }
});