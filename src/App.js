import "./App.css";
import VariantSwitch from "./components/VariantSwitch";
import { AppProvider } from "./context";

function App(props) {
  return (
    <AppProvider value={props}>
      <VariantSwitch />
    </AppProvider>
  );
}

export default App;
