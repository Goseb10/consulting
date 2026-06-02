export function calculerPrimeDela(age, capital, ageTerme = 67) {
    // Base : une prime pour 1000€ à 18 ans est d'environ 0.45€/mois
    const baseRate = 0.45; 
    const dureePaiement = ageTerme - age;
    
    if (dureePaiement <= 0) return 0;

    // Facteur d'âge : la prime augmente de façon exponentielle avec l'âge
    // car la probabilité de décès augmente et la durée de cotisation diminue.
    let facteurAge = Math.pow(1.07, (age - 18)); 
    
    // Ajustement selon la durée (plus la durée est courte, plus la prime est haute)
    let ajustementDuree = 49 / dureePaiement; 

    let primeBruteMensuelle = (baseRate * (capital / 1000) * facteurAge * ajustementDuree);
    
    // Ajout de la taxe de 2% obligatoire en Belgique
    return primeBruteMensuelle * 1.02;
}