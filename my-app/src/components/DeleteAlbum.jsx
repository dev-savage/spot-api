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

const AddAlbumModal = ({ handleClose, selectedA }) => {
	const [name, setName] = useState(selectedA[0].name);
	const [artist, setArtist] = useState(selectedA[0].artist);
	const [url, setUrl] = useState(selectedA[0].url);

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
						<CardTitle tag="h5">Delete Album</CardTitle>
						<FontAwesomeIcon onClick={close} icon="times" className="ai-pads" />
					</div>
				</CardHeader>
				<CardBody className="modal__content">
					{done && <h4 className="subtitle__modal">Saved New Album</h4>}
					{loading && <h4 className="subtitle__modal">Loading</h4>}
					{input && (
						<div className="input--style">
							<h6 className="subtitle__modal">Confirm Deletion</h6>
							<p>Name: {name}</p>
							<p>Artist: {artist}</p>
							<p>Url: {url}</p>
							<hr />
							<div>
								<Button
									className="button-add submit-button"
									color="success"
									onClick={handleSubmit}
								>
									Delete
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
