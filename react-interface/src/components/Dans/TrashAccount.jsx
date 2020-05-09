import React, { useState } from "react";
import "../../addaccount.css";
import axios from "axios";
import {
	Card,
	Button,
	CardHeader,
	CardBody,
	CardTitle,
	Input,
} from "reactstrap";

const TrashAccountModal = ({ email, handleClose }) => {
	const [pass, setPass] = useState(null);
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [input, setInput] = useState(true);

	const close = () => {
		setDone(false);
		setInput(true);
		handleClose();
	};

	const handleSubmit = () => {
		setInput(false);
		setLoading(true);
		axios
			.delete(`http://localhost:3000/users/${email}`, {
				password: pass,
			})
			.then((res) => {
				setLoading(false);
				setDone(true);
			});
	};
	const headerStyle = {
		display: "flex",
		justifyContent: "space-between",
	};

	return (
		<div className="add__account__modal">
			<Card className="content__modal">
				<CardHeader className="modal__heading">
					<div style={headerStyle}>
						<CardTitle tag="h4">Delete Account</CardTitle>
						<i
							className="tim-icons icon-simple-remove add-btn"
							onClick={close}
						/>
					</div>
				</CardHeader>
				<CardBody className="modal__content">
					{done && <h4 className="subtitle__modal">Acount Deleted!</h4>}
					{loading && <h4 className="subtitle__modal">Loading</h4>}
					{input && (
						<div>
							<h4 className="subtitle__modal">Delete Account for: {email}</h4>
							<br />
							<hr />
							<div>
								<Button color="success" onClick={handleSubmit}>
									Confirm
								</Button>
								<Button color="warning" onClick={close}>
									Cancel
								</Button>
							</div>
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
};

export default TrashAccountModal;
