import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      onClick={() => loginWithRedirect()}
      variant={"outlined"}
      sx={{
        mx: "0.5vw",
      }}
    >
      Staff Login
    </Button>
  );
};

export default LoginButton;
