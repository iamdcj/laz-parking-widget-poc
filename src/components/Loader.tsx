import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAppContext } from "../context";

const Loader = () => {
  const { state } = useAppContext();
  const { isLoading, isInitializing } = state;

  if (!isInitializing && !isLoading) return null;

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
        zIndex: 13,
        background: "rgba(255, 255, 255, .75)",
      }}
    >
      <CircularProgress size={42} />
    </Box>
  );
};

export default Loader;
