import React, { useState } from "react";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink } from "reactstrap";
import Autocomplete from "./components/Autocomplete";
import Generate from "./components/Generate";
import About from "./components/About";
import Footer from "./components/Footer";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const [view, setView] = useState("Generate");

  let sections = {
    "Generate": <Generate />,
    "Autocomplete": <Autocomplete />,
    "About": <About />
  };

  return (
    <>
      <Navbar
        expand="md"
        light
        className="navbar-default navbar-dark sticky-top text-white bg-primary">
        <h1
          onClick={() => setView("About")}>
          Lexington's Words
        </h1>
        <NavbarToggler onClick={toggle} className="text-white" />
        <Collapse
          isOpen={isOpen}
          navbar >
          <Nav
            style={{ display: "flex", flexFlow: "row nowrap" }}
            navbar >
            {
              Object.keys(sections).map((item, index) => {
                return (
                  <NavItem
                    className="mx-auto"
                    key={index}
                    onClick={() => setView(item)} >
                    <NavLink
                      className={item !== view ? "text-white" : "text-warning"}>
                      {item}
                    </NavLink>
                  </NavItem>
                )
              })
            }
          </Nav>
        </Collapse>
      </Navbar>
      {
        sections[view]
      }
      <Footer/>
    </>
  );
}

export default App;