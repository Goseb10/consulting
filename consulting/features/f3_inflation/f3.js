// features/f3_inflation/f3.js - VERSION MISE À JOUR

import { formatMonetaire, updateElement } from '../../core/utils.js';
import { translations, currentLang, registerOnLangChange } from '../../core/i18n.js';

// NOUVEAU: Importer le store
import { getState, bindInput } from '../../core/store.js';

let inflationChartInstance; 

export function calculerInflation() {
    console.log("calculerInflation déclenché");
    const t = translations[currentLang] || translations.fr;
    try {
        // NOUVEAU: Lire les valeurs depuis le store
        const state = getState();
        const montantActuel = parseFloat(state.f3_montant) || 0;
        const dureeAnnees = parseInt(state.f3_duree) || 0;
        const tauxInflationPct = parseFloat(state.f3_taux) || 0;

        // Logique de calcul (inchangée)
        if (montantActuel <= 0 || dureeAnnees <= 0 ) {
             console.warn("F2 (Inflation): Montant ou durée invalide.");
             updateElement('inflation-future-needed', 0);
             updateElement('inflation-future-value', 0);
             updateElement('inflation-loss', 0);
             updateElement('inflation-result-years', dureeAnnees, false); // Affiche '0' si invalide, mais c'est ok
             const summaryEl = document.getElementById('inflation-summary');
             if(summaryEl) summaryEl.textContent = t.no_data || "Entrez des valeurs valides.";
             createInflationChart([]);
             return;
        }

        const tauxInflation = tauxInflationPct / 100;
        const montantFuturEquivalent = montantActuel * Math.pow(1 + tauxInflation, dureeAnnees);
        const valeurFutureReelle = montantActuel / Math.pow(1 + tauxInflation, dureeAnnees);
        const perteDeValeur = montantActuel - valeurFutureReelle;

        // Mise à jour UI (inchangée)
        updateElement('inflation-future-needed', montantFuturEquivalent);
        updateElement('inflation-future-value', valeurFutureReelle);
        updateElement('inflation-loss', perteDeValeur);
        updateElement('inflation-result-years', dureeAnnees, false); // Met à jour SEULEMENT le span du nombre

        // Mettre à jour la phrase de synthèse
        let summaryText = t.p_summary_f3 || "";
        summaryText = summaryText.replace('{rate}', tauxInflationPct.toFixed(1));
        summaryText = summaryText.replace(/{currentAmount}/g, formatMonetaire(montantActuel)); 
        summaryText = summaryText.replace('{futureValue}', formatMonetaire(valeurFutureReelle));
        summaryText = summaryText.replace('{years}', dureeAnnees);
        summaryText = summaryText.replace('{futureNeeded}', formatMonetaire(montantFuturEquivalent));
        const summaryEl = document.getElementById('inflation-summary');
        if (summaryEl) summaryEl.textContent = summaryText;
        
        // Préparer les données et créer le graphique
        let devaluationData = [];
        for (let year = 0; year <= dureeAnnees; year++) {
            devaluationData.push({
                year: year,
                value: montantActuel / Math.pow(1 + tauxInflation, year)
            });
        }
        createInflationChart(devaluationData);

    } catch (error) {
        console.error("Erreur majeure dans calculerInflation:", error);
         updateElement('inflation-future-needed', 0);
         updateElement('inflation-future-value', 0);
         updateElement('inflation-loss', 0);
         const summaryEl = document.getElementById('inflation-summary');
         if(summaryEl) summaryEl.textContent = "Erreur lors du calcul.";
         createInflationChart([]);
    }
}

// Fonction createInflationChart (inchangée)
function createInflationChart(data) {
    const ctx = document.getElementById('inflationChart')?.getContext('2d');
    if (!ctx) { console.warn("Canvas F2 (Inflation) non trouvé"); return; }
    
    const t = translations[currentLang] || translations.fr;

    if (inflationChartInstance) {
        inflationChartInstance.destroy();
    }

    if (!data || data.length <= 1) { 
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
        ctx.font = "16px Inter"; ctx.fillStyle = "#ccc"; ctx.textAlign = "center";
        ctx.fillText(t.no_data || "Aucune donnée", ctx.canvas.width / 2, ctx.canvas.height / 2); 
        return;
    }

    const labels = data.map(d => d.year);
    const dataValues = data.map(d => d.value);

    try {
        const dangerColor = getComputedStyle(document.documentElement).getPropertyValue('--danger-color').trim() || '#D3425A';
        const hexToRgba = (hex, alpha) => {
             let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
             hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                 return r + r + g + g + b + b;
             });
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!result) return `rgba(211, 66, 90, ${alpha})`; // Fallback color
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        const dangerColorRgba = hexToRgba(dangerColor, 0.1);


        inflationChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: t.chart_devaluation_label || 'Pouvoir d\'achat (€)',
                    data: dataValues,
                    borderColor: dangerColor, 
                    backgroundColor: dangerColorRgba, 
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1,
                    pointBackgroundColor: dangerColor,
                    pointRadius: 3,
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    y: { 
                        beginAtZero: false, 
                        title: { display: true, text: t.chart_y_label }, 
                        ticks: { callback: value => formatMonetaire(value).replace(/\s?EUR/, '') } 
                    },
                    x: { 
                        title: { display: true, text: t.chart_x_label_f3 || "Années" },
                        ticks: { stepSize: 1, callback: function(value) { // Assurer que seuls les entiers sont affichés
                                if (Math.floor(value) === value) { return value; }
                            }
                        } 
                    }
                },
                plugins: {
                    legend: { 
                        display: true, 
                        position: 'bottom'
                    },
                    tooltip: { 
                        callbacks: { 
                            label: ctx => `${ctx.dataset.label}: ${formatMonetaire(ctx.parsed.y)}`,
                            title: ctx => `${t.chart_x_label_f3 || "Année"} ${ctx[0].label}` 
                         } 
                    }
                }
            }
        });
    } catch (e) { console.error("Erreur création graphique F2 (Inflation):", e); }
}

/**
 * Initialise la fonctionnalité F3 (listeners)
 */
export function initF3() {
    console.log("Initialisation F3...");

    // NOUVEAU: Lier les inputs au store
    bindInput('inflation-montant', 'f3_montant', calculerInflation);
    bindInput('inflation-duree', 'f3_duree', calculerInflation);
    bindInput('inflation-taux', 'f3_taux', calculerInflation);
    
    // Listener sur le bouton
    document.getElementById('f3-calculate-button').addEventListener('click', calculerInflation);

    // Enregistrer pour les changements de langue
    registerOnLangChange(calculerInflation);

    // Premier calcul
    calculerInflation();
}