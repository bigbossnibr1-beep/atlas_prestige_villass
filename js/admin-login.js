document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adminLoginForm');
    const message = document.getElementById('loginMessage');
    
    if (!localStorage.getItem('adminAccount')) {
        const defaultAdmin = {
            email: 'admin@atlasprestige.com',
            password: 'admin123',
            role: 'super-admin'
        };
        localStorage.setItem('adminAccount', JSON.stringify(defaultAdmin));
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value;
        const admin = JSON.parse(localStorage.getItem('adminAccount'));
        
        if (email === admin.email && password === admin.password) {
            localStorage.setItem('adminSession', JSON.stringify({
                email: admin.email,
                role: admin.role,
                loginTime: new Date().toISOString()
            }));
            
            message.textContent = '✓ Authentification réussie. Redirection...';
            message.className = 'form-message success';
            
            setTimeout(() => {
                window.location.href = 'admindashboard.html';
            }, 1000);
        } else {
            message.textContent = '✗ Identifiants incorrects';
            message.className = 'form-message error';
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
        }
    });
});