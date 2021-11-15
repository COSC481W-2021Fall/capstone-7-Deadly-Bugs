import { useHistory } from "react-router-dom";
import "./NavBar.css";

/*
Expected something like this
navConfig: [{route:"/view",name:"Viewer"},{route:"/",name:"Home"}]
*/

function NavBar(props) {
	const history = useHistory();

	return (
		<nav>
			{props.navConfig ? (
				props.navConfig.map((nav) => {
					return <button onClick={() => history.push(nav.route)}>{nav.name}</button>;
				})
			) : (
				<h1>No navconfig provided</h1>
			)}
		</nav>
	);
}

export default NavBar;
