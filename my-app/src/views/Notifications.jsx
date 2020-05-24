import React, { useState, useEffect } from "react";
import LiveFeed from "../components/LiveFeed";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import "../css/Card.css";
import "../css/Dashboard.css";
import "../css/Dp.css";
import { css } from "@emotion/core";
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
import fontawesome from "@fortawesome/fontawesome";
import {
	faSun,
	faCalendar,
	faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
fontawesome.library.add(faSun, faCalendar, faDollarSign);
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
								<h5 className="card-category">Plays</h5>
							</Col>
						</Row>
					</CardHeader>
					<CardBody>
						<div style={myStyle}>
							<Today />
							<Month />
							<Money />
						</div>
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
		color: "white",
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
	const [data, setData] = useState([]);
	const classes = useStyles();

	useEffect(() => {
		const ep = "http://77.68.118.54/api";
		axios
			.get(`${ep}/plays/today`)
			.then((result) => {
				setData(result.data[0].total);
			})
			.catch((error) => {});
	}, []);
	return (
		<CC {...rest} className={clsx(classes.root, className)}>
			<CardContent>
				<Grid container justify="space-between">
					<Grid item>
						<h5 className="text__color">Today</h5>
						<h4 className="text__color">{data}</h4>
					</Grid>
					<Grid item>
						<div>
							<i className="fa fa-sun music--bar--symbol"></i>
						</div>
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

const Month = (props) => {
	const { className, ...rest } = props;
	const [data, setData] = useState([]);
	const classes = useStyles();

	useEffect(() => {
		const ep = "http://77.68.118.54/api";
		axios
			.get(`${ep}/plays/thismonth`)
			.then((result) => {
				setData(result.data[0].total);
			})
			.catch((error) => {});
	}, []);
	return (
		<CC {...rest} className={clsx(classes.root, className)}>
			<CardContent>
				<Grid container justify="space-between">
					<Grid item>
						<h5 className="text__color">Month</h5>
						<h4 className="text__color">{data}</h4>
					</Grid>
					<Grid item>
						<div>
							<i className="fa fa-calendar music--bar--symbol"></i>
						</div>
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

const Money = (props) => {
	const { className, ...rest } = props;
	const [data, setData] = useState([]);
	const classes = useStyles();

	useEffect(() => {
		const ep = "http://77.68.118.54/api";
		axios
			.get(`${ep}/plays/thismonth`)
			.then((result) => {
				let f = result.data[0].total * 0.0032;
				let g = f.toFixed(2);
				setData(g);
			})
			.catch((error) => {});
	}, []);
	return (
		<CC {...rest} className={clsx(classes.root, className)}>
			<CardContent>
				<Grid container justify="space-between">
					<Grid item>
						<h5 className="text__color">Estimated Pay</h5>
						<h4 className="text__color">${data}</h4>
					</Grid>
					<Grid item>
						<div>
							<i className="fa fa-dollar-sign music--bar--symbol"></i>
						</div>
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
