import "./App.css";
import { DerivTrading } from "./components/DerivTrading";

function App() {
  return (
    <div className="container">
      <h1>Deriv Trading App</h1>
      <div className="env-info">
        <p>Environment: {import.meta.env.MODE}</p>
      </div>
      <DerivTrading />
    </div>
  );
}

export default App;
