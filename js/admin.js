document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'admin.html' || currentPage === '') {
        initLogin();
    } else {
        checkAuth();
        initDashboard();
        loadJSPDF(); 
    }
});

function loadJSPDF() {
    if (typeof window.jspdf !== 'undefined') return;
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
        console.log('jsPDF chargé avec succès');
    };
    script.onerror = () => {
        console.error('Erreur lors du chargement de jsPDF');
    };
    document.head.appendChild(script);
}

function getAdminCredentials() {
    const saved = localStorage.getItem('adminCredentials');
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
}

function checkAuth() {
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
        window.location.href = 'admin.html';
    }
}

function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    const toggleBtn = document.getElementById('togglePassword');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const pwd = document.getElementById('password');
            pwd.type = pwd.type === 'password' ? 'text' : 'password';
        });
    }
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        const creds = getAdminCredentials();
        
        if (email === creds.email && password === creds.password) {
            localStorage.setItem('adminAuth', JSON.stringify({
                email: email,
                name: creds.name,
                loginTime: new Date().toISOString()
            }));
            window.location.href = 'admin-dashboard.html';
        } else {
            errorDiv.textContent = '❌ Email ou mot de passe incorrect';
            setTimeout(() => { errorDiv.textContent = ''; }, 3000);
        }
    });
}

function initDashboard() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadAllData();
    setupNavigation();
    setupFilters();
    setupLogout();
    setupSettings();
    setupRefresh();
    setupViewAllButton();
    checkNewReservations();
    setInterval(() => {
        loadAllData();
        checkNewReservations();
    }, 10000);
}

function setupViewAllButton() {
    const viewAllBtn = document.querySelector('.btn-view-all');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('reservations');
        });
    }
}

function updateDateTime() {
    const now = new Date();
    const timeEl = document.getElementById('currentTime');
    const dateEl = document.getElementById('currentDate');
    
    if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString('fr-FR', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }
    if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
        });
    });
    
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

function showSection(sectionName) {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeNav) activeNav.classList.add('active');
   
    sections.forEach(s => s.classList.remove('active'));
    const targetSection = document.getElementById(`${sectionName}Section`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
   
    if (sectionName === 'statistics') loadStatistics();
    if (sectionName === 'clients') loadClients();
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                localStorage.removeItem('adminAuth');
                window.location.href = 'admin.html';
            }
        });
    }
}

function setupRefresh() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadAllData();
            showNotification('Données actualisées', 'success');
        });
    }
}

function getReservations() {
    return JSON.parse(localStorage.getItem('atlasReservations') || '[]');
}

function saveReservations(reservations) {
    localStorage.setItem('atlasReservations', JSON.stringify(reservations));
}

function loadAllData() {
    updateStats();
    loadReservations();
    loadRecentReservations();
    loadTopVillas();
}

function updateStats() {
    const reservations = getReservations();
    const total = reservations.length;
    const today = new Date().toDateString();
    const todayCount = reservations.filter(r => new Date(r.created_at).toDateString() === today).length;
    const revenue = reservations.reduce((sum, r) => sum + (parseFloat(r.total_price) || 0), 0);
    const uniqueEmails = [...new Set(reservations.map(r => r.email))];
    
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    
    setEl('totalReservations', total);
    setEl('todayReservations', todayCount);
    setEl('totalRevenue', revenue.toLocaleString('fr-FR') + ' MAD');
    setEl('totalClients', uniqueEmails.length);
    
    const pending = reservations.filter(r => r.status === 'pending').length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const completed = reservations.filter(r => r.status === 'completed').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;
    
    setEl('statusPending', pending);
    setEl('statusConfirmed', confirmed);
    setEl('statusCompleted', completed);
    setEl('statusCancelled', cancelled);
    
    const badge = document.getElementById('navBadge');
    if (badge) badge.textContent = pending;
}

function loadReservations() {
    const reservations = getReservations();
    const tbody = document.getElementById('reservationsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (reservations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 40px; color: var(--color-text-light);">Aucune réservation</td></tr>';
        return;
    }
    
    const sorted = [...reservations].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    sorted.forEach(res => {
        const row = createReservationRow(res);
        tbody.appendChild(row);
    });
}

