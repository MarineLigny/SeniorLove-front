import { Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Page404.scss";

export default function NotFoundPage(){
    const navigate = useNavigate();

  return(
    <div className="not-found">
      <h1 className="not-found-404">4 <Heart className="not-found-icon" /> 4</h1>
      <h2 className="not-found-title">Oups ! Page introuvable</h2>
      <p className="not-found-message">
        Même après toutes ces années, on peut encore se perdre…
        Mais pas d'inquiétude, votre moitié vous attend quelque part <Heart className="not-found-message-heart"/>
      </p>
      <button type='button' onClick={() => navigate("/")} className="not-found-btn">
        <ArrowLeft className="not-found-btn-icon" />
        Retour à l'accueil
      </button>
    </div>
  )

}