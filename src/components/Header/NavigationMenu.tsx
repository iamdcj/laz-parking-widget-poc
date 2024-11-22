import { Button, Link, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { useAppContext } from "../../context";
import MenuIcon from "@mui/icons-material/Menu";
import { ChevronRight } from "@mui/icons-material";

const NavigationMenu = () => {
  const theme = useTheme();
  const {
    state: { labels, isHeaderEnabled },
  } = useAppContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const links = [
    {
      link: labels.MANAGEMYBOOKING_URL,
      label: labels.MYACCOUNT || labels.MANAGEMYBOOKING,
    },
    {
      link: labels.EDITRESERVATION_URL,
      label: labels.EDITRESERVATION,
    },
    {
      link: labels.CANCELRESERVATION_URL,
      label: labels.CANCELRESERVATION,
    },
  ];

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          color: "#fff",
          position: "absolute",
          right: 0,
          minWidth: "auto",
        }}
      >
        <MenuIcon
          sx={{
            color: !isHeaderEnabled ? theme.palette.primary.main : "#fff",
          }}
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {links.map(({ link, label }) => (
          <MenuItem
            onClick={handleClose}
            sx={{ pr: 0 }}
            key={`menu-item-${label}`}
          >
            <Link
              href={link}
              target="_blank"
              onClick={handleClose}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                textDecoration: "none",
              }}
            >
              {label} <ChevronRight />
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NavigationMenu;
