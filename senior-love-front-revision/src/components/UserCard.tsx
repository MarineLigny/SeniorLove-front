import { Link } from "react-router-dom";
import type IUsers from "../@types/users";
import calculateAge from "../utils/calculateAge";
import { MessageCircle } from 'lucide-react';
interface UserCardProps {
    user: IUsers
}

export default function UserCard({user}: UserCardProps){
    //console.log(user.localisation.city)
    //console.log(user);
    //console.log(user.profile_picture);
    return (
        <article className="meetCard"> 
                <Link className="messageBtn" to={`/message/${user.id}`}>
                    <MessageCircle className="messageBtn-icone"/>
                </Link>

                {user.profile_picture ? 
                <img className="meetCard-avatar" src={`http://marineligny-server.eddi.cloud${user.profile_picture}`} alt={`${user.pseudo}'s profile`} /> 
                : <img className="meetCard-avatar-color" src="/img/avatar3.png" alt={`${user.pseudo}'s profile`} /> }
                
                

                <div className="meetCard-text"> 
                    <h2>{user.pseudo}</h2>
                    <p className="particle">{calculateAge(user.birth_date)} ans</p>
                    <p className="particle" >{user.localisation?.city || "ville inconnue"}</p>

                    <a href={`/profile/${user.pseudo}`}  className="btnArticleMeet" >Voir Plus</a>                

                </div> 
        </article>
    );
};