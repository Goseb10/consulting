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

$error_message = '';
$user_mode = null;

// 1. VÉRIFIER SI UN CODE VIENT D'ÊTRE SOUMIS
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['passcode'])) {
    
    $submitted_pass = trim($_POST['passcode']);

    // --- VOS CODES SECRETS ---
    if ($submitted_pass == '2828') {
        $_SESSION['mode'] = 'user';
    } 
    elseif ($submitted_pass == '1100') {
        $_SESSION['mode'] = 'visitor';
    } 
    else {
        $error_message = 'Code incorrect.';
    }
}

// 2. DÉCIDER QUOI AFFICHER
if (isset($_SESSION['mode'])) {

    // L'utilisateur EST connecté. On charge l'application.
    $app_html = file_get_contents('app.html');
    
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