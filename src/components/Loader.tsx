import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAppContext } from "../context";

const Loader = () => {
  const { state } = useAppContext();
  const { isLoading } = state;

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        display: "flex",
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        top: 0,
        right: 0,
        zIndex: 2,
        background: "rgba(0, 0, 0, .65)",
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default Loader;