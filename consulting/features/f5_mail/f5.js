// features/f5_mail/f5.js 

import { CURRENT_YEAR, AGE_FINALE_DEFAUT, AGE_FINALE_LT, FRAIS_DEFAUT } from '../../core/constants.js';
import { emailTemplates } from '../../core/emailTemplates.js'; 
import { translations } from '../../core/i18n.js';
import { effectuerSimulation } from '../../core/simulationEngine.js'; 
// Importer formatMonetaire et updateElement
import { formatMonetaire, updateElement } from '../../core/utils.js';

// Importer le store
import { getState, bindInput, bindCheckbox, updateState } from '../../core/store.js';


/**
 * Calcule le capital final et le capital investi pour une épargne non fiscale.
 * Inclut les frais de gestion annuels de 0.85%
 */
function calculateNonFiscal(monthlyPayment, years) {
    const P_monthly = parseFloat(monthlyPayment);
    const t = parseInt(years);
    const annualRatePct = 8.0; 

    const fraisMensuelPct = 0.03; // 3%
    const taxeVersamentPct = 0.02; // 2%
    const fraisGestionAnnuelPct = 0.0085; // NOUVEAU: 0.85%
    const taxePlusValuePct = 0.10; // 10%
    const franchisePlusValue = 10000; // 10K €

    if (isNaN(P_monthly) || P_monthly < 0 || isNaN(t) || t <= 0) {
        return { finalCapital: 0, investedCapital: 0 };
    }

    const monthlyRate = Math.pow(1 + (annualRatePct / 100), 1 / 12) - 1;
    let currentCapital = 0; 
    const totalMonths = t * 12;
    
    const investedCapital = P_monthly * totalMonths; 
    const versementNet = P_monthly * (1 - fraisMensuelPct - taxeVersamentPct);

    for (let month = 1; month <= totalMonths; month++) {
        currentCapital += versementNet;
        currentCapital *= (1 + monthlyRate);
        
        // --- LOGIQUE DE FRAIS DE GESTION AJOUTÉE ---
        if (month > 0 && month % 12 === 0) {
            const fraisGestionAn = currentCapital * fraisGestionAnnuelPct;
            currentCapital -= (fraisGestionAn || 0);
        }
        // --- FIN AJOUT ---
    }

    const capitalFinalBrut = currentCapital;
    const plusValueBrute = capitalFinalBrut - investedCapital; 
    const plusValueTaxable = Math.max(0, plusValueBrute - franchisePlusValue);
    const taxeSurPlusValue = plusValueTaxable * taxePlusValuePct;
    
    const capitalFinalNet = capitalFinalBrut - taxeSurPlusValue;

    return {
        finalCapital: capitalFinalNet, 
        investedCapital: investedCapital 
    };
}


/**
 * Génère l'aperçu de l'email
 */
