import React from "react";
import styled from "styled-components";

const Container = styled.button`
  all: unset;
  height: 30px;
  padding: 5px;
  display: grid;
  place-items: center;
  cursor: pointer;
`;
const MenuDots = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.secondary};

  ::before,
  ::after {
    content: "";
    display: block;
    position: relative;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: inherit;
  }
  ::before {
    bottom: 10px;
  }
  ::after {
    bottom: -5px;
  }
  ${Container}:hover & {
    background-color: ${({ theme }) => theme.colors.regularText};
  }
`;
const MenuContainer = styled.ul`
  list-style: none;
  width: 250px;
  height: auto;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 10;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
  background-color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  transform-origin: 95% 85%;
  transform: scale(0);
  transition: transform 0.3s ease;
  ${Container}:focus & {
    transform: scale(1);
  }
`;
const StyledMenuItem = styled.li`
  display: flex;
  align-items: center;
  padding: 16px;
  min-height: 26px;
  width: 100%;
  color: ${({ theme }) => theme.colors.regularText};

  :hover {
    background-color: ${({ theme }) => theme.colors.regularText};
    color: ${({ theme }) => theme.colors.primary};
  }
`;
const MenuItemIcon = styled.div`
  width: 24px;
  height: 24px;
  font-size: 24px;
  margin-right: 15px;
  display: grid;
  place-items: center;
`;
export const MenuItem: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ icon, children, ...props }) => {
  return (
    <StyledMenuItem {...props}>
      {icon && <MenuItemIcon>{icon}</MenuItemIcon>}
      {children}
    </StyledMenuItem>
  );
};

const DotMenu: React.FC = ({ children, ...props }) => {
  return (
    <Container {...props}>
      <MenuDots />
      <MenuContainer>{children}</MenuContainer>
    </Container>
  );
};

export default DotMenu;
