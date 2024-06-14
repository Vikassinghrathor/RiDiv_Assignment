import {Container , Navbar} from "react-bootstrap";
import MainLogo from "../assets/images/weatherLogo.png";

const NavHeader = () => {
  return (
     <Navbar>
      <Container>
        <Navbar.Brand href="./">
        <img
          src={MainLogo}
          alt="Main Logo"
          width="30"
          height="30"
          className="align-top"
        />
        Weather Dashboard</Navbar.Brand>
      </Container>
     </Navbar>
  );
}

export default NavHeader;