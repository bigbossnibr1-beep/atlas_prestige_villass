document.addEventListener('DOMContentLoaded', () => {
    const confirmedData = localStorage.getItem('atlasReservationConfirmed');
    
    if (!confirmedData) {
        window.location.href = 'reservation.html';
        return;
    }

    const data = JSON.parse(confirmedData);

    const villasImages = {
        'Villa Tilila': 'villa-atlas-royal/EX.jpg',
        'Dar Saada Private Villa': 'villa-majorelle-prestige/JARDIN.jpg',
        'Villa de Salah': 'villa-palm-family/piscine.jpeg',
        'Villa LES LAURIERS': 'villa-atlas-garden/PISCINE.jpg',
        'Marrakech Le Joyau Villa': 'villa-diamond-palace/VUS.jpg',
        'Villa Elyana': 'villa-royal-prestige/PISCINE.jpg'
    };

    const villasCapacity = {
        'Villa Tilila': { rooms: 5, capacity: 10 },
        'Dar Saada Private Villa': { rooms: 5, capacity: 10 },
        'Villa de Salah': { rooms: 3, capacity: 8 },
        'Villa LES LAURIERS': { rooms: 4, capacity: 10 },
        'Marrakech Le Joyau Villa': { rooms: 4, capacity: 10 },
        'Villa Elyana': { rooms: 4, capacity: 12 }
    };

    function formatPrice(amount) {
        return Number(amount).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' MAD';
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }

    document.getElementById('clientName').textContent = data.client_name;
    document.getElementById('reservationId').textContent = data.reservation_id;
    document.getElementById('invoiceNumber').textContent = data.invoice_number;
    document.getElementById('confirmationDate').textContent = new Date().toLocaleDateString('fr-FR', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    document.getElementById('villaImage').src = villasImages[data.villa_name] || '';
    document.getElementById('villaName').textContent = data.villa_name;
    const cap = villasCapacity[data.villa_name] || { rooms: 0, capacity: 0 };
    document.getElementById('villaCapacity').textContent = `${cap.rooms} chambres • ${cap.capacity} personnes`;
    document.getElementById('villaPrice').textContent = `${Number(data.villa_price).toLocaleString('fr-FR')} MAD / nuit`;

    document.getElementById('checkIn').textContent = `${formatDate(data.check_in)} à ${data.arrival_time}`;
    document.getElementById('checkOut').textContent = `${formatDate(data.check_out)} à ${data.departure_time}`;
    document.getElementById('nights').textContent = `${data.nights} nuit(s)`;
    document.getElementById('guests').textContent = `${data.adults} adulte(s), ${data.children} enfant(s)`;

    const servicesList = document.getElementById('servicesList');
    if (data.services_selected && data.services_selected.length > 0) {
        let servicesHtml = '<h4>Services Sélectionnés</h4>';
        data.services_selected.forEach(s => {
            const price = s.type === 'daily' ? s.price * data.nights : s.price;
            servicesHtml += `<div class="service-item"><span>${s.name}</span><span>${formatPrice(price)}</span></div>`;
        });
        servicesList.innerHTML = servicesHtml;
    } else {
        servicesList.innerHTML = '<p style="color: var(--color-text-light); font-style: italic;">Aucun service additionnel sélectionné</p>';
    }

    document.getElementById('villaTotal').textContent = formatPrice(data.villa_total);
    document.getElementById('servicesTotal').textContent = formatPrice(data.services_total);
    document.getElementById('subtotal').textContent = formatPrice(data.subtotal);
    document.getElementById('vat').textContent = formatPrice(data.vat);
    document.getElementById('tax').textContent = formatPrice(data.tax);
    document.getElementById('totalPrice').textContent = formatPrice(data.total_price);

    document.getElementById('downloadPdfBtn').addEventListener('click', () => {
        generateProfessionalPDF(data);
    });

    function generateProfessionalPDF(data) {
        if (typeof window.jspdf === 'undefined') {
            alert('La bibliothèque PDF n\'est pas chargée. Vérifiez votre connexion internet.');
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

        doc.text('Villa:', margin, y);
        doc.setFont('helvetica', 'bold');
        doc.text(data.villa_name, valueStart, y);
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
        doc.text('Document généré automatiquement - Fait à Marrakech', margin, y + 22);

       
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
       

        const filename = `ATLAS-PRESTIGE-VILLAS-RESERVATION-${data.reservation_id}.pdf`;
        doc.save(filename);
    }
});