import "./App.css";
import React, { useState, useEffect } from "react";

const userNames = [
  "sagargupta1610",
  "sagargupta1610",
]

function App() {
  const url = "https://lcapi.cyclic.app/";
  const [data, setData] = useState([]);

  const fetchInfo = () => {
    return Promise.all(
      userNames.map((userName) => {
        return fetch(url + userName).then((res) => res.json());
      }
      )
    ).then((res) => {
      setData(res);
    }
    );
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  console.log(data);

  return (
    <div className="App">
      React App {data[0].easySolved}
    </div>
  );
}

export default App;