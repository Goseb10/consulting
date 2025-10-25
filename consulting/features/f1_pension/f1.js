// features/f1_pension/f1.js - VERSION MISE À JOUR

import { formatMonetaire, updateElement, updateInputElement } from '../../core/utils.js';
import { translations, currentLang, registerOnLangChange } from '../../core/i18n.js';
import { CURRENT_YEAR, AGE_TAXE, AGE_FINALE_DEFAUT, AGE_FINALE_LT, FRAIS_DEFAUT, LIMITES_VERSEMENT } from '../../core/constants.js';
import { effectuerSimulation } from '../../core/simulationEngine.js';

// NOUVEAU: Importer le store
import { getState, bindInput, bindCheckbox, updateState } from '../../core/store.js';

let myChart; // Instance du graphique F1

function changerFraisDefaut() {
    // NOUVEAU: Lire l'état depuis le store
    const state = getState();
    const typeEpargne = state.f1_type;
    
    const frais = FRAIS_DEFAUT[typeEpargne];
    const entreeEl = document.getElementById('frais-entree');
    const courantEl = document.getElementById('frais-courant');

    if (frais && entreeEl && courantEl) {
        // NOUVEAU: Mettre à jour le DOM et le state
        entreeEl.value = frais.fraisEntree;
        courantEl.value = frais.fraisCourant;
        updateState('f1_frais_entree', frais.fraisEntree);
        updateState('f1_frais_courant', frais.fraisCourant);
    }
    
    const ltExtensionContainer = document.getElementById('lt-extension-container');
    const eltTaxContainer = document.getElementById('elt-taxe-info');
    const epTaxContainer = document.getElementById('ep-taxe-info'); // Ajout du container EP

    if (typeEpargne === 'long-terme') {
        if (ltExtensionContainer) ltExtensionContainer.style.display = 'flex';
        if (eltTaxContainer) eltTaxContainer.style.display = 'flex'; // On affiche ELT
        if (epTaxContainer) epTaxContainer.style.display = 'none'; // On cache EP
    } else { // Gère le cas 'pension'
        if (ltExtensionContainer) {
            ltExtensionContainer.style.display = 'none';
            const checkbox = document.getElementById('extension-80ans-toggle');
            if (checkbox && checkbox.checked) { // Ne décocher que si c'est coché
                // NOUVEAU: Mettre à jour le DOM et le state
                checkbox.checked = false; 
                updateState('f1_extend_80', false);
            }
        }
        if (eltTaxContainer) eltTaxContainer.style.display = 'none'; // On cache ELT
        if (epTaxContainer) epTaxContainer.style.display = 'flex'; // On affiche EP
    }
}