function createReservationRow(res) {
    const row = document.createElement('tr');
    const villa = VILLAS_DATA[res.villa_id] || { name: res.villa_name, image: '' };
    const statusClass = `status-${res.status || 'pending'}`;
    const statusText = {
        'pending': 'En attente',
        'confirmed': 'Confirmée',
        'completed': 'Terminée',
        'cancelled': 'Annulée'
    }[res.status || 'pending'];
    
    row.innerHTML = `
        <td><strong>${res.reservation_id}</strong></td>
        <td>${new Date(res.created_at).toLocaleDateString('fr-FR')}</td>
        <td>
            <div style="display: flex; flex-direction: column;">
                <strong>${res.client_name}</strong>
                <small style="color: var(--color-text-light);">${res.email}</small>
            </div>
        </td>
        <td>
            <div style="display: flex; align-items: center; gap: 10px;">
                ${villa.image ? `<img src="${villa.image}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;" onerror="this.style.display='none'">` : ''}
                <span>${villa.name}</span>
            </div>
        </td>
        <td>${new Date(res.check_in).toLocaleDateString('fr-FR')}</td>
        <td>${new Date(res.check_out).toLocaleDateString('fr-FR')}</td>
        <td>${res.nights}</td>
        <td><strong style="color: var(--color-gold);">${parseFloat(res.total_price).toLocaleString('fr-FR')} MAD</strong></td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn-action btn-view" onclick="viewReservation('${res.reservation_id}')">Voir</button>
                <button class="btn-action btn-delete" onclick="deleteReservation('${res.reservation_id}')">Suppr</button>
            </div>
        </td>
    `;
    return row;
}

