import { useEffect, useState } from "react";
import type IUsers from "../../@types/users";
import MyMessageCard from "../../components/MyMessageCard";
import axios from "axios";



export default function MyMessagePage() {
   // import des users, creation de la liste via State et récupération des infos vie IUsers
   const [usersList, setUsersList] = useState<IUsers[]>([]);
   // recupération du token pour identification
   const storedToken = localStorage.getItem("token");

   useEffect(() => {
      const getContacts = async () => {
         try {
            //appel de la route en api pour récupérer les info, via axios
            const response = await axios.get("https://seniorlove.up.railway.appmessaging",
               {
                  headers: {
                     Authorization: `Bearer ${storedToken}`,
                  },
               },
            );
            console.log('call de responsedata', response.data);
            setUsersList(response.data);
         } catch (error) {
            console.log("l'appel à l'API rencontre un problème", error)
         }
      };
      console.log('ici se trouve la liste de mes contact', getContacts())
      getContacts();
   }, [storedToken])

   return (
      <div>
         <h1>Messagerie</h1>
         <div className="content">
            <div className="contactsPage">
               <section className="contactsPage-title">
                  <h2 className="contactsPage-title">contacts</h2>
               </section>

               <section className="contactsPage-card">
                  {usersList.map(user => (
                     <MyMessageCard key={user.id} user={user} />
                  ))}
               </section>
            </div>
         </div>

      </div>
   );
};