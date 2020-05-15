import React from "react";
import { Switch, Route } from "react-router-dom";
import "./css/Main.css";

import Dashboard from "./views/Dashboard";
import Albums from "./views/Albums";
import Users from "./views/Users";

const Main = () => {
	return (
		<main className="main-panel">
			<Switch>
				<Route exact path="/" component={Dashboard} />
				<Route path="/users" component={Users} />
				<Route path="/albums" component={Albums} />
			</Switch>
		</main>
	);
};

export default Main;
