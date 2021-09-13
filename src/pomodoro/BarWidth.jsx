  

import React from "react"
import {minutesToDuration, secondsToDuration} from "../utils/duration"

function thisBarWidth(session, focusDuration, breakDuration) {
  
  if(session)
  {if(session.label === "Focusing"){
    const barFocus = focusDuration
    let currentBar = (((barFocus*60) - session?.timeRemaining)*100)/ (barFocus*60)
   
    return currentBar
  }
  else if(session.label === "On Break"){
    const barFocus = breakDuration
    let currentBar = (((barFocus*60) - session?.timeRemaining)*100)/ (barFocus*60)
    return currentBar
  }}
  return 0
}

export default function BarWidth({isTimerRunning, timerStatus, session, focusDuration, breakDuration}){
  let extraStuff = null;
   if(timerStatus && isTimerRunning) {extraStuff = <div>
   <div className="row mb-2">
     <div className="col">
       <h2 data-testid="session-title">
         {session?.label} for {minutesToDuration(session?.label === "Focusing" ? focusDuration : breakDuration)} minutes
       </h2>
       <p className="lead" data-testid="session-sub-title">
         {secondsToDuration(session?.timeRemaining)} remaining
       </p>
     </div>
   </div>
   <div className="row mb-2">
     <div className="col">
       <div className="progress" style={{ height: "20px" }}>
         <div
           className="progress-bar"
           role="progressbar"
           aria-valuemin="0"
           aria-valuemax="100"
           aria-valuenow={thisBarWidth(session, focusDuration, breakDuration)} // TODO: Increase aria-valuenow as elapsed time increases
           style={{ width: `${thisBarWidth(session, focusDuration, breakDuration)}%` }} // TODO: Increase width % as elapsed time increases
         />
       </div>
     </div>
   </div>
 </div>}
 else if(timerStatus){
  extraStuff = <div>
  <div className="row mb-2">
    <div className="col">
      <h2 data-testid="session-title">
        {session?.label} for {minutesToDuration(session?.label === "Focusing" ? focusDuration : breakDuration)} minutes
      </h2>
      <p className="lead" data-testid="session-sub-title">
        {secondsToDuration(session?.timeRemaining)} remaining
      </p>
      <h2>PAUSED</h2>
    </div>
  </div>
  <div className="row mb-2">
    <div className="col">
      <div className="progress" style={{ height: "20px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={thisBarWidth(session, focusDuration, breakDuration)} // TODO: Increase aria-valuenow as elapsed time increases
          style={{ width: `${thisBarWidth(session, focusDuration, breakDuration)}%` }} // TODO: Increase width % as elapsed time increases
        />
      </div>
    </div>
  </div>
</div>
  }
  return extraStuff
}