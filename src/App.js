import Calendar from "./Calendar";
import { AccountProvider } from "./AccountContext";

function App() {
  return (
    <AccountProvider>
      <Calendar />
    </AccountProvider>
  );
}

export default App;
