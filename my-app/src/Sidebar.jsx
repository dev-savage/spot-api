import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";
import "./css/sidebar.css";
import spotlogo2 from "./spotlogo2.png";
import fontawesome from "@fortawesome/fontawesome";
import {
	faMusic,
	faChartLine,
	faUsers,
	faCircle,
	faDesktop,
	faBell,
} from "@fortawesome/free-solid-svg-icons";
fontawesome.library.add(
	faMusic,
	faChartLine,
	faUsers,
	faCircle,
	faDesktop,
	faBell
);

function Sidebar() {
	const [page, setPage] = useState("dashboard");
	const [key, setKey] = useState(0);
	const isActive = (type) => {
		return page === type;
	};
	const setActive = (type) => {
		setPage(type);
		const key1 = key + 1;
		setKey(key1);
	};
	return (
		<div className="sidebar">
			<div className="sidebar-wrapper">
				<div className="align--center--header">
					<img alt="logo" src={spotlogo2} className="logostyle" />
					<h6 className="sidebar--title">SPOTIFY ANALYTICS</h6>
				</div>
				<hr className="hrstyle" />
				<Nav className="noliststyle">
					<li className="db" onClick={() => setActive("notifications")}>
						<NavLink
							to="/notifications"
							className="nav-link sb__element"
							activeClassName="active"
						>
							<div key={key} className="icon-all">
								{isActive("notifications") ? (
									<i className="fa fa-circle fa-sm my--icon"></i>
								) : (
									<i className="fa fa-circle fa-sm my--icon hide"></i>
								)}
								<div className="align--center">
									<i className="fa fa-bell my--icon"></i>
									<div>Live Feed</div>
								</div>
							</div>
						</NavLink>
					</li>

					<li className="db" onClick={() => setActive("dashboard")}>
						<NavLink
							to="/"
							className="nav-link sb__element"
							activeClassName="active"
						>
							<div key={key} className="icon-all">
								{isActive("dashboard") ? (
									<i className="fa fa-circle fa-sm my--icon"></i>
								) : (
									<i className="fa fa-circle fa-sm my--icon hide"></i>
								)}
								<div className="align--center">
									<i className="fa fa-chart-line fa-sm my--icon"></i>
									<div>Dashboard</div>
								</div>
							</div>
						</NavLink>
					</li>
					<li className="db" onClick={() => setActive("users")}>
						<NavLink
							to="/users"
							className="nav-link sb__element"
							activeClassName="active"
						>
							<div key={key} className="icon-all">
								{isActive("users") ? (
									<i className="fa fa-circle fa-sm my--icon"></i>
								) : (
									<i className="fa fa-circle fa-sm my--icon hide"></i>
								)}
								<div className="align--center">
									<i className="fa fa-users fa-sm my--icon"></i>
									<div>Users</div>
								</div>
							</div>
						</NavLink>
					</li>
					<li className="db" onClick={() => setActive("albums")}>
						<NavLink
							to="/albums"
							className="nav-link sb__element"
							activeClassName="active"
						>
							<div key={key} className="icon-all">
								{isActive("albums") ? (
									<i className="fa fa-circle fa-sm my--icon"></i>
								) : (
									<i className="fa fa-circle fa-sm my--icon hide"></i>
								)}
								<div className="align--center">
									<i className="fa fa-music my--icon"></i>
									<div>Albums</div>
								</div>
							</div>
						</NavLink>
					</li>
					<li className="db" onClick={() => setActive("vms")}>
						<NavLink
							to="/vms"
							className="nav-link sb__element"
							activeClassName="active"
						>
							<div key={key} className="icon-all">
								{isActive("vms") ? (
									<i className="fa fa-circle fa-sm my--icon"></i>
								) : (
									<i className="fa fa-circle fa-sm my--icon hide"></i>
								)}
								<div className="align--center">
									<i className="fa fa-desktop my--icon"></i>
									<div>Virtual Machines</div>
								</div>
							</div>
						</NavLink>
					</li>
					<li className="db" onClick={() => setActive("notifications")}>
						<NavLink
							to="/notifications"
							className="nav-link sb__element"
							activeClassName="active"
						>
							<div key={key} className="icon-all">
								{isActive("notifications") ? (
									<i className="fa fa-circle fa-sm my--icon"></i>
								) : (
									<i className="fa fa-circle fa-sm my--icon hide"></i>
								)}
								<div className="align--center">
									<i className="fa fa-bell my--icon"></i>
									<div>Notifications</div>
								</div>
							</div>
						</NavLink>
					</li>
				</Nav>
			</div>
		</div>
	);
}

export default Sidebar;
