

export default function ConversationPage() {

  return (
    <div className="pc-container">
      <h1 className="pc-title">Politique de Confidentialité</h1>
      <p className="pc-date">Dernière mise à jour : 11/09/2025</p>

      <section className="pc-section">
        <h2 className="pc-section-title">1.Données collectées</h2>
        <p> Lors de votre inscription, nous collectons les données suivantes : </p>
        <ul className="pc-section-list">
          <li>Adresse email (obligatoire)</li>
          <li>Mot de passe (obligatoire)</li>
          <li>Date de naissance (obligatoire)</li>
          <li>Pseudo (obligatoire)</li>
          <li>Nom et prénom (facultatif)</li>
          <li>Photo de profil (facultatif)</li>
          <li>Sexe (facultatif)</li>
          <li>Ville (facultatif)</li>
          <li>Description personnelle (facultatif)</li>
        </ul>
      </section>

      <section className="pc-section">
        <h2 className="pc-section-title">2. Finalité</h2>
        <p>
          Ces données sont utilisées uniquement pour permettre la création d’un compte utilisateur
          dans le cadre d’un test de développement. Elles ne sont ni partagées ni utilisées à des
          fins commerciales. Ce site n’a pas vocation à être mis en production.
        </p>
      </section>

      <section className="pc-section">
        <h2 className="pc-section-title">3. Stockage et durée de conservation</h2>
        <p>
          Vos données sont stockées en base de données de manière sécurisée. Elles sont conservées
          pour une durée minimale strictement nécessaire au bon fonctionnement du test, puis
          supprimées.
        </p>
      </section>

      <section className="pc-section">
        <h2 className="pc-section-title">4. Sécurité</h2>
        <p>
          Vos données sont protégées par des mesures techniques :
        </p>
        <ul className="pc-section-list">
          <li>Connexion sécurisée via HTTPS</li>
          <li>Mots de passe chiffrés avec une méthode de hachage sécurisée</li>
          <li>Accès restreint uniquement au développeur</li>
          <li>Utilisation de tokens JWT pour les sessions</li>
          <li>Renouvellement automatique des tokens via refresh tokens stockés en cookies HttpOnly</li>
        </ul>
      </section>

      <section className="pc-section">
        <h2 className="pc-section-title">5. Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez des droits suivants :
        </p>
        <ul className="pc-section-list">
          <li>Droit d'accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit de suppression (droit à l’oubli)</li>
          <li>Droit de limitation du traitement</li>
          <li>Droit d’opposition au traitement</li>
        </ul>
        <p className="mt-2">
          Pour exercer vos droits, contactez :{" "}
          <a href="mailto:emmanuelle.eisele@outlook.com">
            emmanuelle.eisele@outlook.com
          </a> ou{" "}
          <a href="mailto:mligny.dev@gmail.com">
            mligny.dev@gmail.com
          </a>
        </p>
      </section>

      <section className="pc-section">
        <h2 className="pc-section-title">6. Contact</h2>
        <p>
          Pour toute question concernant vos données ou cette politique de confidentialité, vous
          pouvez nous contacter à l’adresse suivante :{" "}
          <a href="mailto:emmanuelle.eisele@outlook.com">
            emmanuelle.eisele@outlook.com
          </a> ou{" "}
          <a href="mailto:mligny.dev@gmail.com">
            mligny.dev@gmail.com
          </a>
        </p>
      </section>

      <p className="pc-p">
        En utilisant ce site, vous acceptez cette politique de confidentialité.
      </p>
    </div>
  );
};