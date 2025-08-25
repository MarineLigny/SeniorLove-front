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
                    className="event-picture"
                    src={event.picture || "/img/default.jpg"}
                    alt={event.name}
                />

                <h2>{event.name} - {event?.localisation?.city}</h2>

                <button type="button" className="btnarticle">Voir Plus</button>
            </Link>
            </article>
        
    );
};

