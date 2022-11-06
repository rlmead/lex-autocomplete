import React from "react";
import { Navbar, Nav } from "reactstrap";

function Footer(props) {
  return (
    <Navbar
      className="fixed-bottom bg-success text-white">
      <Nav
        className="mx-auto">
        <p className="mb-auto">
          {props.text}
        </p>
      </Nav>
    </Navbar>
  );
}

export default Footer;