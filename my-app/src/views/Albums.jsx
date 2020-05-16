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
import DeleteAlbum from "../components/DeleteAlbum";
import AddAlbum from "../components/AddAlbum";
import EditAlbum from "../components/EditAlbum";
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
		name: "Name",
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
	function convertArrayOfObjectsToCSV(array) {
		let result;

		const columnDelimiter = ",";
		const lineDelimiter = "\n";
		const keys = Object.keys(albums[0]);

		result = "";
		result += keys.join(columnDelimiter);
		result += lineDelimiter;

		array.forEach((item) => {
			let ctr = 0;
			keys.forEach((key) => {
				if (ctr > 0) result += columnDelimiter;

				result += item[key];

				ctr++;
			});
			result += lineDelimiter;
		});

		return result;
	}
	function downloadCSV(array) {
		const link = document.createElement("a");
		let csv = convertArrayOfObjectsToCSV(array);
		if (csv == null) return;

		const filename = "albums.csv";

		if (!csv.match(/^data:text\/csv/i)) {
			csv = `data:text/csv;charset=utf-8,${csv}`;
		}

		link.setAttribute("href", encodeURI(csv));
		link.setAttribute("download", filename);
		link.click();
	}
	const onExport = () => {
		downloadCSV(albums);
	};
	useEffect(() => {
		axios.get("http://77.68.118.54/api/albums").then((data) => {
			console.log(data.data);
			setAlbums(data.data);
		});
	}, [count]);

	const close = () => {
		setAdd(false);
		setEdit(false);
		setDel(false);
		let c = count + 1;
		setCount(c);
	};
	const openAdd = () => {
		setAdd(true);
	};
	const openEdit = () => {
		setEdit(true);
	};
	const openDel = () => {
		setDel(true);
	};
	return (
		<div className="content">
			<Row>
				<div className="col-12 my--card">
					{add && <AddAlbum handleClose={close} />}
					{edit && <EditAlbum handleClose={close} selectedA={selectedA} />}
					{del && <DeleteAlbum handleClose={close} selectedA={selectedA} />}
					<Card className="my--card--stuff">
						<CardHeader>
							<CardTitle tag="h4"> Albums</CardTitle>
							<div className="action--icons">
								<div className="not--buttons"></div>
								<div className="the--buttons">
									<div onClick={openAdd}>
										<i className="fa fa-plus fa-sm ai-pads"></i>
									</div>
									<div onClick={openEdit}>
										<i className="fa fa-pencil-alt fa-sm ai-pads"></i>
									</div>
									<div onClick={openDel}>
										<i className="fa fa-trash-alt fa-sm ai-pads"></i>
									</div>
									<div onClick={(e) => onExport(e.target.value)}>
										<i className="fa fa-file-excel fa-sm ai-pads"></i>
									</div>
								</div>
							</div>
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
