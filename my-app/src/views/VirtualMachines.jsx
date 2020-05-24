import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
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
import {
	Card as CC,
	CardContent,
	Grid,
	Typography,
	Avatar,
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import MoneyIcon from "@material-ui/icons/Money";
import clsx from "clsx";

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
				// console.log(res.data);
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
									<h5 className="card-category">Overall</h5>
									<CardTitle className="header--symbol" tag="h4">
										<h1>VM Contol</h1>
									</CardTitle>
								</Col>
							</Row>
						</CardHeader>
						<CardBody>
							{error ? (
								<h3>Error {error}</h3>
							) : vm ? (
								vm.map((element, i) => <VM key={i} machine={element} />)
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
const useStyles = makeStyles((theme) => ({
	root: {
		height: "100%",
		// width: "90%",
		margin: "1.5em",
		background: "linear-gradient(0deg, #3358f4, #1d8cf8);",
	},
	content: {
		alignItems: "center",
		display: "flex",
	},
	title: {
		fontWeight: 700,
	},
	avatar: {
		backgroundColor: "white",
		height: 56,
		width: 56,
	},
	icon: {
		height: 32,
		width: 32,
	},
	difference: {
		marginTop: "3em",
		display: "flex",
		alignItems: "center",
	},
	differenceIcon: {
		color: "black",
	},
	differenceValue: {
		color: "black",
		marginRight: "3em",
	},
}));

const VM = (props, machine) => {
	console.log(props);
	const { className, ...rest } = props;
	const [data, setData] = useState([]);
	const classes = useStyles();

	useEffect(() => {
		console.log("loaded");
	}, []);

	return (
		<CC {...rest} className={clsx(classes.root, className)}>
			<CardContent>
				<Grid container justify="space-between">
					<Grid item>
						<Typography
							className={classes.title}
							color="textSecondary"
							gutterBottom
							variant="body2"
						>
							machine
						</Typography>
						<Typography variant="h3">{data}</Typography>
					</Grid>
					<Grid item>
						<Avatar className={classes.avatar}>
							<MoneyIcon className={classes.icon} />
						</Avatar>
					</Grid>
				</Grid>
				<div className={classes.difference}>
					<ArrowDownwardIcon className={classes.differenceIcon} />
					<Typography className={classes.differenceValue} variant="body2">
						12%
					</Typography>
					<Typography className={classes.caption} variant="caption">
						Since last month
					</Typography>
				</div>
			</CardContent>
		</CC>
	);
};

const Loader = () => {
	return (
		<RingLoader css={override} size={90} color={"#1d8cf8"} loading={true} />
	);
};

export default VirtualMachines;
