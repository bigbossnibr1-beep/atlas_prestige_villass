document.addEventListener('DOMContentLoaded', () => {
    const adminSession = JSON.parse(localStorage.getItem('adminSession'));
    if (!adminSession) {
        window.location.href = 'admin-login.html';
        return;
    }

    const usersTableBody = document.getElementById('usersTableBody');
    const emptyState = document.getElementById('emptyState');
    const totalUsersEl = document.getElementById('totalUsers');
    const newUsersEl = document.getElementById('newUsers');
    const lastUpdateEl = document.getElementById('lastUpdate');
    const searchInput = document.getElementById('searchInput');
    const refreshBtn = document.getElementById('refreshBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const modalClose = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('cancelBtn');
    const toast = document.getElementById('toast');

    function loadUsers(filter = '') {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const filtered = filter 
            ? users.filter(u => 
                u.name.toLowerCase().includes(filter) ||
                u.email.toLowerCase().includes(filter) ||
                (u.phone && u.phone.includes(filter))
            )
            : users;

        totalUsersEl.textContent = users.length;
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newUsers = users.filter(u => new Date(u.createdAt) > sevenDaysAgo);
        newUsersEl.textContent = newUsers.length;
        
        lastUpdateEl.textContent = new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        if (filtered.length === 0) {
            usersTableBody.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        usersTableBody.innerHTML = filtered.map((user, index) => {
            const realIndex = users.indexOf(user);
            const date = new Date(user.createdAt).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            return `
                <tr>
                    <td class="user-id">#${String(realIndex + 1).padStart(3, '0')}</td>
                    <td class="user-name">${escapeHtml(user.name)}</td>
                    <td class="user-email">${escapeHtml(user.email)}</td>
                    <td>${escapeHtml(user.phone || '-')}</td>
                    <td class="user-date">${date}</td>
                    <td>
                        <div class="actions">
                            <button class="action-btn edit" data-index="${realIndex}" title="Modifier">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="action-btn delete" data-index="${realIndex}" title="Supprimer">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        attachActionEvents();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function attachActionEvents() {
        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.index)));
        });

        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', () => deleteUser(parseInt(btn.dataset.index)));
        });
    }

    function openEditModal(index) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users[index];
        if (!user) return;

        document.getElementById('editIndex').value = index;
        document.getElementById('editName').value = user.name;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPhone').value = user.phone || '';
        document.getElementById('editPassword').value = '';
        
        editModal.classList.add('active');
    }

    function closeModal() {
        editModal.classList.remove('active');
        editForm.reset();
    }

    modalClose.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeModal();
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = parseInt(document.getElementById('editIndex').value);
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (!users[index]) return;

        const newName = document.getElementById('editName').value.trim();
        const newEmail = document.getElementById('editEmail').value.trim();
        const newPhone = document.getElementById('editPhone').value.trim();
        const newPassword = document.getElementById('editPassword').value;

        const emailExists = users.some((u, i) => i !== index && u.email === newEmail);
        if (emailExists) {
            showToast('Cet email est déjà utilisé par un autre utilisateur', 'error');
            return;
        }

        users[index].name = newName;
        users[index].email = newEmail;
        users[index].phone = newPhone;
        if (newPassword) users[index].password = newPassword;

        localStorage.setItem('users', JSON.stringify(users));
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.email === users[index].email) {
            localStorage.setItem('currentUser', JSON.stringify(users[index]));
        }

        closeModal();
        loadUsers(searchInput.value.toLowerCase());
        showToast('✓ Utilisateur modifié avec succès', 'success');
    });

    function deleteUser(index) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users[index];
        if (!user) return;

        if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?\n\nCette action est irréversible.`)) {
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            loadUsers(searchInput.value.toLowerCase());
            showToast('✓ Utilisateur supprimé', 'success');
        }
    }

    searchInput.addEventListener('input', (e) => {
        loadUsers(e.target.value.toLowerCase());
    });

    refreshBtn.addEventListener('click', () => {
        loadUsers(searchInput.value.toLowerCase());
        showToast('✓ Données actualisées', 'success');
    });

    logoutBtn.addEventListener('click', () => {
        if (confirm('Voulez-vous vraiment vous déconnecter du dashboard ?')) {
            localStorage.removeItem('adminSession');
            window.location.href = 'admin-login.html';
        }
    });

    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && editModal.classList.contains('active')) {
            closeModal();
        }
    });

    loadUsers();
    
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');

if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
});

const tableContainer = document.querySelector('.table-container');
if (tableContainer) {
    const checkScroll = () => {
        if (tableContainer.scrollWidth > tableContainer.clientWidth) {
            tableContainer.classList.add('scrollable');
        } else {
            tableContainer.classList.remove('scrollable');
        }
    };
    checkScroll();
    window.addEventListener('resize', checkScroll);
    tableContainer.addEventListener('scroll', () => {
        if (tableContainer.scrollLeft > 20) {
            tableContainer.classList.remove('scrollable');
        }
    });
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

});