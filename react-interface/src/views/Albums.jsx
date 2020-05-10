import React, { useState, useEffect } from "react";
import axios from "axios";
import "../users.css";

import AddAccount from "../components/Dans/AddAlbum";
import EditAccount from "../components/Dans/EditAccount";
import TrashAlbum from "../components/Dans/TrashAlbum";

import {
	Card,
	CardHeader,
	CardBody,
	CardTitle,
	Table,
	Row,
	Col,
	Label,
	FormGroup,
	Input,
} from "reactstrap";

const Albums = () => {
	const [users, setUsers] = useState([]);
	const [modal, setModal] = useState(false);
	const [edit, setEdit] = useState(false);
	const [trash, setTrash] = useState(false);
	const [count, setCount] = useState(0);
	const [email, setEmail] = useState(null);
	useEffect(() => {
		axios.get("http://77.68.118.54/albums").then((data) => {
			setUsers(data.data);
		});
	}, [count]);
	const headerStyle = {
		display: "flex",
		justifyContent: "space-between",
	};

	const add = () => {
		setModal(true);
	};
	const editModal = () => {
		setEdit(true);
	};
	const deleteModal = () => {
		setTrash(true);
	};
	const close = () => {
		setModal(false);
		setEdit(false);
		setTrash(false);
		let c = count + 1;
		setCount(c);
	};
	const setSelected = (row) => {
		setEmail(row);
	};
	return (
		<>
			<div className="content">
				<Row>
					{modal && <AddAccount handleClose={close} />}
					{edit && <EditAccount email={email} handleClose={close} />}
					{trash && <TrashAlbum email={email} handleClose={close} />}
					<Card>
						<CardHeader>
							<div style={headerStyle}>
								<CardTitle tag="h4">All Users</CardTitle>
								<div>
									<i
										className="tim-icons icon-simple-add add-btn btn-padd"
										onClick={add}
									/>
									<i
										className="tim-icons icon-pencil add-btn btn-padd"
										onClick={editModal}
									/>
									<i
										className="tim-icons icon-trash-simple add-btn btn-padd"
										onClick={deleteModal}
									/>
								</div>
							</div>
						</CardHeader>
						<CardBody>
							{users ? (
								<Table className="tablesorter" responsive>
									<thead className="text-primary">
										<tr>
											<th>Select</th>
											<th>Name</th>
											<th>Artist</th>
											<th>Url</th>
										</tr>
									</thead>
									<tbody>
										{users.map((row, i) => {
											return (
												<tr key={i + "-row"}>
													<td>
														<FormGroup check>
															<Label check>
																<Input id="i" defaultValue="" type="checkbox" />
																<span
																	className="form-check-sign"
																	onClick={() => setSelected(row.name)}
																>
																	<span className="check" />
																</span>
															</Label>
														</FormGroup>
													</td>
													<td>{row.name}</td>
													<td>{row.artist}</td>
													<td>{row.url}</td>
												</tr>
											);
										})}
									</tbody>
								</Table>
							) : (
								<h2>Loading...</h2>
							)}
						</CardBody>
					</Card>
				</Row>
			</div>
		</>
	);
};
export default Albums;
