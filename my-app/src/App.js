import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Main from "./Main";
import axios from "axios";

function App() {
	return (
		<div className="wrapper">
			<Sidebar />
			<Main />
		</div>
	);
}

export default App;
