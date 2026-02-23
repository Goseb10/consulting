// features/f1_pension/f1.js

import { formatMonetaire, updateElement, updateInputElement } from '../../core/utils.js';
import { translations, currentLang, registerOnLangChange } from '../../core/i18n.js';
import { CURRENT_YEAR, AGE_TAXE, AGE_FINALE_DEFAUT, FRAIS_DEFAUT, LIMITES_VERSEMENT } from '../../core/constants.js';
import { effectuerSimulation } from '../../core/simulationEngine.js';
import { getState, bindInput, updateState } from '../../core/store.js';

let myChart; // Instance du graphique F1

function changerFraisDefaut() {
    const state = getState();
    const typeEpargne = state.f1_type;
    
    const frais = FRAIS_DEFAUT[typeEpargne];
    const entreeEl = document.getElementById('frais-entree');
    const courantEl = document.getElementById('frais-courant');

    if (frais && entreeEl && courantEl) {
        entreeEl.value = frais.fraisEntree;
        courantEl.value = frais.fraisCourant;
        updateState('f1_frais_entree', frais.fraisEntree);
        updateState('f1_frais_courant', frais.fraisCourant);
    }
    
    const ltTargetAgeContainer = document.getElementById('lt-target-age-container');
    const eltTaxContainer = document.getElementById('elt-taxe-info');
    const epTaxContainer = document.getElementById('ep-taxe-info');

    if (typeEpargne === 'long-terme') {
        if (ltTargetAgeContainer) ltTargetAgeContainer.style.display = 'block';
        if (eltTaxContainer) eltTaxContainer.style.display = 'flex'; 
        if (epTaxContainer) epTaxContainer.style.display = 'none'; 
    } else { 
        if (ltTargetAgeContainer) ltTargetAgeContainer.style.display = 'none';
        if (eltTaxContainer) eltTaxContainer.style.display = 'none'; 
        if (epTaxContainer) epTaxContainer.style.display = 'flex'; 
    }
}

export function calculerProjectionF1() { 
    console.log("calculerProjectionF1 déclenché");
    try {
        const state = getState();
        const anneeNaissance = parseInt(state.f1_birth_year) || 0;
        let versementBrutMensuel = parseFloat(state.f1_versement) || 0; 
        const typeEpargne = state.f1_type;
        
        // --- NOUVEAU: Récupère l'âge dynamiquement ---
        const finalAge = (typeEpargne === 'long-terme') ? (parseInt(state.f1_target_age) || 67) : AGE_FINALE_DEFAUT;
        
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
                const inputVersement = document.getElementById('versement-brut');
                if (inputVersement) inputVersement.value = versementBrutMensuel.toFixed(2); 
                updateState('f1_versement', versementBrutMensuel);
            }
        }
        
        // Logique d'affichage (UI)
        const t = translations[currentLang] || translations.fr;
        
        const birthYearLabel = document.querySelector('label[for="annee-naissance"]');
        if (birthYearLabel) birthYearLabel.textContent = `${t.label_birth_year_base || "Année de naissance"} (Cible ${finalAge} ans)`;
        
        const yearsSpan = document.getElementById('duree-ans-info').nextElementSibling;
        if (yearsSpan) yearsSpan.textContent = ` ${t.span_years_base || "années (jusqu'à"} ${finalAge} ans)`;
        
        const finalProjTitle = document.getElementById('f1-final-projection-title');
        if (finalProjTitle) finalProjTitle.textContent = `Projection Finale (Âge ${finalAge} ans)`;

        const finalNetLabel = document.getElementById('f1-final-net-label');
        if (finalNetLabel) finalNetLabel.textContent = `CAPITAL FINAL NET (Total perçu à ${finalAge} ans)`;

        // Simulation
        const params = { anneeNaissance, versementBrutMensuel, typeEpargne, rendementAnnuel, fraisEntreePct, fraisCourantAnnuelPct, targetAge: finalAge }; 
        const result = effectuerSimulation(params, CURRENT_YEAR);
        const resultRetard = effectuerSimulation(params, CURRENT_YEAR + 1);

        const ageTaxe = result.ageTaxe || AGE_TAXE;
        const labelTaxe = t.span_tax_levied.replace('{age}', ageTaxe.toFixed(0));

        // Reset UI si invalide
        if (!result || result.dureeAnnees <= 0 || isNaN(result.capitalFinalNet)) {
             console.warn("F1: Durée nulle ou résultat invalide.");
             updateElement('duree-ans-info', "0", false); updateElement('versement-brut-mois', 0); updateElement('avantage-mois', 0); updateElement('net-place-mois', 0); updateElement('versement-brut-annuel', 0); updateElement('avantage-annuel-calcule', 0); updateElement('capital-net-annuel', 0); updateElement('versement-brut-total', 0); updateElement('avantage-total', 0); updateElement('capital-net-total', 0); updateElement('total-duree-annees', "0", false); updateInputElement('capital-avant-taxe-value', 0); updateInputElement('taxe-liberatoire-value', 0); updateElement('taxe-liberatoire', 0); updateElement('capital-final', 0); updateElement('capital-retard', 0); updateElement('perte-estimee', 0); 
             const labelTaxeEchec = t.span_tax_levied.replace('{age}', AGE_TAXE.toFixed(0));
             updateElement('f1-tax-label', labelTaxeEchec, false);
             createChartF1([], 0, 0, 0, 0, finalAge, AGE_TAXE); 
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
        
        updateElement('f1-tax-label', labelTaxe, false);
        
        updateElement('taxe-liberatoire', result.taxeLiberatoire);
        updateElement('capital-final', result.capitalFinalNet); 
        updateElement('capital-retard', resultRetard.capitalFinalNet);
        updateElement('perte-estimee', perteEstimee);
        
        createChartF1(result.evolutionCapital, anneeNaissance + AGE_TAXE, result.capitalAuMomentTaxe, result.taxeLiberatoire, resultRetard.capitalFinalNet, finalAge, ageTaxe); 

    } catch (error) {
        console.error("Erreur majeure dans calculerProjectionF1:", error);
        updateElement('capital-final', 0); createChartF1([], 0, 0, 0, 0, AGE_FINALE_DEFAUT, AGE_TAXE); 
    }
}

