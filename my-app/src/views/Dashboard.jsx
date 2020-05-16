import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardTitle, Row } from "reactstrap";
import "../css/Card.css";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	BarChart,
	Bar,
	Cell,
	Legend,
} from "recharts";
import "../css/Dashboard.css";
// import axios from "axios";

const Dashboard = () => {
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);
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
							<CardTitle tag="h4">Total Plays Over Time</CardTitle>
						</CardHeader>
						<CardBody>
							{error ? (
								<h3>Error {error}</h3>
							) : data ? (
								<AC data={data} />
							) : (
								<h4>Loading</h4>
							)}
						</CardBody>
					</Card>
				</div>
			</Row>
			<Row className="">
				<div className="col-12 my--card override--padding">
					<Card className="my--card--stuff">
						<CardHeader>
							<CardTitle tag="h4">Daily Plays by Album</CardTitle>
						</CardHeader>
						<CardBody>
							{error ? (
								<h3>Error {error}</h3>
							) : bar ? (
								<BC data={bar} />
							) : (
								<h4>Loading</h4>
							)}
						</CardBody>
					</Card>
				</div>
			</Row>
		</div>
	);
};

const AC = ({ data }) => {
	return (
		<AreaChart
			width={1120}
			height={250}
			data={data}
			margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
		>
			<defs>
				{/* <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
					<stop offset="5%" stopColor="#3358f4" stopOpacity={0.8} />
					<stop offset="95%" stopColor="#1d8cf8" stopOpacity={0} />
				</linearGradient> */}
				<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
					<stop offset="5%" stopColor="#3358f4" stopOpacity={0.8} />
					<stop offset="95%" stopColor="#3358f4" stopOpacity={0} />
				</linearGradient>
			</defs>
			<XAxis dataKey="name" />
			<YAxis />
			<CartesianGrid strokeDasharray="1 1" />
			<Tooltip />
			<Area
				type="monotone"
				dataKey="pv"
				stroke="#3358f4"
				fillOpacity={1}
				fill="url(#colorPv)"
			/>
		</AreaChart>
	);
};

const BC = ({ data }) => {
	return (
		<BarChart
			width={1120}
			height={300}
			data={data}
			margin={{
				top: 5,
				right: 30,
				left: 20,
				bottom: 5,
			}}
		>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
			<Legend />
			<Bar dataKey="pv" stroke="#3358f4" />
			<Bar dataKey="value" fill="#27293d">
				{data.map((entry, index) => (
					<Cell key={`cell-${index}`} stroke="#3358f4" strokeWidth={1} />
				))}
			</Bar>
			<Bar dataKey="uv" fill="#27293d" stroke="#3358f4" strokeWidth={2} />
		</BarChart>
	);
};
export default Dashboard;
