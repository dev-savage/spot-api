import React from "react";
import NotificationAlert from "react-notification-alert";

import {
	Alert,
	UncontrolledAlert,
	Button,
	Card,
	CardHeader,
	CardBody,
	CardTitle,
	Row,
	Col,
} from "reactstrap";

const Notifications = () => {
	return (
		<>
			<div className="content">
				<Row>
					<Col md="12">
						<Card>
							<CardHeader>
								<CardTitle tag="h4">Notification states</CardTitle>
							</CardHeader>
							<CardBody>
								<UncontrolledAlert color="primary">
									<span>
										<b>Primary - </b>
										This is a regular notification made with ".alert-primary"
									</span>
								</UncontrolledAlert>
								<UncontrolledAlert color="info">
									<span>
										<b>Info - </b>
										This is a regular notification made with ".alert-info"
									</span>
								</UncontrolledAlert>
								<UncontrolledAlert color="success">
									<span>
										<b>Success - </b>
										This is a regular notification made with ".alert-success"
									</span>
								</UncontrolledAlert>
								<UncontrolledAlert color="warning">
									<span>
										<b>Warning - </b>
										This is a regular notification made with ".alert-warning"
									</span>
								</UncontrolledAlert>
								<UncontrolledAlert color="danger">
									<span>
										<b>Danger - </b>
										This is a regular notification made with ".alert-danger"
									</span>
								</UncontrolledAlert>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</div>
		</>
	);
};

export default Notifications;
