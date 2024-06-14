import { Outlet } from "react-router-dom";
import NavHeader from './components/Navbar'


function App() {
  return (
    <>
      <NavHeader />
      <Outlet />
    </>
  );
}

export default App;