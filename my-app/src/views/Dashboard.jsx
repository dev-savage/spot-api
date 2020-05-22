import React, { useState, useEffect } from "react";
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

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
	margin-bottom: 3em;
`;

const Dashboard = () => {
	const [error, setError] = useState(null);
	const [dataa, setData] = useState(null);
	const [bar, setBar] = useState(null);

	useEffect(() => {
		setTimeout(() => {
			if (Math.random > 10) setError(true);
			const d = [
				{
					name: "Page A",
					uv: 4000,
					pv: 2400,
					amt: 2400,
				},
				{
					name: "Page B",
					uv: 3000,
					pv: 1398,
					amt: 2210,
				},
				{
					name: "Page C",
					uv: 2000,
					pv: 9800,
					amt: 2290,
				},
				{
					name: "Page D",
					uv: 2780,
					pv: 3908,
					amt: 2000,
				},
				{
					name: "Page E",
					uv: 1890,
					pv: 4800,
					amt: 2181,
				},
				{
					name: "Page F",
					uv: 2390,
					pv: 3800,
					amt: 2500,
				},
				{
					name: "Page G",
					uv: 3490,
					pv: 4300,
					amt: 2100,
				},
			];
			const b = [
				{
					name: "Page A",
					uv: 4000,
					pv: 2400,
					amt: 2400,
				},
				{
					name: "Page B",
					uv: 3000,
					pv: 1398,
					amt: 2210,
				},
				{
					name: "Page C",
					uv: 2000,
					pv: 9800,
					amt: 2290,
				},
				{
					name: "Page D",
					uv: 2780,
					pv: 3908,
					amt: 2000,
				},
				{
					name: "Page E",
					uv: 1890,
					pv: 4800,
					amt: 2181,
				},
				{
					name: "Page F",
					uv: 2390,
					pv: 3800,
					amt: 2500,
				},
				{
					name: "Page G",
					uv: 3490,
					pv: 4300,
					amt: 2100,
				},
			];
			setData(d);
			setBar(b);
		}, 1500);
	}, []);

	return (
		<div className="content">
			<Row>
				<div className="col-12 my--card">
					<Card className="my--card--stuff">
						<CardHeader>
							<Row>
								<Col className="text-left" sm="6">
									<h5 className="card-category">Overall</h5>
									<CardTitle tag="h4">Overall Plays</CardTitle>
								</Col>
								<ControlButtons />
								{/* <Datee /> */}
							</Row>
						</CardHeader>
						<CardBody>
							{error ? (
								<h3>Error {error}</h3>
							) : dataa ? (
								// <AC data={data} />
								<Line
									data={chartExample1.data1}
									options={chartExample1.options}
								/>
							) : (
								<RingLoader
									css={override}
									size={90}
									color={"#1d8cf8"}
									loading={true}
								/>
							)}
						</CardBody>
					</Card>
				</div>
			</Row>
			<BarCard resource={"artist"} />
			<BarCard resource={"album"} />
		</div>
	);
};

const BarCard = ({ resource }) => {
	const name = resource.charAt(0).toUpperCase() + resource.slice(1);
	const [error, setError] = useState(false);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [time, setTime] = useState("WEEK");

	useEffect(() => {
		const fetchData = async () => {
			setError(false);
			setLoading(true);
			setData(null);
			axios
				.get(`http://localhost:3000/api/plays/barchart/${resource}/${time}`)
				.then((result) => {
					setData(result.data);
					setLoading(false);
				})
				.catch((error) => {
					if (error.response) {
						setError(error.response.status);
					} else {
						setError("Could not get Data");
					}
					setLoading(false);
				});
		};
		fetchData();
	}, [time]);

	const handleTime = (update) => {
		switch (update) {
			case 0:
				setTime("WEEK");
				break;
			case 1:
				setTime("7DAYS");
				break;
			case 2:
				setTime("MONTH");
				break;
			case 3:
				setTime("YEAR");
				break;
			default:
				setTime("WEEK");
				break;
		}
	};
	return (
		<Row className="">
			<div className="col-12 my--card override--padding">
				<Card className="my--card--stuff">
					<CardHeader>
						<Row>
							<Col className="text-left" sm="6">
								<h5 className="card-category">{name}</h5>
								<CardTitle tag="h4">Plays per {name}</CardTitle>
							</Col>
							<BarTimeControl setTime={handleTime} />
						</Row>
					</CardHeader>
					<CardBody>
						{error ? (
							<h3>Error: {error}</h3>
						) : loading ? (
							<RingLoader
								css={override}
								size={90}
								color={"#1d8cf8"}
								loading={true}
							/>
						) : (
							<Bar
								data={barchartDetails(data).data}
								options={barchartDetails(data).options}
							/>
						)}
					</CardBody>
				</Card>
			</div>
		</Row>
	);
};