export function calculerProjectionF1() { 
    console.log("calculerProjectionF1 déclenché");
    try {
        // NOUVEAU: Lire toutes les valeurs depuis le store
        const state = getState();
        const anneeNaissance = parseInt(state.f1_birth_year) || 0;
        let versementBrutMensuel = parseFloat(state.f1_versement) || 0; 
        const typeEpargne = state.f1_type;
        const isExtended = state.f1_extend_80;
        const finalAge = (typeEpargne === 'long-terme' && isExtended) ? AGE_FINALE_LT : AGE_FINALE_DEFAUT;
        const rendementAnnuel = parseFloat(state.f1_rendement) || 0; 
        const fraisEntreePct = parseFloat(state.f1_frais_entree) || 0; 
        const fraisCourantAnnuelPct = parseFloat(state.f1_frais_courant) || 0; 

        // Logique de validation et de correction
        const limites = LIMITES_VERSEMENT[typeEpargne];
        if (limites) {
            let versementModifie = false;
            if (versementBrutMensuel < limites.min) { 
                versementBrutMensuel = limites.min;
                versementModifie = true;
            } else if (versementBrutMensuel > limites.max) { 
                versementBrutMensuel = limites.max;
                versementModifie = true;
            }
            
            if(versementModifie && !document.body.classList.contains('mode-visitor')) {
                // NOUVEAU: Si on corrige le montant, on met à jour le DOM et le store
                // Ne pas le faire en mode visiteur pour éviter une boucle
                const inputVersement = document.getElementById('versement-brut');
                if (inputVersement) inputVersement.value = versementBrutMensuel.toFixed(2); 
                updateState('f1_versement', versementBrutMensuel);
            }
        }
        
        // Logique d'affichage (UI)
        const t = translations[currentLang] || translations.fr;
        const birthYearLabel = document.querySelector('[data-key="label_birth_year"]');
        if (birthYearLabel) birthYearLabel.textContent = (finalAge === 80) ? t.label_birth_year_80 : t.label_birth_year;
        const yearsSpan = document.querySelector('[data-key="span_years"]');
        if (yearsSpan) yearsSpan.textContent = (finalAge === 80) ? " " + t.span_years_80 : " " + t.span_years;
        
        const resultBox67 = document.getElementById('result-box-67');
        const resultBox80 = document.getElementById('result-box-80');
        if (resultBox67) resultBox67.style.display = (finalAge === 80) ? 'none' : 'block';
        if (resultBox80) resultBox80.style.display = (finalAge === 80) ? 'block' : 'none';

        // Simulation
        const params = { anneeNaissance, versementBrutMensuel, typeEpargne, rendementAnnuel, fraisEntreePct, fraisCourantAnnuelPct, targetAge: finalAge }; 
        const result = effectuerSimulation(params, CURRENT_YEAR);
        const resultRetard = effectuerSimulation(params, CURRENT_YEAR + 1);

        // Reset UI si invalide
        if (!result || result.dureeAnnees <= 0 || isNaN(result.capitalFinalNet)) {
            console.warn("F1: Durée nulle ou résultat invalide.");
             updateElement('duree-ans-info', "0", false); updateElement('versement-brut-mois', 0); updateElement('avantage-mois', 0); updateElement('net-place-mois', 0); updateElement('versement-brut-annuel', 0); updateElement('avantage-annuel-calcule', 0); updateElement('capital-net-annuel', 0); updateElement('versement-brut-total', 0); updateElement('avantage-total', 0); updateElement('capital-net-total', 0); updateElement('total-duree-annees', "0", false); updateInputElement('capital-avant-taxe-value', 0); updateInputElement('taxe-liberatoire-value', 0); updateElement('taxe-liberatoire', 0); updateElement('taxe-liberatoire-80', 0); updateElement('capital-final', 0); updateElement('capital-final-80', 0); updateElement('capital-retard', 0); updateElement('perte-estimee', 0); createChartF1([], 0, 0, 0, 0, finalAge); 
             return; 
        }

        // Mise à jour de l'UI avec les résultats
        const perteEstimee = result.capitalFinalNet - resultRetard.capitalFinalNet;
        const ageActuel = CURRENT_YEAR - anneeNaissance;
        const stopAge = finalAge;
        const avantageActif = ageActuel < stopAge;

        updateElement('duree-ans-info', result.dureeAnnees.toFixed(0), false);
        updateElement('versement-brut-mois', versementBrutMensuel);
        updateElement('avantage-mois', avantageActif ? result.avantageFiscalMensuel : 0);
        updateElement('net-place-mois', avantageActif ? result.capitalNetPlaceMensuel : versementBrutMensuel);
        updateElement('versement-brut-annuel', result.versementBrutAnnuel);
        updateElement('avantage-annuel-calcule', avantageActif ? result.avantageFiscalAnnuel : 0); 
        updateElement('capital-net-annuel', avantageActif ? result.capitalNetPlaceAnnuel : result.versementBrutAnnuel);
        updateElement('versement-brut-total', result.capitalBrutPlaceTotal);
        updateElement('avantage-total', result.avantageFiscalTotal);
        updateElement('capital-net-total', result.capitalNetPlaceTotal);
        updateElement('total-duree-annees', result.dureeVersementAnnees.toFixed(0), false);
        updateInputElement('capital-avant-taxe-value', result.capitalAuMomentTaxe);
        updateInputElement('taxe-liberatoire-value', result.taxeLiberatoire);
        updateElement('taxe-liberatoire', result.taxeLiberatoire);
        updateElement('taxe-liberatoire-80', result.taxeLiberatoire);
        updateElement('capital-final', result.capitalFinalNet); 
        updateElement('capital-final-80', result.capitalFinalNet); 
        updateElement('capital-retard', resultRetard.capitalFinalNet);
        updateElement('perte-estimee', perteEstimee);
        
        // Mettre à jour le graphique
        createChartF1(result.evolutionCapital, anneeNaissance + AGE_TAXE, result.capitalAuMomentTaxe, result.taxeLiberatoire, resultRetard.capitalFinalNet, finalAge); 

    } catch (error) {
        console.error("Erreur majeure dans calculerProjectionF1:", error);
        updateElement('capital-final', 0); updateElement('capital-final-80', 0); createChartF1([], 0, 0, 0, 0, AGE_FINALE_DEFAUT); 
    }
}

