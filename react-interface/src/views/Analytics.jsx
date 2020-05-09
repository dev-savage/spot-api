import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import classNames from "classnames";
// reactstrap components
import {
	Button,
	ButtonGroup,
	Card,
	CardHeader,
	CardBody,
	CardTitle,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
	Label,
	FormGroup,
	Input,
	Table,
	Row,
	Col,
	UncontrolledTooltip,
} from "reactstrap";

import {
	chartExample1,
	chartExample2,
	chartExample3,
	chartExample4,
} from "variables/charts.js";

const AlbumChart = () => {
	const [bc, setBc] = useState(null);
	const [months, setMonths] = useState(null);
	const [overallStat, setOverallStat] = useState(null);
	useEffect(() => {
		axios.get("http://localhost:3000/plays").then((results) => {
			const bar = getBarChart(results.data);
			setOverallStat(getTotalDailyPlays(results.data));
			setBc(bar);
			axios.get("http://localhost:3000/plays/month").then((results) => {
				setMonths(results.data);
			});
		});
	}, []);
	return (
		<>
			<div className="content">
				<Row>
					<Col lg="12">
						<Card className="card-chart">
							<CardHeader>
								<h5 className="card-category">Individual Album Plays</h5>
								{overallStat ? (
									<CardTitle tag="h3">
										<i className="tim-icons icon-delivery-fast text-primary" />{" "}
										{overallStat} streams so far today
									</CardTitle>
								) : (
									<CardTitle tag="h3">
										<i className="tim-icons icon-delivery-fast text-primary" />{" "}
										Loading
									</CardTitle>
								)}
							</CardHeader>
							<CardBody>
								{bc ? (
									<div className="chart-area">
										<Bar data={bc.data} options={bc.options} />
									</div>
								) : (
									<h4>Loading</h4>
								)}
							</CardBody>
						</Card>
					</Col>
				</Row>
				<Row>
					<Col xs="12">
						<Card className="card-chart">
							<CardHeader>
								<Row>
									<Col className="text-left" sm="6">
										<h5 className="card-category">Total Streams</h5>
										<CardTitle tag="h2">Overall Performance</CardTitle>
									</Col>
									<Col sm="6">
										<ButtonGroup
											className="btn-group-toggle float-right"
											data-toggle="buttons"
										>
											<Button
												tag="label"
												className={classNames("btn-simple", "active")}
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
													Monthly
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
												className={classNames("btn-simple")}
											>
												<input className="d-none" name="options" type="radio" />
												<span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
													Weekly
												</span>
												<span className="d-block d-sm-none">
													<i className="tim-icons icon-gift-2" />
												</span>
											</Button>
											<Button
												color="info"
												id="1"
												size="sm"
												tag="label"
												className={classNames("btn-simple")}
											>
												<input className="d-none" name="options" type="radio" />
												<span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
													Daily
												</span>
												<span className="d-block d-sm-none">
													<i className="tim-icons icon-gift-2" />
												</span>
											</Button>
										</ButtonGroup>
									</Col>
								</Row>
							</CardHeader>
							<CardBody>
								<div className="chart-area">
									{months ? (
										<Line
											data={getLineChart(months).data}
											options={getLineChart(months).options}
										/>
									) : (
										<h3>Loading!</h3>
									)}
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</div>
		</>
	);
};

const getTotalDailyPlays = (data) => {
	console.log(data);
	const plays = data.map((album) => album.count);
	const total = plays.reduce((total, curr) => total + parseInt(curr), 0);
	return total;
};
const getBarChart = (data) => {
	const albums = data.map((album) => album.album);
	const plays = data.map((album) => album.count);
	const max = Math.ceil(Math.max(...plays) * 1.1);
	const min = Math.floor(Math.min(...plays) * 0.8);
	const total = plays.reduce((total, curr) => total + parseInt(curr), 0);
	console.log(total);
	return {
		data: (canvas) => {
			let ctx = canvas.getContext("2d");

			let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

			gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
			gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
			gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

			return {
				labels: albums,
				datasets: [
					{
						label: "Plays",
						fill: true,
						backgroundColor: gradientStroke,
						hoverBackgroundColor: gradientStroke,
						borderColor: "#d048b6",
						borderWidth: 2,
						borderDash: [],
						borderDashOffset: 0.0,
						data: plays,
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
							suggestedMin: min,
							suggestedMax: max,
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
};

const getLineChart = (months) => {
	console.log(months);
	const max = Math.ceil(Math.max(...months) * 1.1);
	return {
		data: (canvas) => {
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
						data: months,
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
						barPercentage: 1.6,
						gridLines: {
							drawBorder: false,
							color: "rgba(29,140,248,0.0)",
							zeroLineColor: "transparent",
						},
						ticks: {
							suggestedMin: 60,
							suggestedMax: max,
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
		},
	};
};

export default AlbumChart;
