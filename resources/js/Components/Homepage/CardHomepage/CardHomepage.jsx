import './cardhome.css';

export default function CardHomepage(props) {
    return (
        <div className="homeCard">
            <img className="homeCard-img" src={props.src} alt="imagine categorii homepage"></img>
            <div className="middle">
            <p className="scris">{props.denumire}</p>
            </div>
        </div>
        
        
      
    );
}