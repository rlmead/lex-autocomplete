import React, { useState } from "react";
import { Navbar, Nav, NavItem, NavLink } from "reactstrap";
import Autocomplete from "./components/Autocomplete";
import Generate from "./components/Generate";
import About from "./components/About";

function App() {
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
        className="navbar-dark sticky-top text-light bg-primary">
        <h1>OTT Text Prediction</h1>
      </Navbar>
      <Nav
        justified
        tabs
        className="bg-primary" >
        {
          Object.keys(sections).map((item, index) => {
            return (
              <NavItem
                className="mx-auto"
                key={index}
                onClick={() => setView(item)} >
                <NavLink
                  className={item !== view ? "text-light" : "text-info"}>
                  {item}
                </NavLink>
              </NavItem>
            )
          })
        }
      </Nav>
      {
        sections[view]
      }
    </>
  )
}

export default App;