export function genererEmail() {
    console.log("Génération email...");
    try {
        const state = getState();
        const mailLang = state.f5_langue || 'fr';
        
        // ========================================================
        // ### CRÉATION DE LA FONCTION 't' ###
        // ========================================================
        const langDict = translations[mailLang] || translations['fr'];
        if (!langDict) {
            console.error(`Dictionnaire de langue introuvable pour "${mailLang}".`);
            return;
        }
        const t = (key) => {
            if (langDict[key] !== undefined) {
                return langDict[key];
            }
            console.warn(`Clé d'email manquante pour ${mailLang}: ${key}`);
            return translations['fr'][key] || `[${key}]`; 
        };
        // ========================================================

        const prenom = state.f5_prenom || "Prénom";
        const nom = state.f5_nom || "Nom";
        const email = state.f5_email || ""; 
        const isTbd = state.f5_rdv_tbd;

        // --- Formatage de la date et de l'heure ---
        let formattedRdvDate = state.f5_rdv_date;
        let formattedRdvTime = state.f5_rdv_time;
        const langLocale = mailLang === 'nl' ? 'nl-BE' : (mailLang === 'en' ? 'en-GB' : 'fr-BE');

        // --- Fonction pour mettre la première lettre en majuscule ---
        const capitalize = (s) => {
            if (typeof s !== 'string' || s.length === 0) return '';
            return s.charAt(0).toUpperCase() + s.slice(1);
        };
        // --- FIN AJOUT ---

        if (!isTbd) { 
            try {
                if (state.f5_rdv_date) {
                    const dateObj = new Date(state.f5_rdv_date + 'T00:00:00'); 
                    let dateString = new Intl.DateTimeFormat(langLocale, {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                    }).format(dateObj);
                    
                    // Sépare la chaîne (ex: "lundi 10 novembre") en mots
                    const parts = dateString.split(' ');
                    if (parts.length > 0) {
                        // Met la majuscule au premier mot (jour)
                        parts[0] = capitalize(parts[0]);
                        // Met la majuscule au dernier mot (mois)
                        if (parts.length > 2) { // S'assurer qu'il y a un mois
                             parts[parts.length - 1] = capitalize(parts[parts.length - 1]);
                        }
                        // Reconstitue la chaîne
                        formattedRdvDate = parts.join(' ');
                    } else {
                        formattedRdvDate = capitalize(dateString); // Fallback
                    }
                    // --- FIN MODIFICATION ---
                }
            } catch (e) {
                console.warn("Date RDV invalide pour formatage:", state.f5_rdv_date);
                formattedRdvDate = state.f5_rdv_date; 
            }

            try {
                 if (state.f5_rdv_time) {
                    const [hours, minutes] = state.f5_rdv_time.split(':');
                    if(mailLang === 'fr' || mailLang === 'nl') {
                         formattedRdvTime = `${hours}h${minutes}`;
                    } else {
                         const timeObj = new Date();
                         timeObj.setHours(hours, minutes, 0, 0);
                         formattedRdvTime = timeObj.toLocaleTimeString('en-US', {
                             hour: 'numeric',
                             minute: '2-digit',
                             hour12: true
                         });
                    }
                 }
            } catch (e) {
                 console.warn("Heure RDV invalide pour formatage:", state.f5_rdv_time);
                 formattedRdvTime = state.f5_rdv_time; 
            }
        }
        // --- FIN BLOC DATE/HEURE ---
        
        const delaCapital = (typeof state.f5_dela_capital === 'number') ? state.f5_dela_capital : 10000;
        const delaPrime = (typeof state.f5_dela_prime === 'number') ? state.f5_dela_prime : 25.00;
        
        const nonFiscalMensualite = state.f5_nonfiscal_mensualite || 0;
        const nonFiscalBirthYear = state.f5_nonfiscal_birthyear || CURRENT_YEAR;
        let nonFiscalAge = CURRENT_YEAR - parseInt(nonFiscalBirthYear);
         if (isNaN(nonFiscalAge) || nonFiscalAge < 0) {
            nonFiscalAge = 0; 
         }
        const epMensualite = parseFloat(state.f5_ep_mensualite) || 0;
        const epBirthYear = parseInt(state.f5_ep_birthyear) || CURRENT_YEAR;
        const eltMensualite = parseFloat(state.f5_elt_mensualite) || 0;
        const eltBirthYear = parseInt(state.f5_elt_birthyear) || CURRENT_YEAR;
        const eltExtend80 = state.f5_elt_extend_80;
        const msciRate = parseFloat(state.f5_msci_rate) || 8.53;
        
        // Cases à cocher
        const includeEP = state.f5_toggle_ep;
        const includeELT = state.f5_toggle_elt;
        const includePLCI = state.f5_toggle_plci;
        const includeINAMI = state.f5_toggle_inami;
        const includeEIP = state.f5_toggle_eip;
        const includeNonFiscal = state.f5_toggle_nonfiscal;
        const includeDela = state.f5_toggle_dela;
        const includeEnfant = state.f5_toggle_enfant; 
        const childrenData = state.f5_children_data || [];
        
        // --- Simulations ---
        const res10 = calculateNonFiscal(nonFiscalMensualite, 10);
        const res20 = calculateNonFiscal(nonFiscalMensualite, 20);
        const res30 = calculateNonFiscal(nonFiscalMensualite, 30);

        let epData = {}; 
        if (includeEP) {
            const epParams = {
                anneeNaissance: epBirthYear,
                versementBrutMensuel: epMensualite,
                typeEpargne: 'pension',
                rendementAnnuel: 5.0,
                fraisEntreePct: FRAIS_DEFAUT.pension.fraisEntree,
                fraisCourantAnnuelPct: FRAIS_DEFAUT.pension.fraisCourant,
                targetAge: AGE_FINALE_DEFAUT
            };
            epData = effectuerSimulation(epParams, CURRENT_YEAR);
            epData.targetAge = AGE_FINALE_DEFAUT; 
        }
        
        let eltData = {}; 
        if (includeELT) {
            const eltTargetAge = eltExtend80 ? AGE_FINALE_LT : AGE_FINALE_DEFAUT;
            const eltParams = {
                anneeNaissance: eltBirthYear,
                versementBrutMensuel: eltMensualite,
                typeEpargne: 'long-terme',
                rendementAnnuel: 5.0,
                fraisEntreePct: FRAIS_DEFAUT['long-terme'].fraisEntree,
                fraisCourantAnnuelPct: FRAIS_DEFAUT['long-terme'].fraisCourant,
                targetAge: eltTargetAge
            };
            eltData = effectuerSimulation(eltParams, CURRENT_YEAR);
            eltData.targetAge = eltTargetAge; 
        }


        // --- Construction HTML ---
        
        // Définition du sujet déplacée ici
        const sujet = (t('email_subject') || "Synthèse : {nom} {prenom}")
                        .replace('{nom}', nom)
                        .replace('{prenom}', prenom);
        
        let html = '';
        html += emailTemplates.intro(t, prenom, nom, email, sujet); // 'sujet' est passé en paramètre
        
        if (includeEP) html += emailTemplates.ep(t, epData, formatMonetaire); 
        if (includeELT) html += emailTemplates.elt(t, eltData, formatMonetaire);
        if (includeEP || includeELT) html += emailTemplates.ep_elt_common(t, msciRate, formatMonetaire); 
        
        if (includePLCI) html += emailTemplates.plci(t);
        if (includeINAMI) html += emailTemplates.inami(t);
        if (includeEIP) html += emailTemplates.eip(t);
        
        if (includeNonFiscal) html += emailTemplates.nonfiscal(t, nonFiscalMensualite, nonFiscalAge, res10, res20, res30, formatMonetaire);
        
        // --- NOUVELLE LOGIQUE ENFANT (Dynamique + 3 Sims) ---
        if (includeEnfant) {
            childrenData.forEach((child) => {
                if (child.name && child.mensualite > 0) {
                    const mensualite = parseFloat(child.mensualite) || 0;
                    const birthYear = parseInt(child.birthyear) || CURRENT_YEAR;
                    const age = CURRENT_YEAR - birthYear;
                    
                    // Calcul des durées
                    const duration18 = Math.max(0, 18 - age);
                    const duration21 = Math.max(0, 21 - age);
                    const duration25 = Math.max(0, 25 - age);
                    
                    // Lancement des 3 simulations
                    const res18 = calculateNonFiscal(mensualite, duration18);
                    const res21 = calculateNonFiscal(mensualite, duration21);
                    const res25 = calculateNonFiscal(mensualite, duration25);
                    
                    // Appel du template mis à jour
                    html += emailTemplates.enfant(t, child, res18, res21, res25, formatMonetaire);
                }
            });
        }
        // --- FIN NOUVELLE LOGIQUE ---
        
        if (includeDela) html += emailTemplates.dela(t, delaCapital, delaPrime, formatMonetaire); 
        
        html += emailTemplates.rdv(t, formattedRdvDate, formattedRdvTime, isTbd); 
        html += `<ul style="margin-top: 10px; margin-bottom: 15px; padding-left: 20px; list-style-type: disc;">`;
        html += `<li>${t('email_docs_base')}</li>`; 
        if (includeEIP) html += `<li>${emailTemplates.docs_eip(t)}</li>`; 
        html += `</ul>`;
        html += emailTemplates.outro(t); 

        // --- Injection ---
        const previewContainer = document.getElementById('email-preview-container');
        if (previewContainer) {
            previewContainer.innerHTML = html;
        } else {
            console.error("Conteneur d'aperçu 'email-preview-container' non trouvé.");
        }

        // 'sujet' est déjà défini plus haut
        updateElement('email-subject-display', sujet, false);
        updateElement('email-to-display', email, false);


    } catch (e) {
        console.error("Erreur lors de la génération de l'email:", e);
        const previewContainer = document.getElementById('email-preview-container');
        if (previewContainer) {
            previewContainer.innerHTML = "<p style='color: red;'>Une erreur est survenue.</p>";
        }
    }
}

