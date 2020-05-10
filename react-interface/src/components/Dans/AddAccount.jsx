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
	InputGroup,
} from "reactstrap";

const AddAccountModal = ({ handleClose }) => {
	const [email, setEmail] = useState(null);
	const [pass, setPass] = useState(null);
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [input, setInput] = useState(true);

	const close = () => {
		setDone(false);
		setInput(true);
		handleClose();
	};
	const handleEmail = (e) => {
		setEmail(e.target.value);
	};
	const handlePassword = (e) => {
		setPass(e.target.value);
	};
	const handleSubmit = () => {
		setInput(false);
		setLoading(true);
		axios
			.post("http://77.68.118.54/users", {
				email: email,
				password: pass,
			})
			.then((res) => {
				console.log(res);
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
						<CardTitle tag="h4">Add Account</CardTitle>
						<i
							className="tim-icons icon-simple-remove add-btn"
							onClick={close}
						/>
					</div>
				</CardHeader>
				<CardBody className="modal__content">
					{done && <h4 className="subtitle__modal">Saved New User</h4>}
					{loading && <h4 className="subtitle__modal">Loading</h4>}
					{input && (
						<div>
							<h4 className="subtitle__modal">New Account Details</h4>
							<Input
								id="inEmail"
								placeholder="Email"
								className="subtitle__modal"
								type="text"
								onChange={handleEmail}
							/>
							<br />
							<Input
								id="inPass"
								placeholder="Password"
								type="text"
								className="subtitle__modal"
								onChange={handlePassword}
							/>
							<hr />
							<div>
								<Button color="success" onClick={handleSubmit}>
									Submit
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

export default AddAccountModal;
