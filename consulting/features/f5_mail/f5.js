// features/f5_mail/f5.js 

import { CURRENT_YEAR, AGE_FINALE_DEFAUT, FRAIS_DEFAUT } from '../../core/constants.js';
import { emailTemplates } from '../../core/emailTemplates.js'; 
import { translations, loadTranslations } from '../../core/i18n.js';
import { effectuerSimulation } from '../../core/simulationEngine.js'; 
import { formatMonetaire, updateElement, updateInputElement } from '../../core/utils.js';
import { getState, bindInput, bindCheckbox, updateState } from '../../core/store.js';

function calculateNonFiscal(monthlyPayment, years) {
    const P_monthly = parseFloat(monthlyPayment);
    const t = parseInt(years);
    const annualRatePct = 8.0; 
    const fraisMensuelPct = 0.03; 
    const taxeVersamentPct = 0.02; 
    const fraisGestionAnnuelPct = 0.0085; 
    const taxePlusValuePct = 0.10; 
    const franchisePlusValue = 10000; 

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
        if (month > 0 && month % 12 === 0) currentCapital -= (currentCapital * fraisGestionAnnuelPct || 0);
    }

    const capitalFinalBrut = currentCapital;
    const plusValueBrute = capitalFinalBrut - investedCapital; 
    const plusValueTaxable = Math.max(0, plusValueBrute - franchisePlusValue);
    const capitalFinalNet = capitalFinalBrut - (plusValueTaxable * taxePlusValuePct);

    return { finalCapital: capitalFinalNet, investedCapital: investedCapital };
}

