import React from "react";
import { Spinner } from "reactstrap";

function Spinners() {
  return (
    <div className="text-left">
      <Spinner type="grow" size="sm" color="danger" className="m-2" />
      <Spinner type="grow" size="sm" color="danger" className="m-2" />
      <Spinner type="grow" size="sm" color="danger" className="m-2" />
    </div>
  )
}

export default Spinners;