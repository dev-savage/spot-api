import React, { useState, useEffect } from "react";
import LiveFeed from "../components/LiveFeed";
import {
	Card,
	CardHeader,
	CardBody,
	CardTitle,
	Row,
	Col,
	ButtonGroup,
	Button,
} from "reactstrap";
import "../css/Card.css";
import { Bar, Line } from "react-chartjs-2";
import "../css/Dashboard.css";
import "../css/Dp.css";
import { css } from "@emotion/core";
import RingLoader from "react-spinners/RingLoader";
import axios from "axios";
import { makeStyles } from "@material-ui/styles";
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
const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
	margin-bottom: 3em;
`;

const Notifications = () => {
	useEffect(() => {}, []);
	return (
		<div className="content">
			<Widgets />
			<LiveFeed />
		</div>
	);
};

const Widgets = () => {
	const myStyle = {
		display: "flex",
		justifyContent: "center",
	};
	return (
		<Row>
			<div className="col-12 my--card">
				<Card className="my--card--stuff">
					<CardHeader>
						<Row>
							<Col className="text-left" sm="6">
								<h5 className="card-category">PLays</h5>
								<CardTitle tag="h4">Todays Plays</CardTitle>
							</Col>
						</Row>
					</CardHeader>
					<CardBody>
						{/* <RingLoader
							css={override}
							size={90}
							color={"#1d8cf8"}
							loading={true}
						/> */}
						<div style={myStyle}>
							<Today />
							<Today />
							<Today />
						</div>
					</CardBody>
				</Card>
			</div>
		</Row>
	);
};
const Feed = () => {
	return (
		<Row>
			<div className="col-12 my--card override--padding">
				<Card className="my--card--stuff">
					<CardHeader>
						<Row>
							<Col className="text-left" sm="6">
								<h5 className="card-category">Feed</h5>
								<CardTitle tag="h4">Latest Plays</CardTitle>
							</Col>
						</Row>
					</CardHeader>
					<CardBody>
						<RingLoader
							css={override}
							size={90}
							color={"#1d8cf8"}
							loading={true}
						/>
					</CardBody>
				</Card>
			</div>
		</Row>
	);
};

const useStyles = makeStyles((theme) => ({
	root: {
		height: "100%",
		width: "30%",
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

const Today = (props) => {
	const { className, ...rest } = props;

	const classes = useStyles();

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
							BUDGET
						</Typography>
						<Typography variant="h3">$24,000</Typography>
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
export default Notifications;