function createChartF1(data, annee60Ans, capitalAuMomentTaxe, taxeLiberatoire, capitalRetardValue, finalAge, ageTaxe) { 
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

    let indexTaxe = chartData.findIndex(d => d.age >= ageTaxe);
    let pointAvantTaxeAjoute = false;
    if (indexTaxe >= 0 && capitalAuMomentTaxe > 0 && taxeLiberatoire > 0) {
        if (indexTaxe === 0 || chartData[indexTaxe - 1].capital !== capitalAuMomentTaxe) {
             const pointAvantTaxe = { year: chartData[indexTaxe].year, age: chartData[indexTaxe].age, capital: capitalAuMomentTaxe };
             chartData.splice(indexTaxe, 0, pointAvantTaxe); 
             pointAvantTaxeAjoute = true;
        }
    }
    
    const finalIndexTaxe = pointAvantTaxeAjoute ? indexTaxe : chartData.findIndex(d => d.age >= ageTaxe);

    const labels = chartData.map(d => d.year); 
    const dataCapital = chartData.map(d => d.capital);
    const capitalFinalNet = (chartData.length > 0) ? (chartData[chartData.length - 1].capital || 0) : 0; 
    const capitalRetard = capitalRetardValue || 0;
    const finalIndex = labels.length - 1;
    
    let pointAvantTaxePoints = labels.map(() => null); 
    let pointApresTaxePoints = labels.map(() => null); 

    if (finalIndexTaxe >= 0 && finalIndexTaxe < chartData.length) {
         pointAvantTaxePoints[finalIndexTaxe] = capitalAuMomentTaxe;
         if (finalIndexTaxe + 1 < chartData.length) {
             pointApresTaxePoints[finalIndexTaxe + 1] = chartData[finalIndexTaxe + 1].capital;
         }
    }

    const pointFinalNet = labels.map((_, i) => i === finalIndex ? capitalFinalNet : null);
    const pointRetard = labels.map((_, i) => i === finalIndex ? capitalRetard : null);
    
    // Labels dynamiques
    const finalLabel = `Capital Final NET (${finalAge} ans)`;
    const ageTaxeStr = ageTaxe.toFixed(0);
    const labelEvo = t.chart_evolution.replace('{age}', ageTaxeStr);
    const labelAvant = t.chart_avant_taxe.replace('{age}', ageTaxeStr);
    const labelApres = t.chart_apres_taxe.replace('{age}', ageTaxeStr);

    if (myChart) { myChart.destroy(); }

    try {
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels, 
                datasets: [
                    { label: labelEvo, data: dataCapital, borderColor: '#0070B0', backgroundColor: 'rgba(0, 112, 176, 0.1)', borderWidth: 2, fill: false, tension: 0.1, pointRadius: 2, pointHoverRadius: 4 }, 
                    { label: labelAvant, data: pointAvantTaxePoints, borderColor: '#FF8800', backgroundColor: '#FF8800', borderWidth: 0, pointRadius: 6, pointStyle: 'star', showLine: false },
                    { label: labelApres, data: pointApresTaxePoints, borderColor: '#FF8800', backgroundColor: '#FF8800', borderWidth: 0, pointRadius: 6, pointStyle: 'triangle', showLine: false },
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
                                const isFirst = chartData.findIndex(p => Math.abs(p.year - value) < 0.1) === 0; 
                                const isLast = chartData.findIndex(p => Math.abs(p.year - value) < 0.1) === chartData.length -1; 
                                const isAgeTaxe = Math.abs(dataPoint.age - ageTaxe) < 1; 

                                if (isFirst || isLast || isAgeTaxe || (roundedYear % 5 === 0)) {
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

export function initF1() {
    console.log("Initialisation F1...");
    
    bindInput('type-epargne', 'f1_type', () => {
        changerFraisDefaut(); 
        calculerProjectionF1();
        syncF1ToMail(); 
    });
    bindInput('f1-target-age', 'f1_target_age', () => {
        calculerProjectionF1();
        syncF1ToMail();
    });
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
    
    document.getElementById('f1-calculate-button').addEventListener('click', calculerProjectionF1);
    registerOnLangChange(calculerProjectionF1);

    const syncF1ToMail = () => {
        if (document.body.classList.contains('mode-visitor')) return;

        const state = getState();
        const montant = state.f1_versement;
        const birthYear = state.f1_birth_year;
        const targetAge = state.f1_target_age;
        
        if (state.f1_type === 'pension') {
            updateInputElement('mail-ep-mensualite', montant);
            updateInputElement('mail-ep-birthyear', birthYear);
            updateState('f5_ep_mensualite', montant); 
            updateState('f5_ep_birthyear', birthYear);
        } else if (state.f1_type === 'long-terme') {
            updateInputElement('mail-elt-mensualite', montant);
            updateInputElement('mail-elt-birthyear', birthYear);
            updateInputElement('mail-elt-target-age', targetAge);
            updateState('f5_elt_mensualite', montant); 
            updateState('f5_elt_birthyear', birthYear);
            updateState('f5_elt_target_age', targetAge);
        }
    };
    
    changerFraisDefaut(); 
    setTimeout(() => {
        calculerProjectionF1(); 
        syncF1ToMail(); 
    }, 0); 
    
    syncF1ToMail(); 
}
