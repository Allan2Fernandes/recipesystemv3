import "./ImagesGridComponent.css"
import React from "react";
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
                    <img
                        key={index}
                        src={`${baseURL}api/Image/getImageOnFileName/${image['ParamValue']}`}
                        alt={`Image ${index}`}
                        className={"image-item"}
                        onClick={(event) => clickHandlerSelectImage(image)}
                    />
                ))
            }
        </div>
    )
}

export default ImagesGridComponent