export async function genererEmail() {
    try {
        const state = getState();
        const mailLang = state.f5_langue || 'fr';
        await loadTranslations(mailLang);
        
        const langDict = translations[mailLang] || translations['fr'];
        const t = (key) => langDict[key] !== undefined ? langDict[key] : (translations['fr'][key] || `[${key}]`);

        const prenom = state.f5_prenom || "Prénom";
        const nom = state.f5_nom || "Nom";
        const email = state.f5_email || ""; 
        const isTbd = state.f5_rdv_tbd;

        let formattedRdvDate = state.f5_rdv_date;
        let formattedRdvTime = state.f5_rdv_time;
        const langLocale = mailLang === 'nl' ? 'nl-BE' : (mailLang === 'en' ? 'en-GB' : 'fr-BE');

        if (!isTbd) { 
            try {
                if (state.f5_rdv_date) {
                    const dateObj = new Date(state.f5_rdv_date + 'T00:00:00'); 
                    let dateString = new Intl.DateTimeFormat(langLocale, { weekday: 'long', day: 'numeric', month: 'long' }).format(dateObj);
                    formattedRdvDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);
                }
                if (state.f5_rdv_time) {
                    const [hours, minutes] = state.f5_rdv_time.split(':');
                    formattedRdvTime = (mailLang === 'fr' || mailLang === 'nl') ? `${hours}h${minutes}` : state.f5_rdv_time;
                }
            } catch (e) {}
        }
        
        const msciRate = parseFloat(state.f5_msci_rate) || 8.53;
        const includeEP = state.f5_toggle_ep;
        const includeELT = state.f5_toggle_elt;
        const includePLCI = state.f5_toggle_plci;
        const includeINAMI = state.f5_toggle_inami;
        const includeEIP = state.f5_toggle_eip;
        const includeNonFiscal = state.f5_toggle_nonfiscal;
        const includeDela = state.f5_toggle_dela;
        const includeEnfant = state.f5_toggle_enfant; 

        // Préparation des tableaux de données
        let epDataArray = [];
        if (includeEP) {
            (state.f5_ep_data || []).forEach(sim => {
                const epParams = {
                    anneeNaissance: parseInt(sim.birthyear) || CURRENT_YEAR, versementBrutMensuel: parseFloat(sim.mensualite) || 0,
                    typeEpargne: 'pension', rendementAnnuel: 5.0,
                    fraisEntreePct: FRAIS_DEFAUT.pension.fraisEntree, fraisCourantAnnuelPct: FRAIS_DEFAUT.pension.fraisCourant,
                    targetAge: AGE_FINALE_DEFAUT
                };
                const simResult = effectuerSimulation(epParams, CURRENT_YEAR);
                simResult.targetAge = AGE_FINALE_DEFAUT; 
                epDataArray.push(simResult);
            });
        }

        let eltDataArray = [];
        if (includeELT) {
            (state.f5_elt_data || []).forEach(sim => {
                const eltParams = {
                    anneeNaissance: parseInt(sim.birthyear) || CURRENT_YEAR, versementBrutMensuel: parseFloat(sim.mensualite) || 0,
                    typeEpargne: 'long-terme', rendementAnnuel: 5.0,
                    fraisEntreePct: FRAIS_DEFAUT['long-terme'].fraisEntree, fraisCourantAnnuelPct: FRAIS_DEFAUT['long-terme'].fraisCourant,
                    targetAge: parseInt(sim.target_age) || 67
                };
                const simResult = effectuerSimulation(eltParams, CURRENT_YEAR);
                simResult.targetAge = eltParams.targetAge; 
                eltDataArray.push(simResult);
            });
        }

        let nonFiscalDataArray = [];
        if (includeNonFiscal) {
            (state.f5_nonfiscal_data || []).forEach(sim => {
                const mens = parseFloat(sim.mensualite) || 0;
                let age = CURRENT_YEAR - (parseInt(sim.birthyear) || CURRENT_YEAR);
                nonFiscalDataArray.push({
                    mensualite: mens, age: Math.max(0, age),
                    res10: calculateNonFiscal(mens, 10), res20: calculateNonFiscal(mens, 20), res30: calculateNonFiscal(mens, 30)
                });
            });
        }

        const sujet = (t('email_subject') || "Synthèse d’analyse financière : {prenom} {nom}").replace('{nom}', nom).replace('{prenom}', prenom);
        
        let html = emailTemplates.intro(t, prenom, nom, email, sujet); 
        
        if (includeEP) html += emailTemplates.ep(t, epDataArray, formatMonetaire); 
        if (includeELT) html += emailTemplates.elt(t, eltDataArray, formatMonetaire);
        if (includeEP || includeELT) html += emailTemplates.ep_elt_common(t, msciRate, formatMonetaire); 
        
        if (includePLCI) html += emailTemplates.plci(t);
        if (includeINAMI) html += emailTemplates.inami(t);
        if (includeEIP) html += emailTemplates.eip(t);
        
        if (includeNonFiscal) html += emailTemplates.nonfiscal(t, nonFiscalDataArray, formatMonetaire);
        
        if (includeEnfant) {
            (state.f5_children_data || []).forEach((child) => {
                if (child.name && child.mensualite > 0) {
                    const mensualite = parseFloat(child.mensualite) || 0;
                    const age = CURRENT_YEAR - (parseInt(child.birthyear) || CURRENT_YEAR);
                    html += emailTemplates.enfant(t, child, 
                        calculateNonFiscal(mensualite, Math.max(0, 18 - age)), 
                        calculateNonFiscal(mensualite, Math.max(0, 21 - age)), 
                        calculateNonFiscal(mensualite, Math.max(0, 25 - age)), formatMonetaire);
                }
            });
        }
        
        if (includeDela) html += emailTemplates.dela(t, state.f5_dela_data || [], formatMonetaire); 
        
        html += emailTemplates.rdv(t, formattedRdvDate, formattedRdvTime, isTbd); 
        html += `<ul style="margin-top: 10px; margin-bottom: 15px; padding-left: 20px; list-style-type: disc;"><li>${t('email_docs_base')}</li>`; 
        if (includeEIP) html += `<li>${emailTemplates.docs_eip(t)}</li>`; 
        html += `</ul>${emailTemplates.outro(t)}`; 

        const previewContainer = document.getElementById('email-preview-container');
        if (previewContainer) previewContainer.innerHTML = html;
        updateElement('email-subject-display', sujet, false);
        updateElement('email-to-display', email, false);

    } catch (e) {
        console.error("Erreur lors de la génération de l'email:", e);
    }
}

