import React, { Fragment, useState, useEffect, useRef } from "react";
import { Modal, Button, Grid, Header, Input, Message } from "semantic-ui-react";
import axios from "axios";
import Particles from "react-particles-js";
import { useRouter } from "next/router";
import Loader from "react-loader-spinner";

export default function Home() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [snippetName, setSnippetName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [spinner, setSpinner] = useState("");

  async function createSnippet(e) {
    e.preventDefault();
    
      if (snippetName === "") {
        setNameError(true);
        return;
      }
      setSpinner("loading");
      const res = await axios.post("/api/code", {
        name: snippetName,
        fontFamily: "Courier, sans-serif",
        fontSize: "14px",
        content: `function greet(){
    console.log('welcome to code heat');
  }`,
      });

      console.log(res.data);
      setSnippetName("");
      setModalOpen(!modalOpen);
      if (window.location.href === `${window.location.href}/${res.data.data._id}`) {
        setSpinner("loaded");
      }
      console.log(res.data.success);
      router.push(`/${res.data.data._id}`);
  }
  useEffect(() => {
    if (!modalOpen) {
      setNameError(false);
    }
  }, [modalOpen]);

  return (
    <>
        <Particles
          params={{
            particles: {
              number: {
                value: 80,
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
                    src: "",
                    height: 20,
                    width: 20,
                  },
                  {
                    src: "",
                    height: 26,
                    width: 25,
                  },
                  {
                    src: "",
                    height: 20,
                    width: 20,
                  },
                ],
              },
              color: {
                value: "#ff7d1a",
              },
              size: {
                value: 15,
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
    <div  style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    }}       >
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

          {spinner === "loading" ? (
            <Loader
              type="Bars"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2em",
              }}
              color="#AF601A"
              height={220}
              width={300}
              timeout={5000} //3 secs
            />
          ) : (
              <Modal
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
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Input
                      type="text"
                      value={snippetName}
                      onChange={(e) => {
                        setSnippetName(e.target.value);
                      }}
                      onKeyUp = {(e)=>{
                        console.log("hi");
                        if(e.key==="Enter"){
                          console.log("done");
                          createSnippet(e);
                        }
                      }}
                      placeholder="Give your snippet a name"
                    />
                  </div>
                </Modal.Content>
                <Modal.Actions>
                  <Button color="orange"
                    onClick={createSnippet}>
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
            )}
        </div>
  </>
  );
}
