import React from "react";
import { Navbar, Nav } from "reactstrap";

function Footer() {
  return (
    <Navbar
      className="fixed-bottom bg-success text-white">
      <Nav
        className="mx-auto">
        <p className="mb-auto">
          Exploring Lexingtonians' ideas for their city's future through combinations of their own words
        </p>
      </Nav>
    </Navbar>
  );
}

export default Footer;