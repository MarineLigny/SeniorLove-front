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
                <img className="articlePictMeet" src={`https://emmanuelleeisele-server.eddi.cloud${user.profile_picture}`} alt={`${user.pseudo}'s profile`} /> 
                : <img className="articlePictMeet avatar" src="/img/avatar3.png" alt={`${user.pseudo}'s profile`} /> }
                
                
                
                {//<img className="articlePictMeet" src={
                    //user.profile_picture
                    //? `https://emmanuelleeisele-server.eddi.cloud${user.profile_picture}` //soit image fournit
                    //: "/img/avatar-SVG.png" // soit image d'un avatar en dur
                    //} alt={`${user.pseudo}`} />
                }

                <div className="articlePictMeet-text"> 
                    <h2>{user.pseudo}</h2>
                    <p className="particle">{calculateAge(user.birth_date)} ans</p>
                    <p className="particle" >{user.localisation?.city || "ville inconnue"}</p>

                    <a href={`/profile/${user.pseudo}`}  className="btnArticleMeet" >Voir Plus</a>                

                </div> 
        </article>
    );
};