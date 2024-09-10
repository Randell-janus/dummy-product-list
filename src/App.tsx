import { useState } from "react";
import Modal from "./components/reusables/Modal";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>modal</p>
      <Modal />
    </>
  );
}

export default App;
