// core/constants.js

export const CURRENT_YEAR = new Date().getFullYear();
export const AGE_TAXE = 60;
export const AGE_FINALE_DEFAUT = 67;
export const AGE_FINALE_LT = 80;
export const AGE_MAX_VERSEMENT_EP = 64; // On ne verse plus dans une EP après 64 ans
export const FRAIS_DEFAUT = {
    pension: { fraisEntree: 3, fraisCourant: 0.85 },
    'long-terme': { fraisEntree: 3, fraisCourant: 1 }
};
export const LIMITES_VERSEMENT = {
    pension: { min: 30, max: 112.50 },
    'long-terme': { min: 30, max: 205 }
};