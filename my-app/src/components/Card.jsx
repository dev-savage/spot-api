import React from "react";
import "../css/Card.css";

const Card = () => {
	return (
		<div className="row">
			<div className="col-12">
				<div className="cardstuff">
					<div className="card-header">
						<div className="row">
							<div className="text-left col-sm-6">
								<h5 className="card-category">Test</h5>
								<h2 className="card-title">Other test</h2>
							</div>
						</div>
					</div>
					<div className="card-body"></div>
				</div>
			</div>
		</div>
	);
};

export default Card;
