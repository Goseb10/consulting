// features/f4_comparator/f4.js

import { updateElement, formatMonetaire } from '../../core/utils.js';
import { translations, currentLang, registerOnLangChange } from '../../core/i18n.js';
import { AGE_FINALE_DEFAUT, CURRENT_YEAR, AGE_TAXE } from '../../core/constants.js';
import { effectuerSimulation } from '../../core/simulationEngine.js';
import { getState, bindInput, bindCheckbox } from '../../core/store.js';

let comparatorChartInstance; 

function updateComparatorTaxInfo() {
    const t = translations[currentLang] || translations.fr;
    const state = getState();

    // --- Colonne 1 ---
    const type1 = state.f4_c1_type;
    const finalAge1 = (type1 === 'long-terme') ? (parseInt(state.f4_c1_target_age) || 67) : AGE_FINALE_DEFAUT;
    const eltTax1 = document.getElementById('f3-c1-elt-taxe-info');
    const epTax1 = document.getElementById('f3-c1-ep-taxe-info');
    const ltTargetAgeContainer1 = document.getElementById('f3-c1-lt-target-age-container'); 
    const startAgeLabel1 = document.querySelector('#f3-col-1 label[for="f3-c1-start-age"]'); 
    const yearsSpan1 = document.getElementById('f3-c1-duree-ans-text'); 
    
    if (type1 === 'long-terme') {
        if (eltTax1) eltTax1.style.display = 'flex';
        if (epTax1) epTax1.style.display = 'none';
        if (ltTargetAgeContainer1) ltTargetAgeContainer1.style.display = 'block'; 
    } else { 
        if (eltTax1) eltTax1.style.display = 'none';
        if (epTax1) epTax1.style.display = 'flex';
        if (ltTargetAgeContainer1) ltTargetAgeContainer1.style.display = 'none';
    }
    
    if (startAgeLabel1) startAgeLabel1.textContent = `${t.label_start_age_base || "Âge actuel"} (Cible ${finalAge1} ans)`;
    if (yearsSpan1) yearsSpan1.textContent = ` ${t.span_years_base || "années (jusqu'à"} ${finalAge1} ans)`;


    // --- Colonne 2 ---
    const type2 = state.f4_c2_type;
    const finalAge2 = (type2 === 'long-terme') ? (parseInt(state.f4_c2_target_age) || 67) : AGE_FINALE_DEFAUT;
    const eltTax2 = document.getElementById('f3-c2-elt-taxe-info');
    const epTax2 = document.getElementById('f3-c2-ep-taxe-info');
    const ltTargetAgeContainer2 = document.getElementById('f3-c2-lt-target-age-container'); 
    const startAgeLabel2 = document.querySelector('#f3-col-2 label[for="f3-c2-start-age"]'); 
    const yearsSpan2 = document.getElementById('f3-c2-duree-ans-text'); 

    if (type2 === 'long-terme') {
        if (eltTax2) eltTax2.style.display = 'flex';
        if (epTax2) epTax2.style.display = 'none';
        if (ltTargetAgeContainer2) ltTargetAgeContainer2.style.display = 'block'; 
    } else { 
        if (eltTax2) eltTax2.style.display = 'none';
        if (epTax2) epTax2.style.display = 'flex';
        if (ltTargetAgeContainer2) ltTargetAgeContainer2.style.display = 'none';
    }
    
    if (startAgeLabel2) startAgeLabel2.textContent = `${t.label_start_age_base || "Âge actuel"} (Cible ${finalAge2} ans)`;
    if (yearsSpan2) yearsSpan2.textContent = ` ${t.span_years_base || "années (jusqu'à"} ${finalAge2} ans)`;
}

function setupF4ScenarioUI() {
    const state = getState();
    const isStopSwitch = state.f4_scenario_stop_switch;
    const t = translations[currentLang] || translations.fr;

    const stopSwitchGroup = document.getElementById('f3-c1-stop-switch-group'); 
    const versementGroup = document.getElementById('f3-c1-flux-group');
    const differenceLine = document.getElementById('f3-difference-line');
    const combinedResults = document.getElementById('f3-combined-results');
    const resultsTitle = document.getElementById('f3-results-title');

    if (isStopSwitch) {
        if (stopSwitchGroup) stopSwitchGroup.style.display = 'block'; 
        if (versementGroup) versementGroup.style.display = 'none'; 
        
        if (differenceLine) differenceLine.style.display = 'none';
        if (combinedResults) combinedResults.style.display = 'block';
        if (resultsTitle) resultsTitle.textContent = t.h3_total_capital || "Capital Total Combiné";

    } else {
        if (stopSwitchGroup) stopSwitchGroup.style.display = 'none'; 
        if (versementGroup) versementGroup.style.display = 'block'; 
        
        if (differenceLine) differenceLine.style.display = 'flex'; 
        if (combinedResults) combinedResults.style.display = 'none';
        if (resultsTitle) resultsTitle.textContent = t.h3_difference || "Différence";
    }
}

