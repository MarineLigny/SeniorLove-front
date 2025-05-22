import { Link } from "react-router-dom";
import type IUsers from "../@types/users";
import calculateAge from "../utils/calculateAge";
import { MessageCircle } from "lucide-react";
interface UserMessageCardProps {
    user: IUsers
}



export default function MyMessageCard({user}: UserMessageCardProps){
    
    return (
        <article className="meetCard">
            <Link className="messageBtn" to={`/message/${user.id}`}>
                <MessageCircle className="messageBtn-icone"/>
            </Link>
            <img className="articlePictMeet" src={
                    user.profile_picture
                    ? `http://marineligny-server.eddi.cloud${user.profile_picture}` //soit image fournit
                    : "/img/hero1.jpg" // soit image d'un avatar en dur
                    } alt={`${user.pseudo}`} />
            <h2>{user.pseudo}</h2>
            <p className="particle">{calculateAge(user.birth_date)} ans</p>
            <p className="particle" >{user.localisation?.city || "ville inconnue"}</p>

            <a href={`/profile/${user.pseudo}`}  className="btn-message" >Voir Profil</a>
        </article>
    );
};