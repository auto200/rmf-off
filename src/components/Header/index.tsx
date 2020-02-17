import React from "react";
import styled from "styled-components";
import { headerHeight } from "../../utils/constants";
import { FaMoon, FaSun } from "react-icons/fa";
import { TiThLarge } from "react-icons/ti";
import { MdApps } from "react-icons/md";
import PropTypes from "prop-types";

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${headerHeight + "px"};
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ToggleTheme = styled.div`
  color: ${({ theme }) => theme.colors.regularText};
  font-size: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  cursor: pointer;
`;
const Filters = styled.div``;
const LayoutIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  font-size: 38px;
  color: ${({ theme }) => theme.colors.regularText};
  cursor: pointer;
  user-select: none;
  @media (max-width: 1100px) {
    display: none;
  }
`;

const Header = ({
  toggleDarkMode,
  darkMode,
  currentFilterType,
  filterValue,
  setFilter,
  filterTypes,
  wideGridLayout,
  toggleGridLayout
}) => {
  const handleFilterTypeChange = e => {
    const val = e.target.value;
    setFilter([val, filterValue]);
  };
  const handleFilterInputChange = e => {
    const val = e.target.value;
    setFilter([currentFilterType, val]);
  };
  return (
    <Wrapper>
      <ToggleTheme onClick={toggleDarkMode} title="Zmień schemat kolorów">
        {darkMode ? <FaMoon /> : <FaSun />}
      </ToggleTheme>
      <Filters>
        <select value={currentFilterType} onChange={handleFilterTypeChange}>
          {Object.entries(filterTypes).map((filter: any) => (
            <option key={filter[0]} value={filter[0]}>
              {filter[1]}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={filterValue}
          onChange={handleFilterInputChange}
        />
      </Filters>
      <LayoutIconWrapper onClick={toggleGridLayout}>
        {wideGridLayout ? <TiThLarge /> : <MdApps />}
      </LayoutIconWrapper>
    </Wrapper>
  );
};

export default Header;

Header.propTypes = {
  toggleDarkMode: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  currentFilterType: PropTypes.string.isRequired,
  filterValue: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  filterTypes: PropTypes.object.isRequired,
  wideGridLayout: PropTypes.bool.isRequired,
  toggleGridLayout: PropTypes.func.isRequired
};
