import { useState } from "react";
import ModalRegister from "../../components/ModalRegister";

type Props = {
  //onClose: () => void;
  onRegisterSuccess: () => void;
};

export default function HomePage({onRegisterSuccess }: Props) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const token = localStorage.getItem("token");

  return (
    <div>
        
        <section className="hero">
          <div className="hero_text">
            <h1>Senior Love, Le site de rencontre pour les 60 ans et +</h1>
            <p>Ce site vous permet de rencontrer d'autres seniors dans votre région. Inscrivez-vous gratuitement pour démarrer votre aventure amoureuse en toute sécurité.</p>
          </div>
        </section>

        <section className='homeCard'>
          <div className="card_flex">
            <img src="img/rencontre1.jpg" alt="Rencontre Senior" />
            <div>
              <h2 className="section_title">Faites des rencontres sérieuses dès aujourd’hui !</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis voluptatum nihil consequatur. Labore, amet magni! Fugit itaque aspernatur laborum! Nulla recusandae vitae quo adipisci, minima nostrum dignissimos amet doloribus deserunt dicta aut odio dolor asperiores numquam at, mollitia possimus consequuntur harum. Sed nisi quod unde ad? Ex qui totam eos!</p>
              {token && ( //si je suis connecté je vois 'rencontres'
                <button type="button"><a href="/meet">Rencontres</a></button>
              )}
              {!token && ( //si je suis deconnecté je vois 's'inscrire'
              <button type="button" onClick={()=> setShowRegisterModal(true)}> S'inscrire</button>
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
          </div>
        </section>

        <section className='homeCard'>
          <div className='card_flex'>
            <div>
              <h2 className="section_title">Comment ça marche ?</h2>
              <ul>
                <li className="homeCard-li">Inscription</li>
                <p>Body text for whatever you’d like to expand on the main point. </p>
                <li className="homeCard-li">Remplir son profil </li>
                <p>Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes.</p>
                <li className="homeCard-li">Trouver un profil qui vous correspond</li>
                <p>Body text for whatever you’d like to add more to the main point. It provides details, explanations, and context.</p>
                <li className="homeCard-li">Envoyer un message</li>
                <p>Body text for whatever you’d like to add more to the main point.</p>
              </ul>
            </div>
            <img src="img/istockphoto-904172104-2048x2048 (1).jpg" alt="Rencontre Senior" />
          </div>
        </section>

        <section className='homeCard'>
          <h2 className="section_title">Événements</h2>
          <div className="cards">
            <div className="card">
              <img className="card-img" src="./img/paris.jpg" alt="Paris" />
              <p className="card-p">Parlons en terrasse, Paris</p>
            </div>
            <div className="card">
              <img className="card-img" src="./img/lyon-meilleur-pire-arrondissements.jpg" alt="Lyon" />
              <p className="card-p">Visite de la ville, Lyon</p>
            </div>
            <div className="card">
              <img className="card-img" src="./img/bordeauxrue02.jpg" alt="Bordeaux" />
              <p className="card-p">Visite de la ville, Bordeaux</p>
            </div>
          </div>
          <p className="homeCard-p">Envie d'en voir plus ? Inscrivez vous dès maintenant et découvrez notre panoplie d'évenements!</p>
        </section>

        <section className='homeCard'>
          <h2 className="section_title">Témoignages</h2>
          <div className="testimonials">
          <div className="testimonial">
              <p>"Je suis venu chercher l’amour... je repars avec Mireille et une passion pour les puzzles 1000 pièces. Que demander de plus ?"</p>
              
              <div className="testimonial_footer">
                <img src="./img/senior3.jpg" alt="Michel, 68 ans" />
                <small>– Michel, 68 ans</small>
              </div>
            </div>
            <div className="testimonial">
              <p>"Il m’a invitée à danser dès notre premier tchat. Deux semaines plus tard, il m’a fait tourner la tête (et une entorse au genou). Je recommande ❤️"</p>
              
              <div className="testimonial_footer">
                <img src="./img/senior2.jpg" alt="Josette, 70 ans" />
                <small>– Josette, 70 ans</small>
              </div>
            </div>
            <div className="testimonial">
              <p>"Il m’a envoyé une rose virtuelle, puis une vraie… puis 12. Maintenant je dois faire de la place sur le balcon."</p>
              
              <div className="testimonial_footer">
                <img src="./img/senior1.jpg" alt="profil de Lucette, 69 ans" />
                <small>– Lucette, 69 ans</small>
              </div>
            </div>
          </div>
        </section>
    </div>
  )
}
