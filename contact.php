<?php
// contact.php - Traitement du formulaire de contact

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    // Récupération et sécurisation des données
    $nom       = htmlspecialchars(trim($_POST['lastName'] ?? ''));
    $prenom    = htmlspecialchars(trim($_POST['firstName'] ?? ''));
    $email     = htmlspecialchars(trim($_POST['email'] ?? ''));
    $telephone = htmlspecialchars(trim($_POST['phone'] ?? ''));
    $sujet     = htmlspecialchars(trim($_POST['subject'] ?? ''));
    $message   = htmlspecialchars(trim($_POST['message'] ?? ''));
    
    // Validation
    $errors = [];
    
    if (empty($nom))    $errors[] = "Le nom est obligatoire";
    if (empty($prenom)) $errors[] = "Le prénom est obligatoire";
    if (empty($email))  $errors[] = "L'email est obligatoire";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Email invalide";
    if (empty($message)) $errors[] = "Le message est obligatoire";
    
    if (empty($errors)) {
        
        // Email du destinataire
        $to = "bigbossnibr1@gmail.com";
        
        // Sujet de l'email
        $emailSubject = "Nouveau message de contact - Atlas Prestige Villas";
        
        // Corps de l'email en HTML
        $emailBody = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: 'Montserrat', Arial, sans-serif; color: #333; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #D4AF37 0%, #B89628 100%); color: white; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-family: 'Playfair Display', serif; font-size: 24px; }
                .content { background: #f9f9f9; padding: 30px; }
                .field { margin-bottom: 20px; }
                .label { font-weight: bold; color: #D4AF37; display: block; margin-bottom: 5px; }
                .value { color: #333; }
                .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>ATLAS PRESTIGE VILLAS</h1>
                    <p>Nouveau message de contact</p>
                </div>
                <div class='content'>
                    <div class='field'>
                        <span class='label'>Nom complet:</span>
                        <span class='value'>$prenom $nom</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Email:</span>
                        <span class='value'>$email</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Téléphone:</span>
                        <span class='value'>$telephone</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Sujet:</span>
                        <span class='value'>$sujet</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Message:</span>
                        <div class='value' style='background: white; padding: 15px; border-left: 3px solid #D4AF37;'>$message</div>
                    </div>
                </div>
                <div class='footer'>
                    <p>Ce message a été envoyé depuis le site Atlas Prestige Villas</p>
                    <p>© 2026 Atlas Prestige Villas - Marrakech</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        // Headers de l'email
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: Atlas Prestige Villas <noreply@atlasprestige.com>\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        // Envoi de l'email
        if (mail($to, $emailSubject, $emailBody, $headers)) {
            
            // Email envoyé avec succès
            echo json_encode([
                'success' => true,
                'message' => '✓ Votre message a été envoyé avec succès. Notre équipe vous contactera dans les plus brefs délais.'
            ]);
            
        } else {
            
            // Erreur lors de l'envoi
            echo json_encode([
                'success' => false,
                'message' => '✗ Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter directement.'
            ]);
        }
        
    } else {
        
        // Erreurs de validation
        echo json_encode([
            'success' => false,
            'message' => ' ' . implode(', ', $errors)
        ]);
    }
    
} else {
    // Accès direct interdit
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => 'Accès interdit'
    ]);
}
?>