function createComparatorChart(dataC1, dataC2, nameC1, nameC2) {
    const ctx = document.getElementById('comparatorChart')?.getContext('2d');
    if (!ctx) { console.warn("Canvas Comparateur non trouvé"); return; }
    const t = translations[currentLang] || translations.fr;
    
    if (comparatorChartInstance) { comparatorChartInstance.destroy(); }

    if (!dataC1 || dataC1.length === 0) { return; }

    let allAges = dataC1.map(d => Math.round(d.age));
    if (dataC2 && dataC2.length > 0) {
        allAges = allAges.concat(dataC2.map(d => Math.round(d.age)));
    }
    
    const uniqueAges = [...new Set(allAges)].sort((a, b) => a - b);
    const labels = uniqueAges;

    const mapDataToLabels = (data) => {
        return labels.map(labelAge => {
            const point = data.find(d => Math.round(d.age) === labelAge);
            return point ? point.capital : null;
        });
    };

    const datasetC1 = mapDataToLabels(dataC1);
    const datasetC2 = dataC2 ? mapDataToLabels(dataC2) : [];

    try {
        comparatorChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: nameC1 || "Compagnie 1",
                        data: datasetC1,
                        borderColor: '#0070B0', 
                        backgroundColor: 'rgba(0, 112, 176, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: nameC2 || "Compagnie 2",
                        data: datasetC2,
                        borderColor: '#FF8800', 
                        backgroundColor: 'rgba(255, 136, 0, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { callback: value => formatMonetaire(value).replace(/\s?EUR/, '') } },
                    x: { 
                        title: { display: true, text: t.chart_x_label || "Âge (ans)" },
                        ticks: { stepSize: 5 } 
                    }
                },
                plugins: {
                    legend: { display: true, position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: ctx => `${ctx.dataset.label}: ${formatMonetaire(ctx.parsed.y)}`
                        }
                    }
                }
            }
        });
    } catch (e) { console.error("Erreur Chart Comparateur:", e); }
}

