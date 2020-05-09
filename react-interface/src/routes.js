/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import Map from "views/Map.js";
import Rtl from "views/Rtl.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";

import TadhgTable from "views/TadhgTables";
import Notifications from "views/MyNotifications";

import Users from "views/Users";
import Albums from "views/Albums";
import Analytics from "views/Analytics";
var routes = [
	{
		path: "/analytics",
		name: "Analytics",
		rtlName: "لوحة القيادة",
		icon: "tim-icons icon-chart-pie-36",
		component: Analytics,
		layout: "/admin",
	},
	{
		path: "/users",
		name: "Users",
		rtlName: "قائمة الجدول",
		icon: "tim-icons icon-single-02",
		component: Users,
		layout: "/admin",
	},
	{
		path: "/albums",
		name: "Albums",
		rtlName: "قائمة الجدول",
		icon: "tim-icons icon-world",
		component: Albums,
		layout: "/admin",
	},
	{
		path: "/notifications",
		name: "Notifications",
		rtlName: "إخطارات",
		icon: "tim-icons icon-bell-55",
		component: Notifications,
		layout: "/admin",
	},
];
export default routes;