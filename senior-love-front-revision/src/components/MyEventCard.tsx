import type IEvent from "../@types/events";

type MyEventProps = {
	event: IEvent; 
};
export default function MyEventCard({ event }: MyEventProps){
    return ( 
        <article className="event">
                    <img className="event-picture" src={event.picture} alt="bike" />
                    <h2>{event.name} - {event?.localisation?.city}</h2>
                    <p className="particle-event">{event.description}</p>
                </article>
    ); 
};