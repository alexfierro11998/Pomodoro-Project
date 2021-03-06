import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import {minutesToDuration} from "../utils/duration"
import BarWidth from "./BarWidth";
import DurationHandler from "./DurationHandler";

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}




/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  const [timerStatus, setTimerStatus] = useState(false);
  
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);
  // ToDo: Allow the user to adjust the focus and break duration.
  const [focusDuration, setFocusDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)

  
  const stopButtonFunction = event => {
    event.preventDefault()
 
    setSession(()=> {
      return{
        label: "Focusing",
        timeRemaining: 1500
      }
    })
    setIsTimerRunning(false)
    setTimerStatus(false)
  }
  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
  
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );
  
  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    if(!timerStatus){
      setSession({
        label: "Focusing",
        timeRemaining: focusDuration*60
      })
    }
    setTimerStatus(true)
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          
          return prevStateSession;
        });
      }
      return nextState;
    });
  }
 

 //Code Begins ===================================================================================================================================================
  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              Focus Duration: {minutesToDuration(focusDuration)}
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              <DurationHandler currentButton={"decrease focus"} setFocusDuration={setFocusDuration} focusDuration={focusDuration} setSession={setSession}/>
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
              <DurationHandler currentButton={"increase focus"} setFocusDuration={setFocusDuration} focusDuration={focusDuration} setSession={setSession}/>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                Break Duration: {minutesToDuration(breakDuration)}
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                <DurationHandler currentButton={"decrease break"} setBreakDuration={setBreakDuration} breakDuration={breakDuration} />
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                <DurationHandler currentButton={"increase break"} setBreakDuration={setBreakDuration} breakDuration={breakDuration} />
                
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
            {/* TODO: Disable the stop button when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary pickButton"
              data-testid="stop"
              title="Stop the session"
              disabled={!timerStatus}
              onClick={stopButtonFunction}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <BarWidth isTimerRunning={isTimerRunning} session={session} focusDuration={focusDuration} breakDuration={breakDuration} timerStatus={timerStatus}/>
    </div>
    
  );
}

export default Pomodoro;