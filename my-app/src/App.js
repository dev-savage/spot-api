import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Main from "./Main";
import axios from "axios";

function App() {
	axios.get("http://77.68.118.54/api/users").then((res) => {
		console.log(res);
	});

	return (
		<div className="wrapper">
			<Sidebar />
			<Main />
		</div>
	);
}

export default App;
