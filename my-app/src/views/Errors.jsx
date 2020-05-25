import React, { useState, useEffect } from "react";
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
		name: "Issue",
		selector: "issue",
		sortable: true,
	},
	{
		name: "IP Address",
		selector: "ip_address",
		sortable: true,
	},
	{
		name: "Time",
		selector: "time",
		sortable: true,
	},
	{
		name: "User",
		selector: "user",
		sortable: true,
	},
	{
		name: "Album",
		selector: "album",
		sortable: true,
	},
	{
		name: "Description",
		selector: "description",
		sortable: true,
	},
];

const Albums = () => {
	const [count, setCount] = useState(0);
	const [errors, setErrors] = useState(null);

	const formatDate = (newDate) => {
		let date = newDate.split("T")[0];
		let time = newDate.split("T")[1];
		let seconds = time.split(".")[0];
		return date + " @ " + seconds;
	};

	useEffect(() => {
		axios.get("http://77.68.118.54/api/errors").then((res) => {
			console.log(res.data);
			let e = res.data.map((er) => {
				return {
					issue: er.issue,
					ip_address: er.ip_address,
					time: formatDate(er.time),
					user: er.user,
					album: er.album,
					description: "pending",
				};
			});
			setErrors(e);
		});
	}, [count]);

	return (
		<div className="content">
			<Row>
				<div className="col-12 my--card">
					<Card className="my--card--stuff">
						<CardHeader>
							<CardTitle tag="h4">Errors</CardTitle>
						</CardHeader>
						<CardBody>
							{errors ? (
								<DataTable
									title=""
									columns={columns}
									data={errors}
									defaultSortField="time"
									defaultSortAsc={false}
									selectableRows={false}
									// selected={handleSelect}
									pagination={true}
									pointerOnHover={true}
									dense={false}
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

export default Albums;
