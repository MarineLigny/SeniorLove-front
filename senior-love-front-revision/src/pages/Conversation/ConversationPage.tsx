import { ArrowLeft, SendHorizontal } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { AxiosError } from 'axios';
import type IMessage from '../../@types/message';
import htmlUnescape from '../../utils/unescape';

export default function ConversationPage() {
    const navigate = useNavigate(); // utile pour naviguer entre differents lien
    const { contactId } = useParams<{ contactId: string }>(); //recupération de l'id du contact
    const [message, setMessage] = useState<IMessage[]>([]); //import  des messages
    const [error, setError] = useState("");
    // si on utilise message dans le fetch de get, alors cela reload à l'infini, mieux vaut appeler un autre state ici nommé reloadMessage 
    const [reloadMessages, setReloadMessages] = useState(0);


    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const contactIdNumber = Number(contactId);

        //console.log("contactId:", contactId);
        //console.log("contactIdNumber:", Number(contactId));
        //console.log("token:", storedToken);

        // ---------------Vérifie que l'ID est bien un nombre valide----------------------
        if (!storedToken || !contactId || Number.isNaN(contactIdNumber)) {
            setError("Contact introuvable");
            navigate("/404");
            return;
        }


        //---------------ici la fonction pour recuperer l'historique de messagerie------------
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:3000/message/${contactIdNumber}`, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`, // Utilisation du token pour l'authentification
                    }
                });

                console.log(response.data);
                setMessage(response.data);

            } catch (err) {
                const axiosError = err as AxiosError;
                console.error("Erreur axios :", axiosError);
                if (axiosError.response) {
                    setError(
                        typeof axiosError.response.data === "string"
                            ? axiosError.response.data
                            : "Accès non autorisé ou erreur serveur"
                    );
                } else {
                    setError("Impossible de contacter le serveur");
                }
                navigate("/404"); // Rediriger vers la page 404 en cas d'erreur
            }
        }
        fetchData(); //on appel le fetch
    }, [contactId, navigate, reloadMessages]); //refresh a chaque changement dans l'url   

    // -------------ici c'est la fonction pour mettre en forme un message et l'envoyer--------------
    async function messageForm(formData: FormData) {
        try {
            const storedToken = localStorage.getItem("token");
            const contactIdNumber = Number(contactId);
            console.log(contactIdNumber)

            // on récupère les données grace à la méthode "get" du formdata et au "name" de l'input
            const messages = formData.get('content') as string;

            const response = await axios.post(`http://localhost:3000/message/${contactIdNumber}`,
                {
                    content: messages,
                },

                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                }
            );
            // Ajoute le nouveau message dans la liste des messages
            setMessage([...message, response.data]);

            // Incrémente le compteur reloadMessages pour déclencher le useEffect si besoin
            setReloadMessages(prev => prev + 1);

        } catch (err) {
            const axiosError = err as AxiosError;
            console.error("Erreur axios :", axiosError);

        }
    };
    // ------------------------------------------------------------------------
    if (error || !contactId) return <p>{error || "Contact introuvable"}</p>;

    return (
        <div>
            <button // le css se retrouve sur ProfilPageViewer.scss
                onClick={() => navigate(-1)}
                type="button"
                className="btn-back">
                <ArrowLeft />
                Retour
            </button>

            {/*<h1>{message.pseudo}</h1>*/}

            <div className="allMessage">
                {message?.map((msg) => {
                    return (
                        <div key={msg.id}>
                            <h4>{msg.sender?.pseudo}</h4>
                            <section className="message">
                                <p>{htmlUnescape(msg.content)}</p>
                            </section>
                            <p className="date">{new Date(msg.createdAt).toLocaleString()}</p>
                        </div>
                    )
                })}
            </div>

            <div className='create-message'>
                <h4 className="bannerMessage">Message</h4>
                <form action={messageForm} className='message-form'>
                    <textarea name="content" className="MyNewMessage" placeholder="Entrer votre message" />
                    <button className='message-send-btn' type='submit' value='Envoyer'>
                        <SendHorizontal className='message-send-icon' />
                    </button>
                </form>
            </div>

        </div>
    );
};