const barchartDetails = (input) => {
	const myLabels = input.map((row) => row.item);
	const myData = input.map((row) => row.total);
	const suggestedMax = Math.max(...myData) + 2;
	const suggestedMin = Math.min(...myData) - 2;
	const actualMin = suggestedMin < 0 ? 0 : suggestedMin;
	const padding = suggestedMax / 10;

	return {
		data: (canvas) => {
			let ctx = canvas.getContext("2d");

			let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

			gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
			gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
			gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

			return {
				labels: myLabels,
				datasets: [
					{
						label: "Streams",
						fill: true,
						backgroundColor: gradientStroke,
						hoverBackgroundColor: gradientStroke,
						borderColor: "#d048b6",
						borderWidth: 2,
						borderDash: [],
						borderDashOffset: 0.0,
						data: myData,
					},
				],
			};
		},
		options: {
			maintainAspectRatio: false,
			legend: {
				display: false,
			},
			tooltips: {
				backgroundColor: "#f5f5f5",
				titleFontColor: "#333",
				bodyFontColor: "#666",
				bodySpacing: 4,
				xPadding: 12,
				mode: "nearest",
				intersect: 0,
				position: "nearest",
			},
			responsive: true,
			scales: {
				yAxes: [
					{
						gridLines: {
							drawBorder: false,
							color: "rgba(225,78,202,0.1)",
							zeroLineColor: "transparent",
						},
						ticks: {
							suggestedMin: actualMin,
							suggestedMax: suggestedMax,
							padding: padding,
							fontColor: "#9e9e9e",
						},
					},
				],
				xAxes: [
					{
						gridLines: {
							drawBorder: false,
							color: "rgba(225,78,202,0.1)",
							zeroLineColor: "transparent",
						},
						ticks: {
							padding: 20,
							fontColor: "#9e9e9e",
						},
					},
				],
			},
		},
	};
};

const BarTimeControl = ({ setTime }) => {
	const [clicked, setClicked] = useState(0);
	const handleClick = (type) => {
		setClicked(type);
		setTime(type);
	};
	return (
		<Col sm="6">
			<ButtonGroup
				className="btn-group-toggle float-right"
				data-toggle="buttons"
			>
				<Button
					tag="label"
					className={
						clicked === 0
							? "btn-simple active button-again"
							: "btn-simple button-again"
					}
					color="info"
					id="0"
					size="sm"
					onClick={() => handleClick(0)}
				>
					<input
						defaultChecked
						className="d-none"
						name="options"
						type="radio"
					/>
					<span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
						This Week
					</span>
					<span className="d-block d-sm-none">
						<i className="tim-icons  icon-single-02" />
					</span>
				</Button>
				<Button
					tag="label"
					className={
						clicked === 1
							? "btn-simple active button-again"
							: "btn-simple button-again"
					}
					color="info"
					id="0"
					size="sm"
					onClick={() => handleClick(1)}
				>
					<input
						defaultChecked
						className="d-none"
						name="options"
						type="radio"
					/>
					<span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
						Last 7 Days
					</span>
					<span className="d-block d-sm-none">
						<i className="tim-icons icon-single-02" />
					</span>
				</Button>
				<Button
					color="info"
					id="1"
					size="sm"
					tag="label"
					className={
						clicked === 2
							? "btn-simple active button-again"
							: "btn-simple button-again"
					}
					onClick={() => handleClick(2)}
				>
					<input className="d-none" name="options" type="radio" />
					<span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
						This Month
					</span>
					<span className="d-block d-sm-none">
						<i className="tim-icons icon-gift-2" />
					</span>
				</Button>
				<Button
					color="info"
					id="2"
					size="sm"
					tag="label"
					className={
						clicked === 3
							? "btn-simple active button-again"
							: "btn-simple button-again"
					}
					onClick={() => handleClick(3)}
				>
					<input className="d-none" name="options" type="radio" />
					<span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
						This Year
					</span>
					<span className="d-block d-sm-none">
						<i className="tim-icons icon-tap-02" />
					</span>
				</Button>
			</ButtonGroup>
		</Col>
	);
};