function createChartF1(data, annee60Ans, capitalAuMomentTaxe, taxeLiberatoire, capitalRetardValue, finalAge) { 
    const ctx = document.getElementById('capitalChart')?.getContext('2d'); 
    if (!ctx) { console.warn("Canvas F1 non trouvé"); return;} 
    const t = translations[currentLang] || translations.fr; 
    
    let chartData = data ? JSON.parse(JSON.stringify(data)) : [];

    if (!chartData || chartData.length === 0) {
        if (myChart) myChart.destroy();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
        ctx.font = "16px Inter"; ctx.fillStyle = "#ccc"; ctx.textAlign = "center";
        ctx.fillText(t.no_data || "Aucune donnée", ctx.canvas.width / 2, ctx.canvas.height / 2); 
        return;
    }

    let index60Ans = chartData.findIndex(d => d.age >= AGE_TAXE); 
    let pointAvantTaxeAjoute = false;
    if (index60Ans > 0 && capitalAuMomentTaxe > 0 && taxeLiberatoire > 0) {
        const pointAvantTaxe = { year: chartData[index60Ans].year, age: chartData[index60Ans].age, capital: capitalAuMomentTaxe };
        if (index60Ans === 0 || chartData[index60Ans - 1].capital !== capitalAuMomentTaxe) {
             chartData.splice(index60Ans, 0, pointAvantTaxe); 
             pointAvantTaxeAjoute = true;
        }
    }
    
    const finalIndex60Ans = pointAvantTaxeAjoute ? index60Ans : chartData.findIndex(d => d.age >= AGE_TAXE);

    const labels = chartData.map(d => d.year); 
    const dataCapital = chartData.map(d => d.capital);
    const capitalFinalNet = (chartData.length > 0) ? (chartData[chartData.length - 1].capital || 0) : 0; 
    const capitalRetard = capitalRetardValue || 0;
    const finalIndex = labels.length - 1;
    
    let pointAvantTaxePoints = labels.map(() => null); 
    let pointApresTaxePoints = labels.map(() => null); 

    if (pointAvantTaxeAjoute && finalIndex60Ans < chartData.length) {
         pointAvantTaxePoints[finalIndex60Ans] = capitalAuMomentTaxe;
         if (finalIndex60Ans + 1 < chartData.length) {
             pointApresTaxePoints[finalIndex60Ans + 1] = chartData[finalIndex60Ans + 1].capital;
         }
    }

    const pointFinalNet = labels.map((_, i) => i === finalIndex ? capitalFinalNet : null);
    const pointRetard = labels.map((_, i) => i === finalIndex ? capitalRetard : null);
    const finalAgeKey = (finalAge === 80) ? 'chart_final_net_80' : 'chart_final_net';
    const finalLabel = t[finalAgeKey] || t.chart_final_net;

    if (myChart) { myChart.destroy(); }

    try {
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels, 
                datasets: [
                    { label: t.chart_evolution, data: dataCapital, borderColor: '#0070B0', backgroundColor: 'rgba(0, 112, 176, 0.1)', borderWidth: 2, fill: false, tension: 0.1, pointRadius: 2, pointHoverRadius: 4 }, 
                    { label: t.chart_avant_taxe, data: pointAvantTaxePoints, borderColor: '#FF8800', backgroundColor: '#FF8800', borderWidth: 0, pointRadius: 6, pointStyle: 'star', showLine: false },
                    { label: t.chart_apres_taxe, data: pointApresTaxePoints, borderColor: '#FF8800', backgroundColor: '#FF8800', borderWidth: 0, pointRadius: 6, pointStyle: 'triangle', showLine: false },
                    { label: finalLabel, data: pointFinalNet, borderColor: '#00B3A6', backgroundColor: '#00B3A6', borderWidth: 0, pointRadius: 7, pointStyle: 'circle', showLine: false },
                    { label: t.chart_retard, data: pointRetard, borderColor: '#D3425A', backgroundColor: '#D3425A', borderWidth: 0, pointRadius: 7, pointStyle: 'crossRot', showLine: false }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false, 
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: t.chart_y_label, }, ticks: { callback: value => formatMonetaire(value).replace(/\s?EUR/, '') } },
                    x: { 
                        type: 'linear', 
                        title: { display: true, text: t.chart_x_label, }, 
                        ticks: {
                             stepSize: 5, 
                             callback: function(value, index) { 
                                const dataPoint = chartData.find(p => Math.abs(p.year - value) < 0.1); 
                                if (!dataPoint) return null; 
                                
                                const age = dataPoint.age.toFixed(0);
                                let unit = (currentLang === 'fr' ? 'ans' : (currentLang === 'nl' ? 'jaar' : 'yrs'));
                                const roundedYear = Math.round(value);
                                const isFirst = chartData.findIndex(p => Math.abs(p.year - value) < 0.1) === 0; // Check if it's the first data point's year
                                const isLast = chartData.findIndex(p => Math.abs(p.year - value) < 0.1) === chartData.length -1; // Check if it's the last data point's year
                                const isAge60 = Math.abs(dataPoint.age - AGE_TAXE) < 1; 

                                if (isFirst || isLast || isAge60 || (roundedYear % 5 === 0)) {
                                     return `${age} ${unit}`;
                                }
                                return null; 
                             },
                             autoSkip: false, 
                             maxRotation: 0, 
                             minRotation: 0
                        }
                    }
                },
                plugins: {
                    legend: { display: true, position: 'bottom', labels: { boxWidth: 15, padding: 20 } }, 
                    tooltip: { 
                         callbacks: { 
                             label: ctx => {
                                 let label = ctx.dataset.label || '';
                                 if (label) { label += ': '; }
                                 label += formatMonetaire(ctx.parsed.y);
                                 const dataPoint = chartData[ctx.dataIndex];
                                 if (dataPoint) {
                                     label += ` (${dataPoint.age.toFixed(1)} ${currentLang === 'fr' ? 'ans' : (currentLang === 'nl' ? 'yrs' : 'yrs')})`;
                                 }
                                 return label;
                             },
                             title: ctx => { 
                                const dataPoint = chartData[ctx[0].dataIndex];
                                return dataPoint ? `Année ${dataPoint.year.toFixed(1)}` : ''; 
                             }
                         } 
                     }
                }
            }
        });
    } catch (e) { console.error("Erreur création graphique F1:", e); }
}

