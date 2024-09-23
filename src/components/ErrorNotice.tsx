import React from "react";
import { Alert } from "@mui/material";

const ErrorNotice = ({ error }: { error: string }) => {
  return (
    <Alert severity="error" variant="filled">
      {error}
    </Alert>
  );
};

export default ErrorNotice;