const ControlButtons = () => {
	return (
		<Col sm="6">
			<ButtonGroup
				className="btn-group-toggle float-right"
				data-toggle="buttons"
			>
				<Button
					tag="label"
					className="btn-simple button-again"
					color="info"
					id="0"
					size="sm"
				>
					<input
						defaultChecked
						className="d-none"
						name="options"
						type="radio"
					/>
					<span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
						This Week
					</span>
					<span className="d-block d-sm-none">
						<i className="tim-icons icon-single-02" />
					</span>
				</Button>
				<Button
					color="info"
					id="1"
					size="sm"
					tag="label"
					className="btn-simple button-again"
				>
					<input className="d-none" name="options" type="radio" />
					<span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
						This Month
					</span>
					<span className="d-block d-sm-none">
						<i className="tim-icons icon-gift-2" />
					</span>
				</Button>
				<Button
					color="info"
					id="2"
					size="sm"
					tag="label"
					className="btn-simple active button-again"
				>
					<input className="d-none" name="options" type="radio" />
					<span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
						This Year
					</span>
					<span className="d-block d-sm-none">
						<i className="tim-icons icon-tap-02" />
					</span>
				</Button>
			</ButtonGroup>
		</Col>
	);
};

let chart1_2_options = {
	maintainAspectRatio: false,
	legend: {
		display: false,
	},
	tooltips: {
		backgroundColor: "#f5f5f5",
		titleFontColor: "#333",
		bodyFontColor: "#666",
		bodySpacing: 4,
		xPadding: 12,
		mode: "nearest",
		intersect: 0,
		position: "nearest",
	},
	responsive: true,
	scales: {
		yAxes: [
			{
				barPercentage: 1.6,
				gridLines: {
					drawBorder: false,
					color: "rgba(29,140,248,0.0)",
					zeroLineColor: "transparent",
				},
				ticks: {
					suggestedMin: 60,
					suggestedMax: 125,
					padding: 20,
					fontColor: "#9a9a9a",
				},
			},
		],
		xAxes: [
			{
				barPercentage: 1.6,
				gridLines: {
					drawBorder: false,
					color: "rgba(29,140,248,0.1)",
					zeroLineColor: "transparent",
				},
				ticks: {
					padding: 20,
					fontColor: "#9a9a9a",
				},
			},
		],
	},
};

