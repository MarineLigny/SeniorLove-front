
export default function calculateAge(birthDate: Date | string): number {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    // On calcule la différence de mois et de jours pour voir si l’anniversaire a déjà eu lieu cette année.
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
    
    // Si on est avant le mois de naissance, 
    // ou dans le mois d'anniversaire mais avant le jour, alors on retire 1 an.
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--; 
    }

    return age;
}