function renderDynamicInputs() {
    const state = getState();
    const t = translations[state.f5_langue || 'fr'] || translations['fr'];

    const syncArray = (count, array, defaultObj) => {
        let newArr = [...(array || [])];
        while (newArr.length < count) newArr.push({ ...defaultObj });
        return newArr.slice(0, count);
    };

    // EP
    state.f5_ep_data = syncArray(parseInt(state.f5_ep_count) || 1, state.f5_ep_data, { mensualite: 87.50, birthyear: 2000 });
    const epContainer = document.getElementById('ep-dynamic-inputs');
    if (epContainer) {
        epContainer.innerHTML = state.f5_ep_data.map((sim, idx) => `
            <div style="border-top: 1px dashed var(--border-light); padding-top: 10px; margin-top: 10px;">
                <h5 style="margin-bottom: 5px; color: var(--primary-color);">Option ${idx + 1}</h5>
                <div class="mail-inputs-grid">
                    <div><label>${t.f4_label_ep_monthly || "Mensualité"}</label><input type="number" class="dyn-input" data-type="ep" data-idx="${idx}" data-field="mensualite" value="${sim.mensualite}" step="0.01"></div>
                    <div><label>${t.f4_label_ep_birthyear || "Naissance"}</label><input type="number" class="dyn-input" data-type="ep" data-idx="${idx}" data-field="birthyear" value="${sim.birthyear}" step="1"></div>
                </div>
            </div>`).join('');
    }

    // ELT
    state.f5_elt_data = syncArray(parseInt(state.f5_elt_count) || 1, state.f5_elt_data, { mensualite: 100, birthyear: 2000, target_age: 67 });
    const eltContainer = document.getElementById('elt-dynamic-inputs');
    if (eltContainer) {
        eltContainer.innerHTML = state.f5_elt_data.map((sim, idx) => `
            <div style="border-top: 1px dashed var(--border-light); padding-top: 10px; margin-top: 10px;">
                <h5 style="margin-bottom: 5px; color: var(--primary-color);">Option ${idx + 1}</h5>
                <div class="mail-inputs-grid">
                    <div><label>${t.f4_label_elt_monthly || "Mensualité"}</label><input type="number" class="dyn-input" data-type="elt" data-idx="${idx}" data-field="mensualite" value="${sim.mensualite}" step="0.01"></div>
                    <div><label>${t.f4_label_elt_birthyear || "Naissance"}</label><input type="number" class="dyn-input" data-type="elt" data-idx="${idx}" data-field="birthyear" value="${sim.birthyear}" step="1"></div>
                    <div style="grid-column: 1/-1"><label>Âge terme</label><input type="number" class="dyn-input" data-type="elt" data-idx="${idx}" data-field="target_age" value="${sim.target_age}" step="1"></div>
                </div>
            </div>`).join('');
    }

    // Non-Fiscal
    state.f5_nonfiscal_data = syncArray(parseInt(state.f5_nonfiscal_count) || 1, state.f5_nonfiscal_data, { mensualite: 100, birthyear: 2000 });
    const nfContainer = document.getElementById('nonfiscal-dynamic-inputs');
    if (nfContainer) {
        nfContainer.innerHTML = state.f5_nonfiscal_data.map((sim, idx) => `
            <div style="border-top: 1px dashed var(--border-light); padding-top: 10px; margin-top: 10px;">
                <h5 style="margin-bottom: 5px; color: var(--primary-color);">Option ${idx + 1}</h5>
                <div class="mail-inputs-grid">
                    <div><label>${t.f4_label_nonfiscal_monthly || "Mensualité"}</label><input type="number" class="dyn-input" data-type="nf" data-idx="${idx}" data-field="mensualite" value="${sim.mensualite}" step="10"></div>
                    <div><label>${t.f4_label_nonfiscal_birthyear || "Naissance"}</label><input type="number" class="dyn-input" data-type="nf" data-idx="${idx}" data-field="birthyear" value="${sim.birthyear}" step="1"></div>
                </div>
            </div>`).join('');
    }

    // Dela
    state.f5_dela_data = syncArray(parseInt(state.f5_dela_count) || 1, state.f5_dela_data, { capital: 10000, prime: 25 });
    const delaContainer = document.getElementById('dela-dynamic-inputs');
    if (delaContainer) {
        delaContainer.innerHTML = state.f5_dela_data.map((sim, idx) => `
            <div style="border-top: 1px dashed var(--border-light); padding-top: 10px; margin-top: 10px;">
                <h5 style="margin-bottom: 5px; color: var(--primary-color);">Option ${idx + 1}</h5>
                <div class="mail-inputs-grid">
                    <div><label>${t.f4_label_dela_capital || "Capital"}</label><input type="number" class="dyn-input" data-type="dela" data-idx="${idx}" data-field="capital" value="${sim.capital}" step="500"></div>
                    <div><label>${t.f4_label_dela_prime || "Prime"}</label><input type="number" class="dyn-input" data-type="dela" data-idx="${idx}" data-field="prime" value="${sim.prime}" step="0.01"></div>
                </div>
            </div>`).join('');
    }

    // Enfants
    state.f5_children_data = syncArray(parseInt(state.f5_children_count) || 0, state.f5_children_data, { name: "Enfant", mensualite: 100, birthyear: 2010 });
    const childrenContainer = document.getElementById('children-options-container');
    if (childrenContainer) {
        childrenContainer.innerHTML = state.f5_children_data.map((sim, idx) => `
            <div style="border-top: 1px dashed var(--border-light); padding-top: 10px; margin-top: 10px;">
                <h5 style="margin-bottom: 5px; color: var(--primary-color);">${t.f4_child_name_label || "Enfant"} ${idx + 1}</h5>
                <div class="mail-inputs-grid">
                    <div><label>Nom</label><input type="text" class="dyn-input" data-type="enfant" data-idx="${idx}" data-field="name" value="${(sim.name||'').replace(/"/g, '&quot;')}"></div>
                    <div><label>Mensualité</label><input type="number" class="dyn-input" data-type="enfant" data-idx="${idx}" data-field="mensualite" value="${sim.mensualite}"></div>
                    <div><label>Naissance</label><input type="number" class="dyn-input" data-type="enfant" data-idx="${idx}" data-field="birthyear" value="${sim.birthyear}"></div>
                </div>
            </div>`).join('');
    }

    updateState('f5_ep_data', state.f5_ep_data);
    updateState('f5_elt_data', state.f5_elt_data);
    updateState('f5_nonfiscal_data', state.f5_nonfiscal_data);
    updateState('f5_dela_data', state.f5_dela_data);
    updateState('f5_children_data', state.f5_children_data);
    
    genererEmail();
}

