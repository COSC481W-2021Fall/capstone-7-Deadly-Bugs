import React from "react";

/* Styling */
import "./background_styles.css";

export default function Navbar() {
	return (
		<nav className="navbar">
			<div className="brand-title">Flashfolio</div>
			<div className="navbar-links">
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/load">Load Deck</a></li>
			</ul>
			</div>
		</nav>
	)
}
