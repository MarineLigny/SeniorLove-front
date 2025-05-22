import { Link } from 'react-router-dom';
import type IEvent from '../@types/events';

  
  type Props = {
    event: IEvent;
  };

export default function EventCard({ event }: Props){
    return (
            <article className="event ">
            <Link to={`/event/${event.id}`}>
                <img
                    className="articlepict"
                    src={event.picture || "/img/default.jpg"}
                    alt={event.name}
                />

                <h2>{event.name} - {event?.localisation?.city}</h2>
                {/*<p className="particle-event">{event.description}</p>*/}

                <button type="button" className="btnarticle">Voir Plus</button>
            </Link>
            </article>
        
    );
};