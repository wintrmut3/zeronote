var Latex = require('react-latex')


export default function LatexRenderer(props) {
    return (
        
        <Latex displayMode={true}>{props.data}</Latex>
    );
}