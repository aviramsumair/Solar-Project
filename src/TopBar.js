import React from "react";


export default function TopBar({hideMoonNames, setHideMoonNames, showPlanetNames, setShowPlanetNames}){

    function planetNameButtonClick(){
        setShowPlanetNames(!showPlanetNames)
    }

    function moonNameButtonClick(){
        setHideMoonNames(!hideMoonNames)
    }

    function sliderValue(){
        console.log("hi")
    }

    return(
        <div className="mainHeader">
            
            <div id="planetSliderContainer">
                <input id="planetSpeedSlider" type="range" mins="0" max="10" onChange={()=>sliderValue}></input>          
            </div>
            <button className="settingsButton" onClick={planetNameButtonClick}>{showPlanetNames ? "Hide" : "Show"} Planet Names</button>            
            <button className="settingsButton" onClick={moonNameButtonClick}>{hideMoonNames ? "Show" : "Hide"} Moon Names</button>
        </div>
    )

}