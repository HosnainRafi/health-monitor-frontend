import React from "react";

function Recommendations({ suggestions, whatToEat, whatToAvoid }) {
  return (
    <div className="mb-4">
      <h4>Personalized Recommendations</h4>
      <ul className="list-group mb-3">
        {suggestions &&
          suggestions.map((tip, i) => (
            <li key={i} className="list-group-item">
              {tip}
            </li>
          ))}
      </ul>
      <div className="row">
        <div className="col-md-6">
          <h5>What to Eat</h5>
          <ul className="list-group">
            {whatToEat &&
              whatToEat.map((item, i) => (
                <li key={i} className="list-group-item list-group-item-success">
                  {item}
                </li>
              ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h5>What to Avoid</h5>
          <ul className="list-group">
            {whatToAvoid &&
              whatToAvoid.map((item, i) => (
                <li key={i} className="list-group-item list-group-item-danger">
                  {item}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