let chartExample1 = {
	data1: (canvas) => {
		let ctx = canvas.getContext("2d");

		let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

		gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
		gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
		gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

		return {
			labels: [
				"JAN",
				"FEB",
				"MAR",
				"APR",
				"MAY",
				"JUN",
				"JUL",
				"AUG",
				"SEP",
				"OCT",
				"NOV",
				"DEC",
			],
			datasets: [
				{
					label: "My First dataset",
					fill: true,
					backgroundColor: gradientStroke,
					borderColor: "#1f8ef1",
					borderWidth: 2,
					borderDash: [],
					borderDashOffset: 0.0,
					pointBackgroundColor: "#1f8ef1",
					pointBorderColor: "rgba(255,255,255,0)",
					pointHoverBackgroundColor: "#1f8ef1",
					pointBorderWidth: 20,
					pointHoverRadius: 4,
					pointHoverBorderWidth: 15,
					pointRadius: 4,
					data: [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
				},
			],
		};
	},
	data2: (canvas) => {
		let ctx = canvas.getContext("2d");

		let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

		gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
		gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
		gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

		return {
			labels: [
				"JAN",
				"FEB",
				"MAR",
				"APR",
				"MAY",
				"JUN",
				"JUL",
				"AUG",
				"SEP",
				"OCT",
				"NOV",
				"DEC",
			],
			datasets: [
				{
					label: "My First dataset",
					fill: true,
					backgroundColor: gradientStroke,
					borderColor: "#1f8ef1",
					borderWidth: 2,
					borderDash: [],
					borderDashOffset: 0.0,
					pointBackgroundColor: "#1f8ef1",
					pointBorderColor: "rgba(255,255,255,0)",
					pointHoverBackgroundColor: "#1f8ef1",
					pointBorderWidth: 20,
					pointHoverRadius: 4,
					pointHoverBorderWidth: 15,
					pointRadius: 4,
					data: [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
				},
			],
		};
	},
	data3: (canvas) => {
		let ctx = canvas.getContext("2d");

		let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

		gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
		gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
		gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

		return {
			labels: [
				"JAN",
				"FEB",
				"MAR",
				"APR",
				"MAY",
				"JUN",
				"JUL",
				"AUG",
				"SEP",
				"OCT",
				"NOV",
				"DEC",
			],
			datasets: [
				{
					label: "My First dataset",
					fill: true,
					backgroundColor: gradientStroke,
					borderColor: "#1f8ef1",
					borderWidth: 2,
					borderDash: [],
					borderDashOffset: 0.0,
					pointBackgroundColor: "#1f8ef1",
					pointBorderColor: "rgba(255,255,255,0)",
					pointHoverBackgroundColor: "#1f8ef1",
					pointBorderWidth: 20,
					pointHoverRadius: 4,
					pointHoverBorderWidth: 15,
					pointRadius: 4,
					data: [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130],
				},
			],
		};
	},
	options: chart1_2_options,
};

let chartExample3 = {
	data: (canvas) => {
		let ctx = canvas.getContext("2d");

		let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

		gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
		gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
		gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

		return {
			labels: ["USA", "GER", "AUS", "UK", "RO", "BR"],
			datasets: [
				{
					label: "Countries",
					fill: true,
					backgroundColor: gradientStroke,
					hoverBackgroundColor: gradientStroke,
					borderColor: "#d048b6",
					borderWidth: 2,
					borderDash: [],
					borderDashOffset: 0.0,
					data: [53, 20, 10, 80, 100, 45],
				},
			],
		};
	},
	options: {
		maintainAspectRatio: false,
		legend: {
			display: false,
		},
		tooltips: {
			backgroundColor: "#f5f5f5",
			titleFontColor: "#333",
			bodyFontColor: "#666",
			bodySpacing: 4,
			xPadding: 12,
			mode: "nearest",
			intersect: 0,
			position: "nearest",
		},
		responsive: true,
		scales: {
			yAxes: [
				{
					gridLines: {
						drawBorder: false,
						color: "rgba(225,78,202,0.1)",
						zeroLineColor: "transparent",
					},
					ticks: {
						suggestedMin: 60,
						suggestedMax: 120,
						padding: 20,
						fontColor: "#9e9e9e",
					},
				},
			],
			xAxes: [
				{
					gridLines: {
						drawBorder: false,
						color: "rgba(225,78,202,0.1)",
						zeroLineColor: "transparent",
					},
					ticks: {
						padding: 20,
						fontColor: "#9e9e9e",
					},
				},
			],
		},
	},
};

export default Dashboard;
