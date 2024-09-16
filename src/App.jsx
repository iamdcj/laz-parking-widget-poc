import { Box } from "@mui/material";
import VariantSwitch from "./components/VariantSwitch";
import { AppProvider } from "./context";

function App(props) {
  return (
    <AppProvider value={props}>
      <div
        style={{
          maxWidth: props.width ? `${props.width}px` : "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#007dba",
            padding: 3,
            marginBottom: 1,
            borderRadius: "0 0 5px 5px"

          }}
        >
          {props.title ? (
            <p
              style={{
                color: "#fff",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {props.title}
            </p>
          ) : (
            <img
              src="https://go.lazparking.com/static/media/laz-logo.a4d328f3134864d713456684b16773d9.svg"
              id="laz-logo"
              class="laz-header-logo"
              alt=""
              width={50}
            />
          )}
        </Box>
        <VariantSwitch />
      </div>
    </AppProvider>
  );
}

export default App;
