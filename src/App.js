import React, { useEffect, useState } from "react";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink } from "reactstrap";
import Autocomplete from "./components/Autocomplete";
import Generate from "./components/Generate";
import About from "./components/About";
import Footer from "./components/Footer";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [view, setView] = useState("Autocomplete");

  useEffect(() => {
    const storedView = JSON.parse(window.localStorage.getItem('appView'));
    if (storedView) {
      setView(storedView);
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('appView',JSON.stringify(view));
  }, [view])



  let sections = {
    "Autocomplete": <Autocomplete />,
    "Generate": <Generate />,
    "About": <About />
  };

  let footerText = {
    "Generate": "Generate a full comment based on ideas from residents of Lexington, KY",
    "Autocomplete": "Choose your own words to create a comment based on ideas from residents of Lexington, KY",
    "About": <span>Created by <a className="text-white" href="https://also-and.web.app/" target="_blank" rel="noreferrer">B</a> and <a className="text-white" href="https://jofrhwld.github.io/" target="_blank" rel="noreferrer">Joe</a> for <a className="text-white" href="https://www.civiclex.org/" target="_blank" rel="noreferrer">Civic Lex</a></span>
  };

  return (
    <>
      <Navbar
        expand="md"
        light
        className="navbar-default navbar-dark sticky-top text-white bg-primary">
        <h1
          onClick={() => setView("About")}>
          Lex Autocomplete
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
                    style={{ cursor: "pointer", fontSize: "1.25em" }}
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