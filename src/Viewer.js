import './App.css';
import './GeneratorStyles.css';

export default function Viewer(props) {
    return (
        <div className="viewer" id = "export-target">
            <div className="boxes-wrapper" id="boxes-wrapper">
                {props.data}
            </div>
        </div>
    );
}