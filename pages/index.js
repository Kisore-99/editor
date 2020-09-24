import React, { Fragment, useState, useEffect, useRef } from "react";
import Editor from "react-simple-code-editor";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/dracula";
import { Segment, Button, Dropdown, Label, Popup, Grid, Header } from "semantic-ui-react";
import axios from "axios";

import homeStyles from "../styles/Home.module.css";
import Head from "next/head";
// import { exportComponentAsJPEG } from "react-component-export-image";

const Home = ({ content }) => {
  const exampleCode = content.data[0].content;
  console.log(content.data[0]);
  const AUTOSAVE_INTERVAL = 3000;
  const exportRef = useRef();
  const [currentCode, setCurrentCode] = useState(exampleCode);
  const [code, setCode] = useState(exampleCode);
  const [styles, setStyles] = useState({
    boxSizing: "border-box",
    fontFamily: '"Inconsolata", sans-serif',
    fontSize: "14px",
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
        console.log("inside if----");
        const res = await axios.put("http://localhost:3000/api/code", {
          content: currentCode,
          id: content.data[0]._id,
        });
      }
    }, AUTOSAVE_INTERVAL);
    return () => clearTimeout(timer);
  }, [currentCode]);

  console.log(host);
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
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
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
      const res = await axios.post("http://localhost:3000/api/code", { content: code });
    } catch (err) {
      console.log(err);
    }
  };

  const copyToCliboard = (e) => {
    textAreaRef.current.select();
    document.execCommand("copy");
    e.target.focus();
  };

  const exportCode = (e, { value }) => {
    console.log(value);
    // exportComponentAsJPEG(exportRef);
    // let container = document.getElementById("exportComponent");
    // // html2canvas(document.getElementById("exportComponent")).then((canvas) =>
    // //   window.open(canvas.toDataURL("image/png"))
    // // );
    // let parent = container.parentNode;
    // console.log(parent);
    // html2canvas(container, {
    //   letterRendering: 1,
    //   allowTaint: true,
    // }).then(function (canvas) {
    //   console.log(canvas);
    //   var a = document.createElement("a");
    //   // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
    //   a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
    //   document.body.appendChild(a);
    //   a.download = "somefilename.jpg";
    //   a.click();
    // });

    html2canvas(document.getElementById("exportComponent"), {
      onrendered: (canvas) => {
        console.log(canvas);
        // let image = canvas.toDataURL("png");
        // let a = document.createElement("a");
        // a.setAttribute("download", "myImage.png");
        // a.setAttribute("href", image);
        // a.click();
        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = "html_image.png";
        link.href = canvas.toDataURL("image/png");
        link.target = "_blank";
        console.log(document.body);
        link.click();
        // // let el = document.getElementById(a.id);
        // // el.parentNode.removeChild(el);
        // console.log(a.id);
        // var myImage = canvas.toDataURL("image/png");
        // window.open(myImage, "Image");
        // var a = document.createElement("a");
        // // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
        // a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        // // document.body.appendChild(a);

        // a.download = "somefilename.jpg";
        // a.click();
        // a.remove();
        // console.log(a.remove());
      },
    });
    // html2canvas(window.document.getElementById("exportComponent")).then((canvas) => {
    //   console.log(canvas);
    //   let image = canvas.toDataURL("png");
    //   let a = document.createElement("a");
    //   a.setAttribute("download", "myImage.png");
    //   a.setAttribute("href", image);
    //   a.click();
    // });
    //   var a = document.createElement("a");
    //   // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
    //   a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
    //   document.body.appendChild(a);
    //   a.download = "somefilename.jpg";
    //   a.click();
    // });
    // if (value === "png") exportComponentAsPNG(exportRef);
    // else if (value === "jpg") exportComponentAsJPEG(exportRef);
    // else return;
  };

  const sizeOptions = [
    { text: "12px", value: "12px", key: "12px", small: "12px" },
    { text: "14px", value: "14px", key: "14px", medium: "14px" },
    { text: "16px", value: "16px", key: "16px", large: "16px" },
    { text: "18px", value: "18px", key: "18px", huge: "18px" },
  ];

  const languageOptions = [
    { key: "jsx", text: "jsx", value: "jsx" },
    { key: "java", text: "java", value: "java" },
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
    { key: "Inconsolata", text: "Inconsolata", value: "Inconsolata" },
    { key: "Courier", text: "Courier", value: "Courier" },
    { key: "Stylish", text: "Stylish", value: "Stylish" },
    { key: "Kanit", text: "Kanit", value: "Kanit" },
  ];

  // const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
  // console.log(dom.window.document.querySelector("p").textContent);

  return (
    <div>
      <Head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.js"></script>
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
      <body style={{ background: "black" }}></body>
      <Segment style={{ background: "black", border: "1px solid #fff" }}>
        <Dropdown
          placeholder="select font size"
          closeOnEscape={false}
          defaultValue={sizeOptions[1].value}
          selection
          options={sizeOptions}
          onChange={increaseFontSize}
        />
        <Dropdown
          placeholder="select font size"
          closeOnEscape={false}
          defaultValue={languageOptions[0].value}
          selection
          options={languageOptions}
          onChange={selectLanguage}
        />
        <Dropdown
          placeholder="select font family"
          closeOnEscape={false}
          defaultValue={fontFamilyOptions[0].value}
          selection
          options={fontFamilyOptions}
          onChange={selectFontFamily}
        />
        <Button.Group color="teal">
          <Button>Export</Button>
          <Dropdown
            className="button icon"
            floating
            options={exportOptions}
            trigger={<></>}
            onChange={exportCode}
          />
        </Button.Group>
        <Button primary onClick={saveCode}>
          Save
        </Button>
        <Popup trigger={<Button>Share your code</Button>} flowing hoverable>
          <Grid centered divided columns={1}>
            <Grid.Column textAlign="center">
              <Header as="h4">Copy the link</Header>
              <input disabled ref={textAreaRef} value={`${host}/${content.data[0]._id}`} />
              <Button onClick={copyToCliboard}>Copy</Button>
            </Grid.Column>
          </Grid>
        </Popup>
      </Segment>
      <div ref={exportRef}>
        <Segment
          disabled={true}
          padded
          raised
          style={{
            marginTop: "3em",
            background: "#85C1E9",
            padding: "40px",
          }}
        >
          <div
            style={{
              border: "1px solid black",
              background: "black",
              padding: "4px",
            }}
          >
            <Label circular color="red" size="mini" style={{ fontSize: "0.4em" }} />
            <Label circular color="green" size="mini" style={{ fontSize: "0.4em" }} />
            <Label circular color="yellow" size="mini" style={{ fontSize: "0.4em" }} />
            <Editor
              value={currentCode}
              // onValueChange={onValueChange}
              highlight={highlight}
              padding={10}
              id="exportComponent"
              style={styles}
            />
          </div>
        </Segment>
      </div>
      <footer className={homeStyles.footer}>
        <h2 style={{ color: "#fff" }}>created by devs</h2>
      </footer>
    </div>
  );
};

Home.getInitialProps = async () => {
  const res = await axios.get("http://localhost:3000/api/code");
  return { content: res.data };
};
export default Home;
