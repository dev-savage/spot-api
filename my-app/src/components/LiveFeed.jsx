import React, { useState, useEffect, useRef } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { Card, CardHeader, CardBody, CardTitle, Row } from "reactstrap";
import fontawesome from "@fortawesome/fontawesome";
import {
	faPlus,
	faTrashAlt,
	faPencilAlt,
	faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import "../css/Card.css";
import axios from "axios";
fontawesome.library.add(faPlus, faTrashAlt, faPencilAlt, faFileExcel);

createTheme("solarized", {
	text: {
		primary: "#ffffff",
		secondary: "#525f7f",
	},
	background: {
		default: "#27293d",
	},
	context: {
		background: "#27293d",
		text: "#FFFFFF",
	},
	divider: {
		default: "#525f7f",
	},
	action: {
		button: "rgba(0,0,0,.54)",
		hover: "rgba(0,0,0,.08)",
		disabled: "rgba(0,0,0,.12)",
	},
});
const columns = [
	{
		name: "Hostname",
		selector: "vm",
		sortable: true,
	},
	{
		name: "Time",
		selector: "time",
		sortable: true,
	},
	{
		name: "Album",
		selector: "album",
		sortable: true,
	},
];

const Albums = () => {
	const [count, setCount] = useState(0);
	const [albums, setAlbums] = useState(null);

	const formatDate = (newDate) => {
		let date = newDate.split("T")[0];
		let time = newDate.split("T")[1];
		let seconds = time.split(".")[0];
		return date + " @ " + seconds;
	};
	useEffect(() => {
		axios.get("http://77.68.118.54/api/virtualmachines/").then((data) => {
			let p = data.data.map((vm) => {
				return {
					vm: vm.vm,
					time: formatDate(vm.last_play),
					album: vm.album,
				};
			});
			setAlbums(p);
			console.log(data.data);
		});
	}, []);
	useInterval(() => {
		axios.get("http://77.68.118.54/api/virtualmachines/").then((data) => {
			let p = data.data.map((vm) => {
				return {
					vm: vm.vm,
					time: formatDate(vm.last_play),
					album: vm.album,
				};
			});
			setAlbums(p);
			console.log(data.data);
		});
	}, 10000);

	return (
		<div className="content">
			<Row>
				<div className="col-12 my--card override--padding">
					<Card className="my--card--stuff">
						<CardHeader>
							<CardTitle tag="h4">Latest Plays by Virtual Machine</CardTitle>
						</CardHeader>
						<CardBody>
							{albums ? (
								<DataTable
									title=""
									columns={columns}
									data={albums}
									defaultSortField="time"
									defaultSortAsc={false}
									pagination={true}
									pointerOnHover={true}
									dense={true}
									noTableHead={false}
									fixedHeader={true}
									fixedHeaderScrollHeight="300px"
									theme="solarized"
								/>
							) : (
								<h4> Loading... </h4>
							)}
						</CardBody>
					</Card>
				</div>
			</Row>
		</div>
	);
};

function useInterval(callback, delay) {
	const savedCallback = useRef();

	// Remember the latest function.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}
export default Albums;
