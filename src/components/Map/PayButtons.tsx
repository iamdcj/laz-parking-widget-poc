import React from "react";
import { Box, Button, Link } from "@mui/material";

const PayButtons = ({
  id,
  size = "small",
}: {
  id: string;
  size?: "small" | "medium" | "large";
}) => {
  return (
    <Box display="flex" gap={1.5}>
      <Button
        variant="outlined"
        fullWidth
        component={Link}
        href={`https://go.lazparking.com/buynow?l=${id}`}
        target="_blank"
        size={size}
      >
        Buy Now
      </Button>
      <Button
        variant="outlined"
        fullWidth
        component={Link}
        href={`https://go.lazparking.com/subnow?l=${id}`}
        target="_blank"
        size={size}
      >
        Subscribe
      </Button>
    </Box>
  );
};

export default PayButtons;
