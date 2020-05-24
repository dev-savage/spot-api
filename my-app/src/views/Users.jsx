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
import DeleteUser from "../components/DeleteUser";
import AddUser from "../components/AddUser";
import EditUser from "../components/EditUser";
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
	{ name: "id", selector: "idusers", sortable: true },
	{
		name: "Email",
		selector: "email",
		sortable: true,
	},
	{
		name: "Password",
		selector: "password",
		sortable: true,
	},
	{
		name: "Login Working",
		selector: "loginworking",
		sortable: true,
	},
	{
		name: "Currently Logged In",
		selector: "currentlyloggedin",
		sortable: true,
	},
];

const Users = () => {
	const [add, setAdd] = useState(false);
	const [edit, setEdit] = useState(false);
	const [del, setDel] = useState(false);
	const [selectedA, setSelectedA] = useState(null);
	const [users, setUsers] = useState(null);
	const [error, setError] = useState(null);
	const [keyUpdate, setKeyUpdate] = useState(0);
	useEffect(() => {
		axios
			.get("http://77.68.118.54/api/users")
			.then((users) => {
				setUsers(users.data);
			})
			.catch((e) => {
				setError(e);
			});
	}, [keyUpdate]);

	function convertArrayOfObjectsToCSV(array) {
		let result;

		const columnDelimiter = ",";
		const lineDelimiter = "\n";
		const keys = Object.keys(users[0]);

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

		const filename = "users.csv";

		if (!csv.match(/^data:text\/csv/i)) {
			csv = `data:text/csv;charset=utf-8,${csv}`;
		}

		link.setAttribute("href", encodeURI(csv));
		link.setAttribute("download", filename);
		link.click();
	}
	const onExport = () => {
		downloadCSV(users);
	};

	const close = () => {
		setAdd(false);
		setEdit(false);
		setDel(false);
		let k = keyUpdate + 1;
		setKeyUpdate(k);
	};
	return (
		<div className="content">
			<Row>
				<div className="col-12 my--card">
					{add && <AddUser handleClose={close} />}
					{edit && <EditUser handleClose={close} selectedA={selectedA} />}
					{del && <DeleteUser handleClose={close} selectedA={selectedA} />}
					<Card className="my--card--stuff">
						<CardHeader>
							<CardTitle tag="h4">Users</CardTitle>
							<div className="action--icons">
								<div className="not--buttons"></div>
								<div className="the--buttons">
									<div onClick={() => setAdd(true)}>
										<i className="fa fa-plus fa-sm ai-pads"></i>
									</div>
									<div onClick={() => setEdit(true)}>
										<i className="fa fa-pencil-alt fa-sm ai-pads"></i>
									</div>
									<div onClick={() => setDel(true)}>
										<i className="fa fa-trash-alt fa-sm ai-pads"></i>
									</div>
									<div onClick={(e) => onExport(e.target.value)}>
										<i className="fa fa-file-excel fa-sm ai-pads"></i>
									</div>
								</div>
							</div>
						</CardHeader>
						<CardBody>
							{error ? (
								<h3>Error {error}</h3>
							) : users ? (
								<DataTable
									title=""
									columns={columns}
									data={users}
									defaultSortField="id"
									selectableRows={true}
									onSelectedRowsChange={(e) => setSelectedA(e.selectedRows)}
									pagination={true}
									pointerOnHover={true}
									dense={false}
									noTableHead={false}
									fixedHeader={true}
									fixedHeaderScrollHeight="300px"
									theme="solarized"
								/>
							) : (
								<h4>Loading</h4>
							)}
						</CardBody>
					</Card>
				</div>
			</Row>
		</div>
	);
};

export default Users;
