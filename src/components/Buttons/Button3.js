// **************************************
// emotion conponent 생성 방법
// **************************************

import Button from "@mui/material/Button";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material/styles";
import { css } from "@emotion/css";

const BasicButton = styled(Button)`
  background: linear-gradient(90deg, #7c4dff 20%, #b388ff 90%);
  border: 0;
  border-radius: 3px;
  box-shadow: 1px 1px 5px 1px #d1c4e9;
  color: #fff;
  padding: 1rem 2rem;
`;

const Button3 = styled(BasicButton)`
  border: 0;
  border-radius: 3px;
  box-shadow: 1px 1px 5px 1px #d1c4e9;
  height: 48px;
  padding: 1rem 2rem;
  margin-left: 50px;
`;

const CssButton1 = (theme) => {
  return css`
    border: 0;
    border-radius: 3px;
    box-shadow: 1px 1px 5px 1px ${theme.palette.lightGray.main};
    height: 48px;
    padding: 1rem 2rem;
    margin-left: 50px;
  `;
};

const Button4 = styled(BasicButton)`
  font-size: 20px;
`;

export { Button3, Button4, CssButton1 };
