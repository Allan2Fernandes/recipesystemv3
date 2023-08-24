import "./ImagesGridComponent.css"
import React, {useState} from "react";
import {baseURL} from "../../../../../Constants";

function ImagesGridComponent(props){

    function clickHandlerSelectImage(imageName){
        var fileName = imageName['ParamValue']
        props.handleChangeSelectedStepImageFromDatabase(fileName)
    }

    return (
        <div id={"ImagesGridComponentMainDiv"} className={"image-grid"}>
            {
                props.listOfImageNames.map((image, index) => (
                    <div key={index}>
                        <img
                            src={`${baseURL}api/Image/getImageOnFileName/${image['ParamValue']}`}
                            alt={`Image ${index}`}
                            className={"image-item"}
                            onClick={(event) => clickHandlerSelectImage(image)}
                        />
                        <center>
                            <label id={"ImageNameLabel"}>{image['ParamValue']}</label>
                        </center>
                    </div>
                ))
            }
        </div>
    )
}

export default ImagesGridComponent