export function calculerComparaisonF3() {
    console.log("calculerComparaisonF3 déclenché");
    
    updateComparatorTaxInfo();

    try {
        const t = translations[currentLang] || translations.fr;
        const state = getState();
        
        const isStopSwitch = state.f4_scenario_stop_switch;

        // --- C1 ---
        const name1 = state.f4_c1_name;
        const type1 = state.f4_c1_type;
        const currentAge1 = parseInt(state.f4_c1_start_age) || 0; 
        const anneeNaissance1 = CURRENT_YEAR - currentAge1;
        const versement1_base = parseFloat(state.f4_c1_versement) || 0;
        const rendement1 = parseFloat(state.f4_c1_rendement) || 0;
        const fraisEntree1 = parseFloat(state.f4_c1_frais_entree) || 0;
        const fraisCourant1 = parseFloat(state.f4_c1_frais_courant) || 0;
        const finalAge1 = (type1 === 'long-terme') ? (parseInt(state.f4_c1_target_age) || 67) : AGE_FINALE_DEFAUT;

        const paramsC1_Base = { 
            typeEpargne: type1, anneeNaissance: anneeNaissance1, 
            rendementAnnuel: rendement1, fraisEntreePct: fraisEntree1, 
            fraisCourantAnnuelPct: fraisCourant1, targetAge: finalAge1
        };

        // --- C2 ---
        const name2 = state.f4_c2_name;
        const type2 = state.f4_c2_type;
        const currentAge2 = parseInt(state.f4_c2_start_age) || 0; 
        const anneeNaissance2 = CURRENT_YEAR - currentAge2;
        const versement2 = parseFloat(state.f4_c2_versement) || 0;
        const rendement2 = parseFloat(state.f4_c2_rendement) || 0;
        const fraisEntree2 = parseFloat(state.f4_c2_frais_entree) || 0;
        const fraisCourant2 = parseFloat(state.f4_c2_frais_courant) || 0;
        const finalAge2 = (type2 === 'long-terme') ? (parseInt(state.f4_c2_target_age) || 67) : AGE_FINALE_DEFAUT;
        
        const paramsC2_Base = { 
            typeEpargne: type2, anneeNaissance: anneeNaissance2, versementBrutMensuel: versement2, 
            rendementAnnuel: rendement2, fraisEntreePct: fraisEntree2, fraisCourantAnnuelPct: fraisCourant2, 
            targetAge: finalAge2, capitalInitial: 0
        };

        let result1, result2;
        let result_Precalc_data = null; 

        if (isStopSwitch) {
            const originalStartAge = parseInt(state.f4_c1_original_start_age) || 18;
            const startYear_Precalc = anneeNaissance1 + originalStartAge;
            
            const params_Precalc = {
                ...paramsC1_Base,
                versementBrutMensuel: versement1_base,
                targetAge: currentAge1, 
                capitalInitial: 0
            };
            const result_Precalc = effectuerSimulation(params_Precalc, startYear_Precalc);
            result_Precalc_data = result_Precalc; 
            const capitalActuelC1 = result_Precalc.capitalFinalNet;
            
            const params_C1_Growth = {
                ...paramsC1_Base,
                versementBrutMensuel: 0, 
                capitalInitial: capitalActuelC1, 
                targetAge: finalAge1 
            };
            result1 = effectuerSimulation(params_C1_Growth, CURRENT_YEAR);

            result2 = effectuerSimulation(paramsC2_Base, CURRENT_YEAR);

            updateElement('f3-c1-final-only', result1.capitalFinalNet);
            updateElement('f3-c2-final-only', result2.capitalFinalNet);
            const combinedTotal = result1.capitalFinalNet + result2.capitalFinalNet;
            updateElement('f3-combined-capital', combinedTotal);

        } else {
            const params_C1_Normal = {
                ...paramsC1_Base,
                versementBrutMensuel: versement1_base,
                capitalInitial: 0,
                targetAge: finalAge1
            };
            result1 = effectuerSimulation(params_C1_Normal, CURRENT_YEAR);
            
            result2 = effectuerSimulation(paramsC2_Base, CURRENT_YEAR);
            
            const diff = result1.capitalFinalNet - result2.capitalFinalNet;
            updateElement('f3-difference-capital', diff);
            const diffEl = document.getElementById('f3-difference-capital');
            if (diffEl) {
                diffEl.classList.remove('positive', 'negative');
                if (diff > 0.01) {
                    diffEl.classList.add('positive');
                } else if (diff < -0.01) {
                    diffEl.classList.add('negative');
                }
            }
        }

        // --- Mise à jour UI ---
        updateElement('f3-c1-duree-ans-info', result1.dureeAnnees.toFixed(0), false);
        updateElement('f3-c2-duree-ans-info', result2.dureeAnnees.toFixed(0), false);
        
        updateElement('f3-c1-final-capital-text', `CAPITAL FINAL NET (${finalAge1} ans)`, false);
        updateElement('f3-c2-final-capital-text', `CAPITAL FINAL NET (${finalAge2} ans)`, false);

        const ageTaxe1 = result1.ageTaxe || AGE_TAXE;
        const labelTaxe1 = t.span_f3_tax.replace('{age}', ageTaxe1.toFixed(0));
        updateElement('f4-c1-tax-label', labelTaxe1, false);
        
        const ageTaxe2 = result2.ageTaxe || AGE_TAXE;
        const labelTaxe2 = t.span_f3_tax.replace('{age}', ageTaxe2.toFixed(0));
        updateElement('f4-c2-tax-label', labelTaxe2, false);

        const unit = currentLang === 'nl' ? 'jaar' : (currentLang === 'en' ? 'yrs' : 'ans');
        
        if (isStopSwitch && result_Precalc_data) {
            updateElement('f3-c1-duree-ans-total', `${result_Precalc_data.dureeVersementAnnees.toFixed(0)} ${unit}`, false);
            updateElement('f3-c1-versement-brut-total', result_Precalc_data.capitalBrutPlaceTotal);
            updateElement('f3-c1-avantage-total', result_Precalc_data.avantageFiscalTotal);
            updateElement('f3-c1-capital-net-total', result_Precalc_data.capitalNetPlaceTotal);
            updateElement('f3-c1-taxe-liberatoire', result1.taxeLiberatoire);
            updateElement('f3-c1-capital-final', result1.capitalFinalNet); 
            
            const combinedEvolutionC1 = [
                ...result_Precalc_data.evolutionCapital,
                ...result1.evolutionCapital
            ];
            const uniqueEvolutionC1 = combinedEvolutionC1.filter((v, i, a) => a.findIndex(t => t.age === v.age) === i);

            createComparatorChart(uniqueEvolutionC1, result2.evolutionCapital, name1, name2);

        } else {
            updateElement('f3-c1-duree-ans-total', `${result1.dureeVersementAnnees.toFixed(0)} ${unit}`, false);
            updateElement('f3-c1-versement-brut-total', result1.capitalBrutPlaceTotal);
            updateElement('f3-c1-avantage-total', result1.avantageFiscalTotal);
            updateElement('f3-c1-capital-net-total', result1.capitalNetPlaceTotal);
            updateElement('f3-c1-taxe-liberatoire', result1.taxeLiberatoire);
            updateElement('f3-c1-capital-final', result1.capitalFinalNet);
            
            createComparatorChart(result1.evolutionCapital, result2.evolutionCapital, name1, name2);
        }

        updateElement('f3-c2-duree-ans-total', `${result2.dureeVersementAnnees.toFixed(0)} ${unit}`, false);
        updateElement('f3-c2-versement-brut-total', result2.capitalBrutPlaceTotal);
        updateElement('f3-c2-avantage-total', result2.avantageFiscalTotal);
        updateElement('f3-c2-capital-net-total', result2.capitalNetPlaceTotal);
        updateElement('f3-c2-taxe-liberatoire', result2.taxeLiberatoire);
        updateElement('f3-c2-capital-final', result2.capitalFinalNet);

    } catch (error) {
        console.error("Erreur majeure dans calculerComparaisonF3:", error);
    }
}

