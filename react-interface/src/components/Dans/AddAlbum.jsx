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

const AddAlbumModal = ({ handleClose }) => {
	const [name, setName] = useState(null);
	const [artist, setArtist] = useState(null);
	const [url, setUrl] = useState(null);

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
			.post("http://77.68.118.54/albums", {
				name: name,
				artist: artist,
				url: url,
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
						<CardTitle tag="h4">Add Album</CardTitle>
						<i
							className="tim-icons icon-simple-remove add-btn"
							onClick={close}
						/>
					</div>
				</CardHeader>
				<CardBody className="modal__content">
					{done && <h4 className="subtitle__modal">Saved New Album</h4>}
					{loading && <h4 className="subtitle__modal">Loading</h4>}
					{input && (
						<div>
							<h4 className="subtitle__modal">New Album Details</h4>
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

export default AddAlbumModal;
