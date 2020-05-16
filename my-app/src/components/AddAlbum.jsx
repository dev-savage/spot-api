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

const AddAlbumModal = ({ handleClose }) => {
	const [name, setName] = useState(null);
	const [artist, setArtist] = useState(null);
	const [url, setUrl] = useState(null);
	const [error, setError] = useState(null);

	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [input, setInput] = useState(true);

	const close = () => {
		setDone(false);
		setInput(true);
		handleClose();
	};
	const handleName = (e) => {
		setName(e.target.value);
	};
	const handleArtist = (e) => {
		setArtist(e.target.value);
	};
	const handleUrl = (e) => {
		setUrl(e.target.value);
	};
	const handleSubmit = () => {
		setInput(false);
		setLoading(true);
		axios
			.post("http://77.68.118.54/api/albums", {
				name: name,
				artist: artist,
				url: url,
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
						<CardTitle tag="h5">Add Album</CardTitle>
						<FontAwesomeIcon onClick={close} icon="times" className="ai-pads" />
					</div>
				</CardHeader>
				<CardBody className="modal__content">
					{done && <h4 className="subtitle__modal">Saved New Album</h4>}
					{loading && <h4 className="subtitle__modal">Loading</h4>}
					{error && <h4 className="subtitle__modal">Error: {error}</h4>}
					{input && (
						<div className="input--style">
							<h6 className="subtitle__modal">New Album Details</h6>
							<Input
								id="inEmail"
								placeholder="Name"
								className="subtitle__modal"
								type="text"
								onChange={handleName}
							/>
							<br />
							<Input
								id="inPass"
								placeholder="Artist"
								type="text"
								className="subtitle__modal"
								onChange={handleArtist}
							/>
							<br />
							<Input
								id="inPass"
								placeholder="URL"
								type="text"
								className="subtitle__modal"
								onChange={handleUrl}
							/>
							<hr />
							<div>
								<Button
									className="button-add submit-button"
									color="success"
									onClick={handleSubmit}
								>
									Submit
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

export default AddAlbumModal;