function handleDynamicInput(e) {
    if (e.target.classList.contains('dyn-input')) {
        const type = e.target.dataset.type;
        const idx = e.target.dataset.idx;
        const field = e.target.dataset.field;
        
        let stateKey;
        if (type === 'ep') stateKey = 'f5_ep_data';
        if (type === 'elt') stateKey = 'f5_elt_data';
        if (type === 'nf') stateKey = 'f5_nonfiscal_data';
        if (type === 'dela') stateKey = 'f5_dela_data';
        if (type === 'enfant') stateKey = 'f5_children_data';

        if (stateKey) {
            const state = getState();
            let val = e.target.value;
            if (e.target.type === 'number') {
                val = parseFloat(val);
                if (isNaN(val)) val = 0;
            }
            
            state[stateKey][idx][field] = val;
            updateState(stateKey, state[stateKey]);
            genererEmail();
        }
    }
}

function toggleRdvInputs() {
    const isTbd = getState().f5_rdv_tbd;
    const displayValue = isTbd ? 'none' : 'block';
    ['mail-rdv-date', 'mail-rdv-time'].forEach(id => {
        const el = document.getElementById(id);
        const lbl = document.querySelector(`label[for="${id}"]`);
        if (el) el.style.display = displayValue;
        if (lbl) lbl.style.display = displayValue;
    });
    genererEmail(); 
}

export function initF5() {
    bindInput('mail-client-prenom', 'f5_prenom', genererEmail);
    bindInput('mail-client-nom', 'f5_nom', genererEmail);
    bindInput('mail-client-email', 'f5_email', genererEmail); 
    bindInput('mail-rdv-date', 'f5_rdv_date', genererEmail);
    bindInput('mail-rdv-time', 'f5_rdv_time', genererEmail);
    bindCheckbox('mail-rdv-tbd', 'f5_rdv_tbd', toggleRdvInputs); 
    bindInput('mail-langue', 'f5_langue', renderDynamicInputs);
    bindInput('mail-common-msci-rate', 'f5_msci_rate', genererEmail);

    ['ep', 'elt', 'plci', 'inami', 'eip', 'nonfiscal', 'dela', 'enfant'].forEach(type => {
        bindCheckbox(`toggle-${type}`, `f5_toggle_${type}`, genererEmail);
        const toggle = document.getElementById(`toggle-${type}`);
        const container = document.getElementById(`${type === 'enfant' ? 'children-main' : type + '-options'}-container`);
        if (toggle && container) {
            const action = () => { container.style.display = toggle.checked ? 'block' : 'none'; };
            toggle.addEventListener('change', action); action();
        }
    });

    ['ep', 'elt', 'nonfiscal', 'dela', 'children'].forEach(type => {
        bindInput(`mail-${type}-count`, `f5_${type}_count`, renderDynamicInputs);
    });

    // CIBLAGE CORRIGÉ ICI : L'écouteur s'applique bien sur #f4 pour attraper les modifs des simulations
    const f4Section = document.getElementById('f4');
    if (f4Section) {
        f4Section.addEventListener('input', handleDynamicInput);
    }

    document.getElementById('f5-generate-button').addEventListener('click', () => {
        genererEmail(); 
        const previewCard = document.getElementById('f5-results-card');
        if (previewCard) previewCard.style.display = 'block';
    });
    
    toggleRdvInputs();
    renderDynamicInputs(); 
}
