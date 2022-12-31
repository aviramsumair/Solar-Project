import {React, useState} from "react";
import Slider from '@mui/material/Slider';


export default function TopBar({hideMoonNames, setHideMoonNames, showPlanetNames, setShowPlanetNames, sliderValue, setSliderValue}){

    

    function planetNameButtonClick(){
        setShowPlanetNames(!showPlanetNames)
    }

    function moonNameButtonClick(){
        setHideMoonNames(!hideMoonNames)
    }

    function handleChange(event, newValue){
        setSliderValue(newValue);
      };

    return(
        <div className="mainHeader">
             <div className="speedSlider">
                <label>Simulation Speed</label>
                <Slider value={sliderValue}  valueLabelDisplay={'auto'} onChange={handleChange} />
            </div>                       
            <button className="settingsButton" onClick={planetNameButtonClick}>{showPlanetNames ? "Hide" : "Show"} Planet Names</button>            
            <button className="settingsButton" onClick={moonNameButtonClick}>{hideMoonNames ? "Show" : "Hide"} Moon Names</button>
        </div>
    )

}