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

  let footerText = {
    "Generate": "Generate a full comment based on ideas from residents of Lexington, KY",
    "Autocomplete": "Choose your own words to create a comment based on ideas from residents of Lexington, KY",
    "About": <span>Created by <a className="text-white" href="https://also-and.web.app/" target="_blank">B</a> and <a className="text-white" href="https://jofrhwld.github.io/" target="_blank">Joe</a></span>
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
                    style={{ cursor: "pointer" }}
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
      {
        <Footer text={footerText[view]} />
      }
    </>
  );
}

export default App;