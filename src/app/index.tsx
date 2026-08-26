
import { Colors } from "@/constants/theme";
import { Button, Host } from "@expo/ui";
import Geolocation from '@react-native-community/geolocation';
import type { CSSProperties } from "react";
import React from "react";
//....
function getLocation(): Promise<String> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (info) => {
        resolve(`${info.coords.latitude}, ${info.coords.longitude}`);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

function nav() {
  console.log("paein")
}

export default function HomeScreen() {


  // defo not how youre 'supposed' to do this 
  // but uh idc
  const main: CSSProperties = {
      width: "100%",
      height: "100%",
      background: Colors.background,
      color: Colors.text,
  }

  const head: CSSProperties= {
    textAlign: "center"
  }
  // placeholder :: just a black square for now
  const iMap: CSSProperties = {
    background: "black",
    width: "80vmin",
    height: "40vh",
    margin: "auto",
    marginTop: "5%",
  }
  
  const cornerStuff: CSSProperties = {
    position: "fixed",
    bottom: 0, 
    left: 0,
  }

  return (
      <div style={main}>
        <div style={head}>
          <h1 style={{fontSize:"3em", marginBottom: "0"}}>
            Almanac
          </h1>
          <span style={{fontSize: "1.5em"}}>Sign in</span>
        </div>

        <div style={{textAlign:"center"}}>
          <div style={iMap}></div>
          <span style={{fontSize: "1.5em"}}>Location: {getLocation()}</span>
        </div>

        <div style={cornerStuff}>

        <Host matchContents>
              <Button
                onPress={nav}
              >
               <span>Take photo!</span>
              </Button>               
          </Host> 

        </div>

      </div>
  );
}


