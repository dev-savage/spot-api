import React from "react";
import { Card, CardHeader, CardBody, CardTitle, Row } from "reactstrap";
import fontawesome from "@fortawesome/fontawesome";
import {
	faPlus,
	faTrashAlt,
	faPencilAlt,
	faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import "../css/Card.css";
import "../css/VirtualMachines.css";
fontawesome.library.add(faPlus, faTrashAlt, faPencilAlt, faFileExcel);

const VirtualMachines = () => {
	return (
		<div className="content">
			<div className="vm--container">
				<Row>
					<Card className="my--card--stuff vm--card">
						<CardHeader>
							<CardTitle tag="h4">Virtual Machine 1</CardTitle>
						</CardHeader>
						<CardBody>
							<h4>Idk yet</h4>
						</CardBody>
					</Card>
					<Card className="my--card--stuff vm--card">
						<CardHeader>
							<CardTitle tag="h4">Virtual Machine 2</CardTitle>
						</CardHeader>
						<CardBody>
							<h4>Idk yet</h4>
						</CardBody>
					</Card>
					<Card className="my--card--stuff vm--card">
						<CardHeader>
							<CardTitle tag="h4">Virtual Machine 3</CardTitle>
						</CardHeader>
						<CardBody>
							<h4>Idk yet</h4>
						</CardBody>
					</Card>
				</Row>
			</div>
		</div>
	);
};

export default VirtualMachines;
