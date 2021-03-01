import { useEffect, useState, useMemo } from 'react';
import './App.css';
import Viewer from './Viewer';
import { Helmet } from 'react-helmet';
import Box from './Box';
import html2canvas from 'html2canvas';
import ls from 'local-storage'
import Download from '@axetroy/react-download';
// import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';


//box data template
class BoxData {
    constructor(title, content, boxtype) {
        this.title = title;
        this.content = content;
        this.boxtype = boxtype;
    }
}

function App() {
    //loadsave
    const readme = "# Welcome to Astronote! \nAstronote is a barebones, studysheet generator with markdown-like syntax. \n Go fullscreen for the best experience (F11) \nCreate a section header with #[space]<Your header here> and then add content below.\nLaTeX input is supported, on a single line with $<LaTeX equation here>$.\nEnjoy one of Maxwell's Equations\n$B'=-\\nabla \\times E$ \n Click the footer text on the left to review this readme\n# Exporting \nHit the preview > export buttons to open the image in a new tab, then Ctrl+P to print. Modfy printing settings at will to fit and print to PDF.\nAll data is autosaved to your browser.\nDownload raw to get a text-version of your editor input to be safe.\n# Warnings \n+ I have only tested this in Chrome\n+ You can't undo after previewing and coming back to editor \n+ Some of the styling is buggy \n+ Data is stored on localStorage which is pretty safe, but go to editor>download-raw to save a copy locally\n+ this copy is normal text, and can be opened with notepad\n Example TeX note for a signals midterm is in the next box\n# Complex Exponential Sin/Cos\n$$sin(t) = Re(z(t)) = e^{j \\omega t} +e^{-j \\omega t}/2$$\n$$cos(t) = Im(z(t)) = e^{j \\omega t} -e^{-j\\omega t}/2j$$\n+ Knowing how to symbolically manipulate this, both forward and backwards, is very helpful\n"

    let savednotes = ls.get('saved-notes');
    if (savednotes == null) savednotes = readme;

    //intializers
    const [content, setContent] = useState(savednotes);
    const [showOutput, setShowOutput] = useState(true);
    const [output, setOutput] = useState([]);
    const [numCols, setNumCols] = useState(4);
    const [isZenMode, setZenMode] = useState(true);
    const [fontStyle, setFontStyle] = useState(0);
    const [fontSize, setFontSize] = useState(1);

    //regex tags

    const ParseContent = (event) => {
        setContent(event.target.value);

    }


    useEffect(() => {
        ls.get('saved-notes');

    }, []);


    //boxPacking
    useEffect(() => {
        BoxPacker();
        ls.set('saved-notes', content);
        console.log(content.replace(/\n/g, '\\n'))
    }, [content])

    const FlipShowOutput = () => {
        setShowOutput(!showOutput);
    }

    //this takes in the code and subdivides it into "boxes"
    const BoxPacker = () => {
        var splitContent = content.split('\n');

        var boxData = new BoxData("", [], "");
        var BoxDataArray = []; //array of logic box elements
        var BoxOutputArray = []; //array of Box Components

        //develop boxes object array, extracting out metadata

        splitContent.forEach(element => {
            if (element.includes("# ")) {
                //write and push the last boxdata
                if (boxData.title !== "") { BoxDataArray.push(boxData); } //push to output array if not null

                boxData = new BoxData("", [], ""); //reset
                //start the new boxData
                boxData.title = element.slice(2); //after the #_
            }
            else {
                boxData.content.push(element);
            }
        });
        //also just push the last element
        if (boxData.title !== "") { BoxDataArray.push(boxData); } //push to output array if not null

        //data objects are created correctly!

        //create the boxes themselves from the data objects and add to the final box array 
        //iterate through the box data
        BoxDataArray.forEach(element => {
            //extracting out the content array from each box
            var content = element.content;

            // console.log(element.title + " Box Shipped")
            // console.log("Box Contents: --- ")
            // console.log(content);
            // console.log("---")

            BoxOutputArray.push(
                < Box
                    title={element.title} //title of the box
                    content={content} //array of strings
                    boxtype="normalbox" // type of box (definition, equation, algorithm)
                />
            );
        }); //end per box

        setOutput(BoxOutputArray); // the final array of populated Box Components
    }//end box data packer function

    //opens image in new tab - can't do this with the simple window.open anymore due to chrome deprec so use iframe instead
    const RenderImage = () => {
        const div = document.getElementById("boxes-wrapper");

        html2canvas(div,  {
            windowWidth: div.scrollWidth,
            windowHeight: div.scrollHeight
        }).then(function (canvas) {
            // const base64image = canvas.toDataURL("png");
            // var iframe = "<iframe width='100%' height='100%' src='" + base64image + "'></iframe>"
            // var data = div.outerHTML;
            // var x = window.open();
            // x.document.open();
            // x.document.write(iframe);
            // x.document.close();
            document
                .appendChild(canvas);
        });

    }

    const RenderTab = () => {
        var wi = window.open('', 'printwindow');


        var data = document.getElementById("boxes-wrapper").outerHTML;

        var texHead = '<link href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css" rel = "stylesheet"/> <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100&family=Space+Mono&family=Syne&display=swap" rel="stylesheet" />'
        var styles = '<link rel="stylesheet" type="text/css" href="ExportStyles.css">'
        wi.document.write('<html><head>')
        wi.document.write(texHead + styles)
        wi.document.write('</head>')
        wi.document.write('<body>')
        wi.document.write(data)
        wi.document.write('</body></html>')
        wi.document.close();
    }

    const RenderReadMe = () => {
        var wi = window.open('', 'readme');



        var texHead = '<link href = "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css" rel = "stylesheet"/> <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100&family=Space+Mono&family=Syne&display=swap" rel="stylesheet" />'
        var styles = '<link rel="stylesheet" type="text/css" href="ExportStyles.css">'
        wi.document.write('<html><head>')
        wi.document.write(texHead + styles)
        wi.document.write('</head>')
        wi.document.write('<body>')
        wi.document.write('<strong>COPY PASTE THIS INTO THE EDITOR AND PREVIEW TO VIEW</strong><pre>')

        wi.document.write(readme)
        wi.document.write('</pre></body></html>')
        wi.document.close();
    }

    const ChangeCols = () => {

        if (document.querySelector("#boxes-wrapper")) {
            document.getElementById("boxes-wrapper").style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
        }
        setNumCols((numCols) % 7 + 1);

    }
    const ZenMode = () => {
        if (showOutput) {
            // document.getElementById("editor").style.padding = isZenMode ? "4em 20vw" : "1em 1em";

            // var elem = document.documentElement;
            // if (isZenMode) {
            //     if (elem.requestFullscreen) {
            //         elem.requestFullscreen();
            //     } else if (elem.webkitRequestFullscreen) { /* Safari */
            //         elem.webkitRequestFullscreen();
            //     } else if (elem.msRequestFullscreen) { /* IE11 */
            //         elem.msRequestFullscreen();
            //     }
            // }
            setZenMode(!isZenMode)
        }
    }
    const FontToggle = () => {
        setFontStyle((fontStyle + 1) % 2);
        var fontString = ""
        switch (fontStyle) {
            case 0:
                fontString = "'Noto Sans JP', sans-serif";

                break;
            case 1:
                fontString = "'Space Mono', monospace";

                break;
            default:
                fontString = "'Space Mono', monospace";

                break;
        }
        document.getElementById("editor").style.fontFamily = fontString;
    }

    const FontSizeToggle = () => {
        setFontSize(fontSize + 1);
        document.getElementById("editor").style.fontSize = ((fontSize % 6) / 3 + 1).toString().concat("em");
    }

    return (
        <div className="App" >
            <Helmet>
                <link
                    href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
                    rel="stylesheet"
                />

                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100&family=Space+Mono&family=Syne&display=swap" rel="stylesheet" />
                <title>astronote(v.01)</title>
            </Helmet>

            <div className="container">

                {/* //! Note: The Inner Text is required to allow things */}
                {showOutput &&
                    <textarea className="body" id="editor" spellCheck="false" onChange={ParseContent} defaultValue={content} >

                    </textarea>
                }
                {!showOutput &&
                    // <Viewer data={output} />
                    <div className="boxes-wrapper" id="boxes-wrapper">
                        {output}
                    </div>
                }

                {/* Viewer Button Rack */}
                {!showOutput &&
                    <footer>
                        <div className="footer-text">
                            zeronote v0.2
                    </div>
                        <div className="footer-button bg-bl2" onClick={ChangeCols}>
                            <p>++cols[{(numCols - 1) % 7 + 1}]</p>
                        </div>

                        <div className="footer-button bg-bl3" onClick={RenderImage}>
                            export
                            </div>
                        <div className="footer-button bg-bl4" onClick={FlipShowOutput}>
                            <p>editor</p>
                        </div>
                    </footer>

                }

                {/* Editor Button Rack */}
                {showOutput &&
                    <footer>
                        <div className="footer-text">
                            zeronote v0.2
                    </div>
                        <div className="footer-button bg-bl1" onClick={RenderReadMe}>
                            <p>readme</p>
                        </div>
                        <div className="footer-button bg-bl2" onClick={FontToggle}>
                            <p>font-toggle</p>
                        </div>
                        <div className="footer-button bg-bl3" onClick={FontSizeToggle}>
                            <p>font-size</p>
                        </div>
                        <Download file="out.txt" content={content}>
                            <div className="footer-button bg-bl4" >download-raw</div>
                        </Download>
                        <div className="footer-button bg-bl5" onClick={FlipShowOutput}>
                            <p>preview</p>
                        </div>


                    </footer>

                }
            </div>
        </div >
    );
}

export default App;
