import React, { useState,useContext } from "react";
import SmartLinkContext from "./SmartLinkContext";


const SmartLinkContextProvider=({children})=>{
    const [playlistData,setPlaylistData]=useState(null);
    return(
        
        <SmartLinkContext.Provider value={{playlistData,setPlaylistData}} >
            {children}
        </SmartLinkContext.Provider>
    )
}
export default SmartLinkContextProvider