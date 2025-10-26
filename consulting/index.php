<?php
// Démarrer la session pour mémoriser si l'utilisateur est connecté
session_start();

// --- CONSTANTES DE SÉCURITÉ POUR LA LIMITATION ---
define('MAX_ATTEMPTS', 5); // Nombre de tentatives max avant blocage
define('LOCKOUT_TIME', 300); // Temps de blocage en secondes (300s = 5 minutes)
// --------------------------------------------------


// NOUVEAU BLOC DE DÉCONNEXION
// Si l'utilisateur clique sur le lien ?logout=true
if (isset($_GET['logout'])) {
    session_unset();    // Libère toutes les variables de session
    session_destroy();  // Détruit la session
    header("Location: index.php"); // Redirige vers la page de connexion
    exit;
}

// MODIFICATION : Le 'require_once' pointe maintenant un niveau au-dessus
// Assurez-vous que config.php est bien dans le dossier PARENT de public_html
require_once '../config.php';

$error_message = '';
$user_mode = null;


// 1. VÉRIFIER SI UN CODE VIENT D'ÊTRE SOUMIS
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['passcode'])) {
    
    // --- DÉBUT BLOC SÉCURITÉ ANTI-FORCE BRUTE ---
    
    $now = time();
    
    // Initialiser les compteurs de tentatives s'ils n'existent pas
    if (!isset($_SESSION['login_attempts'])) {
        $_SESSION['login_attempts'] = 0;
    }
    if (!isset($_SESSION['last_attempt_time'])) {
        $_SESSION['last_attempt_time'] = $now;
    }
    
    // Si le temps de blocage est écoulé, on réinitialise le compteur
    if (($now - $_SESSION['last_attempt_time']) > LOCKOUT_TIME) {
        $_SESSION['login_attempts'] = 0;
    }
    
    // --- VÉRIFICATION : L'UTILISATEUR EST-IL BLOQUÉ ? ---
    if ($_SESSION['login_attempts'] >= MAX_ATTEMPTS) {
        
        $error_message = 'Trop de tentatives. Veuillez réessayer dans 5 minutes.';
    
    } else {
        // --- L'UTILISATEUR N'EST PAS BLOQUÉ ---
        
        $submitted_pass = trim($_POST['passcode']);

        // --- LOGIQUE DE CONNEXION MISE À JOUR ---
        if (isset($user_codes[$submitted_pass])) {
            // C'est un utilisateur valide
            
            // SÉCURITÉ : Régénérer l'ID de session pour éviter la fixation de session
            session_regenerate_id(true);
            
            $_SESSION['mode'] = 'user';
            $_SESSION['user_name'] = $user_codes[$submitted_pass];
            
            // Réinitialiser les tentatives en cas de succès
            $_SESSION['login_attempts'] = 0;
            unset($_SESSION['last_attempt_time']);

        } 
        elseif ($submitted_pass == $visitor_code) {
            // C'est un visiteur
            
            // SÉCURITÉ : Régénérer l'ID de session
            session_regenerate_id(true);

            $_SESSION['mode'] = 'visitor';
            $_SESSION['user_name'] = 'Visiteur';
            
            // Réinitialiser les tentatives en cas de succès
            $_SESSION['login_attempts'] = 0;
            unset($_SESSION['last_attempt_time']);

        } 
        else {
            // --- LE CODE EST INCORRECT ---
            
            // Incrémenter les tentatives
            $_SESSION['login_attempts']++;
            $_SESSION['last_attempt_time'] = $now;
            
            $remaining_attempts = MAX_ATTEMPTS - $_SESSION['login_attempts'];
            
            if ($remaining_attempts > 0) {
                $error_message = "Code incorrect. Il vous reste $remaining_attempts tentative(s).";
            } else {
                $error_message = "Code incorrect. Trop de tentatives. Veuillez réessayer dans 5 minutes.";
            }
        }
    }
    // --- FIN BLOC SÉCURITÉ ANTI-FORCE BRUTE ---
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
                        <?php 
                        // SÉCURITÉ : Échapper le message d'erreur au cas où
                        echo htmlspecialchars($error_message, ENT_QUOTES, 'UTF-8'); 
                        ?>
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
