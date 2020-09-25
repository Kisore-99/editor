import React, { useState, useEffect, Fragment, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Editor from "react-simple-code-editor";
import theme from "prism-react-renderer/themes/vsDark";
import Highlight, { defaultProps } from "prism-react-renderer";
import { Segment, Button, Dropdown, Label, Icon, Grid, Header } from "semantic-ui-react";
import axios from "axios";

import dbConfig from "../../utils/dbConfig";
import Code from "../../models/Code";
import mongoose from "mongoose";
import homeStyles from "../../styles/Home.module.css";
import NotFound from "../404";

export const getServerSideProps = async ({ query: { id } }) => {
  console.log(id);
  dbConfig();
  if (id.length !== 24) {
    return { props: { page: "Not Found" } };
    // router.push("/404");
  }
  const data = await Code.findById({ _id: mongoose.Types.ObjectId(id) });
  if (!data) {
    return { props: { page: "Not Found" } };
  }
  console.log("found content-->", data);
  const { content, fontFamily, fontSize, _id } = data;
  return { props: { content, fontFamily, fontSize, _id: _id.toString() } };
};

const CodeEditor = ({ content, fontFamily, fontSize, _id, page }) => {
  console.log(fontFamily, fontSize);
  if (page === "Not Found") {
    return <NotFound />;
  }
  const exampleCode = content;
  const AUTOSAVE_INTERVAL = 3000;
  const [currentCode, setCurrentCode] = useState(exampleCode);
  const [code, setCode] = useState(exampleCode);
  const [selectedTheme, setSelectedTheme] = useState();
  const [styles, setStyles] = useState({
    boxSizing: "border-box",
    fontFamily,
    fontSize,
    ...theme.plain,
  });
  const [selectedLanguage, setSelectedLanguage] = useState("jsx");
  const [host, setHost] = useState("");
  const textAreaRef = useRef(null);

  useEffect(() => {
    setHost(window.location.origin);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      console.log(code, currentCode);
      if (code !== currentCode) {
        const res = await axios.put("/api/code", {
          content: currentCode,
          fontFamily,
          fontSize,
          id: _id,
        });
      }
    }, AUTOSAVE_INTERVAL);
    return () => clearTimeout(timer);
  }, [currentCode]);

  const onValueChange = (code) => {
    setCurrentCode(code);
  };

  const highlight = (code) => {
    return (
      <Highlight {...defaultProps} theme={theme} code={code} language={selectedLanguage}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Fragment>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {/* <LineNo>{i + 1}</LineNo> */}
                {/* <LineContent> */}
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
                {/* </LineContent> */}
              </div>
            ))}
          </Fragment>
        )}
      </Highlight>
    );
  };

  const increaseFontSize = (e, { value }) => {
    setStyles({ ...styles, fontSize: value });
  };

  const selectLanguage = (e, { value }) => {
    setSelectedLanguage(value);
  };

  const selectFontFamily = (e, { value }) => {
    setStyles({ ...styles, fontFamily: `${value}, sans-serif` });
  };

  const saveCode = async () => {
    try {
      if (!_id) {
        const res = await axios.post("/api/code", { content: currentCode });
      }
      const res = await axios.put("/api/code", {
        content: currentCode,
        id: _id,
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const copyToCliboard = (e) => {
    // console.log(window.location);
    navigator.clipboard.writeText(window.location.href);
  };

  const exportCode = (e, { value }) => {
    console.log(value);

    const element = document.createElement("a");
    const file = new Blob([document.getElementById("exportComponent").value], {
      type: "text/plain;charset=utf-8",
    });
    console.log(file);
    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element);
    element.click();

    // html2canvas(document.getElementById("exportComponent"), {
    //   onrendered: (canvas) => {
    //     console.log(canvas);
    //     var link = document.createElement("a");
    //     document.body.appendChild(link);
    //     link.download = "html_image.png";
    //     link.href = canvas.toDataURL("image/png");
    //     link.target = "_blank";
    //     console.log(document.body);
    //     link.click();
    //   },
    // });
  };

  const sizeOptions = [
    {
      text: "12px",
      value: "12px",
      key: "12px",
      small: "12px",
      style: { background: "#212F3D", color: "#fff" },
    },
    {
      text: "14px",
      value: "14px",
      key: "14px",
      medium: "14px",
      style: { background: "#212F3D", color: "#fff" },
    },
    {
      text: "16px",
      value: "16px",
      key: "16px",
      large: "16px",
      style: { background: "#212F3D", color: "#fff" },
    },
    {
      text: "18px",
      value: "18px",
      key: "18px",
      huge: "18px",
      style: { background: "#212F3D", color: "#fff" },
    },
  ];

  const languageOptions = [
    { key: "jsx", text: "jsx", value: "jsx", style: { background: "#212F3D", color: "#fff" } },
    { key: "java", text: "java", value: "java", style: { background: "#212F3D", color: "#fff" } },
  ];

  const exportOptions = [
    {
      key: "export as jpg",
      text: "export as jpg",
      value: "jpg",
    },
    {
      key: "export as png",
      text: "export as png",
      value: "png",
    },
  ];

  const fontFamilyOptions = [
    {
      key: "Inconsolata",
      text: "Inconsolata",
      value: "Inconsolata",
      style: { background: "#212F3D", color: "#fff" },
    },
    {
      key: "Courier",
      text: "Courier",
      value: "Courier",
      style: { background: "#212F3D", color: "#fff" },
    },
    {
      key: "Stylish",
      text: "Stylish",
      value: "Stylish",
      style: { background: "#212F3D", color: "#fff" },
    },
    {
      key: "Kanit",
      text: "Kanit",
      value: "Kanit",
      style: { background: "#212F3D", color: "#fff" },
    },
  ];

  return (
    <div>
      <Head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.js"></script>
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@700&family=Quicksand:wght@500&family=Source+Code+Pro:ital,wght@1,600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Stylish&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </Head>
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
      <Segment
        style={{
          background: "#000",
          border: "2px solid orange",
          marginTop: "3em",
          marginLeft: "0.7em",
          marginRight: "0.2em",
        }}
      >
        <Grid columns={5} celled="internally" centered style={{ marginTop: "2em" }}>
          <Dropdown
            placeholder="select font size"
            closeOnEscape={false}
            defaultValue={styles.fontSize ? styles.fontSize : sizeOptions[0].value}
            selection
            options={sizeOptions}
            onChange={increaseFontSize}
            style={{ color: "white", background: "#212F3D" }}
          />
          <Dropdown
            placeholder="select font size"
            closeOnEscape={false}
            defaultValue={languageOptions[0].value}
            selection
            options={languageOptions}
            onChange={selectLanguage}
            style={{ color: "white", background: "#212F3D" }}
          />
          <Dropdown
            placeholder="select font family"
            closeOnEscape={false}
            defaultValue={styles.fontFamily ? styles.fontFamily : fontFamilyOptions[0].value}
            selection
            options={fontFamilyOptions}
            onChange={selectFontFamily}
            style={{ color: "white", background: "#212F3D" }}
          />

          {/* <Button.Group color="teal">
            <Button onClick={exportCode}>Export</Button> */}
          {/* <Dropdown
              className="button icon"
              floating
              options={exportOptions}
              trigger={<></>}
              
            /> */}
          {/* </Button.Group> */}
          <Button primary onClick={saveCode}>
            Save
          </Button>
          {/* <Popup trigger={<Button>Share your code</Button>} flowing hoverable>
            <Grid centered divided columns={1}>
              <Grid.Column textAlign="center">
                <Header as="h4">Copy the link</Header>
                <input disabled ref={textAreaRef} value={`${host}/${_id}`} />
                <Icon onClick={copyToCliboard} name="copy" />
              </Grid.Column>
            </Grid>
          </Popup> */}
          <Icon
            onClick={copyToCliboard}
            name="copy"
            size="big"
            color="orange"
            style={{ cursor: "pointer", marginTop: "3px" }}
          ></Icon>
        </Grid>
        <div>
          <Segment
            padded
            raised
            style={{
              border: "1px solid orange",
              marginTop: "3em",
              // background: "#B7950B",
              // background: "#000",
              background: "#9A7D0A",
              padding: "40px",
            }}
          >
            <div
              style={{
                boxShadow: "0 0 3em #F9E79F",
                background: "black",
                padding: "4px",
              }}
            >
              <Label circular color="red" size="mini" style={{ fontSize: "0.4em" }} />
              <Label circular color="green" size="mini" style={{ fontSize: "0.4em" }} />
              <Label circular color="yellow" size="mini" style={{ fontSize: "0.4em" }} />
              <Editor
                id="exportComponent"
                value={currentCode}
                onValueChange={onValueChange}
                highlight={highlight}
                padding={10}
                style={styles}
              />
            </div>
          </Segment>
        </div>
      </Segment>
      <footer className={homeStyles.footer}>
        <h2 style={{ color: "orange", fontFamily: "VT323, monospace", fontSize: "2em" }}>
          Welcome to our Code Editor
        </h2>
      </footer>
    </div>
  );
};

export default CodeEditor;