/**
 * Initialise la fonctionnalité F1 (listeners)
 */
export function initF1() {
    console.log("Initialisation F1...");
    
    // NOUVEAU: Lier les inputs au store
    // Le callback `calculerProjectionF1` est appelé à chaque changement
    bindInput('type-epargne', 'f1_type', () => {
        changerFraisDefaut(); // Celui-ci doit être appelé en premier
        calculerProjectionF1();
        syncF1ToMail(); // Mettre à jour le mail lors du changement de type
    });
    bindCheckbox('extension-80ans-toggle', 'f1_extend_80', calculerProjectionF1);
    bindInput('annee-naissance', 'f1_birth_year', () => {
        calculerProjectionF1();
        syncF1ToMail();
    });
    bindInput('versement-brut', 'f1_versement', () => {
        calculerProjectionF1();
        syncF1ToMail();
    });
    bindInput('rendement', 'f1_rendement', calculerProjectionF1);
    bindInput('frais-entree', 'f1_frais_entree', calculerProjectionF1);
    bindInput('frais-courant', 'f1_frais_courant', calculerProjectionF1);
    
    // Bouton: ne met pas à jour le state, lance juste le calcul
    document.getElementById('f1-calculate-button').addEventListener('click', calculerProjectionF1);

    // Enregistrer pour les changements de langue
    registerOnLangChange(calculerProjectionF1);

    // NOUVEAU: La synchro vers le mail lit aussi le store
    const syncF1ToMail = () => {
        // Ne pas synchroniser en mode visiteur
        if (document.body.classList.contains('mode-visitor')) return;

        const state = getState();
        const montant = state.f1_versement;
        const birthYear = state.f1_birth_year;
        
        if (state.f1_type === 'pension') {
            updateInputElement('mail-ep-mensualite', montant);
            updateInputElement('mail-ep-birthyear', birthYear);
            updateState('f5_ep_mensualite', montant); // Met aussi à jour le state du mail
            updateState('f5_ep_birthyear', birthYear);
        } else if (state.f1_type === 'long-terme') {
            updateInputElement('mail-elt-mensualite', montant);
            updateInputElement('mail-elt-birthyear', birthYear);
            updateState('f5_elt_mensualite', montant); // Met aussi à jour le state du mail
            updateState('f5_elt_birthyear', birthYear);
        }
    };
    
    // Premier calcul
    changerFraisDefaut(); // Appelé avant le bind pour set les bons frais
    calculerProjectionF1(); // Appelé après les binds pour tout calculer
    
    // Synchro initiale au chargement
    syncF1ToMail(); 
}