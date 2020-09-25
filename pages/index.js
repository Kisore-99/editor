import React, { Fragment, useState, useEffect, useRef } from "react";
import { Modal, Button, Grid, Header, Input, Message } from "semantic-ui-react";
import axios from "axios";
import Particles from "react-particles-js";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [snippetName, setSnippetName] = useState("");
  const [nameError, setNameError] = useState(false);

  async function createSnippet(e) {
    e.preventDefault();
    if (snippetName === "") {
      setNameError(true);
      return;
    }
    const res = await axios.post("/api/code", {
      name: snippetName,
      fontFamily: "'courier', sans-serif",
      fontSize: "14px",
      content: `function greet(){
    console.log('welcome to code heat');
  }`,
    });
    console.log(res.data);
    router.push(`/${res.data.data._id}`);
    setModalOpen(!modalOpen);
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <div>
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
              <Button
                color="orange"
                onClick={() => {
                  setModalOpen(!modalOpen);
                }}
              >
                Create a Snippet
              </Button>
            </div>
          </Grid>

          <Modal
            style={{ backgroundColor: "orange", width: "40vw" }}
            dimmer="blurring"
            open={modalOpen}
            onClose={() => {
              setModalOpen(!modalOpen);
            }}
          >
            <Modal.Content>
              {nameError ? (
                <Message error header="Snippet Name Error" content="Please enter a valid name" />
              ) : null}
              <Input
                type="text"
                value={snippetName}
                onChange={(e) => {
                  setSnippetName(e.target.value);
                }}
                placeholder="Give your snippet a name"
              />
            </Modal.Content>
            <Modal.Actions>
              <Button color="orange" onClick={createSnippet}>
                CREATE
              </Button>
              <Button
                color="black"
                onClick={() => {
                  setModalOpen(!modalOpen);
                }}
              >
                CLOSE
              </Button>
            </Modal.Actions>
          </Modal>
        </div>
      </div>
    </div>
  );
}
