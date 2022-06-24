import React from "react";

//Components
import Footer from "../Footer/Footer";
import Questionnaire from "../Questionnaire/Questionnaire";
//Styles
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Questionnaire />
      <Footer />
    </div>
  );
}

export default App;
