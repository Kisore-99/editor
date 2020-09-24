import { useState, useEffect, Fragment } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Editor from "react-simple-code-editor";
import theme from "prism-react-renderer/themes/dracula";
import Highlight, { defaultProps } from "prism-react-renderer";
import { Segment, Button, Dropdown, Label, Popup, Grid, Header } from "semantic-ui-react";
import axios from "axios";

import dbConfig from "../../utils/dbConfig";
import Code from "../../models/Code";

export const getServerSideProps = async ({ query: { id } }) => {
  dbConfig();
  const data = await Code.findById({ _id: id });
  console.log("found content-->", data);
  const { content, fontFamily, fontSize } = data;
  return { props: { content, fontFamily, fontSize } };
};

const CodeEditor = ({ content, fontFamily, fontSize }) => {
  const [code, setCode] = useState(content);
  const [selectedLanguage, setSelectedLanguage] = useState("jsx");
  const [styles, setStyles] = useState({
    boxSizing: "border-box",
    fontFamily,
    fontSize,
    ...theme.plain,
  });

  console.log(styles.fontFamily);
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

  const onValueChange = (code) => {
    setCode(code);
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

  const exportCode = (e, { value }) => {
    console.log(value);
    html2canvas(document.getElementById("exportComponent"), {
      onrendered: (canvas) => {
        console.log(canvas);
        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = "html_image.png";
        link.href = canvas.toDataURL("image/png");
        link.target = "_blank";
        console.log(document.body);
        link.click();
      },
    });
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
          disabled
          closeOnEscape={false}
          defaultValue={styles.fontSize ? styles.fontSize : sizeOptions[1].value}
          selection
          options={sizeOptions}
          onChange={increaseFontSize}
        />
        <Dropdown
          disabled
          closeOnEscape={false}
          defaultValue={languageOptions[0].value}
          selection
          options={languageOptions}
          onChange={selectLanguage}
        />
        <Dropdown
          placeholder="select font family"
          disabled
          closeOnEscape={false}
          defaultValue={!styles.fontFamily ? fontFamilyOptions[0].value : styles.fontFamily}
          selection
          options={fontFamilyOptions}
          onChange={selectFontFamily}
        />
        <Button.Group color="teal">
          <Button disabled>Export</Button>
          <Dropdown
            disabled
            className="button icon"
            floating
            options={exportOptions}
            trigger={<></>}
            onChange={exportCode}
          />
        </Button.Group>
      </Segment>
      <Segment
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
            value={code}
            highlight={highlight}
            padding={10}
            id="exportComponent"
            onValueChange={onValueChange}
            style={styles}
          />
        </div>
      </Segment>
    </div>
  );
};

// CodeEditor.getInitialProps = async ({ query: { id } }) => {
//   console.log(id);
//   const res = await axios.get(`http://localhost:3000/api/code/${id}`);
//   // const { data } = await res.json();
//   return {
//     content: res.data.data.content,
//   };
// };

export default CodeEditor;
