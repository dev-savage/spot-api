import React, { useState, useEffect, useRef } from "react";
import {
	Card,
	CardHeader,
	CardBody,
	CardTitle,
	Row,
	Col,
	Button,
} from "reactstrap";
import fontawesome from "@fortawesome/fontawesome";
import {
	faPlus,
	faTrashAlt,
	faPencilAlt,
	faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/core";
import { makeStyles } from "@material-ui/styles";
import "../css/Card.css";
import "../css/VirtualMachines.css";
import RingLoader from "react-spinners/RingLoader";
import axios from "axios";

fontawesome.library.add(faPlus, faTrashAlt, faPencilAlt, faFileExcel);

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
	margin-bottom: 3em;
`;
const VirtualMachines = () => {
	const [error, setError] = useState(false);
	const [vm, setVm] = useState(false);

	useEffect(() => {
		axios
			.get("http://77.68.118.54/api/virtualmachines")
			.then((res) => {
				setVm(res.data);
			})
			.catch((err) => {
				setError(err);
			});
	}, []);
	const vmStyle = {
		width: "100%",
	};
	return (
		<div style={vmStyle} className="content">
			<Row>
				<div className="col-12 my--card">
					<Card className="my--card--stuff">
						<CardHeader>
							<Row>
								<Col className="text-left" sm="6">
									<h5 className="card-category">Virtual Machines</h5>
									<CardTitle className="header--symbol" tag="h4">
										Virtual Machines Overview
									</CardTitle>
								</Col>
							</Row>
						</CardHeader>
						<CardBody>
							{error ? (
								<h3>Error {error}</h3>
							) : vm ? (
								vm.map((element, i) => <VM2 key={i} machine={element} />)
							) : (
								<Loader />
							)}
						</CardBody>
					</Card>
				</div>
			</Row>
		</div>
	);
};

const VM2 = (props) => {
	const formatDate = (newDate) => {
		let date = newDate.split("T")[0];
		let time = newDate.split("T")[1];
		let seconds = time.split(".")[0];
		return date + " @ " + seconds;
	};

	const { className, ...rest } = props;
	const [data, setData] = useState([]);
	const [date, setDate] = useState(formatDate(props.machine.last_play));
	const [status, setStatus] = useState(props.machine.status);
	const [loadingStatus, setLoadingStatus] = useState(false);
	const vmStyle = {
		width: "100%",
	};

	useInterval(() => {
		axios
			.get(
				`http://77.68.118.54/api/virtualmachines/today?vm=${props.machine.vm}`
			)
			.then((res) => {
				let d = formatDate(res.data[0].last_play);
				setDate(d);
				if (res.data[0].status.indexOf("t")) {
					setStatus(true);
				} else {
					setStatus(false);
				}
				setLoadingStatus(false);
			})
			.catch((err) => {});
	}, 5000);

	const toggleStatus = (s) => {
		setLoadingStatus(true);
		axios
			.post(`http://77.68.118.54/api/virtualmachines/status`, {
				vm: props.machine.vm,
				status: s,
			})
			.then((res) => {})
			.catch((err) => {});
	};
	return (
		<div style={vmStyle} className="content">
			<Row>
				<div className="col-12 my--card--inner">
					<Card className="my--card--stuff inner__card">
						<CardHeader>
							<Row>
								<Col className="text-left" sm="6">
									<h5 className="card-category text__color">Hostname</h5>
									<CardTitle className="header--symbol" tag="h4">
										{props.machine.vm}
									</CardTitle>
								</Col>
							</Row>
						</CardHeader>
						<CardBody>
							<div className="vm__content__container">
								<div className="info">
									<br />
									<h5 className="text__color">Details</h5>
									<h6 className="text__color">Last Play: {date}</h6>
									<h6 className="text__color">
										Today's Plays: {props.machine.count}{" "}
									</h6>
									<br />
									<br />
									<h6 className="text__color">
										Login: {props.machine.username} / {props.machine.password}
									</h6>
								</div>
								<div className="actions">
									<br />

									<h5 className="text__color">Actions</h5>
									{loadingStatus ? (
										<Button color="secondary">Pending</Button>
									) : status ? (
										<Button color="danger" onClick={() => toggleStatus(false)}>
											Stop Machine
										</Button>
									) : (
										<Button color="success" onClick={() => toggleStatus(true)}>
											Start Machine
										</Button>
									)}
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			</Row>
		</div>
	);
};

function useInterval(callback, delay) {
	const savedCallback = useRef();

	// Remember the latest function.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}

const Loader = () => {
	return (
		<RingLoader css={override} size={90} color={"#1d8cf8"} loading={true} />
	);
};

export default VirtualMachines;
