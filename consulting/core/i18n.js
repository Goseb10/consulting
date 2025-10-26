// core/i18n.js

// 1. OBJET DE TRADUCTION COMPLET
export const translations = {
    fr: {
        meta_title: "Goga Sebastian - Simulateur d'Épargne & Inflation",
        nav_f1: "Pension / LT", nav_nonfiscal: "Non-Fiscal", nav_f2: "Inflation", nav_f3: "Comparateur", nav_mail: "Mail",
        f1_title: "Épargne Pension / Long Terme", h3_params: "Paramètres", h4_contract: "Données", label_type: "Type d'Épargne",
        opt_pension: "Épargne Pension", opt_lt: "Épargne Long Terme",
        label_extend_lt: "Prolonger jusqu'à 80 ans",
        label_birth_year: "Année de Naissance (Cible 67 ans)",
        label_birth_year_80: "Année de Naissance (Cible 80 ans)",
        span_duration: "Durée totale : ",
        span_years: "années (jusqu'à 67 ans)",
        span_years_80: "années (jusqu'à 80 ans)",
        h4_flux: "Flux", label_monthly_gross: "Versement Brut Mensuel (€)", label_yield: "Rendement Annuel Estimé (%)",
        h4_fees: "Frais Appliqués", label_entry_fees: "Frais d'Entrée (%)", label_running_fees: "Frais de gestion (%)",
        btn_calculate: "Calculer la Projection", h3_summary: "Projection de l'épargne",
        label_elt_tax: "Taxe sur ELT",
        label_ep_tax: "Taxe sur EP",
        h4_monthly_detail: "Détail Mensuel et Déductibilité", span_gross_monthly: "Versement Brut par mois", span_deductibility_monthly: "Déductibilité / Avantage Fiscal", span_net_cost_monthly: "Coût Net Réel (Déduction faite)",
        h4_annual_detail: "Détail Annuel et Déductibilité", span_gross_annual: "Versement Brut Annuel", span_deductibility_annual: "Avantage Fiscal Annuel", span_net_cost_annual: "Coût Net Annuel (Déduction faite)",
        h4_total_results: "Résultats Totaux sur la Durée", span_gross_total: "Versement Brut Total", span_deductibility_total: "Avantage Fiscal Total", span_net_total: "Capital Net Placé Total (votre effort)",
        h4_final_projection: "Projection Finale (Âge 67 ans)", 
        span_tax_levied: "Taxe Libératoire Prélevée (à {age} ans)", // MODIFIÉ
        span_final_net_capital: "CAPITAL FINAL NET (Total perçu à 67 ans)",
        h4_final_projection_80: "Projection Finale (Âge 80 ans)",
        span_final_net_capital_80: "CAPITAL FINAL NET (Total perçu à 80 ans)",
        p_capital_delayed: "Capital Final (Démarrage 1 an plus tard)",
        p_loss_estimated: "Perte potentielle de gain",
        h4_capital_evolution: "Évolution du Capital Net après Frais",
        chart_evolution: "Évolution du Capital (Net de Taxe après {age} ans)", // MODIFIÉ
        chart_avant_taxe: "Capital AVANT Prélèvement ({age} ans)", // MODIFIÉ
        chart_apres_taxe: "Capital APRÈS Prélèvement ({age} ans)", // MODIFIÉ
        chart_final_net: "Capital Final NET (67 ans)",
        chart_final_net_80: "Capital Final NET (80 ans)",
        chart_retard: "Capital Final (Retard 1 an)",
        chart_y_label: "Montant (€)", chart_x_label: "Âge (ans)", no_data: "Aucune donnée à afficher",
        h4_external_links_f1: "Exemples de produits :",
        link_ep_example: "Europe Equity (EP)",
        link_elt_example: "R-co Valor (ELT)",
        f2_title: "Épargne non déductible (Intérêts Composés)",
        h3_params_f2: "Paramètres de Simulation",
        h4_amounts_f2: "Montants",
        label_initial: "Montant initial (€)",
        label_monthly: "Versement mensuel (€)",
        h3_projection_f2: "Projection",
        label_yield_f2: "Rendement annuel estimé (%)",
        label_duration_f2: "Durée de l'investissement (années)",
        btn_calculate_f2: "Calculer",
        h3_summary_f2: "Résultats de la simulation",
        span_total_invested: "Total versé (votre effort)",
        span_total_interest: "Intérêts gagnés (Nets)", // Modifié
        span_final_capital_f2: "CAPITAL FINAL TOTAL",
        h4_repartition: "Répartition du capital final",
        h4_evolution_f2: "Évolution du capital", chart_x_label_f2: "Années", // Correction clé ici
        chart_invested: "Total Versé",
        chart_interest: "Intérêts Gagnés",
        h4_external_links: "Exemples de supports (ETF) :",
        link_blackrock: "iShares MSCI World SRI",
        link_msci: "Fiche d'info MSCI",
        // NOUVELLES CLÉS F2 (Non-Fiscal)
        h4_fees_f2: "Frais et Taxes Appliqués",
        label_fees_monthly_f2: "Frais sur versement",
        label_tax_monthly_f2: "Taxe sur versement",
        label_tax_gains_f2: "Taxe sur plus-value (> 10k)",
        span_total_invested_brut: "Total versé (Brut / votre effort)",
        span_total_invested_net: "Capital Net Placé",
        span_total_tax_gains: "Taxe sur Plus-Value (10%)",
        span_final_capital_net_f2: "CAPITAL FINAL NET",
        // FIN NOUVELLES CLÉS F2
        f3_title: "Calculateur d'Inflation",
        h3_params_f3: "Paramètres",
        label_amount_f3: "Montant actuel (€)",
        label_duration_f3: "Nombre d'années",
        label_rate_f3: "Taux d'inflation annuel (%)",
        btn_calculate_f3: "Calculer l'impact",
        h3_results_f3: "Impact de l'inflation",
        span_future_needed: "Montant nécessaire dans ",
        span_future_value: "Valeur future de votre montant actuel",
        span_value_loss: "Perte de pouvoir d'achat",
        p_summary_f3: "Avec un taux d'inflation annuel de {rate}%, vos {currentAmount} € d'aujourd'hui n'auront plus qu'un pouvoir d'achat équivalent à {futureValue} € dans {years} ans. Pour acheter la même chose qu'aujourd'hui avec {currentAmount} €, il vous faudra {futureNeeded} €.",
        h4_devaluation_f3: "Évolution du pouvoir d'achat",
        chart_devaluation_label: "Pouvoir d'achat (€)",
        chart_x_label_f3: "Années",
        f3_title_comparator: "Comparateur de Contrats (EP/ELT)",
        h3_company_1: "Compagnie 1",
        h3_company_2: "Compagnie 2",
        label_company_name: "Nom de la compagnie",
        label_start_age_f4: "Âge de début (Cible 67 ans)", // NOUVEAU
        label_start_age_80_f4: "Âge de début (Cible 80 ans)", // NOUVEAU
        btn_compare: "Comparer les Projections",
        h4_f3_results: "Résultats de la Projection",
        span_f3_duration: "Durée : ",
        span_f3_duration_total: "Durée totale de versement",
        span_f3_gross_total: "Investissement Brut Total",
        span_f3_deduction_total: "Avantage Fiscal Total",
        span_f3_net_total: "Investissement Net Total",
        span_f3_tax: "Taxe Libératoire (à {age} ans)", // MODIFIÉ
        span_f3_final_capital: "CAPITAL FINAL NET (67 ans)",
        h3_difference: "Différence",
        span_difference_label: "Différence de Capital Final (C1 - C2)",
        f4_title: "Générateur de Mail de Synthèse",
        f4_client_info: "Informations Client",
        f4_label_firstname: "Prénom",
        f4_label_lastname: "Nom",
        f4_label_email: "Email",
        f4_label_birthyear: "Année de naissance (Client)",
        f4_label_birthyear_no_client: "Année de naissance",
        f4_label_rdv_date: "Date prochain RDV",
        f4_label_rdv_time: "Heure prochain RDV",
        f4_common_options_title: "Options Communes",
        f4_label_common_msci_rate: "Taux MSCI World (%)",
        f4_ep_options_title: "Options Épargne Pension",
        f4_label_ep_monthly: "Mensualité (€)",
        f4_label_ep_birthyear: "Année de naissance",
        // NOUVELLES CLES ELT
        f4_elt_options_title: "Options Épargne Long Terme",
        f4_label_elt_monthly: "Mensualité (€)",
        f4_label_elt_birthyear: "Année de naissance",
        f4_label_elt_extend_80: "Prolonger jusqu'à 80 ans",
        // FIN NOUVELLES CLES ELT
        f4_dela_options_title: "Options Dela", // Ajouté
        f4_label_dela_capital: "Capital Assuré (€)", // Ajouté
        f4_label_dela_prime: "Prime Mensuelle (€)", // Ajouté
        f4_nonfiscal_options_title: "Options Épargne Non-Fiscale", // Ajouté
        f4_label_nonfiscal_monthly: "Mensualité (€)", // Ajouté
        f4_label_nonfiscal_birthyear: "Année de naissance", // Ajouté
        f4_sections: "Sections à inclure",
        f4_toggle_ep: "Épargne Pension",
        f4_toggle_elt: "Épargne Long Terme",
        f4_toggle_plci: "PLCI",
        f4_toggle_inami: "Plan INAMI",
        f4_toggle_eip: "EIP",
        f4_toggle_nonfiscal: "Épargne non fiscal",
        f4_toggle_dela: "Couverture Dela",
        f4_btn_generate: "Actualiser l'aperçu",
        f4_preview_title: "Aperçu de l'email",
        f4_btn_copy: "Copier l'email",
        f4_feedback_copied: "Copié !",
        email_subject: "Synthèse d’analyse financière : {prenom} {nom}", // AJOUTÉ
    },
     nl: {
        meta_title: "Goga Sebastian - Spaar- & Inflatie Simulator",
        nav_f1: "Pensioen / LT", nav_nonfiscal: "Niet-Fiscaal", nav_f2: "Inflatie", nav_f3: "Vergelijker", nav_mail: "E-mail",
        f1_title: "Pensioensparen / Lange Termijn Sparen", h3_params: "Parameters", h4_contract: "Gegevens", label_type: "Type Sparen",
        opt_pension: "Pensioensparen", opt_lt: "Lange Termijn Sparen",
        label_extend_lt: "Verlengen tot 80 jaar",
        label_birth_year: "Geboortejaar (Doel 67 jaar)", label_birth_year_80: "Geboortejaar (Doel 80 jaar)",
        span_duration: "Totale duur : ", span_years: "jaren (tot 67 jaar)", span_years_80: "jaren (tot 80 jaar)",
        h4_flux: "Stroom", label_monthly_gross: "Bruto Maandelijkse Storting (€)", label_yield: "Geschat Jaarlijks Rendement (%)",
        h4_fees: "Toegepaste Kosten", label_entry_fees: "Instapkosten (%)", label_running_fees: "Beheerskosten (%)",
        btn_calculate: "Projectie Berekenen", h3_summary: "Projectie van het Sparen",
        label_elt_tax: "Taks op LT",
        label_ep_tax: "Taks op PS",
        h4_monthly_detail: "Maandelijkse Details & Aftrekbaarheid", span_gross_monthly: "Bruto Storting per maand", span_deductibility_monthly: "Aftrekbaarheid / Fiscaal Voordeel", span_net_cost_monthly: "Reële Netto Kost (na aftrek)",
        h4_annual_detail: "Jaarlijkse Details & Fiscaliteit", span_gross_annual: "Bruto Jaarlijkse Storting", span_deductibility_annual: "Jaarlijks Fiscaal Voordeel", span_net_cost_annual: "Jaarlijkse Netto Kost (na aftrek)",
        h4_total_results: "Totale Resultaten over de Looptijd", span_gross_total: "Totale Bruto Storting", span_deductibility_total: "Totaal Fiscaal Voordeel", span_net_total: "Totaal Netto Geïnvesteerd Kapitaal",
        h4_final_projection: "Eindprojectie (Leeftijd 67)", 
        span_tax_levied: "Bevrijdende Belasting (op {age} jaar)", // MODIFIÉ
        span_final_net_capital: "FINAAL NETTO KAPITAAL (Totaal ontvangen op 67)",
        h4_final_projection_80: "Eindprojectie (Leeftijd 80)", span_final_net_capital_80: "FINAAL NETTO KAPITAAL (Totaal ontvangen op 80)",
        p_capital_delayed: "Definitief Kapitaal (1 jaar later starten)", p_loss_estimated: "Geschat verlies aan winst",
        h4_capital_evolution: "Evolutie van Netto Kapitaal na Kosten",
        chart_evolution: "Kapitaalevolutie (Netto na belasting op {age})", // MODIFIÉ
        chart_avant_taxe: "Kapitaal VOOR Belasting ({age}j)", // MODIFIÉ
        chart_apres_taxe: "Kapitaal NA Belasting ({age}j)", // MODIFIÉ
        chart_final_net: "Finaal Netto Kapitaal (67j)", chart_final_net_80: "Finaal Netto Kapitaal (80j)",
        chart_retard: "Finaal Kapitaal (Vertraging 1j)",
        chart_y_label: "Bedrag (€)", chart_x_label: "Leeftijd (jaar)", no_data: "Geen gegevens om weer te geven",
        h4_external_links_f1: "Productvoorbeelden :", link_ep_example: "Europe Equity (PS)", link_elt_example: "R-co Valor (LT)",
        f2_title: "Niet-fiscaal Sparen (Samengestelde Interest)", h3_params_f2: "Simulatieparameters", h4_amounts_f2: "Bedragen",
        label_initial: "Startbedrag (€)", label_monthly: "Maandelijkse storting (€)", h3_projection_f2: "Projectie",
        label_yield_f2: "Geschat jaarlijks rendement (%)", label_duration_f2: "Investeringsduur (jaren)",
        btn_calculate_f2: "Berekenen", h3_summary_f2: "Simulatieresultaten",
        span_total_invested: "Totaal ingelegd (uw inspanning)", span_total_interest: "Verdiende rente (Netto)", span_final_capital_f2: "TOTAAL EIND KAPITAAL",
        h4_repartition: "Verdeling eindkapitaal", h4_evolution_f2: "Kapitaalevolutie", chart_x_label_f2: "Jaren",
        chart_invested: "Totaal InGezet", chart_interest: "Verdiende Rente",
        h4_external_links: "Voorbeelden van fondsen (ETF) :", link_blackrock: "iShares MSCI World SRI", link_msci: "MSCI Factsheet",
        // NOUVELLES CLÉS F2 (Non-Fiscal)
        h4_fees_f2: "Toegepaste Kosten en Taksen",
        label_fees_monthly_f2: "Kosten op storting",
        label_tax_monthly_f2: "Taks op storting",
        label_tax_gains_f2: "Taks op meerwaarde (> 10k)",
        span_total_invested_brut: "Totaal ingelegd (Bruto / uw inspanning)",
        span_total_invested_net: "Netto Geïnvesteerd Kapitaal",
        span_total_tax_gains: "Taks op Meerwaarde (10%)",
        span_final_capital_net_f2: "FINAAL NETTO KAPITAAL",
        // FIN NOUVELLES CLÉS F2
        f3_title: "Inflatie Calculator", h3_params_f3: "Parameters",
        label_amount_f3: "Huidig bedrag (€)", label_duration_f3: "Aantal jaren", label_rate_f3: "Jaarlijkse inflatie (%)",
        btn_calculate_f3: "Impact Berekenen", h3_results_f3: "Impact van Inflatie",
        span_future_needed: "Benodigd bedrag over ",
        span_future_value: "Toekomstige waarde van uw huidig bedrag", span_value_loss: "Verlies aan koopkracht",
        p_summary_f3: "Met een jaarlijkse inflatie van {rate}%, zal uw {currentAmount} € van vandaag over {years} jaar nog slechts een koopkracht hebben van {futureValue} €. Om hetzelfde te kopen als vandaag met {currentAmount} €, heeft u {futureNeeded} € nodig.",
        h4_devaluation_f3: "Evolutie van de koopkracht", chart_devaluation_label: "Koopkracht (€)", chart_x_label_f3: "Jaren",
        f3_title_comparator: "Contractvergelijker (PS/LT)",
        h3_company_1: "Maatschappij 1",
        h3_company_2: "Maatschappij 2",
        label_company_name: "Naam maatschappij",
        label_start_age_f4: "Startleeftijd (Doel 67 jaar)", // NOUVEAU
        label_start_age_80_f4: "Startleeftijd (Doel 80 jaar)", // NOUVEAU
        btn_compare: "Projecties Vergelijken",
        h4_f3_results: "Projectieresultaten",
        span_f3_duration: "Looptijd: ",
        span_f3_duration_total: "Totale stortingsduur",
        span_f3_gross_total: "Totale Bruto Investering",
        span_f3_deduction_total: "Totaal Fiscaal Voordeel",
        span_f3_net_total: "Totale Netto Investering",
        span_f3_tax: "Bevrijdende Belasting (op {age}j)", // MODIFIÉ
        span_f3_final_capital: "FINAAL NETTO KAPITAAL (67j)",
        h3_difference: "Verschil",
        span_difference_label: "Verschil Eindkapitaal (M1 - M2)",
        f4_title: "E-mail Synthese Generator",
        f4_client_info: "Klantgegevens",
        f4_label_firstname: "Voornaam",
        f4_label_lastname: "Achternaam",
        f4_label_email: "E-mail",
        f4_label_birthyear: "Geboortejaar (Klant)",
        f4_label_birthyear_no_client: "Geboortejaar",
        f4_label_rdv_date: "Datum volgende afspraak",
        f4_label_rdv_time: "Uur volgende afspraak",
        f4_common_options_title: "Gemeenschappelijke Opties",
        f4_label_common_msci_rate: "MSCI World Tarief (%)",
        f4_ep_options_title: "Opties Pensioensparen",
        f4_label_ep_monthly: "Maandelijkse betaling (€)",
        f4_label_ep_birthyear: "Geboortejaar",
        // NOUVELLES CLES ELT
        f4_elt_options_title: "Opties Lange Termijn Sparen",
        f4_label_elt_monthly: "Maandelijkse betaling (€)",
        f4_label_elt_birthyear: "Geboortejaar",
        f4_label_elt_extend_80: "Verlengen tot 80 jaar",
        // FIN NOUVELLES CLES ELT
        f4_dela_options_title: "Opties Dela", // Ajouté
        f4_label_dela_capital: "Verzekerd Kapitaal (€)", // Ajouté
        f4_label_dela_prime: "Maandelijkse Premie (€)", // Ajouté
        f4_nonfiscal_options_title: "Opties Niet-Fiscaal Sparen", // Ajouté
        f4_label_nonfiscal_monthly: "Maandelijkse betaling (€)", // Ajouté
        f4_label_nonfiscal_birthyear: "Geboortejaar", // Ajouté
        f4_sections: "Op te nemen secties",
        f4_toggle_ep: "Pensioensparen",
        f4_toggle_elt: "Langetermijnsparen",
        f4_toggle_plci: "VAPZ",
        f4_toggle_inami: "RIZIV-plan",
        f4_toggle_eip: "IPT",
        f4_toggle_nonfiscal: "Niet-fiscaal sparen",
        f4_toggle_dela: "Dela Dekking",
        f4_btn_generate: "Voorbeeld bijwerken",
        f4_preview_title: "E-mail voorbeeld",
        f4_btn_copy: "Kopieer e-mail",
        f4_feedback_copied: "Gekopieerd!",
        email_subject: "Synthese financiële analyse: {prenom} {nom}", // AJOUTÉ
    },
    en: {
        meta_title: "Goga Sebastian - Savings & Inflation Simulator",
        nav_f1: "Pension / LT", nav_nonfiscal: "Non-Fiscal", nav_f2: "Inflation", nav_f3: "Comparator", nav_mail: "Email",
        f1_title: "Pension / Long Term Savings", h3_params: "Parameters", h4_contract: "Data", label_type: "Type of Saving",
        opt_pension: "Pension Savings", opt_lt: "Long Term Savings",
        label_extend_lt: "Extend to age 80",
        label_birth_year: "Year of Birth (Target 67 years)", label_birth_year_80: "Year of Birth (Target 80 years)",
        span_duration: "Total Duration: ", span_years: "years (until age 67)", span_years_80: "years (until age 80)",
        h4_flux: "Flow", label_monthly_gross: "Gross Monthly Contribution (€)", label_yield: "Estimated Annual Yield (%)",
        h4_fees: "Applied Fees", label_entry_fees: "Entry Fees (%)", label_running_fees: "Management Fees (%)",
        btn_calculate: "Calculate Projection", h3_summary: "Savings Projection",
        label_elt_tax: "Tax on LT",
        label_ep_tax: "Tax on PS",
        h4_monthly_detail: "Monthly Detail & Deductibility", span_gross_monthly: "Gross Monthly Contribution", span_deductibility_monthly: "Deductibility / Tax Advantage", span_net_cost_monthly: "Real Net Cost (Deduction made)",
        h4_annual_detail: "Annual Detail & Taxation", span_gross_annual: "Gross Annual Contribution", span_deductibility_annual: "Annual Tax Advantage", span_net_cost_annual: "Annual Net Cost (Deduction made)",
        h4_total_results: "Total Results Over Duration", span_gross_total: "Total Gross Contribution", span_deductibility_total: "Total Tax Advantage", span_net_total: "Total Net Capital Invested (your effort)",
        h4_final_projection: "Final Projection (Age 67)", 
        span_tax_levied: "Final Tax Levied (at age {age})", // MODIFIÉ
        span_final_net_capital: "FINAL NET CAPITAL (Total received at 67)",
        h4_final_projection_80: "Final Projection (Age 80)", span_final_net_capital_80: "FINAL NET CAPITAL (Total received at 80)",
        p_capital_delayed: "Final Capital (Starting 1 Year Later)", p_loss_estimated: "Estimated Potential Loss",
        h4_capital_evolution: "Evolution of Net Capital after Fees",
        chart_evolution: "Capital Evolution (Net of Tax after {age})", // MODIFIÉ
        chart_avant_taxe: "Capital BEFORE Levy (age {age})", // MODIFIÉ
        chart_apres_taxe: "Capital AFTER Levy (age {age})", // MODIFIÉ
        chart_final_net: "FINAL NET Capital (age 67)", chart_final_net_80: "FINAL NET Capital (age 80)",
        chart_retard: "Final Capital (1 Year Delay)",
        chart_y_label: "Amount (€)", chart_x_label: "Age (yrs)", no_data: "No data to display",
        h4_external_links_f1: "Product Examples:", link_ep_example: "Europe Equity (PS)", link_elt_example: "R-co Valor (LT)",
        f2_title: "Non-Deductible Savings (Compound Interest)", h3_params_f2: "Simulation Parameters", h4_amounts_f2: "Amounts",
        label_initial: "Initial amount (€)", label_monthly: "Monthly contribution (€)", h3_projection_f2: "Projection",
        label_yield_f2: "Estimated annual yield (%)", label_duration_f2: "Investment duration (years)",
        btn_calculate_f2: "Calculate", h3_summary_f2: "Simulation Results",
        span_total_invested: "Total invested (your effort)", span_total_interest: "Interest earned (Net)", span_final_capital_f2: "TOTAL FINAL CAPITAL",
        h4_repartition: "Final Capital Repartition", h4_evolution_f2: "Capital Evolution", chart_x_label_f2: "Years",
        chart_invested: "Total Invested", chart_interest: "Interest Earned",
        h4_external_links: "Example Investments (ETF) :", link_blackrock: "iShares MSCI World SRI", link_msci: "MSCI Factsheet",
        // NOUVELLES CLÉS F2 (Non-Fiscal)
        h4_fees_f2: "Applied Fees and Taxes",
        label_fees_monthly_f2: "Fees on contribution",
        label_tax_monthly_f2: "Tax on contribution",
        label_tax_gains_f2: "Tax on capital gains (> 10k)",
        span_total_invested_brut: "Total invested (Gross / your effort)",
        span_total_invested_net: "Net Capital Invested",
        span_total_tax_gains: "Tax on Capital Gains (10%)",
        span_final_capital_net_f2: "FINAL NET CAPITAL",
        // FIN NOUVELLES CLÉS F2
        f3_title: "Inflation Calculator", h3_params_f3: "Parameters",
        label_amount_f3: "Current amount (€)", label_duration_f3: "Number of years", label_rate_f3: "Annual inflation rate (%)",
        btn_calculate_f3: "Calculate Impact", h3_results_f3: "Impact of Inflation",
        span_future_needed: "Amount needed in ",
        span_future_value: "Future value of your current amount", span_value_loss: "Loss of purchasing power",
        p_summary_f3: "With an annual inflation rate of {rate}%, your {currentAmount} € today will only have a purchasing power equivalent to {futureValue} € in {years} years. To buy the same thing as today with {currentAmount} €, you will need {futureNeeded} €.",
        h4_devaluation_f3: "Purchasing Power Evolution", chart_devaluation_label: "Purchasing Power (€)", chart_x_label_f3: "Years",
        f3_title_comparator: "Contract Comparator (PS/LT)",
        h3_company_1: "Company 1",
        h3_company_2: "Company 2",
        label_company_name: "Company name",
        label_start_age_f4: "Start Age (Target 67 years)", // NOUVEAU
        label_start_age_80_f4: "Start Age (Target 80 years)", // NOUVEAU
        btn_compare: "Compare Projections",
        h4_f3_results: "Projection Results",
        span_f3_duration: "Duration: ",
        span_f3_duration_total: "Total contribution duration",
        span_f3_gross_total: "Total Gross Investment",
        span_f3_deduction_total: "Total Tax Advantage",
        span_f3_net_total: "Total Net Investment",
        span_f3_tax: "Final Tax (at age {age})", // MODIFIÉ
        span_f3_final_capital: "FINAL NET CAPITAL (age 67)",
        h3_difference: "Difference",
        span_difference_label: "Final Capital Difference (C1 - C2)",
        f4_title: "Synthesis Email Generator",
        f4_client_info: "Client Information",
        f4_label_firstname: "First Name",
        f4_label_lastname: "Last Name",
        f4_label_email: "Email",
        f4_label_birthyear: "Birth Year (Client)",
        f4_label_birthyear_no_client: "Birth Year",
        f4_label_rdv_date: "Next appointment date",
        f4_label_rdv_time: "Next appointment time",
        f4_common_options_title: "Common Options",
        f4_label_common_msci_rate: "MSCI World Rate (%)",
        f4_ep_options_title: "Pension Savings Options",
        f4_label_ep_monthly: "Monthly Payment (€)",
        f4_label_ep_birthyear: "Birth Year",
        // NOUVELLES CLES ELT
        f4_elt_options_title: "Long Term Savings Options",
        f4_label_elt_monthly: "Monthly Payment (€)",
        f4_label_elt_birthyear: "Birth Year",
        f4_label_elt_extend_80: "Extend to age 80",
        // FIN NOUVELLES CLES ELT
        f4_dela_options_title: "Dela Options", // Added
        f4_label_dela_capital: "Insured Capital (€)", // Added
        f4_label_dela_prime: "Monthly Premium (€)", // Added
        f4_nonfiscal_options_title: "Non-Fiscal Savings Options", // Added
        f4_label_nonfiscal_monthly: "Monthly Payment (€)", // Added
        f4_label_nonfiscal_birthyear: "Birth Year", // Added
        f4_sections: "Sections to include",
        f4_toggle_ep: "Pension Savings",
        f4_toggle_elt: "Long-Term Savings",
        f4_toggle_plci: "PLCI",
        f4_toggle_inami: "INAMI Plan",
        f4_toggle_eip: "EIP",
        f4_toggle_nonfiscal: "Non-fiscal savings",
        f4_toggle_dela: "Dela Cover",
        f4_btn_generate: "Update preview",
        f4_preview_title: "Email Preview",
        f4_btn_copy: "Copy Email",
        f4_feedback_copied: "Copied!",
        email_subject: "Financial Analysis Summary: {prenom} {nom}", // AJOUTÉ
    }
};