export function initF4() {
    console.log("Initialisation F4 (Comparateur)...");

    bindCheckbox('f3-scenario-stop-switch', 'f4_scenario_stop_switch', () => {
        setupF4ScenarioUI(); 
        calculerComparaisonF3(); 
    });
    bindInput('f3-c1-original-start-age', 'f4_c1_original_start_age', calculerComparaisonF3);

    // --- BINDINGS C1 ---
    bindInput('f3-c1-name', 'f4_c1_name', calculerComparaisonF3); 
    bindInput('f3-c1-type-epargne', 'f4_c1_type', calculerComparaisonF3);
    bindInput('f3-c1-target-age', 'f4_c1_target_age', calculerComparaisonF3);
    bindInput('f3-c1-start-age', 'f4_c1_start_age', calculerComparaisonF3);
    bindInput('f3-c1-versement-brut', 'f4_c1_versement', calculerComparaisonF3);
    bindInput('f3-c1-rendement', 'f4_c1_rendement', calculerComparaisonF3);
    bindInput('f3-c1-frais-entree', 'f4_c1_frais_entree', calculerComparaisonF3);
    bindInput('f3-c1-frais-courant', 'f4_c1_frais_courant', calculerComparaisonF3);

    // --- BINDINGS C2 ---
    bindInput('f3-c2-name', 'f4_c2_name', calculerComparaisonF3); 
    bindInput('f3-c2-type-epargne', 'f4_c2_type', calculerComparaisonF3);
    bindInput('f3-c2-target-age', 'f4_c2_target_age', calculerComparaisonF3);
    bindInput('f3-c2-start-age', 'f4_c2_start_age', calculerComparaisonF3); 
    bindInput('f3-c2-versement-brut', 'f4_c2_versement', calculerComparaisonF3);
    bindInput('f3-c2-rendement', 'f4_c2_rendement', calculerComparaisonF3);
    bindInput('f3-c2-frais-entree', 'f4_c2_frais_entree', calculerComparaisonF3);
    bindInput('f3-c2-frais-courant', 'f4_c2_frais_courant', calculerComparaisonF3);

    document.getElementById('f4-compare-button').addEventListener('click', calculerComparaisonF3);

    registerOnLangChange(() => {
        setupF4ScenarioUI(); 
        calculerComparaisonF3(); 
    });

    setupF4ScenarioUI(); 
    calculerComparaisonF3(); 
}
