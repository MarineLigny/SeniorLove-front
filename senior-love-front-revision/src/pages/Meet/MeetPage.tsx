import FilterBar from "../../components/FilterBar";
import UserCard from "../../components/UserCard";
import { useEffect, useState } from "react";
import axios from "axios";
import type IUsers from "../../@types/users";


export default function MeetPage() {
	const [usersList, setUsersList] = useState<IUsers[]>([]);
    const storedToken = localStorage.getItem("token");

	useEffect(() => {
		const getUsers = async () => {
			try {
				//const storedToken = localStorage.getItem("token");
				const response = await axios.get(
					"http://marineligny-server.eddi.cloud/meet",
					{
						headers: {
							Authorization: `Bearer ${storedToken}`,
						},
					},
				);
				// console.log(response.data)
				setUsersList(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		getUsers();
	}, [storedToken]);

	return (
		<div>
			<FilterBar />

			<div className="allMeet">
				<section className="title">
					<h1>Rencontres</h1>
				</section>

				<section className="meets">
                    {usersList.map(user => (
                        <UserCard key={user.id} user={user}/>
                    ))}
				</section>
			</div>

		</div>
	);
}