// 2. LOGIQUE DE TRADUCTION (Adaptée pour les labels dynamiques F4)
export let currentLang = 'fr'; // Langue par défaut
export const onLangChangeCallbacks = []; // Fonctions à appeler lors du changement de langue
/**
 * Enregistre une fonction à appeler après un changement de langue.
 * @param {function} callback
 */
export function registerOnLangChange(callback) {
    onLangChangeCallbacks.push(callback);
}

/**
 * Applique les traductions statiques au DOM
 */
export function applyTranslations() {
    const t = translations[currentLang];
    if (!t) { console.error("Traductions non trouvées pour:", currentLang); return; }

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');

        // Exclure les textes gérés dynamiquement par les fonctions de calcul (inflation summary)
        if (key === 'p_summary_f3') return;
        
        // Exclure les labels de taxe qui seront gérés par les calculateurs
        if (key === 'span_tax_levied' || key === 'span_f3_tax') return;
        // Exclure les labels de graphiques qui seront gérés par les calculateurs
        if (['chart_evolution', 'chart_avant_taxe', 'chart_apres_taxe'].includes(key)) return;
        // Exclure les labels d'âge de début F4 qui seront gérés par le calculateur
        if (['label_start_age_f4', 'label_start_age_80_f4'].includes(key)) return;
        
        // MODIFICATION : Exclure les clés F2 (non-fiscal) qui sont maintenant dynamiques
        if (key === 'span_total_invested' || key === 'span_final_capital_f2') {
             // Ces clés sont obsolètes, on les remplace par les nouvelles clés
             if (key === 'span_total_invested' && t['span_total_invested_brut']) {
                 el.textContent = t['span_total_invested_brut'];
             }
             if (key === 'span_final_capital_f2' && t['span_final_capital_net_f2']) {
                 el.textContent = t['span_final_capital_net_f2'];
             }
             return; 
        }


        const isDynamicLabelF1 = ['label_birth_year', 'span_years'].includes(key);
        // MODIFIÉ: S'assurer que le label dynamique de F1 n'écrase pas le nouveau label F4
        if (isDynamicLabelF1 && el.getAttribute('for') === 'annee-naissance' && document.getElementById('type-epargne')?.value === 'long-terme') return; // Vérifier le 'for' pour cibler le bon label
        if (key === 'f4_label_birthyear_no_client' && el.getAttribute('for') !== 'mail-client-birthyear') return; // Ne pas appliquer la clé F4 au label F1

        if (t[key] !== undefined) {
            try {
                if (el.tagName === 'TITLE') { el.textContent = t[key]; }
                else if (el.tagName === 'OPTION' && el.parentElement && el.parentElement.id !== 'language-selector') { el.textContent = t[key]; }
                else if (el.tagName !== 'SELECT' && el.tagName !== 'INPUT') {
                    // Cas spécifique pour span_duration dans F1 ou F3
                    if (el.parentElement && el.parentElement.classList.contains('info-calculated-duration') && (key === 'span_duration' || key === 'span_f3_duration')) {
                        const yearsEl = el.parentElement.querySelector('[data-key="span_years"]');
                        el.textContent = t[key];
                        if (yearsEl && t.span_years) yearsEl.textContent = " " + t.span_years;
                    }
                    // Cas spécifique pour span_future_needed dans F2 (Inflation)
                    else if (key === 'span_future_needed') {
                         if (el.childNodes.length > 0 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                              el.childNodes[0].nodeValue = t[key]; // Met à jour le texte avant le span interne
                         } else {
                              el.textContent = t[key];
                              const spanYears = document.createElement('span');
                              spanYears.id = 'inflation-result-years';
                              el.appendChild(spanYears);
                              if (!el.textContent.includes(currentLang === 'nl' ? ' jaar' : (currentLang === 'en' ? ' years' : ' ans'))) {
                                    el.appendChild(document.createTextNode(currentLang === 'nl' ? ' jaar' : (currentLang === 'en' ? ' years' : ' ans')));
                              }
                         }
                    }
                    // Ne pas écraser les spans dynamiques F1
                    else if (key !== 'span_years') {
                         el.textContent = t[key];
                    }
                }
            } catch (e) { console.error(`Erreur traduction clé "${key}":`, e, el); }
        } else {
             // Optionnel: Avertir si une clé manque dans la langue courante
             // console.warn(`Clé de traduction manquante pour "${key}" en langue "${currentLang}"`);
        }
    });
}

/**
 * Définit la langue et met à jour l'application
 * @param {string} lang 'fr', 'nl', or 'en'
 */
export function setLanguage(lang) {
    if (!translations[lang] || !translations[lang].meta_title) {
        console.error("Langue non supportée ou traductions incomplètes:", lang);
        return;
    }
    currentLang = lang;

    document.querySelectorAll('.flag-button').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-lang') === lang) {
            button.classList.add('active');
        }
    });

    applyTranslations(); // Applique les traductions statiques AVANT

    // Relancer tous les calculateurs enregistrés
    console.log(`Langue changée en ${lang}, rafraîchissement des modules...`);
    onLangChangeCallbacks.forEach(callback => {
        try {
            callback();
        } catch (e) {
            console.error("Erreur lors du rappel de changement de langue :", e, callback);
        }
    });
}

