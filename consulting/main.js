// main.js - VERSION MISE À JOUR

// 1. Importer les modules de fonctionnalités
import { initF1 } from './features/f1_pension/f1.js';
import { initF2 } from './features/f2_nonfiscal/f2.js';
import { initF3 } from './features/f3_inflation/f3.js';
import { initF4 } from './features/f4_comparator/f4.js';
import { initF5, genererEmail } from './features/f5_mail/f5.js';

// 2. Importer la logique de base
import { applyTranslations, setLanguage } from './core/i18n.js';
// NOUVEAU: Importer le store
import { loadState } from './core/store.js';


/**
 * Configure la navigation par onglets (bascule des sections)
 */
function setupNavigation() {
    
    // On sélectionne tous les liens SAUF le bouton de déconnexion
    const navLinks = document.querySelectorAll('header nav a:not(#logout-button)');
    
    const sections = document.querySelectorAll('.calculator-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // N'est appliqué qu'aux onglets, pas à la déconnexion
            const targetId = this.getAttribute('href').substring(1); 
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            sections.forEach(section => {
                section.style.display = (section.id === targetId) ? 'block' : 'none';
            });

            // Si on active l'onglet F4, on régénère le mail
            if (targetId === 'f4') {
                 // Vérifier si on n'est pas visiteur AVANT de générer
                if (!document.body.classList.contains('mode-visitor')) {
                    genererEmail(); 
                }
            }

            // Fermer le menu mobile si on clique sur un lien
            closeMobileMenu();
        });
    });
    
    // Afficher la section F1 par défaut (ou la première visible)
    const defaultSection = document.getElementById('f1');
    if (defaultSection) {
        defaultSection.style.display = 'block'; 
    } else {
        // Fallback si F1 n'existe pas
        const firstLink = navLinks[0];
        if(firstLink) {
            firstLink.click();
        }
    }
}

const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

function closeMobileMenu() {
    if (mainNav && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
    }
}

/**
 * Configure le menu hamburger pour mobile
 */
function setupMobileMenu() {
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = mainNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', 'false'); // L'attribut doit être une chaîne
            menuToggle.textContent = isExpanded ? '✕' : '☰'; 
        });
    }
}

/**
 * Configure les boutons de changement de langue
 */
function setupLanguageSwitcher() {
    document.querySelectorAll('.flag-button').forEach(button => {
        button.addEventListener('click', () => {
            setLanguage(button.getAttribute('data-lang'));
        });
    });
}


// =======================================================
// POINT D'ENTRÉE PRINCIPAL
// =======================================================
document.addEventListener('DOMContentLoaded', () => { 
    console.log("DOM prêt. Initialisation de l'application...");
    
    // 2. Vérifier si on est en mode visiteur AVANT de charger le state
    // (PHP a ajouté la classe 'mode-visitor' au body si c'est le cas)
    const isVisitor = document.body.classList.contains('mode-visitor');
    if (isVisitor) {
        console.log("Mode Visiteur détecté. Fonctionnalités limitées.");
    }

    // NOUVEAU: Charger l'état (le store gère s'il faut charger ou non)
    try {
        loadState();
        console.log("État initialisé.");
    } catch (e) {
        console.error("Erreur chargement du state:", e);
    }

    // 1. Lancer la configuration de base (navigation, langue...)
    try {
        applyTranslations(); 
        setupNavigation(); 
        setupMobileMenu();
        setupLanguageSwitcher();
    } catch (e) {
        console.error("Erreur durant la configuration de base:", e);
    }
    
    // 3. Initialiser chaque module
    try { initF1(); } catch (e) { console.error("Erreur à l'initialisation de F1:", e); }
    try { initF2(); } catch (e) { console.error("Erreur à l'initialisation de F2:", e); }
    try { initF3(); } catch (e) { console.error("Erreur à l'initialisation de F3:", e); }
    
    // MODIFIÉ: F4 (Comparateur) est initialisé pour tout le monde (pour la démo)
    try { initF4(); } catch (e) { console.error("Erreur à l'initialisation de F4:", e); }
    
    // F5 (Mail) n'est initialisé QUE si on N'EST PAS visiteur
    if (!isVisitor) {
        try { initF5(); } catch (e) { console.error("Erreur à l'initialisation de F5:", e); }
    } else {
        // Cacher le lien de navigation vers le mail si on est visiteur
        const mailNavLink = document.querySelector('header nav a[href="#f4"]');
        if (mailNavLink) {
            mailNavLink.style.display = 'none';
        }
    }

    console.log("Initialisation modulaire terminée.");
});