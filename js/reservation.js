document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
    const state = {
         currentStep: 1,
         selectedVilla: null,
         selectedServices: [],
         clientInfo: {},
         pricing: {
             villaTotal: 0, servicesTotal: 0, subtotal: 0,
             vat: 0, tax: 0, total: 0, nights: 0
         }
     };
     const villasData = [
         { id: 'Villa Tilila', name: 'Villa Tilila', price: 1200, image: 'villa-atlas-royal/EX.jpg', description: 'Un écrin de verdure au cœur de la Palmeraie.', capacity: 10, rooms: 5, bathrooms: 4 },
         { id: 'Dar Saada Private Villa', name: 'Dar Saada Private Villa', price: 1600, image: 'villa-majorelle-prestige/JARDIN.jpg', description: 'À proximité des jardins Majorelle, calme absolu.', capacity: 10, rooms: 5, bathrooms: 3 },
         { id: 'Villa de Salah', name: 'Villa de Salah', price: 900, image: 'villa-palm-family/piscine.jpeg', description: 'Idéale pour les familles avec espaces de jeux.', capacity: 8, rooms: 3, bathrooms: 4 },
         { id: 'Villa LES LAURIERS', name: 'Villa LES LAURIERS', price: 1400, image: 'villa-atlas-garden/PISCINE.jpg', description: 'Jardin luxuriant avec vue Atlas.', capacity: 10, rooms: 4, bathrooms: 4 },
         { id: 'Marrakech Le Joyau Villa', name: 'Marrakech Le Joyau Villa', price: 2500, image: 'villa-diamond-palace/VUS.jpg', description: 'Le summum du luxe avec héliport et cinéma.', capacity: 10, rooms: 4, bathrooms: 3 },
         { id: 'Villa Elyana', name: 'Villa Elyana', price: 3500, image: 'villa-royal-prestige/PISCINE.jpg', description: 'Palais moderne avec court de tennis.', capacity: 12, rooms: 4, bathrooms: 3 }
     ];
     const servicesData = [
         { id: 's1', name: 'Chef Cuisinier Privé', price: 1500, type: 'daily', category: 'gastronomie', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" y1="17" x2="18" y2="17"></line></svg>', desc: 'Gastronomie marocaine ou internationale.' },
         { id: 's2', name: 'Petit Déjeuner Inclus', price: 500, type: 'daily', category: 'gastronomie', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>', desc: 'Buffet premium servi chaque matin.' },
         { id: 's3', name: 'Dîner Gastronomique', price: 1200, type: 'flat', category: 'gastronomie', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"></path></svg>', desc: 'Dîner 5 services avec sommelier.' },
         { id: 's4', name: 'Chauffeur Privé', price: 1000, type: 'daily', category: 'transport', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>', desc: 'Chauffeur professionnel toute la journée.' },
         { id: 's5', name: 'Voiture de Luxe', price: 2500, type: 'daily', category: 'transport', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2l2-3h6l2 3h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17v2m14-2v2"></path><circle cx="7.5" cy="14.5" r="1.5"></circle><circle cx="16.5" cy="14.5" r="1.5"></circle></svg>', desc: 'Berline ou SUV haut de gamme.' },
         { id: 's6', name: 'Massage à Domicile', price: 900, type: 'flat', category: 'bien-etre', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22c4.97 0 9-4.03 9-9-4.5 0-9-9-9-9s-4.5 9-9 9c0 4.97 4.03 9 9 9z"></path></svg>', desc: 'Massage relaxant 60 min dans votre villa.' },
         { id: 's7', name: 'Spa Privé', price: 1800, type: 'daily', category: 'bien-etre', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>', desc: 'Accès illimité au spa privatif.' },
         { id: 's8', name: 'Hammam Traditionnel', price: 800, type: 'flat', category: 'bien-etre', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><path d="M9 9h.01M15 9h.01"></path><path d="M12 2a10 10 0 1 0 10 10"></path></svg>', desc: 'Rituel hammam complet avec gommage.' },
         { id: 's9', name: 'Babysitting', price: 600, type: 'daily', category: 'famille', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22c4.97 0 9-4.03 9-9-4.5 0-9-9-9-9s-4.5 9-9 9c0 4.97 4.03 9 9 9z"></path><circle cx="12" cy="10" r="3"></circle></svg>', desc: 'Garde qualifiée pour vos enfants.' },
         { id: 's10', name: 'Ménage Quotidien', price: 400, type: 'daily', category: 'famille', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>', desc: 'Service de ménage professionnel.' },
         { id: 's11', name: 'Sécurité Privée 24h/24', price: 4000, type: 'daily', category: 'securite', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>', desc: 'Agents de sécurité formés.' },
         { id: 's12', name: 'Organisation Événements', price: 5000, type: 'flat', category: 'famille', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg>', desc: 'Coordination complète de votre événement.' },
         { id: 's13', name: 'Décoration Spéciale', price: 3000, type: 'flat', category: 'famille', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>', desc: 'Décoration florale et thématique.' },
         { id: 's14', name: 'Excursion Désert', price: 2500, type: 'flat', category: 'activites', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>', desc: 'Journée complète dans le désert.' },
         { id: 's15', name: 'Quad & Activités', price: 1200, type: 'flat', category: 'activites', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"></rect><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>', desc: 'Randonnée en quad guidée.' },
         { id: 's16', name: 'Montgolfière', price: 3500, type: 'flat', category: 'activites', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>', desc: 'Vol au lever du soleil.' },
         { id: 's17', name: 'Guide Touristique', price: 1500, type: 'flat', category: 'activites', icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>', desc: 'Guide francophone pour la journée.' }
     ];
     const savedState = localStorage.getItem('atlasReservationState');
     if (savedState) {
         try {
             const parsed = JSON.parse(savedState);
             Object.assign(state, parsed);
         } catch (e) {}
     }
     function saveState() {
         localStorage.setItem('atlasReservationState', JSON.stringify(state));
     }
     function renderVillas() {
         const grid = document.getElementById('villasGrid');
         if (!grid) return;
         grid.innerHTML = '';
         villasData.forEach(villa => {
             const card = document.createElement('div');
             card.className = 'villa-card';
             card.dataset.villaId = villa.id;
             if (state.selectedVilla && state.selectedVilla.id === villa.id) {
                 card.classList.add('selected');
             }
             card.innerHTML = `
                 <div class="villa-img" style="background-image: url('${villa.image}')"></div>
                 <div class="villa-info">
                     <h3>${villa.name}</h3>
                     <p class="villa-price">${villa.price.toLocaleString('fr-FR')} MAD / nuit</p>
                     <div class="villa-specs">
                         <span>${villa.rooms} Chambres</span>
                         <span>${villa.capacity} Personnes</span>
                         <span>${villa.bathrooms} SDB</span>
                     </div>
                 </div>
             `;
             card.addEventListener('click', () => selectVilla(villa));
             grid.appendChild(card);
         });
     }
     function selectVilla(villa) {
         state.selectedVilla = villa;
         document.querySelectorAll('.villa-card').forEach(c => c.classList.remove('selected'));
         const target = document.querySelector(`[data-villa-id="${villa.id}"]`);
         if (target) target.classList.add('selected');
         setTimeout(() => {
             goToStep(2);
             renderSelectedVilla();
             renderServices();
         }, 300);
         saveState();
     }
     function renderSelectedVilla() {
         if (!state.selectedVilla) return;
         const img = document.getElementById('selectedVillaImg');
         if (img) img.src = state.selectedVilla.image;
         const name = document.getElementById('selectedVillaName');
         if (name) name.textContent = state.selectedVilla.name;
         const price = document.getElementById('selectedVillaPrice');
         if (price) price.textContent = `${state.selectedVilla.price.toLocaleString('fr-FR')} MAD / nuit`;
         const specs = document.getElementById('selectedVillaSpecs');
         if (specs) specs.innerHTML = `
             <span>${state.selectedVilla.rooms} Chambres</span>
             <span>${state.selectedVilla.capacity} Personnes</span>
             <span>${state.selectedVilla.bathrooms} Salles de bain</span>
         `;
     }
     function renderServices(filter = 'all') {
         const grid = document.getElementById('servicesGrid');
         if (!grid) return;
         grid.innerHTML = '';
         const filtered = filter === 'all' ? servicesData : servicesData.filter(s => s.category === filter);
         filtered.forEach(service => {
             const isSelected = state.selectedServices.some(s => s.id === service.id);
             const card = document.createElement('div');
             card.className = `service-card ${isSelected ? 'selected' : ''}`;
             card.dataset.serviceId = service.id;
             const priceText = service.type === 'daily' ? `${service.price.toLocaleString('fr-FR')} MAD / jour` : `${service.price.toLocaleString('fr-FR')} MAD`;
             card.innerHTML = `
                 <div class="service-icon">${service.icon}</div>
                 <h4>${service.name}</h4>
                 <p>${service.desc}</p>
                 <div class="service-footer">
                     <span class="service-price">${priceText}</span>
                     <input type="checkbox" class="service-checkbox" ${isSelected ? 'checked' : ''}>
                 </div>
             `;
             const checkbox = card.querySelector('.service-checkbox');
             checkbox.addEventListener('change', (e) => {
                 if (e.target.checked) {
                     state.selectedServices.push(service);
                     card.classList.add('selected');
                 } else {
                     state.selectedServices = state.selectedServices.filter(s => s.id !== service.id);
                     card.classList.remove('selected');
                 }
                 saveState();
                 updatePricing();
             });
             grid.appendChild(card);
         });
     }
     document.querySelectorAll('.filter-btn').forEach(btn => {
         btn.addEventListener('click', () => {
             document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
             btn.classList.add('active');
             renderServices(btn.dataset.filter);
         });
     });
     function updatePricing() {
         const arrivalEl = document.getElementById('arrivalDate');
         const departureEl = document.getElementById('departureDate');
         const adultsEl = document.getElementById('adults');
         const childrenEl = document.getElementById('children');
         if (!arrivalEl || !departureEl) return;
         const arrival = arrivalEl.value;
         const departure = departureEl.value;
         const adults = parseInt(adultsEl.value) || 0;
         const children = parseInt(childrenEl.value) || 0;
         if (!arrival || !departure || !state.selectedVilla) return;
         const date1 = new Date(arrival);
         const date2 = new Date(departure);
         const nights = Math.ceil((date2 - date1) / (1000 * 3600 * 24));
         if (nights <= 0) return;
         const villaTotal = state.selectedVilla.price * nights;
         let servicesTotal = 0;
         state.selectedServices.forEach(s => {
             servicesTotal += s.type === 'daily' ? s.price * nights : s.price;
         });
         const subtotal = villaTotal + servicesTotal;
         const vat = subtotal * 0.10;
         const tax = (adults + children) * nights * 30;
         const total = subtotal + vat + tax;
         state.pricing = { villaTotal, servicesTotal, subtotal, vat, tax, total, nights };
         const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
         setEl('sumVillaPrice', `${villaTotal.toLocaleString('fr-FR')} MAD`);
         setEl('sumServicesPrice', `${servicesTotal.toLocaleString('fr-FR')} MAD`);
         setEl('sumSubtotal', `${subtotal.toLocaleString('fr-FR')} MAD`);
         setEl('sumVAT', `${vat.toLocaleString('fr-FR')} MAD`);
         setEl('sumTax', `${tax.toLocaleString('fr-FR')} MAD`);
         setEl('sumTotal', `${total.toLocaleString('fr-FR')} MAD`);
     }
     function goToStep(step) {
         state.currentStep = step;
         document.querySelectorAll('.booking-section').forEach(s => {
             s.classList.add('hidden');
             s.classList.remove('animate-in');
         });
         const currentSection = document.getElementById(`step${step}`);
         if (!currentSection) return;
         currentSection.classList.remove('hidden');
         void currentSection.offsetWidth;
         currentSection.classList.add('animate-in');
         document.querySelectorAll('.step-indicator').forEach(ind => {
             const s = parseInt(ind.dataset.step);
             ind.classList.remove('active', 'completed');
             if (s === step) ind.classList.add('active');
             else if (s < step) ind.classList.add('completed');
         });
         setTimeout(() => {
             const headerHeight = 100;
             const sectionTop = currentSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
             window.scrollTo({ top: sectionTop, behavior: 'smooth' });
         }, 100);
         saveState();
     }
     document.querySelectorAll('.villa-card').forEach(card => {
         card.addEventListener('click', () => {
             const villa = villasData.find(v => v.id === card.dataset.villaId);
             if (villa) selectVilla(villa);
         });
     });
     const backToStep2 = document.getElementById('backToStep2');
     if (backToStep2) backToStep2.addEventListener('click', () => goToStep(2));
     const backToStep3 = document.getElementById('backToStep3');
     if (backToStep3) backToStep3.addEventListener('click', () => goToStep(3));
     const goToStep3Btn = document.getElementById('goToStep3');
     if (goToStep3Btn) goToStep3Btn.addEventListener('click', () => goToStep(3));
     const goToStep4Btn = document.getElementById('goToStep4');
     if (goToStep4Btn) {
         goToStep4Btn.addEventListener('click', () => {
             if (validateForm()) {
                 collectClientInfo();
                 renderSummary();
                 goToStep(4);
             } else {
                 const errEl = document.getElementById('formErrorGlobal');
                 if (errEl) {
                     errEl.classList.remove('hidden');
                     setTimeout(() => errEl.classList.add('hidden'), 3000);
                 }
             }
         });
     }
     function validateForm() {
         let isValid = true;
         const fields = [
             { id: 'lastName', regex: /.{2,}/ },
             { id: 'firstName', regex: /.{2,}/ },
             { id: 'email', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
             { id: 'phone', regex: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/ },
             { id: 'arrivalDate', regex: /.+/ },
             { id: 'departureDate', regex: /.+/ },
             { id: 'arrivalTime', regex: /.+/ },
             { id: 'departureTime', regex: /.+/ }
         ];
         fields.forEach(field => {
             const el = document.getElementById(field.id);
             if (!el) return;
             const group = el.closest('.form-group');
             if (!field.regex.test(el.value.trim())) {
                 if (group) group.classList.add('error');
                 isValid = false;
             } else {
                 if (group) group.classList.remove('error');
             }
         });
         const arrival = document.getElementById('arrivalDate')?.value;
         const departure = document.getElementById('departureDate')?.value;
         if (arrival && departure && new Date(departure) <= new Date(arrival)) {
             const grp = document.getElementById('departureDate')?.closest('.form-group');
             if (grp) grp.classList.add('error');
             isValid = false;
         }
         return isValid;
     }
     function collectClientInfo() {
         state.clientInfo = {
             lastName: document.getElementById('lastName').value,
             firstName: document.getElementById('firstName').value,
             email: document.getElementById('email').value,
             phone: document.getElementById('phone').value,
             arrivalDate: document.getElementById('arrivalDate').value,
             departureDate: document.getElementById('departureDate').value,
             arrivalTime: document.getElementById('arrivalTime').value,
             departureTime: document.getElementById('departureTime').value,
             adults: parseInt(document.getElementById('adults').value),
             children: parseInt(document.getElementById('children').value),
             specialRequests: document.getElementById('specialRequests').value
         };
         saveState();
     }
     function formatDate(dateString) {
         if (!dateString) return '-';
         const options = { year: 'numeric', month: 'long', day: 'numeric' };
         return new Date(dateString).toLocaleDateString('fr-FR', options);
     }
     function renderSummary() {
         if (!state.selectedVilla) return;
         const setSrc = (id, val) => { const el = document.getElementById(id); if (el) el.src = val; };
         const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
         setSrc('sumVillaImg', state.selectedVilla.image);
         setText('sumVillaName', state.selectedVilla.name);
         setText('sumVillaCapacity', `${state.selectedVilla.capacity} personnes • ${state.selectedVilla.rooms} chambres`);
         setText('sumArrival', formatDate(state.clientInfo.arrivalDate) + ' à ' + state.clientInfo.arrivalTime);
         setText('sumDeparture', formatDate(state.clientInfo.departureDate) + ' à ' + state.clientInfo.departureTime);
         setText('sumNights', `${state.pricing.nights} nuit(s)`);
         setText('sumGuests', `${state.clientInfo.adults + state.clientInfo.children} personne(s)`);
         const servicesList = document.getElementById('sumServicesList');
         if (servicesList) {
             servicesList.innerHTML = '';
             if (state.selectedServices.length === 0) {
                 servicesList.innerHTML = '<p style="color: var(--color-text-light); font-style: italic;">Aucun service sélectionné</p>';
             } else {
                 state.selectedServices.forEach(s => {
                     const priceText = s.type === 'daily' ? `${(s.price * state.pricing.nights).toLocaleString('fr-FR')} MAD` : `${s.price.toLocaleString('fr-FR')} MAD`;
                     servicesList.innerHTML += `
                         <div class="service-item-summary">
                             <span>${s.name}</span>
                             <span>${priceText}</span>
                         </div>
                     `;
                 });
             }
         }
         updatePricing();
     }
     const confirmBtn = document.getElementById('confirmReservation');
     if (confirmBtn) {
         confirmBtn.addEventListener('click', () => {
             const btn = document.getElementById('confirmReservation');
             const loader = document.getElementById('loadingOverlay');
             btn.disabled = true;
             if (loader) loader.classList.remove('hidden');
             
             const payload = {
                 reservation_id: 'APV-' + Math.floor(100000 + Math.random() * 900000),
                 invoice_number: 'FAC-' + Date.now(),
                 villa_id: state.selectedVilla.id,
                 villa_name: state.selectedVilla.name,
                 client_name: `${state.clientInfo.firstName} ${state.clientInfo.lastName}`,
                 email: state.clientInfo.email,
                 phone: state.clientInfo.phone,
                 check_in: state.clientInfo.arrivalDate,
                 check_out: state.clientInfo.departureDate,
                 arrival_time: state.clientInfo.arrivalTime,
                 departure_time: state.clientInfo.departureTime,
                 adults: state.clientInfo.adults,
                 children: state.clientInfo.children,
                 special_requests: state.clientInfo.specialRequests,
                 nights: state.pricing.nights,
                 services_selected: state.selectedServices.map(s => ({ id: s.id, name: s.name, price: s.price, type: s.type })),
                 villa_price: state.selectedVilla.price,
                 villa_total: state.pricing.villaTotal,
                 services_total: state.pricing.servicesTotal,
                 subtotal: state.pricing.subtotal,
                 vat: state.pricing.vat,
                 tax: state.pricing.tax,
                 total_price: state.pricing.total,
                 status: 'pending',
                 created_at: new Date().toISOString()
             };
             
             const reservations = JSON.parse(localStorage.getItem('atlasReservations') || '[]');
             reservations.push(payload);
             localStorage.setItem('atlasReservations', JSON.stringify(reservations));
             localStorage.setItem('newReservationAlert', Date.now().toString());
             
             localStorage.setItem('atlasReservationConfirmed', JSON.stringify(payload));
             localStorage.removeItem('atlasReservationState');
             window.location.href = 'confirmation.html';
         });
     }
     ['arrivalDate', 'departureDate', 'adults', 'children'].forEach(id => {
         const el = document.getElementById(id);
         if (el) el.addEventListener('change', updatePricing);
     });
     const chatbotToggle = document.getElementById('chatbotToggle');
     const chatbotWindow = document.getElementById('chatbotWindow');
     const chatbotClose = document.getElementById('chatbotClose');
     const chatbotInput = document.getElementById('chatbotInput');
     const chatbotSend = document.getElementById('chatbotSend');
     const chatbotMessages = document.getElementById('chatbotMessages');
     if (chatbotToggle) chatbotToggle.addEventListener('click', () => chatbotWindow.classList.toggle('active'));
     if (chatbotClose) chatbotClose.addEventListener('click', () => chatbotWindow.classList.remove('active'));
     const getCurrentTime = () => {
         const now = new Date();
         return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
     };
     const addMessage = (text, sender) => {
         const messageDiv = document.createElement('div');
         messageDiv.classList.add('message', sender);
         messageDiv.innerHTML = `<p>${text}</p><span class="message-time">${getCurrentTime()}</span>`;
         chatbotMessages.appendChild(messageDiv);
         chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
     };
     const processBotResponse = (input) => {
         const lowerInput = input.toLowerCase();
         let response = "Je vous invite à contacter notre conciergerie au +212 0767129762.";
         if (lowerInput.includes('prix') || lowerInput.includes('tarif')) {
             response = "Nos villas sont proposées à partir de 9 000 MAD par nuit. Consultez la page de réservation pour les détails.";
         } else if (lowerInput.includes('réserv') || lowerInput.includes('book')) {
             response = "Vous pouvez effectuer votre réservation directement sur cette page en suivant les 4 étapes.";
         } else if (lowerInput.includes('villa')) {
             response = "Nous disposons de 6 villas d'exception allant de 9 000 MAD à 35 000 MAD par nuit.";
         } else if (lowerInput.includes('service')) {
             response = "Nous proposons 17 services premium : chef privé, chauffeur, spa, babysitting, etc.";
         } else if (lowerInput.includes('contact')) {
             response = "Vous pouvez nous joindre au +212 0767129762 ou par email à atlasprestige@gmail.com.";
         } else if (lowerInput.includes('bonjour') || lowerInput.includes('salut')) {
             response = "Bonjour ! Comment puis-je vous aider à organiser votre séjour de luxe à Marrakech ?";
         }
         setTimeout(() => addMessage(response, 'bot'), 800);
     };
     const handleSend = () => {
         const text = chatbotInput.value.trim();
         if (text) {
             addMessage(text, 'user');
             chatbotInput.value = '';
             processBotResponse(text);
         }
     };
     if (chatbotSend) chatbotSend.addEventListener('click', handleSend);
     if (chatbotInput) chatbotInput.addEventListener('keypress', (e) => {
         if (e.key === 'Enter') handleSend();
     });
     renderVillas();
     if (state.selectedVilla) {
         renderSelectedVilla();
         renderServices();
         if (state.currentStep > 1) {
             goToStep(state.currentStep);
         }
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