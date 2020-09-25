import { Grid, Header } from "semantic-ui-react";
import Particles from "react-particles-js";

export default function NotFound() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "90vw",
        height: "100vh",
      }}
    >
      <Particles
        params={{
          particles: {
            number: {
              value: 8,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            line_linked: {
              enable: false,
            },
            move: {
              speed: 1,
              out_mode: "out",
            },
            shape: {
              type: ["image", "circle"],
              image: [
                {
                  src: "/atom.png",
                  height: 20,
                  width: 20,
                },
                {
                  src: "/sublime.png",
                  height: 26,
                  width: 25,
                },
                {
                  src: "/vscode.png",
                  height: 20,
                  width: 20,
                },
              ],
            },
            color: {
              value: "#CCC",
            },
            size: {
              value: 30,
              random: false,
              anim: {
                enable: true,
                speed: 4,
                size_min: 10,
                sync: false,
              },
            },
          },
          retina_detect: false,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Grid centered>
          <Header
            as="h2"
            style={{
              color: "orange",
              marginTop: "2em",
              fontFamily: "VT323, monospace",
              fontSize: "28px",
            }}
          >
            Code Heat
          </Header>
        </Grid>
        <Grid centered style={{ marginTop: "10em" }}>
          <div style={{ border: "2px solid orange", padding: "2em" }}>
            <h2 style={{ color: "orange" }}>Oops Page Not Found!</h2>
          </div>
        </Grid>
      </div>
    </div>
  );
}
