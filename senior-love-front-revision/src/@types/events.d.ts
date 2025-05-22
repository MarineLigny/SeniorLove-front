import type IUsers from "./users";

export default interface IEvent  {
  id: number;
  name: string;
  date: Date;
  description: string;
  availability: number;
  disponibility: boolean;
  picture: string;
  localisation: {
    id: number;
    city: string;
    department: string;
    } | null;
    users: IUsers[];
  };