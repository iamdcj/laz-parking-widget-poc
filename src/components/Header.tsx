import {
  Box,
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Icons from "./Icons";
import { useTheme } from "@mui/material/styles";
import { useAppContext } from "../context";
import MenuIcon from "@mui/icons-material/Menu";
import { ChevronRight } from "@mui/icons-material";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const {
    state: { headerText, logo, labels },
  } = useAppContext();
  const theme = useTheme();

  // for menu
  // labels.CANCELRESERVATION_URL
  // labels.MANAGEMYBOOKING
  // labels.MANAGEMYBOOKING_URL
  // labels.EDITRESERVATION_URL

  return (
    <Box
      id="LAZ_WidgetHeader"
      sx={{
        backgroundColor: "primary.main",
        zIndex: 3,
        borderRadius: "0 0 4px 4px",
        position: "relative",
      }}
    >
      <Box
        className="LAZ_WidgetHeader_Content"
        height={48}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 1.5,
          mb: -0.5,
        }}
      >
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{ color: "#fff", position: "absolute", left: 10 }}
        >
          <MenuIcon color="inherit" />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {labels.MANAGEMYBOOKING_URL && (
            <MenuItem onClick={handleClose}>
              <Link
                href={labels.MANAGEMYBOOKING_URL}
                target="_blank"
                onClick={handleClose}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%"
                }}
              >
                {labels.MYACCOUNT || labels.MANAGEMYBOOKING} <ChevronRight />
              </Link>
            </MenuItem>
          )}
          {labels.EDITRESERVATION_URL && (
            <MenuItem onClick={handleClose}>
              <Link
                href={labels.EDITRESERVATION_URL}
                target="_blank"
                onClick={handleClose}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%"
                }}
              >
                {labels.CANCELRESERVATION} <ChevronRight />
              </Link>
            </MenuItem>
          )}
          {labels.CANCELRESERVATION_URL && (
            <MenuItem onClick={handleClose}>
              <Link
                href={labels.CANCELRESERVATION_URL}
                target="_blank"
                onClick={handleClose}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%"
                }}
              >
                {labels.EDITRESERVATION} <ChevronRight />
              </Link>
            </MenuItem>
          )}
        </Menu>

        {logo ? (
          <img
            src={logo}
            alt="Client Logo"
            style={{ height: 30, width: "auto" }}
          />
        ) : (
          <Typography component="p" color={theme.palette.primary.contrastText}>
            {headerText || labels.RESERVEPARKING}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Header;
