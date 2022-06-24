import React from "react";

//Images and Styles
import logo from "../../assets/images/clark-logo.svg";
import "./Footer.scss";

const Footer = () => {
  return (
    <div className="Footer">
      <a
        href="https://www.clark.de"
        target="__blank"
        title="Clark Website"
        className="Footer__Link"
      >
        <img className="Link__Image" src={logo} alt="Clark Logo" />
      </a>
    </div>
  );
};

export default Footer;
