// core/emailTemplates.js
// NOUVEAU FICHIER DÉDIÉ AUX TEXTES DES EMAILS

export const emailTemplates = {
    
    // =======================================================
    // ### FRANÇAIS ###
    // =======================================================
    fr: {
        intro: (prenom, nom, email) => `
            <p><strong>À:</strong> ${email || ' '}</p>
            <p>Bonjour ${prenom} ${nom},</p>
            <p>J'espère que vous allez bien.</p>
            <p>Suite à notre récent entretien, au cours duquel nous avons réalisé une analyse approfondie de votre situation financière, et après évaluation par un conseiller agréé, je tiens à vous transmettre un récapitulatif des points essentiels abordés ainsi que des recommandations adaptées à vos besoins et à vos objectifs à long terme.</p>
            <p>Ces propositions s'inscrivent dans une approche personnalisée, en tenant compte des informations que vous nous avez communiquées, afin de vous accompagner au mieux dans l'optimisation et la protection de vos intérêts financiers.</p>
        `,
        
        ep: (data, formatMonetaire) => {
            // ... (contenu inchangé)
            return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">Épargne Pension</h3>
            <p>
                Montants: <strong>${formatMonetaire(data.versementBrutMensuel)} BRUTS</strong> (Les montants peuvent être adaptés en fonction de votre objectif fiscal/financier).<br>
                Coût net mensuel: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)} / mois</strong>.<br>
                Déductibilité: <strong>${formatMonetaire(data.avantageFiscalAnnuel)}/an</strong>.<br>
                Durée de l'investissement - ${data.dureeVersementAnnees.toFixed(0)} ans âge terme - 67 ans.<br>
                Frais d'entrée: <strong>3,00%</strong><br>
                Frais de Gestion (annuels):
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li><strong>1,90%</strong> (EP/ELT Europe Equity AXA);</li>
                    <li><strong>0,85%</strong> (EP/ELT Multifunds AXA);</li>
                    <li><strong>1,25%</strong> (EP/ELT iShares P&V).</li>
                </ul>
                Rendement attendu: Entre 5,00% et 10,00%. <a href="https://www.wikifin.be/fr/epargner-et-investir/produits-dinvestissement/produits-dassurances/assurance-de-la-branche-23/quest" target="_blank" rel="noopener noreferrer">Source, attentes</a>.<br>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li style="padding: 5px;">Dans votre cas, nous partons d'un capital investi de <strong>${formatMonetaire(data.capitalBrutPlaceTotal)}</strong> pour atteindre un montant estimé de <strong>${formatMonetaire(data.capitalFinalNet)}</strong> au terme du contrat, taxes et frais compris. L'avantage fiscal perçu représente quant à lui <strong>${formatMonetaire(data.avantageFiscalTotal)}</strong></li>
                </ul>
            </p>
        `},

        elt: (data, formatMonetaire) => {
            // ... (contenu inchangé)
            return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">Épargne à Long Terme</h3>
            <p>
                Montants: <strong>${formatMonetaire(data.versementBrutMensuel)} BRUTS</strong> (Les montants peuvent être adaptés en fonction de votre objectif fiscal/financier).<br>
                Coût net mensuel: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)} / mois</strong>.<br>
                Déductibilité: <strong>${formatMonetaire(data.avantageFiscalAnnuel)} / an</strong>.<br>
                Durée de l'investissement - ${data.dureeVersementAnnees.toFixed(0)} ans âge terme - ${data.targetAge} ans.<br>
                Frais d'entrée: <strong>3,00%</strong><br>
                Frais de Gestion (annuels):
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li><strong>1,90%</strong> (EP/ELT Europe Equity AXA);</li>
                    <li><strong>0,85%</strong> (EP/ELT Multifunds AXA);</li>
                    <li><strong>0,85%</strong> (ELT IM Optimal Balance AXA);</li>
                    <li><strong>0,85%</strong> (ELT Ethna-AKTIV AXA);</li>
                    <li><strong>1,00%</strong> (ELT R-co Valor AXA);</li>
                    <li><strong>1,25%</strong> (EP/ELT iShares P&V).</li>
                </ul>
                Rendement attendu: Entre 5,00% et 10,00%. <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">Source, attentes et autres</a>.<br>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li style="padding: 5px;">Dans votre cas, nous partons d'un capital investi de <strong>${formatMonetaire(data.capitalBrutPlaceTotal)}</strong> pour atteindre un montant estimé de <strong>${formatMonetaire(data.capitalFinalNet)}</strong> au terme du contrat, taxes et frais compris. L'avantage fiscal perçu représente quant à lui <strong>${formatMonetaire(data.avantageFiscalTotal)}</strong></li>
                </ul>
            </p>
        `},

        ep_elt_common: (msciRate, formatMonetaire) => {
            // MODIFIÉ: S'assure que 0 est une valeur valide
            const formattedMsciRate = (typeof msciRate === 'number' ? msciRate : 8.53).toLocaleString('fr-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            return `
            <p style="margin-top: 15px;">
                <a href="https://www.lafinancepourtous.com/outils/calculateurs/calculateur-credit-renouvelable/" target="_blank" rel="noopener noreferrer">Calculateur d'épargnes (pension, enfant et investissement)</a>
            </p>
            <p style="font-size: 0.9em; font-style: italic;">
                Je vous rappelle que ces calculs ont été réalisés sur base d'un rendement fictif de 5,00% (par sécurité et pour tenir compte d'une sous-performance éventuelle). Sur une période d'environ 30 ans, il convient plutôt d'envisager un rendement final de l'ordre de 5,00% à 10,00%, ces 37 dernières années le rendement étant de <strong>${formattedMsciRate}%</strong> en moyenne par an (<a href="https://www.msci.com/documents/10199/178e6643-6ae6-47b9-82be-e1fc565ededb" target="_blank" rel="noopener noreferrer">MSCI World Index - rendement depuis 1987</a>).
            </p>
            <p style="margin-top: 15px;">
                <strong><u>Liens pour se fonder un avis:</u></strong><br>
                <a href="https://fin.belgium.be/fr/particuliers/avantages-fiscaux" target="_blank" rel="noopener noreferrer">Les avantages fiscaux en Belgique.</a><br>
                <a href="https://www.lecho.be/monargent/analyse/pension/ce-que-devrait-deja-faire-un-jeune-inquiet-pour-sa-pension/10301606.html" target="_blank" rel="noopener noreferrer">Les jeunes et leur pension.</a><br>
                <a href="https://www.un.org/fr/global-issues/ageing" target="_blank" rel="noopener noreferrer">Vieillissement de la population européenne.</a><br>
                <a href="https://www.lecho.be/economie-politique/belgique/general/30-de-pensionnes-en-belgique-en-2050-quelles-consequences/9778044.html" target="_blank" rel="noopener noreferrer">Vieillissement de la population belge.</a>
            </p>
            <p style="margin-top: 15px;">
                <strong><u>SOCIÉTÉS RECOMMANDÉES</u></strong><br>
                <a href="https://www.axa.be/fr/particuliers/pension" target="_blank" rel="noopener noreferrer"><strong>AXA</strong></a>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Fonds Épargne Pension/ Long Terme: <a href="https://www.quantalys.com/Fonds/Performances/731077" target="_blank" rel="noopener noreferrer">AXA - Pension Plan AXA Multifunds</a></li>
                    <li>Fonds Épargne Pension/ Long Terme: <a href="https://www.comgest.com/fr/lu/professionnel/fonds/comgest-growth-europe-eur-z-acc" target="_blank" rel="noopener noreferrer">Comgest - Growth Europe Equity EUR Z Acc</a></li>
                    <li style="list-style-type: none; margin-top: 5px;">
                        <ul style="padding-left: 20px; margin-top: 5px; margin-bottom: 5px;">
                            <li>Possibilité de switcher de branche d'investissement pour garantir son capital.</li>
                            <li>Fonction Stop Loss 5 années endéans la retraite afin de sécuriser son investissement.</li>
                            <li>Couvertures décès (naturel & accidentel), incapacité, perte d'emploi - facultatives.</li>
                        </ul>
                    </li>
                </ul>
                <a href="https://www.vivium.be/fr/private-individuals/home" target="_blank" rel="noopener noreferrer"><strong>P&V Assurances SC (Vivium)</strong></a>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Fonds d'Epargne Pension/ Long Terme: BlackRock - <a href="https://www.blackrock.com/fr/intermediaries/products/290846/ishares-msci-world-sri-ucits-etf" target="_blank" rel="noopener noreferrer">iShares MSCI World SRI UCITS ETF</a></li>
                    <li>Fonds d'Epargne Pension: P&V Group - <a href="https://www.lecho.be/les-marches/fonds/dynamic-multi-fund.620832117.html" target="_blank" rel="noopener noreferrer">Dynamic Multi Fund</a></li>
                </ul>
            </p>
        `},

        plci: `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">PENSION LIBRE COMPLÉMENTAIRE POUR INDÉPENDANT (PLCI)</h3>
            <p><strong>La PLCI</strong> (Pension Libre Complémentaire pour Indépendants) est une solution d'épargne qui vous permet de compléter votre pension légale tout en bénéficiant d'avantages fiscaux. Vous cotisez selon le montant et la fréquence de votre choix (mensuelle, trimestrielle, semestrielle ou annuelle), avec un plafond fixé à 4 000,44 € en 2025. Les primes sont déductibles en frais professionnels, réduisent vos cotisations sociales et permettent, sous conditions, d'obtenir une avance pour des projets immobiliers. Au terme, le capital est taxé de manière avantageuse.</p>
            <p>De plus, vous pouvez coupler votre PLCI avec une assurance <strong>Revenu Garanti</strong> pour indépendants qui compense la perte de revenus en cas d'incapacité de travail (maladie ou accident). Elle complète l'allocation de la mutualité, est fiscalement déductible, et s'adresse aux indépendants de moins de 57 ans domiciliés en Belgique. Plus on la souscrit jeune, plus c'est avantageux.</p>
            <p style="padding: 5px; margin-top: 10px;">La demande d'offre concernant votre Pension Libre Complémentaire pour Indépendants seront effectuées lors de votre prochain rendez-vous.</p>
            <p style="margin-top: 15px;">
                <strong><u>SOCIÉTÉS RECOMMANDÉES</u></strong><br>
                <strong><a href="https://www.vivium.be/fr/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Assurances SC (Vivium)</a></strong>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Fonds Pension Libre Complémentaire pour Indépendant: <a href="https://www.lecho.be/les-marches/fonds/dynamic-multi-fund.620832117.html" target="_blank" rel="noopener noreferrer">Dynamic Multi Fund</a></li>
                </ul>
                <strong><a href="https://www.allianzgi.com/" target="_blank" rel="noopener noreferrer">Allianz Global Investor</a></strong>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Dispositif pour la Pension Libre Complémentaire pour Indépendant: <a href="https://allianz.be/content/dam/onemarketing/benelu/allianz-be/downloads/fr/pension/plan-for-life-plus/conditions-generales/plan-for-life-plus-conditions-generales-fr.pdf" target="_blank" rel="noopener noreferrer">Plan For Life+</a></li>
                </ul>
            </p>
        `,

        inami: `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">PLAN INAMI</h3>
            <p>Le Plan INAMI est un dispositif destiné aux dispensateurs de soins médicaux conventionnés. L'<strong>intervention INAMI</strong> est une indemnité annuelle accordée par I'INAMI en contrepartie du respect des tarifs conventionnés. Elle doit être investie dans un <strong>plan de pension complémentaire à caractère social</strong>, et peut également inclure une couverture en cas d'incapacité de travail qui protège l'indépendant en cas de maladie ou accident.</p>
            <p>Le <strong>montant</strong> de l'intervention varie selon la profession et la situation (ex.: médecin débutant, en stage, etc.).</p>
            <p style="padding: 5px; margin-top: 10px;">La demande d'offre et la simulation concernant votre Plan INAMI seront effectuées lors de votre prochain rendez-vous.</p>
            <p style="margin-top: 15px;">
                <strong><u>SOCIÉTÉ RECOMMANDÉE</u></strong><br>
                <strong><a href="https://www.vivium.be/fr/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Assurances SC (Vivium)</a></strong>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Fonds Plan INAMI: <a href="https://www.lecho.be/les-marches/fonds/dynamic-multi-fund.620832117.html" target="_blank" rel="noopener noreferrer">Dynamic Multi Fund</a></li>
                </ul>
            </p>
        `,

        eip: `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">ENGAGEMENT INDIVIDUEL DE PENSION (EIP)</h3>
            <p>L'EIP (Engagement Individuel de Pension) est une solution d'épargne-pension destinée aux dirigeants d'entreprise. C'est un avantage extra-légal flexible qui s'adapte à vos besoins et à votre situation. Vous pouvez déduire 100% des cotisations que vous versez dans votre EIP comme une dépense professionnelle, à condition de respecter <strong>la règle des 80,00%</strong>.</p>
            <p>La règle des 80,00% fixe un maximum pour votre épargne-pension déductible. Voici comment ça fonctionne :</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>La somme de <strong>votre pension légale</strong> et de <strong>l'épargne de votre pension complémentaire (comme l'EIP)</strong> ne peut pas dépasser <strong>80% de votre salaire brut annuel moyen</strong>.</li>
                <li>Votre salaire brut inclut non seulement votre salaire mensuel, mais aussi les avantages que vous recevez (comme une voiture de société).</li>
            </ul>
            <p>Si vous respectez cette règle, vous pouvez bénéficier d'un avantage fiscal tout en construisant une retraite confortable. De plus, les primes permettent, sous conditions, d'obtenir une avance pour des projets immobiliers. Au terme, le capital est taxé de manière avantageuse.</p>
            <p>De plus, vous pouvez coupler votre EIP avec une assurance <strong>Revenu Garanti</strong> pour indépendants qui compense la perte de revenus en cas d'incapacité de travail (maladie ou accident). Elle complète l'allocation de la mutualité, est fiscalement déductible, et s'adresse aux indépendants de moins de 57 ans domiciliés en Belgique. Plus on la souscrit jeune, plus c'est avantageux.</p>
            <p style="padding: 5px; margin-top: 10px;">La demande d'offre et la simulation concernant votre Engagement Individuel de Pension seront effectuées lors de votre prochain rendez-vous.</p>
            <p style="margin-top: 15px;">
                <strong><u>SOCIÉTÉ RECOMMANDÉE</u></strong><br>
                <strong><a href="https://ag.be/particuliers/fr?utm_medium=search-paid&utm_source=Google&utm_campaign=AG-Brand-S-FR-122020-fr&utm_content=Brand&s_kwcid=AL!7641!3!430269132403!e!!g!!ag%20insurance&gad_source=1&gclid=CjwKCAiAxKy5BhBbEiwAYiW--0iMZRujDD9SqRN8MadOgYQ4KsvB6ZdBYsTI6N7TlqW1VbH-U3crSxoCXNQQAvD_BwE" target="_blank" rel="noopener noreferrer">AG Insurance</a></strong>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Fonds Engagement Individuel de Pension: <a href="https://www.lecho.be/les-marches/fonds/ag-insurance-ag-life-equity-world-aqua.60013349.html" target="_blank" rel="noopener noreferrer">AG Insurance - AG Life Equity World Aqua</a></li>
                    <li>Fonds Engagement Individuel de Pension: <a href="https://www.lecho.be/les-marches/fonds/ag-insurance-ag-life-climate-change.60203015.html" target="_blank" rel="noopener noreferrer">AG Insurance - AG Life Climate Change</a></li>
                    <li>Fonds Engagement Individuel de Pension: <a href="https://www.lecho.be/les-marches/fonds/ag-insurance-ag-life-real-estate.60189964.html" target="_blank" rel="noopener noreferrer">AG Insurance - AG Life Real Estate</a></li>
                    <li>Fonds Engagement Individuel de Pension: <a href="https://www.lecho.be/les-marches/fonds/ag-insurance-ag-life-sustainable-dynamic.60052300.html" target="_blank" rel="noopener noreferrer">AG Insurance - AG Life Sustainable Dynamic</a></li>
                </ul>
            </p>
        `,

        // --- SECTION MODIFIÉE ---
        nonfiscal: (mensualite, age, res10, res20, res30, formatMonetaire) => {
            // ... (contenu inchangé)
            return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">ÉPARGNE NON-FISCALE</h3>
            <p>
                Montants: <strong>${formatMonetaire(mensualite)} BRUTS</strong> (Les montants peuvent être adaptés en fonction de votre objectif fiscal/financier).<br>
                Frais sur versement: <strong>3,00% / mois</strong><br>
                Taxe sur versement: <strong>2,00% / mois</strong><br>
                Taxe sur plus-value: <strong>10,00%</strong> (sur la part des gains > 10.000 €)<br>
                Rendement attendu: Entre 8,00% et 14,00%. <a href="https://www.msci.com/documents/10199/178e6643-6ae6-47b9-82be-e1fc565ededb" target="_blank" rel="noopener noreferrer">Source</a> et <a href="https://bourse101.fr/calculatrice-financiere-interet-compose/" target="_blank" rel="noopener noreferrer">calculateur</a>.<br>
            </p>
            <p style="margin-top: 10px;">Durée de l'investissement - 10 ans âge terme - ${(parseInt(age) || 0) + 10} ans.</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li style="padding: 5px;">Dans votre cas, nous partons d'un capital investi de <strong>${formatMonetaire(res10.investedCapital)}</strong> pour atteindre un montant estimé de <strong>${formatMonetaire(res10.finalCapital)}</strong> au terme des 10 années, taxes et frais compris.</li>
            </ul>
            <p style="margin-top: 10px;">Durée de l'investissement - 20 ans âge terme - ${(parseInt(age) || 0) + 20} ans.</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li style="padding: 5px;">Dans votre cas, nous partons d'un capital investi de <strong>${formatMonetaire(res20.investedCapital)}</strong> pour atteindre un montant estimé de <strong>${formatMonetaire(res20.finalCapital)}</strong> au terme des 20 années, taxes et frais compris.</li>
            </ul>
            <p style="margin-top: 10px;">Durée de l'investissement - 30 ans âge terme - ${(parseInt(age) || 0) + 30} ans.</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li style="padding: 5px;">Dans votre cas, nous partons d'un capital investi de <strong>${formatMonetaire(res30.investedCapital)}</strong> pour atteindre un montant estimé de <strong>${formatMonetaire(res30.finalCapital)}</strong> au terme des 30 années, taxes et frais compris.</li>
            </ul>
            <p style="margin-top: 10px;">Vous êtes libre de retirer le capital acquis sans frais supplémentaires à partir de la 6ème année d'investissement.</p>
            <p style="font-size: 0.9em; font-style: italic; margin-top: 10px;">
                Je vous rappelle que ces calculs ont été réalisés sur base d'un rendement fictif de <strong>8,00%</strong> (par sécurité et pour tenir compte d'une sous-performance éventuelle). Sur une période d'environ 30 ans, il convient plutôt d'envisager un rendement final de l'ordre de 8,00% à 14,00%.
            </p>
            <p style="margin-top: 15px;">
                <strong><u>SOCIÉTÉS RECOMMANDÉES</u></strong><br>
                <strong><a href="https://www.vivium.be/fr/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Assurances SC (Vivium)</a></strong><br>
                Vous investiriez au sein des fonds suivant :
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li><a href="https://www.blackrock.com/fr/intermediaries/products/290846/ishares-msci-world-sri-ucits-etf" target="_blank" rel="noopener noreferrer">BlackRock iShares MSCI World SRI UCITS ETF</a></li>
                    <li><a href="https://www.amundietf.fr/fr/particuliers/produits/equity/amundi-msci-water-ucits-etf-acc/fr0014002ch1" target="_blank" rel="noopener noreferrer">Amundi MSCI Water ESG Screened UCITS ETF ACC</a></li>
                    <li><a href="https://www.amundi.fr/fr_instit/product/view/FR0011176635" target="_blank" rel="noopener noreferrer">Amundi Money Market Euro Liquidity Short Term Responsible - E (C)</a></li>
                    <li><a href="https://www.amundi.fr/fr_part/product/view/IE00BKLH2363" target="_blank" rel="noopener noreferrer">Amundi KBI Global Energy Transition Fund - Euro Class G (C)</a></li>
                    <li><a href="https://www.pv.be/documents/1465818/1336497446/Factsheet+PV+Global+Climate+Change+Equities+ETF+FR_12072023.pdf/7d819bb9-fd8b-6cb2-f00b-20d06309f708?t=1702048112735" target="_blank" rel="noopener noreferrer">Amundi Global Climate Change Equities ETF</a></li>
                </ul>
                <strong><a href="https://www.allianzgi.com/" target="_blank" rel="noopener noreferrer">Allianz Global Investor</a></strong><br>
                Vous investiriez au sein du fonds suivant :
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li><a href="https://www.lecho.be/les-marches/fonds/nordea-1---global-climate-and-environment-fund-bp---eur.60003833.html" target="_blank" rel="noopener noreferrer">Nordea Global Climate and Environment Fund BP - EUR</a></li>
                </ul>
            </p>
        `},
        // --- FIN SECTION MODIFIÉE ---

        dela: (capital, prime, formatMonetaire) => {
            // MODIFIÉ: Retrait des valeurs par défaut (gérées par f5.js)
            const formattedCapital = formatMonetaire(capital);
            const formattedPrime = formatMonetaire(prime);

            return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">COUVERTURE OBSÈQUES DELA :</h3>
            <p>La société DELA, avec laquelle je collabore, propose des solutions de couverture obsèques particulièrement avantageuses. Cette offre vous permet de garantir une tranquillité d'esprit pour vous et vos proches, avec des tarifs compétitifs adaptés à votre situation.</p>
            <p>Il est intéressant de noter que les primes sont calculées en fonction de votre âge actuel et restent <strong>fixes</strong> dès la mise en place de la couverture. Cela vous permet de bénéficier d'une stabilité financière à long terme.</p>
            <p style="margin-top: 10px;">En fonction de vos besoins, voici quelques exemples de couverture pour un paiement mensuel jusqu'à vos <strong>67 ans</strong> :</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li><strong>Capital assuré de ${formattedCapital}:</strong> prime mensuelle de <strong>${formattedPrime}</strong>.</li>
            </ul>
            <p>Ces couvertures sont valables <strong>à vie</strong>, et, en bonus, les enfants de moins de 18 ans bénéficient également d'une protection incluse.</p>
            <p>Les primes peuvent bien entendu être ajustées selon le capital souhaité ou la durée de paiement choisie.</p>
        `},

        rdv: (date, time) => `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">POUR NOTRE PROCHAIN RENDEZ-VOUS: <mark style="background-color: #FFFF00; color: #0070B0; padding: 2px 5px; border-radius: 3px; font-weight: bold;">${date} à ${time}.</mark></h3>
            <p>Je vous invite à préparer sur papier toutes les questions que vous pourriez avoir à la lecture de ce mail. Nous commencerons par détailler l'offre ensemble pour s'attarder sur les points pour lesquels vous souhaitez des éclaircissements.</p>
            <p>Vous pouvez également préparer les documents suivants (<u>ne pas les transmettre avant notre entrevue</u>), afin d'être prêt à souscrire si tout est ok pour vous:</p>
        `,

        docs_base: `Une photo de votre carte d’identité (recto & verso séparés);`,
        
        docs_eip: `
            Pour souscrire à un EIP, voici les informations nécessaires :
            <ol style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li><strong>Rémunération brute annuelle:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Montant exact pour l'année 2020.</li>
                        <li>Estimation pour 2025 (probablement identique à 2024, se référer à votre comptable).</li>
                    </ul>
                </li>
                <li><strong>État civil:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Statut marital.</li>
                    </ul>
                </li>
                <li><strong>Fiche détaillée MyPension:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Capitaux existants dans d'autres pensions complémentaires (PLCI, autres).</li>
                    </ul>
                </li>
                <li><strong>Fiche MyCareer:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Nombre d'années de carrière comme salarié et/ou indépendant.</li>
                        <li>Durée dans l'entreprise actuelle.</li>
                    </ul>
                </li>
                <li><strong>Avertissement extrait de rôle:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Des deux années précédentes et de l'année passée.</li>
                    </ul>
                </li>
                <li><strong>Fiche de paie du dirigeant d'entreprise.</strong></li>
                <li><strong>Carte bancaire de la société (au format PDF).</strong></li>
            </ol>
            <p>Ces données permettent de vérifier votre situation professionnelle et personnelle, ainsi que de calculer le respect de la règle des 80,00%.</p>
        `,

        outro: `
            <p style="margin-top: 20px;">N'hésitez pas à me contacter si vous avez des questions ou demandes particulières. Je reste joignable aussi bien par téléphone que par retour de ce mail.</p>
            <p style="margin-top: 15px;">Bien cordialement,</p>
        `
    },

    // =======================================================
    // ### NEDERLANDS (Dutch) ###
    // =======================================================
    nl: {
        intro: (prenom, nom, email) => `
            <p><strong>Aan:</strong> ${email || ' '}</p>
            <p>Beste ${prenom} ${nom},</p>
            <p>Ik hoop dat alles goed met u gaat.</p>
            <p>Naar aanleiding van ons recent gesprek, waarin we een grondige analyse van uw financiële situatie hebben uitgevoerd, en na evaluatie door een erkend adviseur, bezorg ik u graag een samenvatting van de besproken kernpunten en aanbevelingen die zijn afgestemd op uw behoeften en langetermijndoelstellingen.</p>
            <p>Deze voorstellen kaderen in een persoonlijke aanpak, rekening houdend met de informatie die u ons heeft verstrekt, om u zo goed mogelijk te begeleiden bij het optimaliseren en beschermen van uw financiële belangen.</p>
        `,
        
        ep: (data, formatMonetaire) => {
            // ... (contenu inchangé)
            return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">Pensioensparen</h3>
            <p>
                Bedragen: <strong>${formatMonetaire(data.versementBrutMensuel)} BRUTO</strong> (Bedragen kunnen worden aangepast op basis van uw fiscale/financiële doelstelling).<br>
                Netto maandelijkse kosten: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)} / maand</strong>.<br>
                Aftrekbaarheid: <strong>${formatMonetaire(data.avantageFiscalAnnuel)}/jaar</strong>.<br>
                Duur van de investering - ${data.dureeVersementAnnees.toFixed(0)} jaar eindleeftijd - 67 jaar.<br>
                Instapkosten: <strong>3,00%</strong><br>
                Beheerskosten (jaarlijks):
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li><strong>1,90%</strong> (PS/LTS Europe Equity AXA);</li>
                    <li><strong>0,85%</strong> (PS/LTS Multifunds AXA);</li>
                    <li><strong>1,25%</strong> (PS/LTS iShares P&V).</li>
                </ul>
                Verwacht rendement: Tussen 5,00% en 10,00%. <a href="https://www.wikifin.be/nl/sparen-en-beleggen/beleggingsproducten/verzekeringsproducten/tak-23-verzekering/wat-een" target="_blank" rel="noopener noreferrer">Bron, verwachtingen</a>.<br>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li style="padding: 5px;">In uw geval gaan we uit van een geïnvesteerd kapitaal van <strong>${formatMonetaire(data.capitalBrutPlaceTotal)}</strong> om een geschat bedrag van <strong>${formatMonetaire(data.capitalFinalNet)}</strong> te bereiken op de eindvervaldag, inclusief taksen en kosten. Het genoten fiscale voordeel bedraagt <strong>${formatMonetaire(data.avantageFiscalTotal)}</strong></li>
                </ul>
            </p>
        `},

        elt: (data, formatMonetaire) => {
            // ... (contenu inchangé)
            return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">Lange Termijn Sparen</h3>
            <p>
                Bedragen: <strong>${formatMonetaire(data.versementBrutMensuel)} BRUTO</strong> (Bedragen kunnen worden aangepast op basis van uw fiscale/financiële doelstelling).<br>
                Netto maandelijkse kosten: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)} / maand</strong>.<br>
                Aftrekbaarheid: <strong>${formatMonetaire(data.avantageFiscalAnnuel)} / jaar</strong>.<br>
                Duur van de investering - ${data.dureeVersementAnnees.toFixed(0)} jaar eindleeftijd - ${data.targetAge} jaar.<br>
                Instapkosten: <strong>3,00%</strong><br>
                Beheerskosten (jaarlijks):
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li><strong>1,90%</strong> (PS/LTS Europe Equity AXA);</li>
                    <li><strong>0,85%</strong> (PS/LTS Multifunds AXA);</li>
                    <li><strong>0,85%</strong> (LTS IM Optimal Balance AXA);</li>
                    <li><strong>0,85%</strong> (LTS Ethna-AKTIV AXA);</li>
                    <li><strong>1,00%</strong> (LTS R-co Valor AXA);</li>
                    <li><strong>1,25%</strong> (PS/LTS iShares P&V).</li>
                </ul>
                Verwacht rendement: Tussen 5,00% en 10,00%. <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">Bron, verwachtingen en andere</a>.<br>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li style="padding: 5px;">In uw geval gaan we uit van een geïnvesteerd kapitaal van <strong>${formatMonetaire(data.capitalBrutPlaceTotal)}</strong> om een geschat bedrag van <strong>${formatMonetaire(data.capitalFinalNet)}</strong> te bereiken op de eindvervaldag, inclusief taksen en kosten. Het genoten fiscale voordeel bedraagt <strong>${formatMonetaire(data.avantageFiscalTotal)}</strong></li>
                </ul>
            </p>
        `},

        ep_elt_common: (msciRate, formatMonetaire) => {
            // MODIFIÉ: S'assure que 0 est une valeur valide
            const formattedMsciRate = (typeof msciRate === 'number' ? msciRate : 8.53).toLocaleString('nl-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            return `
            <p style="margin-top: 15px;">
                <a href="https://www.lafinancepourtous.com/outils/calculateurs/calculateur-credit-renouvelable/" target="_blank" rel="noopener noreferrer">Spaarcalculator (pensioen, kind en beleggingen)</a>
            </p>
            <p style="font-size: 0.9em; font-style: italic;">
                Ik herinner u eraan dat deze berekeningen zijn gebaseerd op een fictief rendement van 5,00% (voor de veiligheid en om rekening te houden met mogelijke onderprestaties). Over een periode van ongeveer 30 jaar is het realistischer om uit te gaan van een eindrendement van 5,00% tot 10,00%. De afgelopen 37 jaar bedroeg het gemiddelde jaarlijkse rendement <strong>${formattedMsciRate}%</strong> (<a href="https://www.msci.com/documents/10199/178e6643-6ae6-47b9-82be-e1fc565ededb" target="_blank" rel="noopener noreferrer">MSCI World Index - rendement sinds 1987</a>).
            </p>
            <p style="margin-top: 15px;">
                <strong><u>Links om u een mening te vormen:</u></strong><br>
                <a href="https://fin.belgium.be/nl/particulieren/belastingvoordelen" target="_blank" rel="noopener noreferrer">Belastingvoordelen in België.</a><br>
                <a href="https://www.tijd.be/netto/analyse/pensioen/wat-een-jonge-twintiger-vandaag-al-moet-doen-voor-zijn-pensioen/10301606.html" target="_blank" rel="noopener noreferrer">Jongeren en hun pensioen.</a><br>
                <a href="https://www.un.org/en/global-issues/ageing" target="_blank" rel="noopener noreferrer">Vergrijzing van de Europese bevolking.</a><br>
                <a href="https://www.tijd.be/economie-beleid/belgie/algemeen/30-procent-gepensioneerden-in-belgie-in-2050-wat-zijn-de-gevolgen/9778044.html" target="_blank" rel="noopener noreferrer">Vergrijzing van de Belgische bevolking.</a>
            </p>
            <p style="margin-top: 15px;">
                <strong><u>AANBEVOLEN MAATSCHAPPIJEN</u></strong><br>
                <a href="https://www.axa.be/nl/particulieren/pensioen" target="_blank" rel="noopener noreferrer"><strong>AXA</strong></a>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Fonds Pensioensparen/Lange Termijn: <a href="https://www.quantalys.com/Fonds/Performances/731077" target="_blank" rel="noopener noreferrer">AXA - Pension Plan AXA Multifunds</a></li>
                    <li>Fonds Pensioensparen/Lange Termijn: <a href="https://www.comgest.com/nl/lu/professional/funds/comgest-growth-europe-eur-z-acc" target="_blank" rel="noopener noreferrer">Comgest - Growth Europe Equity EUR Z Acc</a></li>
                    <li style="list-style-type: none; margin-top: 5px;">
                        <ul style="padding-left: 20px; margin-top: 5px; margin-bottom: 5px;">
                            <li>Mogelijkheid om te switchen van beleggingstak om kapitaal te garanderen.</li>
                            <li>Stop Loss-functie 5 jaar voor pensionering om investering veilig te stellen.</li>
                            <li>Overlijdensdekking (natuurlijk & ongeval), arbeidsongeschiktheid, baanverlies - optioneel.</li>
                        </ul>
                    </li>
                </ul>
                <a href="https://www.vivium.be/nl/private-individuals/home" target="_blank" rel="noopener noreferrer"><strong>P&V Verzekeringen CV (Vivium)</strong></a>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Fonds Pensioensparen/Lange Termijn: BlackRock - <a href="https://www.blackrock.com/nl/individual/products/290846/ishares-msci-world-sri-ucits-etf" target="_blank" rel="noopener noreferrer">iShares MSCI World SRI UCITS ETF</a></li>
                    <li>Fonds Pensioensparen: P&V Groep - <a href="https://www.tijd.be/market-live/fondsen/dynamic-multi-fund.620832117.html" target="_blank" rel="noopener noreferrer">Dynamic Multi Fund</a></li>
                </ul>
            </p>
        `},

        plci: `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">VRIJ AANVULLEND PENSIOEN VOOR ZELFSTANDIGEN (VAPZ)</h3>
            <p><strong>Het VAPZ</strong> (Vrij Aanvullend Pensioen voor Zelfstandigen) is een spaaroplossing waarmee u uw wettelijk pensioen kunt aanvullen terwijl u geniet van fiscale voordelen. U stort een bedrag en frequentie naar keuze (maandelijks, driemaandelijks, halfjaarlijks of jaarlijks), met een plafond van € 4.000,44 in 2025. De premies zijn aftrekbaar als beroepskosten, verlagen uw sociale bijdragen en maken het onder voorwaarden mogelijk om een voorschot te krijgen voor vastgoedprojecten. Op de eindvervaldag wordt het kapitaal voordelig belast.</p>
            <p>Bovendien kunt u uw VAPZ koppelen aan een <strong>Gewaarborgd Inkomen</strong> verzekering voor zelfstandigen, die inkomensverlies compenseert bij arbeidsongeschiktheid (ziekte of ongeval). Het vult de uitkering van het ziekenfonds aan, is fiscaal aftrekbaar en richt zich tot zelfstandigen jonger dan 57 jaar, gedomicilieerd in België. Hoe jonger u intekent, hoe voordeliger.</p>
            <p style="padding: 5px; margin-top: 10px;">De offerteaanvraag voor uw Vrij Aanvullend Pensioen voor Zelfstandigen zal tijdens uw volgende afspraak worden behandeld.</p>
            <p style="margin-top: 15px;">
                <strong><u>AANBEVOLEN MAATSCHAPPIJEN</u></strong><br>
                <strong><a href="https://www.vivium.be/nl/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Verzekeringen CV (Vivium)</a></strong>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Fonds Vrij Aanvullend Pensioen voor Zelfstandigen: <a href="https://www.tijd.be/market-live/fondsen/dynamic-multi-fund.620832117.html" target="_blank" rel="noopener noreferrer">Dynamic Multi Fund</a></li>
                </ul>
                <strong><a href="https://www.allianzgi.com/" target="_blank" rel="noopener noreferrer">Allianz Global Investor</a></strong>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Product voor Vrij Aanvullend Pensioen voor Zelfstandigen: <a href="https://allianz.be/content/dam/onemarketing/benelu/allianz-be/downloads/nl/pension/plan-for-life-plus/algemene-voorwaarden/plan-for-life-plus-algemene-voorwaarden-nl.pdf" target="_blank" rel="noopener noreferrer">Plan For Life+</a></li>
                </ul>
            </p>
        `,

        inami: `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">RIZIV-PLAN</h3>
            <p>Het RIZIV-plan is een regeling voor geconventioneerde zorgverleners. De <strong>RIZIV-tussenkomst</strong> is een jaarlijkse vergoeding die door het RIZIV wordt toegekend in ruil voor het naleven van de conventietarieven. Deze moet worden belegd in een <strong>aanvullend pensioenplan met sociaal karakter</strong>, en kan ook een dekking bij arbeidsongeschiktheid omvatten die de zelfstandige beschermt bij ziekte of ongeval.</p>
            <p>Het <strong>bedrag</strong> van de tussenkomst varieert afhankelijk van het beroep en de situatie (bv. startende arts, arts in opleiding, enz.).</p>
            <p style="padding: 5px; margin-top: 10px;">De offerteaanvraag en simulatie voor uw RIZIV-plan worden tijdens uw volgende afspraak behandeld.</p>
            <p style="margin-top: 15px;">
                <strong><u>AANBEVOLEN MAATSCHAPPIJ</u></strong><br>
                <strong><a href="https://www.vivium.be/nl/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Verzekeringen CV (Vivium)</a></strong>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Fonds RIZIV-plan: <a href="https://www.tijd.be/market-live/fondsen/dynamic-multi-fund.620832117.html" target="_blank" rel="noopener noreferrer">Dynamic Multi Fund</a></li>
                </ul>
            </p>
        `,

        eip: `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">INDIVIDUELE PENSIOENTOEZEGGING (IPT)</h3>
            <p>De IPT (Individuele Pensioentoezegging) is een pensioenspaaroplossing voor bedrijfsleiders. Het is een flexibel extralegaal voordeel dat zich aanpast aan uw behoeften en situatie. U kunt 100% van de premies die u in uw IPT stort, aftrekken als beroepskosten, op voorwaarde dat u <strong>de 80,00%-regel</strong> respecteert.</p>
            <p>De 80,00%-regel stelt een maximum aan uw aftrekbaar pensioensparen. Zo werkt het:</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>De som van <strong>uw wettelijk pensioen</strong> en <strong>uw aanvullend pensioensparen (zoals de IPT)</strong> mag niet hoger zijn dan <strong>80% van uw gemiddeld bruto jaarloon</strong>.</li>
                <li>Uw bruto loon omvat niet alleen uw maandsalaris, maar ook de voordelen die u ontvangt (zoals een bedrijfswagen).</li>
            </ul>
            <p>Als u deze regel respecteert, kunt u profiteren van een fiscaal voordeel terwijl u bouwt aan een comfortabel pensioen. Bovendien maken de premies het onder voorwaarden mogelijk om een voorschot te krijgen voor vastgoedprojecten. Op de eindvervaldag wordt het kapitaal voordelig belast.</p>
            <p>Daarnaast kunt u uw IPT koppelen aan een <strong>Gewaarborgd Inkomen</strong> verzekering voor zelfstandigen, die inkomensverlies compenseert bij arbeidsongeschiktheid (ziekte of ongeval). Het vult de uitkering van het ziekenfonds aan, is fiscaal aftrekbaar en richt zich tot zelfstandigen jonger dan 57 jaar, gedomicilieerd in België. Hoe jonger u intekent, hoe voordeliger.</p>
            <p style="padding: 5px; margin-top: 10px;">De offerteaanvraag en simulatie voor uw Individuele Pensioentoezegging worden tijdens uw volgende afspraak behandeld.</p>
            <p style="margin-top: 15px;">
                <strong><u>AANBEVOLEN MAATSCHAPPIJ</u></strong><br>
                <strong><a href="https://ag.be/particulieren/nl?utm_medium=search-paid&utm_source=Google&utm_campaign=AG-Brand-S-NL-122020-nl&utm_content=Brand&s_kwcid=AL!7641!3!430269132403!e!!g!!ag%20insurance&gad_source=1&gclid=CjwKCAiAxKy5BhBbEiwAYiW--0iMZRujDD9SqRN8MadOgYQ4KsvB6ZdBYsTI6N7TlqW1VbH-U3crSxoCXNQQAvD_BwE" target="_blank" rel="noopener noreferrer">AG Insurance</a></strong>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Fonds Individuele Pensioentoezegging: <a href="https://www.tijd.be/market-live/fondsen/ag-insurance-ag-life-equity-world-aqua.60013349.html" target="_blank" rel="noopener noreferrer">AG Insurance - AG Life Equity World Aqua</a></li>
                    <li>Fonds Individuele Pensioentoezegging: <a href="https://www.tijd.be/market-live/fondsen/ag-insurance-ag-life-climate-change.60203015.html" target="_blank" rel="noopener noreferrer">AG Insurance - AG Life Climate Change</a></li>
                    <li>Fonds Individuele Pensioentoezegging: <a href="https://www.tijd.be/market-live/fondsen/ag-insurance-ag-life-real-estate.60189964.html" target="_blank" rel="noopener noreferrer">AG Insurance - AG Life Real Estate</a></li>
                    <li>Fonds Individuele Pensioentoezegging: <a href="https://www.tijd.be/market-live/fondsen/ag-insurance-ag-life-sustainable-dynamic.60052300.html" target="_blank" rel="noopener noreferrer">AG Insurance - AG Life Sustainable Dynamic</a></li>
                </ul>
            </p>
        `,

        // --- SECTION MODIFIÉE ---
        nonfiscal: (mensualite, age, res10, res20, res30, formatMonetaire) => {
            // ... (contenu inchangé)
            return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">NIET-FISCAAL SPAREN</h3>
            <p>
                Bedragen: <strong>${formatMonetaire(mensualite)} BRUTO</strong> (Bedragen kunnen worden aangepast op basis van uw fiscale/financiële doelstelling).<br>
                Kosten op storting: <strong>3,00% / maand</strong><br>
                Taks op storting: <strong>2,00% / maand</strong><br>
                Taks op meerwaarde: <strong>10,00%</strong> (op de winst > 10.000 €)<br>
                Verwacht rendement: Tussen 8,00% en 14,00%. <a href="https://www.msci.com/documents/10199/178e6643-6ae6-47b9-82be-e1fc565ededb" target="_blank" rel="noopener noreferrer">Bron</a> en <a href="https://bourse101.fr/calculatrice-financiere-interet-compose/" target="_blank" rel="noopener noreferrer">calculator</a>.<br>
            </p>
            <p style="margin-top: 10px;">Duur van de investering - 10 jaar eindleeftijd - ${(parseInt(age) || 0) + 10} jaar.</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li style="padding: 5px;">In uw geval gaan we uit van een geïnvesteerd kapitaal van <strong>${formatMonetaire(res10.investedCapital)}</strong> om een geschat bedrag van <strong>${formatMonetaire(res10.finalCapital)}</strong> te bereiken na 10 jaar, inclusief taksen en kosten.</li>
            </ul>
            <p style="margin-top: 10px;">Duur van de investering - 20 jaar eindleeftijd - ${(parseInt(age) || 0) + 20} jaar.</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li style="padding: 5px;">In uw geval gaan we uit van een geïnvesteerd kapitaal van <strong>${formatMonetaire(res20.investedCapital)}</strong> om een geschat bedrag van <strong>${formatMonetaire(res20.finalCapital)}</strong> te bereiken na 20 jaar, inclusief taksen en kosten.</li>
            </ul>
            <p style="margin-top: 10px;">Duur van de investering - 30 jaar eindleeftijd - ${(parseInt(age) || 0) + 30} jaar.</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li style="padding: 5px;">In uw geval gaan we uit van een geïnvesteerd kapitaal van <strong>${formatMonetaire(res30.investedCapital)}</strong> om een geschat bedrag van <strong>${formatMonetaire(res30.finalCapital)}</strong> te bereiken na 30 jaar, inclusief taksen en kosten.</li>
            </ul>
            <p style="margin-top: 10px;">U bent vrij om het opgebouwde kapitaal zonder extra kosten op te nemen vanaf het 6e beleggingsjaar.</p>
            <p style="font-size: 0.9em; font-style: italic; margin-top: 10px;">
                Ik herinner u eraan dat deze berekeningen zijn gebaseerd op een fictief rendement van <strong>8,00%</strong> (voor de veiligheid en om rekening te houden met mogelijke onderprestaties). Over een periode van ongeveer 30 jaar is het realistischer om uit te gaan van een eindrendement van 8,00% tot 14,00%.
            </p>
            <p style="margin-top: 15px;">
                <strong><u>AANBEVOLEN MAATSCHAPPIJEN</u></strong><br>
                <strong><a href="https://www.vivium.be/nl/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Verzekeringen CV (Vivium)</a></strong><br>
                U zou beleggen in de volgende fondsen:
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li><a href="https://www.blackrock.com/nl/individual/products/290846/ishares-msci-world-sri-ucits-etf" target="_blank" rel="noopener noreferrer">BlackRock iShares MSCI World SRI UCITS ETF</a></li>
                    <li><a href="https://www.amundietf.nl/nl/particulieren/producten/equity/amundi-msci-water-ucits-etf-acc/fr0014002ch1" target="_blank" rel="noopener noreferrer">Amundi MSCI Water ESG Screened UCITS ETF ACC</a></li>
                    <li><a href="https://www.amundi.nl/nl_instit/product/view/FR0011176635" target="_blank" rel="noopener noreferrer">Amundi Money Market Euro Liquidity Short Term Responsible - E (C)</a></li>
                    <li><a href="https://www.amundi.nl/nl_part/product/view/IE00BKLH2363" target="_blank" rel="noopener noreferrer">Amundi KBI Global Energy Transition Fund - Euro Class G (C)</a></li>
                    <li><a href="https://www.pv.be/documents/1465818/1336497446/Factsheet+PV+Global+Climate+Change+Equities+ETF+NL_12072023.pdf/7d819bb9-fd8b-6cb2-f00b-20d06309f708?t=1702048112735" target="_blank" rel="noopener noreferrer">Amundi Global Climate Change Equities ETF</a></li>
                </ul>
                <strong><a href="https://www.allianzgi.com/" target="_blank" rel="noopener noreferrer">Allianz Global Investor</a></strong><br>
                U zou beleggen in het volgende fonds:
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li><a href="https://www.tijd.be/market-live/fondsen/nordea-1---global-climate-and-environment-fund-bp---eur.60003833.html" target="_blank" rel="noopener noreferrer">Nordea Global Climate and Environment Fund BP - EUR</a></li>
                </ul>
            </p>
        `},
        // --- FIN SECTION MODIFIÉE ---

        dela: (capital, prime, formatMonetaire) => {
            // MODIFIÉ: Retrait des valeurs par défaut
            const formattedCapital = formatMonetaire(capital);
            const formattedPrime = formatMonetaire(prime);

            return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">UITVAARTVERZEKERING DELA:</h3>
            <p>DELA, de maatschappij waarmee ik samenwerk, biedt bijzonder voordelige oplossingen voor uitvaartverzekeringen. Dit aanbod stelt u in staat om gemoedsrust te garanderen voor uzelf en uw naasten, met competitieve tarieven aangepast aan uw situatie.</p>
            <p>Het is interessant om te weten dat de premies worden berekend op basis van uw huidige leeftijd en <strong>vast</strong> blijven zodra de dekking is ingegaan. Dit biedt u financiële stabiliteit op lange termijn.</p>
            <p style="margin-top: 10px;">Afhankelijk van uw behoeften, hier zijn enkele voorbeelden van dekking bij een maandelijkse betaling tot uw <strong>67e</strong>:</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li><strong>Verzekerd kapitaal van ${formattedCapital}:</strong> maandelijkse premie van <strong>${formattedPrime}</strong>.</li>
            </ul>
            <p>Deze dekkingen zijn <strong>levenslang</strong> geldig, en als bonus zijn kinderen jonger dan 18 jaar ook meeverzekerd.</p>
            <p>De premies kunnen uiteraard worden aangepast aan het gewenste kapitaal of de gekozen betalingsduur.</p>
        `},

        rdv: (date, time) => `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">VOOR ONZE VOLGENDE AFSPRAAK: <mark style="background-color: #FFFF00; color: #0070B0; padding: 2px 5px; border-radius: 3px; font-weight: bold;">${date} om ${time}.</mark></h3>
            <p>Ik nodig u uit om alle vragen die u heeft bij het lezen van deze e-mail op papier voor te bereiden. We zullen beginnen met het samen doornemen van de offerte en stilstaan bij de punten waarover u opheldering wenst.</p>
            <p>U kunt ook de volgende documenten voorbereiden (<u>gelieve deze niet voor onze afspraak door te sturen</u>), zodat u klaar bent om in te tekenen als alles in orde is voor u:</p>
        `,

        docs_base: `Een foto van uw identiteitskaart (voor- & achterkant apart);`,
        
        docs_eip: `
            Om een IPT af te sluiten, is de volgende informatie nodig:
            <ol style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li><strong>Bruto jaarinkomen:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Exact bedrag voor het jaar 2020.</li>
                        <li>Schatting voor 2025 (waarschijnlijk identiek aan 2024, raadpleeg uw boekhouder).</li>
                    </ul>
                </li>
                <li><strong>Burgerlijke staat:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Huwelijkse staat.</li>
                    </ul>
                </li>
                <li><strong>Gedetailleerd MyPension-overzicht:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Bestaande kapitalen in andere aanvullende pensioenen (VAPZ, andere).</li>
                    </ul>
                </li>
                <li><strong>MyCareer-overzicht:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Aantal loopbaanjaren als werknemer en/of zelfstandige.</li>
                        <li>Duur in de huidige onderneming.</li>
                    </ul>
                </li>
                <li><strong>Aanslagbiljet:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Van de twee voorgaande jaren en het afgelopen jaar.</li>
                    </ul>
                </li>
                <li><strong>Loonfiche van de bedrijfsleider.</strong></li>
                <li><strong>Bankkaart van de vennootschap (in PDF-formaat).</strong></li>
            </ol>
            <p>Deze gegevens maken het mogelijk om uw professionele en persoonlijke situatie te verifiëren, en om de naleving van de 80,00%-regel te berekenen.</p>
        `,

        outro: `
            <p style="margin-top: 20px;">Aarzel niet om contact met mij op te nemen als u vragen of specifieke verzoeken heeft. Ik ben zowel telefonisch als per e-mail bereikbaar.</p>
            <p style="margin-top: 15px;">Met vriendelijke groeten,</p>
        `
    },
    
    // =======================================================
    // ### ENGLISH ###
    // =======================================================
    en: {
        intro: (prenom, nom, email) => `
            <p><strong>To:</strong> ${email || ' '}</p>
            <p>Hello ${prenom} ${nom},</p>
            <p>I hope you are doing well.</p>
            <p>Following our recent meeting, during which we conducted a thorough analysis of your financial situation, and after evaluation by a certified advisor, I am writing to provide you with a summary of the key points discussed and recommendations tailored to your needs and long-term goals.</p>
            <p>These proposals are part of a personalized approach, taking into account the information you provided, to best assist you in optimizing and protecting your financial interests.</p>
        `,
        
        ep: (data, formatMonetaire) => {
            // ... (contenu inchangé)
            return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">Pension Savings</h3>
            <p>
                Amounts: <strong>${formatMonetaire(data.versementBrutMensuel)} GROSS</strong> (Amounts can be adjusted based on your fiscal/financial goals).<br>
                Net monthly cost: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)} / month</strong>.<br>
                Deductibility: <strong>${formatMonetaire(data.avantageFiscalAnnuel)}/year</strong>.<br>
                Investment duration - ${data.dureeVersementAnnees.toFixed(0)} years term age - 67 years.<br>
                Entry fees: <strong>3.00%</strong><br>
                Management fees (annual):
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li><strong>1.90%</strong> (PS/LTS Europe Equity AXA);</li>
                    <li><strong>0.85%</strong> (PS/LTS Multifunds AXA);</li>
                    <li><strong>1.25%</strong> (PS/LTS iShares P&V).</li>
                </ul>
                Expected return: Between 5.00% and 10.00%. <a href="https://www.wikifin.be/en/save-and-invest/investment-products/insurance-products/branch-23-insurance/what-branch-23" target="_blank" rel="noopener noreferrer">Source, expectations</a>.<br>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li style="padding: 5px;">In your case, we start with an invested capital of <strong>${formatMonetaire(data.capitalBrutPlaceTotal)}</strong> to reach an estimated amount of <strong>${formatMonetaire(data.capitalFinalNet)}</strong> at the end of the contract, including taxes and fees. The total tax benefit received amounts to <strong>${formatMonetaire(data.avantageFiscalTotal)}</strong></li>
                </ul>
            </p>
        `},

        elt: (data, formatMonetaire) => {
            // ... (contenu inchangé)
            return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">Long-Term Savings</h3>
            <p>
                Amounts: <strong>${formatMonetaire(data.versementBrutMensuel)} GROSS</strong> (Amounts can be adjusted based on your fiscal/financial goals).<br>
                Net monthly cost: <strong>${formatMonetaire(data.capitalNetPlaceMensuel)} / month</strong>.<br>
                Deductibility: <strong>${formatMonetaire(data.avantageFiscalAnnuel)} / year</strong>.<br>
                Investment duration - ${data.dureeVersementAnnees.toFixed(0)} years term age - ${data.targetAge} years.<br>
                Entry fees: <strong>3.00%</strong><br>
                Management fees (annual):
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li><strong>1.90%</strong> (PS/LTS Europe Equity AXA);</li>
                    <li><strong>0.85%</strong> (PS/LTS Multifunds AXA);</li>
                    <li><strong>0.85%</strong> (LTS IM Optimal Balance AXA);</li>
                    <li><strong>0.85%</strong> (LTS Ethna-AKTIV AXA);</li>
                    <li><strong>1.00%</strong> (LTS R-co Valor AXA);</li>
                    <li><strong>1.25%</strong> (PS/LTS iShares P&V).</li>
                </ul>
                Expected return: Between 5.00% and 10.00%. <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">Source, expectations, and others</a>.<br>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li style="padding: 5px;">In your case, we start with an invested capital of <strong>${formatMonetaire(data.capitalBrutPlaceTotal)}</strong> to reach an estimated amount of <strong>${formatMonetaire(data.capitalFinalNet)}</strong> at the end of the contract, including taxes and fees. The total tax benefit received amounts to <strong>${formatMonetaire(data.avantageFiscalTotal)}</strong></li>
                </ul>
            </p>
        `},

        ep_elt_common: (msciRate, formatMonetaire) => {
            // MODIFIÉ: S'assure que 0 est une valeur valide
            const formattedMsciRate = (typeof msciRate === 'number' ? msciRate : 8.53).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            return `
            <p style="margin-top: 15px;">
                <a href="https://www.lafinancepourtous.com/outils/calculateurs/calculateur-credit-renouvelable/" target="_blank" rel="noopener noreferrer">Savings calculator (pension, child, and investment)</a>
            </p>
            <p style="font-size: 0.9em; font-style: italic;">
                I remind you that these calculations are based on a fictitious return of 5.00% (for safety and to account for potential underperformance). Over a period of about 30 years, it is more realistic to expect a final return in the range of 5.00% to 10.00%. Over the last 37 years, the average annual return has been <strong>${formattedMsciRate}%</strong> (<a href="https://www.msci.com/documents/10199/178e6643-6ae6-47b9-82be-e1fc565ededb" target="_blank" rel="noopener noreferrer">MSCI World Index - return since 1987</a>).
            </p>
            <p style="margin-top: 15px;">
                <strong><u>Links to form an opinion:</u></strong><br>
                <a href="https://fin.belgium.be/en/individuals/tax-advantages" target="_blank" rel="noopener noreferrer">Tax advantages in Belgium.</a><br>
                <a href="https://www.brusselsstimes.com/318314/what-should-young-people-worried-about-their-pensions-be-doing" target="_blank" rel="noopener noreferrer">Young people and their pensions.</a><br>
                <a href="https://www.un.org/en/global-issues/ageing" target="_blank" rel="noopener noreferrer">Ageing of the European population.</a><br>
                <a href="https://www.brusselsstimes.com/399049/belgiums-ageing-population-presents-major-budgetary-challenges" target="_blank" rel="noopener noreferrer">Ageing of the Belgian population.</a>
            </p>
            <p style="margin-top: 15px;">
                <strong><u>RECOMMENDED COMPANIES</u></strong><br>
                <a href="https://www.axa.be/en/individuals/pension" target="_blank" rel="noopener noreferrer"><strong>AXA</strong></a>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Pension/Long-Term Savings Fund: <a href="https://www.quantalys.com/Fonds/Performances/731077" target="_blank" rel="noopener noreferrer">AXA - Pension Plan AXA Multifunds</a></li>
                    <li>Pension/Long-Term Savings Fund: <a href="https://www.comgest.com/en/lu/professional/funds/comgest-growth-europe-eur-z-acc" target="_blank" rel="noopener noreferrer">Comgest - Growth Europe Equity EUR Z Acc</a></li>
                    <li style="list-style-type: none; margin-top: 5px;">
                        <ul style="padding-left: 20px; margin-top: 5px; margin-bottom: 5px;">
                            <li>Option to switch investment branches to guarantee capital.</li>
                            <li>Stop Loss function 5 years before retirement to secure investment.</li>
                            <li>Death (natural & accidental), disability, job loss cover - optional.</li>
                        </ul>
                    </li>
                </ul>
                <a href="https://www.vivium.be/en/private-individuals/home" target="_blank" rel="noopener noreferrer"><strong>P&V Insurance CV (Vivium)</strong></a>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Pension/Long-Term Savings Fund: BlackRock - <a href="https://www.blackrock.com/en/individual/products/290846/ishares-msci-world-sri-ucits-etf" target="_blank" rel="noopener noreferrer">iShares MSCI World SRI UCITS ETF</a></li>
                    <li>Pension Savings Fund: P&V Group - <a href="https://www.tijd.be/market-live/fondsen/dynamic-multi-fund.620832117.html" target="_blank" rel="noopener noreferrer">Dynamic Multi Fund</a></li>
                </ul>
            </p>
        `},

        plci: `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">FREE SUPPLEMENTARY PENSION FOR THE SELF-EMPLOYED (PLCI/VAPZ)</h3>
            <p><strong>The PLCI/VAPZ</strong> (Free Supplementary Pension for the Self-Employed) is a savings solution that allows you to supplement your state pension while enjoying tax benefits. You contribute an amount and frequency of your choice (monthly, quarterly, semi-annually, or annually), with a ceiling set at €4,000.44 in 2025. The premiums are deductible as professional expenses, reduce your social security contributions, and allow, under certain conditions, to obtain an advance for real estate projects. At maturity, the capital is taxed advantageously.</p>
            <p>Additionally, you can pair your PLCI/VAPZ with a <strong>Guaranteed Income</strong> insurance for the self-employed, which compensates for loss of income in case of incapacity to work (illness or accident). It supplements the health insurance allowance, is tax-deductible, and is aimed at self-employed individuals under 57 domiciled in Belgium. The younger you subscribe, the more advantageous it is.</p>
            <p style="padding: 5px; margin-top: 10px;">The offer request for your Free Supplementary Pension for the Self-Employed will be handled during your next appointment.</p>
            <p style="margin-top: 15px;">
                <strong><u>RECOMMENDED COMPANIES</u></strong><br>
                <strong><a href="https://www.vivium.be/en/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Insurance CV (Vivium)</a></strong>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Free Supplementary Pension Fund: <a href="https://www.tijd.be/market-live/fondsen/dynamic-multi-fund.620832117.html" target="_blank" rel="noopener noreferrer">Dynamic Multi Fund</a></li>
                </ul>
                <strong><a href="https://www.allianzgi.com/" target="_blank" rel="noopener noreferrer">Allianz Global Investor</a></strong>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Product for Free Supplementary Pension: <a href="https://allianz.be/content/dam/onemarketing/benelu/allianz-be/downloads/en/pension/plan-for-life-plus/general-conditions/plan-for-life-plus-general-conditions-en.pdf" target="_blank" rel="noopener noreferrer">Plan For Life+</a></li>
                </ul>
            </p>
        `,

        inami: `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">INAMI/RIZIV PLAN</h3>
            <p>The INAMI/RIZIV Plan is a scheme for healthcare providers who adhere to the convention. The <strong>INAMI/RIZIV contribution</strong> is an annual allowance granted by INAMI/RIZIV in return for respecting the convention tariffs. It must be invested in a <strong>supplementary pension plan with a social character</strong>, and may also include disability cover that protects the self-employed person in case of illness or accident.</p>
            <p>The <strong>amount</strong> of the contribution varies depending on the profession and situation (e.g., new doctor, intern, etc.).</p>
            <p style="padding: 5px; margin-top: 10px;">The offer request and simulation for your INAMI/RIZIV Plan will be handled during your next appointment.</p>
            <p style="margin-top: 15px;">
                <strong><u>RECOMMENDED COMPANY</u></strong><br>
                <strong><a href="https://www.vivium.be/en/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Insurance CV (Vivium)</a></strong>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>INAMI/RIZIV Plan Fund: <a href="https://www.tijd.be/market-live/fondsen/dynamic-multi-fund.620832117.html" target="_blank" rel="noopener noreferrer">Dynamic Multi Fund</a></li>
                </ul>
            </p>
        `,

        eip: `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">INDIVIDUAL PENSION COMMITMENT (EIP/IPT)</h3>
            <p>The EIP/IPT (Individual Pension Commitment) is a pension savings solution for company directors. It is a flexible non-statutory benefit that adapts to your needs and situation. You can deduct 100% of the contributions you pay into your EIP/IPT as a professional expense, provided you respect <strong>the 80.00% rule</strong>.</p>
            <p>The 80.00% rule sets a maximum for your deductible pension savings. Here’s how it works:</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li>The sum of <strong>your state pension</strong> and <strong>your supplementary pension savings (like the EIP/IPT)</strong> cannot exceed <strong>80% of your average gross annual salary</strong>.</li>
                <li>Your gross salary includes not only your monthly salary but also any benefits you receive (like a company car).</li>
            </ul>
            <p>If you respect this rule, you can benefit from a tax advantage while building a comfortable retirement. Additionally, the premiums allow, under certain conditions, to obtain an advance for real estate projects. At maturity, the capital is taxed advantageously.</p>
            <p>Furthermore, you can pair your EIP/IPT with a <strong>Guaranteed Income</strong> insurance for the self-employed, which compensates for loss of income in case of incapacity to work (illness or accident). It supplements the health insurance allowance, is tax-deductible, and is aimed at self-employed individuals under 57 domiciled in Belgium. The younger you subscribe, the more advantageous it is.</p>
            <p style="padding: 5px; margin-top: 10px;">The offer request and simulation for your Individual Pension Commitment will be handled during your next appointment.</p>
            <p style="margin-top: 15px;">
                <strong><u>RECOMMENDED COMPANY</u></strong><br>
                <strong><a href="https://ag.be/particulieren/en?utm_medium=search-paid&utm_source=Google&utm_campaign=AG-Brand-S-EN-122020-en&utm_content=Brand&s_kwcid=AL!7641!3!430269132403!e!!g!!ag%20insurance&gad_source=1&gclid=CjwKCAiAxKy5BhBbEiwAYiW--0iMZRujDD9SqRN8MadOgYQ4KsvB6ZdBYsTI6N7TlqW1VbH-U3crSxoCXNQQAvD_BwE" target="_blank" rel="noopener noreferrer">AG Insurance</a></strong>
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li>Individual Pension Commitment Fund: <a href="https://www.tijd.be/market-live/fondsen/ag-insurance-ag-life-equity-world-aqua.60013349.html" target="_blank" rel="noopener noreferrer">AG Insurance - AG Life Equity World Aqua</a></li>
                    <li>Individual Pension Commitment Fund: <a href="https://www.tijd.be/market-live/fondsen/ag-insurance-ag-life-climate-change.60203015.html" target="_blank" rel="noopener noreferrer">AG Insurance - AG Life Climate Change</a></li>
                    <li>Individual Pension Commitment Fund: <a href="https://www.tijd.be/market-live/fondsen/ag-insurance-ag-life-real-estate.60189964.html" target="_blank" rel="noopener noreferrer">AG Insurance - AG Life Real Estate</a></li>
                    <li>Individual Pension Commitment Fund: <a href="https://www.tijd.be/market-live/fondsen/ag-insurance-ag-life-sustainable-dynamic.60052300.html" target="_blank" rel="noopener noreferrer">AG Insurance - AG Life Sustainable Dynamic</a></li>
                </ul>
            </p>
        `,

        // --- SECTION MODIFIÉE ---
        nonfiscal: (mensualite, age, res10, res20, res30, formatMonetaire) => {
            // ... (contenu inchangé)
            return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">NON-FISCAL SAVINGS</h3>
            <p>
                Amounts: <strong>${formatMonetaire(mensualite)} GROSS</strong> (Amounts can be adjusted based on your fiscal/financial goals).<br>
                Fees on contribution: <strong>3.00% / month</strong><br>
                Tax on contribution: <strong>2.00% / month</strong><br>
                Tax on capital gains: <strong>10.00%</strong> (on gains exceeding €10,000)<br>
                Expected return: Between 8.00% and 14.00%. <a href="https://www.msci.com/documents/10199/178e6643-6ae6-47b9-82be-e1fc565ededb" target="_blank" rel="noopener noreferrer">Source</a> and <a href="https://bourse101.fr/calculatrice-financiere-interet-compose/" target="_blank" rel="noopener noreferrer">calculator</a>.<br>
            </p>
            <p style="margin-top: 10px;">Investment duration - 10 years term age - ${(parseInt(age) || 0) + 10} years.</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li style="padding: 5px;">In your case, we start with an invested capital of <strong>${formatMonetaire(res10.investedCapital)}</strong> to reach an estimated amount of <strong>${formatMonetaire(res10.finalCapital)}</strong> at the end of 10 years, including taxes and fees.</li>
            </ul>
            <p style="margin-top: 10px;">Investment duration - 20 years term age - ${(parseInt(age) || 0) + 20} years.</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li style="padding: 5px;">In your case, we start with an invested capital of <strong>${formatMonetaire(res20.investedCapital)}</strong> to reach an estimated amount of <strong>${formatMonetaire(res20.finalCapital)}</strong> at the end of 20 years, including taxes and fees.</li>
            </ul>
            <p style="margin-top: 10px;">Investment duration - 30 years term age - ${(parseInt(age) || 0) + 30} years.</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li style="padding: 5px;">In your case, we start with an invested capital of <strong>${formatMonetaire(res30.investedCapital)}</strong> to reach an estimated amount of <strong>${formatMonetaire(res30.finalCapital)}</strong> at the end of 30 years, including taxes and fees.</li>
            </ul>
            <p style="margin-top: 10px;">You are free to withdraw the accumulated capital without additional fees from the 6th year of investment.</p>
            <p style="font-size: 0.9em; font-style: italic; margin-top: 10px;">
                I remind you that these calculations are based on a fictitious return of <strong>8.00%</strong> (for safety and to account for potential underperformance). Over a period of about 30 years, it is more realistic to expect a final return in the range of 8.00% to 14.00%.
            </p>
            <p style="margin-top: 15px;">
                <strong><u>RECOMMENDED COMPANIES</u></strong><br>
                <strong><a href="https://www.vivium.be/en/private-individuals/home" target="_blank" rel="noopener noreferrer">P&V Insurance CV (Vivium)</a></strong><br>
                You would invest in the following funds:
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li><a href="https://www.blackrock.com/en/individual/products/290846/ishares-msci-world-sri-ucits-etf" target="_blank" rel="noopener noreferrer">BlackRock iShares MSCI World SRI UCITS ETF</a></li>
                    <li><a href="https://www.amundietf.co.uk/en/individual/products/equity/amundi-msci-water-ucits-etf-acc/fr0014002ch1" target="_blank" rel="noopener noreferrer">Amundi MSCI Water ESG Screened UCITS ETF ACC</a></li>
                    <li><a href="https://www.amundi.com/en_instit/product/view/FR0011176635" target="_blank" rel="noopener noreferrer">Amundi Money Market Euro Liquidity Short Term Responsible - E (C)</a></li>
                    <li><a href="https://www.amundi.com/en_part/product/view/IE00BKLH2363" target="_blank" rel="noopener noreferrer">Amundi KBI Global Energy Transition Fund - Euro Class G (C)</a></li>
                    <li><a href="https://www.pv.be/documents/1465818/1336497446/Factsheet+PV+Global+Climate+Change+Equities+ETF+EN_12072023.pdf/7d819bb9-fd8b-6cb2-f00b-20d06309f708?t=1702048112735" target="_blank" rel="noopener noreferrer">Amundi Global Climate Change Equities ETF</a></li>
                </ul>
                <strong><a href="https://www.allianzgi.com/" target="_blank" rel="noopener noreferrer">Allianz Global Investor</a></strong><br>
                You would invest in the following fund:
                <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                    <li><a href="https://www.tijd.be/market-live/fondsen/nordea-1---global-climate-and-environment-fund-bp---eur.60003833.html" target="_blank" rel="noopener noreferrer">Nordea Global Climate and Environment Fund BP - EUR</a></li>
                </ul>
            </p>
        `},
        // --- FIN SECTION MODIFIÉE ---

        dela: (capital, prime, formatMonetaire) => {
            // MODIFIÉ: Retrait des valeurs par défaut
            const formattedCapital = formatMonetaire(capital);
            const formattedPrime = formatMonetaire(prime);

            return `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">DELA FUNERAL COVER:</h3>
            <p>DELA, the company I partner with, offers particularly advantageous funeral cover solutions. This offer allows you to ensure peace of mind for yourself and your loved ones, with competitive rates tailored to your situation.</p>
            <p>It is interesting to note that the premiums are calculated based on your current age and remain <strong>fixed</strong> once the cover is in place. This provides you with long-term financial stability.</p>
            <p style="margin-top: 10px;">Depending on your needs, here are a few examples of cover with a monthly payment until age <strong>67</strong>:</p>
            <ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li><strong>Insured capital of ${formattedCapital}:</strong> monthly premium of <strong>${formattedPrime}</strong>.</li>
            </ul>
            <p>This cover is valid <strong>for life</strong>, and as a bonus, children under 18 are also included in the protection.</p>
            <p>The premiums can, of course, be adjusted according to the desired capital or the chosen payment duration.</p>
        `},

        rdv: (date, time) => `
            <h3 style="color: #0070B0; border-bottom: 2px solid #0070B0; padding-bottom: 5px; margin-top: 20px; font-family: 'Inter', sans-serif;">FOR OUR NEXT APPOINTMENT: <mark style="background-color: #FFFF00; color: #0070B0; padding: 2px 5px; border-radius: 3px; font-weight: bold;">${date} at ${time}.</mark></h3>
            <p>I invite you to prepare any questions you may have after reading this email. We will start by detailing the offer together and focus on the points you would like clarification on.</p>
            <p>You can also prepare the following documents (<u>please do not send them before our meeting</u>), so you are ready to subscribe if everything is in order for you:</p>
        `,

        docs_base: `A photo of your identity card (front & back separately);`,
        
        docs_eip: `
            To subscribe to an EIP/IPT, the following information is needed:
            <ol style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px;">
                <li><strong>Gross annual remuneration:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Exact amount for the year 2020.</li>
                        <li>Estimate for 2025 (likely identical to 2024, refer to your accountant).</li>
                    </ul>
                </li>
                <li><strong>Marital status:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Marital status.</li>
                    </ul>
                </li>
                <li><strong>Detailed MyPension summary:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Existing capital in other supplementary pensions (PLCI/VAPZ, others).</li>
                    </ul>
                </li>
                <li><strong>MyCareer summary:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>Number of career years as an employee and/or self-employed.</li>
                        <li>Duration in the current company.</li>
                    </ul>
                </li>
                <li><strong>Tax assessment notice:</strong>
                    <ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 15px;">
                        <li>From the two previous years and the past year.</li>
                    </ul>
                </li>
                <li><strong>Pay slip of the company director.</strong></li>
                <li><strong>Company bank card (in PDF format).</strong></li>
            </ol>
            <p>This data allows for verification of your professional and personal situation, as well as calculating compliance with the 80.00% rule.</p>
        `,

        outro: `
            <p style="margin-top: 20px;">Please do not hesitate to contact me if you have any questions or specific requests. I am available by phone or by replying to this email.</p>
            <p style="margin-top: 15px;">Best regards,</p>
        `
    }
};
