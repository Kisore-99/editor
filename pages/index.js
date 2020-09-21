import React, { Fragment, useState, useEffect, useRef } from "react";
import Editor from "react-simple-code-editor";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/dracula";
import { Segment, Button, Dropdown } from "semantic-ui-react";
import { exportComponentAsJPEG, exportComponentAsPNG } from "react-component-export-image";

function Home() {
  const exampleCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`;

  const exportRef = useRef();
  const [code, setCode] = useState(exampleCode);
  const [styles, setStyles] = useState({
    boxShadow: "4px 6px #808B96",
    boxSizing: "border-box",
    fontFamily: '"Dank Mono", "Fira Code", monospace',
    fontSize: "14px",
    ...theme.plain,
  });
  const [selectedTheme, setSelectedTheme] = useState("");

  // useEffect(() => {
  //   setSelectedTheme(React.lazy(() => import("prism-react-renderer/themes/oceanicNext")));
  // }, []);
  // console.log(selectedTheme);

  const onValueChange = (code) => {
    setCode(code);
    // setSelectedTheme(React.lazy(() => import("prism-react-renderer/themes/dracula")));
  };

  const highlight = (code) => {
    // const theme = React.lazy(() => import("prism-react-renderer/themes/oceanicNext"));
    return (
      <Highlight {...defaultProps} theme={theme} code={code} language="jsx">
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

  const exportCode = (e, { value }) => {
    console.log(value);
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

  return (
    <div>
      <Segment>
        <Dropdown
          placeholder="select font size"
          closeOnEscape={false}
          selection
          options={sizeOptions}
          onChange={increaseFontSize}
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
      </Segment>
      <div ref={exportRef}>
        <Segment padded raised style={{ marginTop: "3em", background: "#AED6F1" }}>
          <Editor
            value={code}
            onValueChange={onValueChange}
            highlight={highlight}
            padding={10}
            style={styles}
          />
        </Segment>
      </div>
    </div>
  );
}
export default Home;