/**
 * Copie le contenu HTML de l'aperçu dans le presse-papiers.
 */
function copierEmailHTML() {
    const previewContainer = document.getElementById('email-preview-container');
    const feedback = document.getElementById('copy-feedback');
    if (!previewContainer || !feedback) return;

    try {
        const range = document.createRange();
        range.selectNode(previewContainer);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
        
        const lang = getState().f5_langue || 'fr';
        const t = translations[lang] || translations['fr'];
        
        feedback.textContent = t.f4_feedback_copied || "Copié !"; 
        feedback.style.color = "var(--secondary-color)"; 
        feedback.style.display = 'inline';
        setTimeout(() => { feedback.style.display = 'none'; }, 2000);

    } catch (e) {
        console.error("Échec copie HTML : ", e);
        const lang = getState().f5_langue || 'fr';
        const feedbackText = lang === 'fr' ? "Échec!" : (lang === 'nl' ? "Mislukt!" : (lang === 'en' ? "Failed!" : "Échec!"));
        feedback.textContent = feedbackText;
        feedback.style.color = "red"; 
        feedback.style.display = 'inline';
        setTimeout(() => { feedback.style.display = 'none'; }, 3000);
    }
}


// --- NOUVELLES FONCTIONS (Enfants) - RÉINTRODUITES ---

