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
	{ name: "id", selector: "idalbums", sortable: true },
	{
		name: "Hostname",
		selector: "name",
		sortable: true,
	},
	{
		name: "Artist",
		selector: "artist",
		sortable: true,
	},
	{
		name: "Url",
		selector: "url",
		sortable: true,
	},
];

const Albums = () => {
	const [add, setAdd] = useState(false);
	const [edit, setEdit] = useState(false);
	const [del, setDel] = useState(false);
	const [selectedA, setSelectedA] = useState(null);
	const [count, setCount] = useState(0);
	const [albums, setAlbums] = useState(null);
	const handleSelect = (e) => {
		setSelectedA(e.selectedRows);
	};

	useEffect(() => {
		axios.get("http://77.68.118.54/api/albums").then((data) => {
			setAlbums(data.data);
		});
	}, [count]);

	return (
		<div className="content">
			<Row>
				<div className="col-12 my--card override--padding">
					<Card className="my--card--stuff">
						<CardHeader>
							<CardTitle tag="h4">Latest Plays</CardTitle>
						</CardHeader>
						<CardBody>
							{albums ? (
								<DataTable
									title=""
									columns={columns}
									data={albums}
									defaultSortField="id"
									selectableRows={true}
									// selected={handleSelect}
									onSelectedRowsChange={handleSelect}
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

export default Albums;