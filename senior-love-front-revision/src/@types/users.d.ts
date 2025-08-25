import type IEvent from "./events";
import type Interest from "../pages/ProfilPage";


export default interface IUsers {
   id: number;
   firstname: string;
   lastname: string;
   email: string;
   pseudo: string;
   city: string;
   profile_picture: string;
   gender: string;
   description: string;
   birth_date: Date;
   role: string;
   localisation: {
      id: number;
      city: string;
      department: string;
   } | null;
   activities: {
      id: number;
      name: string;
      category: {
         id: number;
         name: string;
      };
   }[];
   events: IEvent[];

   interest: Interest;
}