/**
 * Met à jour le state `f5_children_data` en lisant le DOM
 */
function updateChildrenDataFromDOM() {
    const state = getState();
    const container = document.getElementById('children-options-container');
    if (!container) return;
    
    const childDivs = container.querySelectorAll('.child-options-group');
    const newChildrenData = [];
    
    childDivs.forEach((div) => {
        const name = div.querySelector('input[data-type="name"]').value;
        const mensualite = parseFloat(div.querySelector('input[data-type="mensualite"]').value) || 0;
        const birthyear = parseInt(div.querySelector('input[data-type="birthyear"]').value) || 2010;
        newChildrenData.push({ name, mensualite, birthyear });
    });
    
    updateState('f5_children_data', newChildrenData);
    genererEmail(); // Regénérer l'email à chaque frappe
}

/**
 * Génère les champs d'input pour le nombre d'enfants demandé
 */
function renderChildrenInputs() {
    const state = getState();
    const count = parseInt(state.f5_children_count) || 0;
    let data = state.f5_children_data || [];
    const t = translations[state.f5_langue || 'fr'] || translations['fr'];
    
    // Ajuster la taille du tableau de données pour correspondre au compteur
    if (data.length > count) {
        data = data.slice(0, count);
    }
    while (data.length < count) {
        data.push({ 
            name: `${t.f4_child_name_label} ${data.length + 1}`, 
            mensualite: 100, 
            birthyear: 2010 
        });
    }
    updateState('f5_children_data', data); // Sauvegarder le tableau ajusté

    const container = document.getElementById('children-options-container');
    if (!container) return;

    let html = '';
    data.forEach((child, index) => {
        const nameVal = (child.name || '').replace(/"/g, '&quot;'); // Échapper les guillemets
        html += `
            <div class="child-options-group" style="border-top: 1px dashed #EBEBEB; padding-top: 15px; margin-top: 15px;">
                <h4 style="font-size: 1.1em; color: var(--primary-color); margin-bottom: 10px;">
                    ${t.f4_child_name_label} ${index + 1}
                </h4>
                <div class="mail-inputs-grid">
                    <div>
                        <label for="child-${index}-name">${t.f4_child_name_label}</label>
                        <input type="text" id="child-${index}-name" class="child-input" data-type="name" value="${nameVal}">
                    </div>
                    <div>
                        <label for="child-${index}-mensualite">${t.f4_child_monthly_label}</label>
                        <input type="number" id="child-${index}-mensualite" class="child-input" data-type="mensualite" value="${child.mensualite}">
                    </div>
                    <div>
                        <label for="child-${index}-birthyear">${t.f4_child_birthyear_label}</label>
                        <input type="number" id="child-${index}-birthyear" class="child-input" data-type="birthyear" value="${child.birthyear}">
                    </div>
                </div>
            </div>`;
    });
    
    container.innerHTML = html;
    genererEmail(); // Mettre à jour l'email après avoir rendu les champs
}

// --- FIN NOUVELLES FONCTIONS ---


/**
 * Gère l'affichage des champs de date/heure du RDV
 */
function toggleRdvInputs() {
    const state = getState();
    const isTbd = state.f5_rdv_tbd;
    
    const displayValue = isTbd ? 'none' : 'block';
    
    const dateInput = document.getElementById('mail-rdv-date');
    const timeInput = document.getElementById('mail-rdv-time');
    const dateLabel = document.querySelector('label[for="mail-rdv-date"]');
    const timeLabel = document.querySelector('label[for="mail-rdv-time"]');

    if (dateInput) dateInput.style.display = displayValue;
    if (timeInput) timeInput.style.display = displayValue;
    if (dateLabel) dateLabel.style.display = displayValue;
    if (timeLabel) timeLabel.style.display = displayValue;
    
    genererEmail(); // Mettre à jour l'email
}


/**
 * Initialise la fonctionnalité F5 (Générateur de Mail)
 */
export function initF5() {
    console.log("Initialisation F5 (Mail)...");

    // Lier les inputs et checkboxes au store
    bindInput('mail-client-prenom', 'f5_prenom', genererEmail);
    bindInput('mail-client-nom', 'f5_nom', genererEmail);
    bindInput('mail-client-email', 'f5_email', genererEmail); 
    bindInput('mail-rdv-date', 'f5_rdv_date', genererEmail);
    bindInput('mail-rdv-time', 'f5_rdv_time', genererEmail);
    bindCheckbox('mail-rdv-tbd', 'f5_rdv_tbd', toggleRdvInputs); 
    
    bindInput('mail-langue', 'f5_langue', () => {
        renderChildrenInputs(); // Réintroduit pour màj les labels
        genererEmail();
    });
    bindInput('mail-common-msci-rate', 'f5_msci_rate', genererEmail);

    // Toggles de section
    bindCheckbox('toggle-ep', 'f5_toggle_ep', genererEmail);
    bindCheckbox('toggle-elt', 'f5_toggle_elt', genererEmail);
    bindCheckbox('toggle-plci', 'f5_toggle_plci', genererEmail);
    bindCheckbox('toggle-inami', 'f5_toggle_inami', genererEmail);
    bindCheckbox('toggle-eip', 'f5_toggle_eip', genererEmail);
    bindCheckbox('toggle-nonfiscal', 'f5_toggle_nonfiscal', genererEmail);
    bindCheckbox('toggle-dela', 'f5_toggle_dela', genererEmail);
    bindCheckbox('toggle-enfant', 'f5_toggle_enfant', genererEmail);
    
    // Options EP
    bindInput('mail-ep-mensualite', 'f5_ep_mensualite', genererEmail);
    bindInput('mail-ep-birthyear', 'f5_ep_birthyear', genererEmail);
    
    // Options ELT
    bindInput('mail-elt-mensualite', 'f5_elt_mensualite', genererEmail);
    bindInput('mail-elt-birthyear', 'f5_elt_birthyear', genererEmail);
    bindCheckbox('mail-elt-extend-80ans', 'f5_elt_extend_80', genererEmail);

    // Options Dela
    bindInput('mail-dela-capital', 'f5_dela_capital', genererEmail);
    bindInput('mail-dela-prime', 'f5_dela_prime', genererEmail);

    // Options Non-Fiscal
    bindInput('mail-nonfiscal-mensualite', 'f5_nonfiscal_mensualite', genererEmail);
    bindInput('mail-nonfiscal-birthyear', 'f5_nonfiscal_birthyear', genererEmail);

    // --- Bindings Enfants (Dynamique) ---
    bindInput('mail-children-count', 'f5_children_count', renderChildrenInputs);
    
    // Ajout d'un écouteur délégué pour les champs enfants dynamiques
    const childrenContainer = document.getElementById('children-options-container');
    if (childrenContainer) {
        childrenContainer.addEventListener('input', (e) => {
            if (e.target.matches('.child-input')) {
                updateChildrenDataFromDOM(); // Met à jour le state et régénère l'email
            }
        });
    }
    // --- FIN NOUVEAU ---

    // --- Logique d'affichage conditionnel ---
    const setupConditionalDisplay = (toggleId, containerId) => {
        const toggle = document.getElementById(toggleId);
        const container = document.getElementById(containerId);
        if (toggle && container) {
            const action = () => { container.style.display = toggle.checked ? 'block' : 'none'; };
            toggle.addEventListener('change', action);
            action(); 
        } else {
             console.warn(`Éléments manquants pour affichage conditionnel: ${toggleId} ou ${containerId}`);
        }
    };

    setupConditionalDisplay('toggle-ep', 'ep-options-container');
    setupConditionalDisplay('toggle-elt', 'elt-options-container');
    setupConditionalDisplay('toggle-dela', 'dela-options-container');
    setupConditionalDisplay('toggle-nonfiscal', 'nonfiscal-options-container');
    setupConditionalDisplay('toggle-enfant', 'children-main-container');

    // Boutons
    document.getElementById('f5-generate-button').addEventListener('click', () => {
        genererEmail(); 
        const previewCard = document.getElementById('f5-results-card');
        if (previewCard) {
            previewCard.style.display = 'block';
        }
    });
    document.getElementById('f5-copy-button').addEventListener('click', copierEmailHTML);
    
    // Générations initiales
    toggleRdvInputs(); // Gère l'affichage initial des champs RDV
    renderChildrenInputs(); // Gère l'affichage initial des champs enfant
    // genererEmail(); // Est déjà appelé par les two fonctions ci-dessus
}