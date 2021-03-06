import LatexRenderer from "./LatexRenderer";

export default function Box(props) {
    const latexBlock = /\$(.*)\$/;
    const bold = /\*\*(.*)\*\*/;
    const italics = /\*(.*)\*/;
    // ![caption text](url)
    const image = /!\[(.*?)\]\((.*?)\)/;
    // [text](url)
    const link = /\[(.*?)\]\((.*?)\)/;

    //custom detector strings
    const remark = /^!rmk.*$/;
    const definition = /^!def.*$/;
    const tip = /^!tip.*$/;
    const important = /^!imp.*$/;

    var PackagedContent = [];

    //iterating over lines of content and processing into divs.
    props.content.forEach(line => {
        if (line.match(latexBlock)) {
            PackagedContent.push(
                <div>
                    <LatexRenderer data={latexBlock.exec(line)[0]} />
                </div>
            );
        }
        else if (line.match(remark)) {
            PackagedContent.push(
                <p className="box-remark">{remark.exec(line)[0].substring(4)}</p> //exec [0] grabs the whole captured string
            )
        }
        else if (line.match(definition)) {
            PackagedContent.push(
                <p className="box-definition">{definition.exec(line)[0].substring(4)}</p> //exec [0] grabs the whole captured string
            )
        }
        else if (line.match(tip)) {
            PackagedContent.push(
                <p className="box-tip">{tip.exec(line)[0].substring(4)}</p> //exec [0] grabs the whole captured string
            )
        }
        else if (line.match(important)) {
            PackagedContent.push(
                <p className="box-important">{important.exec(line)[0].substring(4)}</p> //exec [0] grabs the whole captured string
            )
        }
        else if (line.match(bold)) {
            PackagedContent.push(
                <p> <b>{bold.exec(line)[1]}</b></p> //exec [0] grabs the whole captured string
            )
        }
        else if (line.match(italics)) {
            PackagedContent.push(
                <p><em>{italics.exec(line)[1]}</em></p>
            )
        }
        else if (line.match(image)) {
            PackagedContent.push(
                <div>
                    <img src={image.exec(line)[2]} alt = "figure"></img>
                    <p><em>{image.exec(line)[1]}</em></p>
                </div>
            )
        }
        else if (line.match(link)) {
            // console.log(link.exec(line))
            PackagedContent.push(
                <p>
                    <a href={link.exec(line)[2]} rel='noreferrer' target='_blank'>{link.exec(line)[1]}</a>
                </p>
            )
        }
        else {
            PackagedContent.push(
                <div>
                    {line}
                </div>
            );
        }
    });

    return (
        <div className="box">
            <div className="box-head">{props.title}</div>
            <div className="box-content">
                {PackagedContent}

            </div>
        </div>

    );
}