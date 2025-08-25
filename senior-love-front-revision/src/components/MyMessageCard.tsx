import { Link } from "react-router-dom";
import type IUsers from "../@types/users";
import calculateAge from "../utils/calculateAge";
import { MessageCircle } from "lucide-react";
interface UserMessageCardProps {
   user: IUsers
}



export default function MyMessageCard({ user }: UserMessageCardProps) {

   return (
      <article className="user-card">
         <Link className="messageBtn" to={`/message/${user.id}`}>
            <MessageCircle className="messageBtn-icone" />
         </Link>

         {user.profile_picture ?
            <img className="user-card-img" src={`https://seniorlove.up.railway.app/${user.profile_picture}`} alt={`${user.pseudo}'s profile`} />
            : <img className="user-card-img avatar" src="/img/avatar3.png" alt={`${user.pseudo}'s profile`} />}

         <div className="user-card-text">
            <h2 className="user-card-title">{user.pseudo}</h2>
            <p className="user-card-p">{calculateAge(user.birth_date)} ans</p>
            <p className="user-card-p" >{user.localisation?.city || "ville inconnue"}</p>

            <a href={`/profile/${user.pseudo}`} className="btn-see-more" >Voir Plus</a>

         </div>
      </article>
   );
};