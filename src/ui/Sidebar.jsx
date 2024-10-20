import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";
import Uploader from "../data/Uploader";
import { HiCog } from "react-icons/hi2";
import { useState } from "react";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const Setting = styled.div`
  position: absolute;
  top: 24px;
  right: 10px;
  scale: 2;
  opacity: 0;
`;

function Sidebar() {
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow((show) => !show);
  };

  return (
    <StyledSidebar>
      <Logo />
      <MainNav />
      {/* NOTE: DEV TEMP */}
      <Setting onClick={handleClick}>
        <HiCog color="#462bc7" />
      </Setting>
      {show && <Uploader />}
      {/* NOTE: DEV TEMP */}
    </StyledSidebar>
  );
}

export default Sidebar;
