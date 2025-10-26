<?php
// Démarrer la session pour mémoriser si l'utilisateur est connecté
session_start();

// NOUVEAU BLOC DE DÉCONNEXION
// Si l'utilisateur clique sur le lien ?logout=true
if (isset($_GET['logout'])) {
    session_unset();    // Libère toutes les variables de session
    session_destroy();  // Détruit la session
    header("Location: index.php"); // Redirige vers la page de connexion
    exit;
}

// --- NOUVELLE LISTE DES UTILISATEURS (basée sur Codes.png) ---
$user_codes = [
    '4512' => 'Louis DEWASME',
    '8307' => 'Cyril VAERNEWYCK',
    '2694' => 'Noa SOUDANT',
    '9175' => 'Paul BOUR',
    '6823' => 'Sebastian GOGA',        // Code de l'image
    '2828' => 'Sebastian GOGA',        // Ancien code (gardé comme alias)
    '7450' => 'Lorenzo Pagano',
    '3581' => 'Doryan Gouilliart',
    '1069' => 'Hugo Letrouit',
    '5748' => 'Vincent Pietquin',
    '8921' => 'Nalé Declercq',
    '4136' => 'Benjamin Debuyst',
    '7295' => 'Louca Labella',
    '9840' => 'Julien Sucaet',
    '6273' => 'Théo Cappelaere',
    '3502' => 'Ernest Andrieux',
    '1687' => 'Maxime DESLOOVERE',
    '4925' => 'Thibaut LEMAHIEU',
    '8396' => 'Seraphin LEPLAE',
    '2714' => 'Antoine DECLERCQ',
    '5068' => 'Maxence Carion',
    '1549' => 'Aymerick Coucq',
    '9632' => 'Noah Debuysschere',
    '6871' => 'Mike Moerman',
    '3205' => 'Lenny Gaillot',
    '7984' => 'Mattéo Opsomer',
    '2467' => 'Anaïs Noppe'
];

$visitor_code = '1100';
$error_message = '';
$user_mode = null;


// 1. VÉRIFIER SI UN CODE VIENT D'ÊTRE SOUMIS
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['passcode'])) {
    
    $submitted_pass = trim($_POST['passcode']);

    // --- LOGIQUE DE CONNEXION MISE À JOUR ---
    if (isset($user_codes[$submitted_pass])) {
        // C'est un utilisateur valide
        $_SESSION['mode'] = 'user';
        $_SESSION['user_name'] = $user_codes[$submitted_pass]; // On stocke son nom
    } 
    elseif ($submitted_pass == $visitor_code) {
        // C'est un visiteur
        $_SESSION['mode'] = 'visitor';
        $_SESSION['user_name'] = 'Visiteur'; // Nom par défaut pour le mode visiteur
    } 
    else {
        $error_message = 'Code incorrect.';
    }
}

// 2. DÉCIDER QUOI AFFICHER
if (isset($_SESSION['mode'])) {

    // L'utilisateur EST connecté. On charge l'application.
    $app_html = file_get_contents('app.html');
    
    // --- REMPLACEMENT DYNAMIQUE DU NOM ---
    // Récupérer le nom de l'utilisateur depuis la session
    $display_name = $_SESSION['user_name'];
    
    // Remplacer "Sebastian Goga Consulting" par "Nom Utilisateur Consulting"
    $app_html = str_replace(
        'Sebastian Goga Consulting',    // Le texte original dans app.html
        $display_name . ' Consulting',  // Le nouveau texte
        $app_html
    );
    // --- FIN DU REMPLACEMENT ---

    if ($_SESSION['mode'] == 'visitor') {
        $app_html = str_replace(
            '<body',
            '<body class="mode-visitor"',
            $app_html
        );
    }
    
    echo $app_html;

} 
else {
    // L'utilisateur N'EST PAS connecté. On affiche le portail HTML.
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accès au Simulateur</title>
    <link rel="stylesheet" href="style.css"> 
</head>
<body>
    <div id="login-overlay" style="display: flex;">
        <div id="login-box">
            <h2>Accès au Simulateur</h2>
            <p>Veuillez entrer un code d'accès.</p>
            
            <form method="POST" action="index.php">
                <input type="password" id="login-passcode" name="passcode" placeholder="Code d'accès..." autofocus>
                <button type="submit" id="login-button">Valider</button>
                
                <?php if ($error_message): ?>
                    <p id="login-error" style="display:block; color: red; margin-top: 10px;">
                        <?php echo $error_message; ?>
                    </p>
                <?php endif; ?>
            </form>
        </div>
    </div>
</body>
</html>
<?php
} // Fin du 'else'
?>
