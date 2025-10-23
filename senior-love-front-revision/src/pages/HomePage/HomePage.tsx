import { useState } from "react";
import ModalRegister from "../../components/ModalRegister";

type Props = {
  onRegisterSuccess: () => void;
};

export default function HomePage({ onRegisterSuccess }: Props) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const token = localStorage.getItem("accessToken");

  return (
    <div>
      <section className="header">
        <div className="header-text">
          <h1 className="header-text-title">
            Senior Love, Le site de rencontre pour les + 60 ans
          </h1>
          <p className="header-text-intro">
            Ce site vous permet de rencontrer d'autres seniors dans votre
            région. Inscrivez-vous gratuitement pour démarrer votre aventure
            amoureuse en toute sécurité.
          </p>
        </div>
        <img
          className="header-image"
          src="/img/old-couple-header.jpg"
          alt="Décor flou"
        />
      </section>

      <section className="teaser content">
        <div className="teaser-main ">
          <div className="teaser-main-text">
            <h2 className="teaser-main-title">
              Faites des rencontres sérieuses dès aujourd’hui !
            </h2>
            <p className="teaser-main-p">
              Bienvenue sur notre site dédié à toutes les personnes de 60 ans et
              plus, qui souhaitent partager de nouveaux moments à deux. Ici, pas
              de jugements ni de pression : simplement des échanges sincères,
              des liens profonds et la possibilité de vivre ou revivre une belle
              histoire. Osez tourner une nouvelle page… elle pourrait bien être
              la plus belle
            </p>
            {token && ( //si je suis connecté je vois 'rencontres'
              <button className="teaser-main-btn" type="button">
                <a href="/meet">Rencontres</a>
              </button>
            )}
            {!token && ( //si je suis deconnecté je vois 's'inscrire'
              <button
                className="teaser-main-btn"
                type="button"
                onClick={() => setShowRegisterModal(true)}
              >
                {" "}
                S'inscrire
              </button>
            )}

            {showRegisterModal && (
              <ModalRegister
                onClose={() => setShowRegisterModal(false)}
                onRegisterSuccess={() => {
                  setShowRegisterModal(false);
                  onRegisterSuccess();
                }}
              />
            )}
          </div>
          <img
            className="teaser-main-img"
            src="img/old-couple-flowers.jpg"
            alt="Rencontre Senior"
          />
        </div>
      </section>

      <section className="presentation-section content">
        <h2 className="presentation-title">Comment ça marche ?</h2>
        <div className="presentation">
          <div className="presentation-left">
            <ul className="presentation-list">
              <li>
                <p className="presentation-text-title">Inscription</p>
                <p className="presentation-text">
                  Créer un compte ne prend que quelques minutes. Aucun
                  engagement, aucune pression : vous êtes ici pour explorer à
                  votre rythme.
                </p>
              </li>

              <li>
                <p className="presentation-text-title">Remplir son profil</p>
                <p className="presentation-text">
                  Plus votre profil est complet, plus il sera facile de créer
                  des échanges vrais et sincères. Nul besoin d’en faire trop,
                  l’essentiel est d’être vous-même.
                </p>
              </li>

              <li>
                <p className="presentation-text-title">
                  Trouver un profil qui vous correspond
                </p>
                <p className="presentation-text">
                  Que vous cherchiez une belle amitié, une complicité naissante
                  ou une véritable histoire d’amour, vous êtes au bon endroit.
                  Prenez le temps de lire, de ressentir, d’imaginer.
                </p>
              </li>

              <li>
                <p className="presentation-text-title">Envoyer un message</p>
                <p className="presentation-text">
                  Un simple bonjour peut tout changer. Lancez la conversation,
                  le reste se fera naturellement.
                </p>
              </li>
            </ul>
          </div>
          <img
            className="presentation-img"
            src="img/old-pc.jpg"
            alt="Rencontre Senior"
          />
        </div>
      </section>

      <section className="events-section content">
        <h2 className="events-section-title">Événements</h2>
        <div className="events-cards">
          <div className="event-card">
            <img className="event-card-img" src="./img/paris.jpg" alt="Paris" />
            <p className="event-card-p">Parlons en terrasse, Paris</p>
          </div>
          <div className="event-card">
            <img
              className="event-card-img"
              src="./img/lyon-meilleur-pire-arrondissements.jpg"
              alt="Lyon"
            />
            <p className="event-card-p">Visite de la ville, Lyon</p>
          </div>
          <div className="event-card">
            <img
              className="event-card-img"
              src="./img/bordeauxrue02.jpg"
              alt="Bordeaux"
            />
            <p className="event-card-p">Visite de la ville, Bordeaux</p>
          </div>
        </div>
        <p className="events-section-p">
          Envie d'en voir plus ? Inscrivez vous dès maintenant et découvrez
          notre panoplie d'évenements!
        </p>
      </section>
    </div>
  );
}
