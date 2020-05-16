import React, { useState } from "react";
import "../css/Add.css";
import axios from "axios";
import {
	Card,
	Button,
	CardHeader,
	CardBody,
	CardTitle,
	Input,
} from "reactstrap";
import fontawesome from "@fortawesome/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
fontawesome.library.add(faTimes);

const EditUserModal = ({ handleClose, selectedA }) => {
	const email = selectedA[0].email;
	const [pass, setPass] = useState(selectedA[0].password);

	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [input, setInput] = useState(true);
	const [error, setError] = useState(false);

	const close = () => {
		setDone(false);
		setInput(true);
		handleClose();
	};

	const handleArtist = (e) => {
		setPass(e.target.value);
	};

	const handleSubmit = () => {
		setInput(false);
		setLoading(true);
		axios
			.put(`http://77.68.118.54/api/users/${email}`, {
				password: pass,
			})
			.then((res) => {
				setLoading(false);
				setDone(true);
			})
			.catch((e) => {
				setLoading(false);
				setError(e);
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
						<CardTitle tag="h5">Edit Password</CardTitle>
						<FontAwesomeIcon onClick={close} icon="times" className="ai-pads" />
					</div>
				</CardHeader>
				<CardBody className="modal__content">
					{done && <h4 className="subtitle__modal">Updated User Password</h4>}
					{loading && <h4 className="subtitle__modal">Loading</h4>}
					{error && <h4 className="subtitle__modal">{error}</h4>}
					{input && (
						<div className="input--style">
							<h6 className="subtitle__modal">
								Edit Password for User: {email}
							</h6>
							<br />
							<Input
								id="inPass"
								placeholder={pass}
								type="text"
								className="subtitle__modal"
								onChange={handleArtist}
							/>
							<hr />
							<div>
								<Button
									className="button-add submit-button"
									color="success"
									onClick={handleSubmit}
								>
									Update
								</Button>
								<Button color="warning cancel-button" onClick={close}>
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

export default EditUserModal;
