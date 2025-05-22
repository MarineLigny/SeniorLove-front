export type InterestCategory = 
| "Loisirs"
| "Culture"
| "Sport"
| "Bien-être"
| "Style de vie"
| "Jeux"
| "Musique"
| "Nature";

export type Interests = {
    [K in InterestCategory]: {
        [activity: string]: boolean;
    };
};