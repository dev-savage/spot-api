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
import fontawesome from "@fortawesome/fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
fontawesome.library.add(faMusic);
const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
	margin-bottom: 3em;
`;
const ep = "http://77.68.118.54/api/plays/barchart/";
const Dashboard = () => {
	return (
		<div className="content">
			<LineCard />
			<BarCard resource={"artist"} />
			<BarCard resource={"album"} />
		</div>
	);
};

const LineCard = () => {
	const [line, setLine] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [time, setTime] = useState("MONTH");
	const [total, setTotal] = useState(0);
	useEffect(() => {
		setLoading(true);
		axios
			.get(`http://77.68.118.54/api/plays/linechart/${time}`)
			.then((res) => {
				console.log(res.data);
				createTotal(res.data);
				setLine(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setError(true);
				setLoading(false);
			});
	}, [time]);
	const createTotal = (data) => {
		let t = 0;
		data.forEach((el) => {
			t += el.count;
		});
		setTotal(t);
	};

	const changed = (value) => {
		console.log("changed to " + value);
		switch (value) {
			case 0: {
				setTime("WEEK");
				break;
			}
			case 1: {
				setTime("MONTH");
				break;
			}
			case 2: {
				setTime("YTD");
				break;
			}
			default: {
				setTime("YTD");
				break;
			}
		}
	};

	return (
		<Row>
			<div className="col-12 my--card">
				<Card className="my--card--stuff">
					<CardHeader>
						<Row>
							<Col className="text-left" sm="6">
								<h5 className="card-category">Overall</h5>
								<CardTitle className="header--symbol" tag="h4">
									<div>
										<i className="fa fa-music music--line--symbol"></i>
									</div>
									<div className="header--figure ">{total} streams</div>
								</CardTitle>
							</Col>
							<ControlButtons setTime={changed} />
						</Row>
					</CardHeader>
					<CardBody>
						{error ? (
							<h3>Error {error}</h3>
						) : line ? (
							<Line
								data={linechartDetails(line).data1}
								options={LineChartOptions(line)}
							/>
						) : (
							<Loader />
						)}
					</CardBody>
				</Card>
			</div>
		</Row>
	);
};
const BarCard = ({ resource }) => {
	const name = resource.charAt(0).toUpperCase() + resource.slice(1);
	const [error, setError] = useState(false);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [time, setTime] = useState("WEEK");
	const [total, setTotal] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			setError(false);
			setLoading(true);
			setData(null);
			axios
				.get(`${ep}${resource}/${time}`)
				.then((result) => {
					setData(result.data);
					getTotal(result.data);
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

	const getTotal = (input) => {
		let t = 0;
		input.forEach((el) => {
			console.log(el);
			t += el.total;
		});
		setTotal(t);
	};
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
								<CardTitle className="header--symbol" tag="h4">
									<div>
										<i className="fa fa-music music--bar--symbol"></i>
									</div>
									<div className="header--figure ">{total} streams</div>
								</CardTitle>
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
const linechartDetails = (input) => {
	const labels = input.map((month) => month.MontnameYear);
	const values = input.map((month) => month.count);

	return {
		data1: (canvas) => {
			let ctx = canvas.getContext("2d");

			let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

			gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
			gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
			gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

			return {
				labels: labels,
				datasets: [
					{
						label: "Plays",
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
						data: values,
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
};

const LineChartOptions = (input) => {
	const values = input.map((month) => month.count);

	const suggestedMin = Math.min(...values) < 0 ? 0 : Math.min(...values);
	const suggestedMax =
		Math.max(...values) + Math.ceil(Math.max(...values) * 0.1);

	return {
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
						suggestedMin: suggestedMin,
						suggestedMax: suggestedMax,
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
};

const ControlButtons = ({ setTime }) => {
	const [clicked, setClicked] = useState(1);
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
						This Month
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
						This Year
					</span>
					<span className="d-block d-sm-none">
						<i className="tim-icons icon-gift-2" />
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

const Loader = () => {
	return (
		<RingLoader css={override} size={90} color={"#1d8cf8"} loading={true} />
	);
};
export default Dashboard;
