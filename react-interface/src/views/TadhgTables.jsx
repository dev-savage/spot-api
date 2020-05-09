import React, { useState, useEffect } from "react";

// reactstrap components
import {
	Card,
	CardHeader,
	CardBody,
	CardTitle,
	Table,
	Row,
	Col,
} from "reactstrap";

import DataTable from "react-data-table-component";

const TadhgTable = () => {
	const [users, setUsers] = useState(null);
	useEffect(() => {
		console.log("in here");
		fetch("http://localhost:3000/users")
			.then((response) => response.json())
			.then((data) => {
				setUsers(data);
			});
	}, []);
	const columns = [
		{
			name: "ID",
			selector: "idusers",
			sortable: true,
		},
		{
			name: "Username",
			selector: "username",
			sortable: true,
		},
		{
			name: "Password",
			selector: "password",
			sortable: true,
		},
	];

	return (
		<>
			<div className="content">
				<Row>
					<Col md="12">
						<Card>
							<CardHeader>
								<CardTitle tag="h4">Table of All Users</CardTitle>
							</CardHeader>
							<CardBody>
								{users ? (
									<DataTable
										title=""
										columns={columns}
										data={users}
										defaultSortField="idusers"
										fixedHeader
										fixedHeaderScrollHeight="1000px"
									/>
								) : (
									<h4>Loading</h4>
								)}
							</CardBody>
						</Card>
					</Col>
				</Row>
			</div>
		</>
	);
};

export default TadhgTable;