function loadRecentReservations() {
    const reservations = getReservations();
    const container = document.getElementById('recentReservationsList');
    if (!container) return;
    
    const recent = reservations.slice(-5).reverse();
    
    if (recent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <p>Aucune réservation pour le moment</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recent.map(res => {
        const villa = VILLAS_DATA[res.villa_id] || { name: res.villa_name, image: '' };
        const statusClass = `status-${res.status || 'pending'}`;
        const statusText = {
            'pending': 'En attente',
            'confirmed': 'Confirmée',
            'completed': 'Terminée',
            'cancelled': 'Annulée'
        }[res.status || 'pending'];
        
        return `
            <div class="recent-item" onclick="viewReservation('${res.reservation_id}')">
                ${villa.image ? `<img src="${villa.image}" class="villa-thumb" onerror="this.style.display='none'">` : '<div class="villa-thumb" style="background: var(--color-gold); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">V</div>'}
                <div class="recent-info">
                    <h4>${res.client_name}</h4>
                    <p>${villa.name} • <span class="status-badge ${statusClass}" style="font-size: 0.7rem;">${statusText}</span></p>
                </div>
                <div class="recent-meta">
                    <div class="recent-price">${parseFloat(res.total_price).toLocaleString('fr-FR')} MAD</div>
                    <div class="recent-date">${new Date(res.check_in).toLocaleDateString('fr-FR')}</div>
                </div>
            </div>
        `;
    }).join('');
}

function loadTopVillas() {
    const reservations = getReservations();
    const container = document.getElementById('topVillasList');
    if (!container) return;
    
    const villaStats = {};
    reservations.forEach(r => {
        if (!villaStats[r.villa_id]) {
            villaStats[r.villa_id] = { count: 0, revenue: 0 };
        }
        villaStats[r.villa_id].count++;
        villaStats[r.villa_id].revenue += parseFloat(r.total_price) || 0;
    });
    
    const sorted = Object.entries(villaStats).sort((a, b) => b[1].count - a[1].count).slice(0, 5);
    
    if (sorted.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Aucune donnée</p></div>';
        return;
    }
    
    container.innerHTML = sorted.map(([villaId, stats], index) => {
        const villa = VILLAS_DATA[villaId] || { name: villaId };
        return `
            <div class="villa-rank-item">
                <div class="rank-number">${index + 1}</div>
                <div class="villa-rank-info">
                    <h4>${villa.name}</h4>
                    <p>${stats.revenue.toLocaleString('fr-FR')} MAD</p>
                </div>
                <div class="villa-rank-count">${stats.count} rés.</div>
            </div>
        `;
    }).join('');
}

function viewReservation(reservationId) {
    const reservations = getReservations();
    const res = reservations.find(r => r.reservation_id === reservationId);
    if (res) showReservationModal(res);
}

function showReservationModal(res) {
    const modal = document.getElementById('reservationModal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;
    
    const villa = VILLAS_DATA[res.villa_id] || { name: res.villa_name, image: '' };
    const servicesHtml = res.services_selected && res.services_selected.length > 0
        ? res.services_selected.map(s => `
            <div class="service-item">
                <span>${s.name}</span>
                <span>${parseFloat(s.price).toLocaleString('fr-FR')} MAD</span>
            </div>
        `).join('')
        : '<p style="color: var(--color-text-light); font-style: italic;">Aucun service sélectionné</p>';
    
    const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled'];
    const statusLabels = {
        'pending': 'En attente',
        'confirmed': 'Confirmée',
        'completed': 'Terminée',
        'cancelled': 'Annulée'
    };
    
    modalBody.innerHTML = `
        ${villa.image ? `
            <div style="width: 100%; height: 200px; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
                <img src="${villa.image}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.style.display='none'">
            </div>
        ` : ''}
        <div class="detail-section">
            <h4>Informations Client</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Nom complet</span>
                    <span class="detail-value">${res.client_name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${res.email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Téléphone</span>
                    <span class="detail-value">${res.phone}</span>
                </div>
            </div>
        </div>
        <div class="detail-section">
            <h4>Détails du Séjour</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Villa</span>
                    <span class="detail-value">${villa.name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Arrivée</span>
                    <span class="detail-value">${new Date(res.check_in).toLocaleDateString('fr-FR')} à ${res.arrival_time}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Départ</span>
                    <span class="detail-value">${new Date(res.check_out).toLocaleDateString('fr-FR')} à ${res.departure_time}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Durée</span>
                    <span class="detail-value">${res.nights} nuit(s)</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Voyageurs</span>
                    <span class="detail-value">${res.adults} adulte(s), ${res.children} enfant(s)</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Statut</span>
                    <select class="detail-value" style="border: 1px solid var(--color-border); padding: 8px; border-radius: 6px; background: white;" onchange="updateStatus('${res.reservation_id}', this.value)">
                        ${statusOptions.map(s => `<option value="${s}" ${res.status === s ? 'selected' : ''}>${statusLabels[s]}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>
        <div class="detail-section">
            <h4>Services Additionnels</h4>
            <div class="services-list">
                ${servicesHtml}
            </div>
        </div>
        <div class="detail-section">
            <h4>Récapitulatif Financier</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Prix Villa</span>
                    <span class="detail-value">${parseFloat(res.villa_total).toLocaleString('fr-FR')} MAD</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Services</span>
                    <span class="detail-value">${parseFloat(res.services_total).toLocaleString('fr-FR')} MAD</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Sous-Total HT</span>
                    <span class="detail-value">${parseFloat(res.subtotal).toLocaleString('fr-FR')} MAD</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">TVA (10%)</span>
                    <span class="detail-value">${parseFloat(res.vat).toLocaleString('fr-FR')} MAD</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Taxe de Séjour</span>
                    <span class="detail-value">${parseFloat(res.tax).toLocaleString('fr-FR')} MAD</span>
                </div>
                <div class="detail-item" style="background: var(--color-gold); color: white;">
                    <span class="detail-label" style="color: rgba(255,255,255,0.9);">Total TTC</span>
                    <span class="detail-value" style="color: white; font-size: 1.2rem;">${parseFloat(res.total_price).toLocaleString('fr-FR')} MAD</span>
                </div>
            </div>
        </div>
        ${res.special_requests ? `
            <div class="detail-section">
                <h4>Demandes Spéciales</h4>
                <p style="background: var(--color-gray); padding: 15px; border-radius: 8px; font-style: italic;">${res.special_requests}</p>
            </div>
        ` : ''}
        
        <!-- ✅ BOUTON TÉLÉCHARGER PDF AJOUTÉ -->
        <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid var(--color-gold); display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="downloadPdfBtnAdmin" onclick="generateAdminPDF()" style="
                flex: 1;
                min-width: 200px;
                background: linear-gradient(135deg, #D4AF37 0%, #B89628 100%);
                color: white;
                border: none;
                padding: 14px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(212, 175, 55, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(212, 175, 55, 0.3)';">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Télécharger la Facture PDF
            </button>
            <button onclick="printReservation()" style="
                flex: 1;
                min-width: 200px;
                background: transparent;
                color: var(--color-gold);
                border: 2px solid var(--color-gold);
                padding: 14px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='var(--color-gold)'; this.style.color='white';" onmouseout="this.style.background='transparent'; this.style.color='var(--color-gold)';">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Imprimer
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    window.currentReservation = res;
}

function generateAdminPDF() {
    const data = window.currentReservation;
    if (!data) {
        alert('Aucune réservation sélectionnée');
        return;
    }

    if (typeof window.jspdf === 'undefined') {
        alert('Chargement de la bibliothèque PDF en cours, veuillez réessayer dans quelques secondes...');
        loadJSPDF();
        setTimeout(() => {
            if (typeof window.jspdf !== 'undefined') {
                generateAdminPDF();
            }
        }, 2000);
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;
    
    const gold = [212, 175, 55];
    const black = [17, 17, 17];
    const gray = [100, 100, 100];
    
    function formatPrice(amount) {
        return Number(amount).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' MAD';
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
    
    doc.setFillColor(...gold);
    doc.rect(0, 0, pageWidth, 4, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(...gold);
    doc.text('ATLAS PRESTIGE VILLAS', pageWidth / 2, y + 12, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text("L'Excellence Immobilière à Marrakech", pageWidth / 2, y + 20, { align: 'center' });
    
    y += 35;
    
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...black);
    doc.text('FACTURE DE RÉSERVATION', pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gold);
    doc.text('INFORMATIONS GÉNÉRALES', margin, y);
    y += 2;
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + 60, y);
    y += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...black);
    doc.setFontSize(10);
    
    const labelWidth = 50;
    const valueStart = margin + labelWidth + 5;
    
    doc.text('N° Réservation:', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(data.reservation_id, valueStart, y);
    y += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.text('N° Facture:', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(data.invoice_number, valueStart, y);
    y += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.text("Date d'émission:", margin, y);
    doc.setFont('helvetica', 'bold');
    const now = new Date();
    doc.text(now.toLocaleDateString('fr-FR') + ' à ' + now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}), valueStart, y);
    y += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gold);
    doc.text('INFORMATIONS CLIENT', margin, y);
    y += 2;
    doc.setDrawColor(...gold);
    doc.line(margin, y, margin + 55, y);
    y += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...black);
    doc.setFontSize(10);
    
    doc.text('Nom complet:', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(data.client_name, valueStart, y);
    y += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Email:', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(data.email, valueStart, y);
    y += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Téléphone:', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(data.phone, valueStart, y);
    y += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gold);
    doc.text('DÉTAILS DU SÉJOUR', margin, y);
    y += 2;
    doc.setDrawColor(...gold);
    doc.line(margin, y, margin + 50, y);
    y += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...black);
    doc.setFontSize(10);
    
    const villa = VILLAS_DATA[data.villa_id] || { name: data.villa_name };
    
    doc.text('Villa:', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(villa.name, valueStart, y);
    y += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Arrivée:', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${formatDate(data.check_in)} à ${data.arrival_time}`, valueStart, y);
    y += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Départ:', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${formatDate(data.check_out)} à ${data.departure_time}`, valueStart, y);
    y += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Durée:', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.nights} nuit(s)`, valueStart, y);
    y += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Voyageurs:', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.adults} adulte(s), ${data.children} enfant(s)`, valueStart, y);
    y += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gold);
    doc.text('SERVICES ADDITIONNELS', margin, y);
    y += 2;
    doc.setDrawColor(...gold);
    doc.line(margin, y, margin + 58, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(...black);
    
    if (data.services_selected && data.services_selected.length > 0) {
        data.services_selected.forEach(s => {
            const price = s.type === 'daily' ? s.price * data.nights : s.price;
            doc.setFont('helvetica', 'normal');
            doc.text(s.name, margin, y);
            doc.setFont('helvetica', 'bold');
            doc.text(formatPrice(price), pageWidth - margin, y, { align: 'right' });
            y += 6;
        });
    } else {
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(...gray);
        doc.text('Aucun service sélectionné', margin, y);
        y += 6;
        doc.setTextColor(...black);
    }
    y += 8;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gold);
    doc.text('RÉCAPITULATIF FINANCIER', margin, y);
    y += 2;
    doc.setDrawColor(...gold);
    doc.line(margin, y, margin + 62, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(...black);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Prix de la Villa (${data.nights} nuits x ${formatPrice(data.villa_price)})`, margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(formatPrice(data.villa_total), pageWidth - margin, y, { align: 'right' });
    y += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Services Additionnels', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(formatPrice(data.services_total), pageWidth - margin, y, { align: 'right' });
    y += 7;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Sous-Total HT', margin, y);
    doc.text(formatPrice(data.subtotal), pageWidth - margin, y, { align: 'right' });
    y += 5;
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text('TVA (10%)', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(formatPrice(data.vat), pageWidth - margin, y, { align: 'right' });
    y += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text('Taxe de Séjour', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(formatPrice(data.tax), pageWidth - margin, y, { align: 'right' });
    y += 5;
    
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    
    const totalBoxHeight = 15;
    doc.setFillColor(...black);
    doc.rect(margin, y - 5, pageWidth - 2 * margin, totalBoxHeight, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gold);
    doc.text('TOTAL TTC', margin + 5, y + 5);
    doc.text(formatPrice(data.total_price), pageWidth - margin - 5, y + 5, { align: 'right' });
    y += 20;
    
    const qrX = pageWidth - margin - 40;
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([2, 2], 0);
    doc.rect(qrX, y, 40, 40);
    doc.setLineDashPattern([], 0);
    
    doc.setFontSize(8);
    doc.setTextColor(...black);
    doc.setFont('helvetica', 'bold');
    doc.text('QR CODE', qrX + 20, y + 18, { align: 'center' });
    doc.text('DE RÉSERVATION', qrX + 20, y + 23, { align: 'center' });
    doc.setTextColor(...gold);
    doc.text(data.reservation_id, qrX + 20, y + 32, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...gray);
    doc.text('Signature numérique Atlas Prestige Villas', margin, y + 15);
    doc.setFontSize(8);
    doc.text('Document généré depuis le Dashboard Admin', margin, y + 22);
    
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...black);
    doc.text('ATLAS PRESTIGE VILLAS', pageWidth / 2, pageHeight - 28, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...gray);
    doc.text('45 Rue de la Palmeraie, 40000 Marrakech, Maroc', pageWidth / 2, pageHeight - 22, { align: 'center' });
    doc.text('+212 0767129762 | atlasprestige@gmail.com', pageWidth / 2, pageHeight - 17, { align: 'center' });
    
    const filename = `ATLAS-PRESTIGE-${data.reservation_id}.pdf`;
    doc.save(filename);
    
    showNotification('PDF téléchargé avec succès !', 'success');
}

function printReservation() {
    const data = window.currentReservation;
    if (!data) {
        alert('Aucune réservation sélectionnée');
        return;
    }
    
    const villa = VILLAS_DATA[data.villa_id] || { name: data.villa_name };
    
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Facture ${data.reservation_id}</title>
            <style>
                body { font-family: 'Helvetica', Arial, sans-serif; padding: 40px; color: #333; }
                .header { text-align: center; border-bottom: 3px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
                .header h1 { color: #D4AF37; font-size: 28px; margin: 0; letter-spacing: 2px; }
                .header p { color: #666; font-size: 11px; margin-top: 8px; }
                h2 { color: #D4AF37; font-size: 14px; border-bottom: 1px solid #D4AF37; padding-bottom: 5px; margin-top: 25px; }
                h3 { text-align: center; font-size: 20px; color: #111; margin-bottom: 30px; }
                .row { display: flex; margin-bottom: 8px; }
                .label { width: 150px; font-weight: normal; color: #333; }
                .value { flex: 1; font-weight: bold; }
                .total-box { background: #111; color: white; padding: 15px; margin-top: 20px; display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; }
                .total-box .amount { color: #D4AF37; }
                .footer { margin-top: 50px; text-align: center; border-top: 1px solid #ddd; padding-top: 20px; font-size: 11px; color: #666; }
                .service-item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dashed #ddd; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>ATLAS PRESTIGE VILLAS</h1>
                <p>L'Excellence Immobilière à Marrakech</p>
            </div>
            
            <h3>FACTURE DE RÉSERVATION</h3>
            
            <h2>INFORMATIONS GÉNÉRALES</h2>
            <div class="row"><span class="label">N° Réservation:</span><span class="value">${data.reservation_id}</span></div>
            <div class="row"><span class="label">N° Facture:</span><span class="value">${data.invoice_number}</span></div>
            <div class="row"><span class="label">Date d'émission:</span><span class="value">${new Date().toLocaleDateString('fr-FR')}</span></div>
            
            <h2>INFORMATIONS CLIENT</h2>
            <div class="row"><span class="label">Nom complet:</span><span class="value">${data.client_name}</span></div>
            <div class="row"><span class="label">Email:</span><span class="value">${data.email}</span></div>
            <div class="row"><span class="label">Téléphone:</span><span class="value">${data.phone}</span></div>
            
            <h2>DÉTAILS DU SÉJOUR</h2>
            <div class="row"><span class="label">Villa:</span><span class="value">${villa.name}</span></div>
            <div class="row"><span class="label">Arrivée:</span><span class="value">${new Date(data.check_in).toLocaleDateString('fr-FR')} à ${data.arrival_time}</span></div>
            <div class="row"><span class="label">Départ:</span><span class="value">${new Date(data.check_out).toLocaleDateString('fr-FR')} à ${data.departure_time}</span></div>
            <div class="row"><span class="label">Durée:</span><span class="value">${data.nights} nuit(s)</span></div>
            <div class="row"><span class="label">Voyageurs:</span><span class="value">${data.adults} adulte(s), ${data.children} enfant(s)</span></div>
            
            <h2>SERVICES ADDITIONNELS</h2>
            ${data.services_selected && data.services_selected.length > 0 
                ? data.services_selected.map(s => {
                    const price = s.type === 'daily' ? s.price * data.nights : s.price;
                    return `<div class="service-item"><span>${s.name}</span><span>${price.toLocaleString('fr-FR')} MAD</span></div>`;
                }).join('')
                : '<p style="color: #666; font-style: italic;">Aucun service sélectionné</p>'
            }
            
            <h2>RÉCAPITULATIF FINANCIER</h2>
            <div class="row"><span class="label">Prix Villa:</span><span class="value">${parseFloat(data.villa_total).toLocaleString('fr-FR')} MAD</span></div>
            <div class="row"><span class="label">Services:</span><span class="value">${parseFloat(data.services_total).toLocaleString('fr-FR')} MAD</span></div>
            <div class="row"><span class="label">Sous-Total HT:</span><span class="value">${parseFloat(data.subtotal).toLocaleString('fr-FR')} MAD</span></div>
            <div class="row"><span class="label">TVA (10%):</span><span class="value">${parseFloat(data.vat).toLocaleString('fr-FR')} MAD</span></div>
            <div class="row"><span class="label">Taxe de Séjour:</span><span class="value">${parseFloat(data.tax).toLocaleString('fr-FR')} MAD</span></div>
            
            <div class="total-box">
                <span>TOTAL TTC</span>
                <span class="amount">${parseFloat(data.total_price).toLocaleString('fr-FR')} MAD</span>
            </div>
            
            <div class="footer">
                <p><strong>ATLAS PRESTIGE VILLAS</strong></p>
                <p>45 Rue de la Palmeraie, 40000 Marrakech, Maroc</p>
                <p>+212 0767129762 | atlasprestige@gmail.com</p>
                <p style="margin-top: 10px; font-style: italic;">Signature numérique - Document généré depuis le Dashboard Admin</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

function closeModal() {
    const modal = document.getElementById('reservationModal');
    if (modal) modal.classList.remove('active');
}

function updateStatus(reservationId, newStatus) {
    const reservations = getReservations();
    const res = reservations.find(r => r.reservation_id === reservationId);
    if (res) {
        res.status = newStatus;
        saveReservations(reservations);
        loadAllData();
        showNotification('Statut mis à jour avec succès', 'success');
    }
}

function deleteReservation(reservationId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
        const reservations = getReservations();
        const filtered = reservations.filter(r => r.reservation_id !== reservationId);
        saveReservations(filtered);
        loadAllData();
        showNotification('Réservation supprimée', 'success');
    }
}

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const villaFilter = document.getElementById('villaFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (!searchInput) return;
    
    const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const villa = villaFilter.value;
        const status = statusFilter.value;
        
        const rows = document.querySelectorAll('#reservationsTableBody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const matchSearch = !searchTerm || text.includes(searchTerm);
            const matchVilla = !villa || text.includes(villa);
            const matchStatus = !status || row.innerHTML.includes(status);
            
            row.style.display = (matchSearch && matchVilla && matchStatus) ? '' : 'none';
        });
    };
    
    searchInput.addEventListener('input', applyFilters);
    villaFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
}

function loadStatistics() {
    const reservations = getReservations();
    const villaStatsGrid = document.getElementById('villaStatsGrid');
    const monthlyStats = document.getElementById('monthlyStats');
    
    if (!villaStatsGrid || !monthlyStats) return;
    
    const villaStats = {};
    reservations.forEach(r => {
        if (!villaStats[r.villa_id]) {
            villaStats[r.villa_id] = { count: 0, revenue: 0 };
        }
        villaStats[r.villa_id].count++;
        villaStats[r.villa_id].revenue += parseFloat(r.total_price) || 0;
    });
    
    villaStatsGrid.innerHTML = Object.entries(villaStats).map(([villaId, stats]) => {
        const villa = VILLAS_DATA[villaId] || { name: villaId };
        return `
            <div class="stat-detailed-card">
                <div class="stat-detailed-header">
                    <h4>${villa.name}</h4>
                    <span class="stat-detailed-count">${stats.count} rés.</span>
                </div>
                <div class="stat-detailed-revenue">${stats.revenue.toLocaleString('fr-FR')} MAD</div>
                <div class="stat-detailed-label">Chiffre d'affaires total</div>
            </div>
        `;
    }).join('') || '<p style="text-align: center; color: var(--color-text-light); padding: 40px;">Aucune donnée disponible</p>';
    
    const monthlyData = {};
    reservations.forEach(r => {
        const date = new Date(r.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[key]) monthlyData[key] = { count: 0, revenue: 0 };
        monthlyData[key].count++;
        monthlyData[key].revenue += parseFloat(r.total_price) || 0;
    });
    
    monthlyStats.innerHTML = Object.entries(monthlyData).sort().reverse().map(([key, stats]) => {
        const [year, month] = key.split('-');
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        return `
            <div class="monthly-card">
                <h4>${monthNames[parseInt(month) - 1]} ${year}</h4>
                <div class="count">${stats.count}</div>
                <div class="revenue">${stats.revenue.toLocaleString('fr-FR')} MAD</div>
            </div>
        `;
    }).join('') || '<p style="text-align: center; color: var(--color-text-light); padding: 40px;">Aucune donnée disponible</p>';
}

function loadClients() {
    const reservations = getReservations();
    const container = document.getElementById('clientsList');
    if (!container) return;
    
    const clients = {};
    reservations.forEach(r => {
        if (!clients[r.email]) {
            clients[r.email] = {
                name: r.client_name,
                email: r.email,
                phone: r.phone,
                reservations: 0,
                totalSpent: 0
            };
        }
        clients[r.email].reservations++;
        clients[r.email].totalSpent += parseFloat(r.total_price) || 0;
    });
    
    const searchInput = document.getElementById('clientSearch');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    const filteredClients = Object.values(clients).filter(c =>
        c.name.toLowerCase().includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm)
    );
    
    container.innerHTML = filteredClients.map(client => {
        const initials = client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        return `
            <div class="client-card">
                <div class="client-header">
                    <div class="client-avatar">${initials}</div>
                    <div class="client-info">
                        <h4>${client.name}</h4>
                        <p>${client.email}</p>
                    </div>
                </div>
                <div class="client-stats">
                    <div class="client-stat">
                        <div class="client-stat-value">${client.reservations}</div>
                        <div class="client-stat-label">Réservations</div>
                    </div>
                    <div class="client-stat">
                        <div class="client-stat-value">${client.totalSpent.toLocaleString('fr-FR')} MAD</div>
                        <div class="client-stat-label">Total dépensé</div>
                    </div>
                </div>
            </div>
        `;
    }).join('') || '<p style="text-align: center; color: var(--color-text-light); padding: 40px;">Aucun client</p>';
    
    if (searchInput) {
        searchInput.oninput = loadClients;
    }
}

function loadSettings() {
    const creds = getAdminCredentials();
    const nameEl = document.getElementById('settingsName');
    const emailEl = document.getElementById('settingsEmail');
    
    if (nameEl) nameEl.value = creds.name;
    if (emailEl) emailEl.value = creds.email;
}

function setupSettings() {
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const name = document.getElementById('settingsName').value.trim();
            const email = document.getElementById('settingsEmail').value.trim();
            const oldPassword = document.getElementById('settingsOldPassword').value;
            const newPassword = document.getElementById('settingsNewPassword').value;
            const confirmPassword = document.getElementById('settingsConfirmPassword').value;
            
            const creds = getAdminCredentials();
            
            if (newPassword) {
                if (oldPassword !== creds.password) {
                    showNotification('Ancien mot de passe incorrect', 'error');
                    return;
                }
                if (newPassword !== confirmPassword) {
                    showNotification('Les mots de passe ne correspondent pas', 'error');
                    return;
                }
                if (newPassword.length < 6) {
                    showNotification('Le mot de passe doit contenir au moins 6 caractères', 'error');
                    return;
                }
                creds.password = newPassword;
            }
            
            creds.name = name;
            creds.email = email;
            localStorage.setItem('adminCredentials', JSON.stringify(creds));
            
            const adminNameEl = document.getElementById('sidebarAdminName');
            if (adminNameEl) adminNameEl.textContent = name;
            
            showNotification('Paramètres sauvegardés avec succès', 'success');
            
            document.getElementById('settingsOldPassword').value = '';
            document.getElementById('settingsNewPassword').value = '';
            document.getElementById('settingsConfirmPassword').value = '';
        });
    }
    
    const clearBtn = document.getElementById('clearAllBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('⚠️ ATTENTION : Cette action supprimera TOUTES les réservations de façon irréversible. Êtes-vous sûr ?')) {
                if (confirm('Dernière confirmation : Voulez-vous vraiment tout supprimer ?')) {
                    localStorage.removeItem('atlasReservations');
                    loadAllData();
                    showNotification('Toutes les réservations ont été supprimées', 'success');
                }
            }
        });
    }
}

function checkNewReservations() {
    const lastCheck = localStorage.getItem('lastReservationCheck') || '0';
    const currentCheck = localStorage.getItem('newReservationAlert') || '0';
    
    if (currentCheck > lastCheck) {
        showNotification('🔔 Nouvelle réservation reçue !', 'info');
        loadAllData();
        localStorage.setItem('lastReservationCheck', currentCheck);
        
        const notifDot = document.getElementById('notifDot');
        if (notifDot) notifDot.classList.add('active');
    }
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    if (!container) return;
    
    const icons = { 'info': '', 'success': '✅', 'error': '❌' };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${type === 'info' ? 'Information' : type === 'success' ? 'Succès' : 'Erreur'}</h4>
            <p>${message}</p>
        </div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

const VILLAS_DATA = {
    'Villa Tilila': {
        name: 'Villa Tilila',
        image: 'villa-atlas-royal/EX.jpg',
        category: 'Villas Prestige',
        price: 1200
    },
    'Dar Saada Private Villa': {
        name: 'Dar Saada Private Villa',
        image: 'villa-majorelle-prestige/JARDIN.jpg',
        category: 'Villas Prestige',
        price: 1600
    },
    'Villa de Salah': {
        name: 'Villa de Salah',
        image: 'villa-palm-family/piscine.jpeg',
        category: 'Villas Familiales',
        price: 900
    },
    'Villa LES LAURIERS': {
        name: 'Villa LES LAURIERS',
        image: 'villa-atlas-garden/PISCINE.jpg',
        category: 'Villas Luxe',
        price: 1400
    },
    'Marrakech Le Joyau Villa': {
        name: 'Marrakech Le Joyau Villa',
        image: 'villa-diamond-palace/VUS.jpg',
        category: 'Villas Ultras Luxe',
        price: 2500
    },
    'Villa Elyana': {
        name: 'Villa Elyana',
        image: 'villa-royal-prestige/PISCINE.jpg',
        category: 'Villas VIP',
        price: 3500
    }
};

const DEFAULT_ADMIN = {
    email: 'adminatlasprestige@gmail.com',
    password: 'admin123',
    name: 'Administrateur'
};

