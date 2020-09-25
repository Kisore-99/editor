import React, { Fragment, useState, useEffect, useRef } from "react";
import Editor from "react-simple-code-editor";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/vsDark";
import { Segment, Button, Dropdown, Label, Popup, Grid, Header, Icon } from "semantic-ui-react";
import axios from "axios";

import dbConfig from "../utils/dbConfig";
import Code from "../models/Code";

import homeStyles from "../styles/Home.module.css";
import Head from "next/head";

export const getServerSideProps = async () => {
  dbConfig();
  const data = await Code.find({});
  console.log(data);
  const { _id, content, fontFamily, fontSize } = data[0];
  return {
    props: {
      _id: _id.toString(),
      content: content.toString(),
      fontFamily: fontFamily.toString(),
      fontSize: fontSize.toString(),
    },
  };
};

const Home = ({ _id, content, fontFamily, fontSize }) => {
  console.log(fontFamily, fontSize);
  const exampleCode = content;
  const AUTOSAVE_INTERVAL = 3000;
  const exportRef = useRef();
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

  // useEffect(() => {
  //   setSelectedTheme(React.lazy(() => import("prism-react-renderer/themes/oceanicNext")));
  // }, []);
  // console.log(selectedTheme);

  const onValueChange = (code) => {
    setCurrentCode(code);
    // setSelectedTheme(React.lazy(() => import("prism-react-renderer/themes/dracula")));
  };

  const highlight = (code) => {
    // const theme = React.lazy(() => import("prism-react-renderer/themes/oceanicNext"));
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
    navigator.clipboard.writeText(`${host}/${_id}`);
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
        <div ref={exportRef}>
          <Segment
            padded
            raised
            style={{
              border: "1px solid orange",
              marginTop: "3em",
              background: "#B7950B",
              padding: "40px",
            }}
          >
            <div
              style={{
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

export default Home;
