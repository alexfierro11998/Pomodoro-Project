import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import {minutesToDuration, secondsToDuration} from "../utils/duration"


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

  const breakIncrease = (event) => {
    event.preventDefault();
    if(breakDuration + 1 >= 16 ) setBreakDuration(14)
    setBreakDuration(current => {
      
      return current+1
    })
    
  }

  const breakDecrease = (event) => {
    event.preventDefault();
    if(breakDuration -1 <= 0) setBreakDuration(2)
    setBreakDuration( current =>  {
      
      return current-1
    })
  }

  const focusIncrease = (event) => {
    event.preventDefault();
    if(focusDuration + 5 > 55)setFocusDuration(55)
    setFocusDuration(current =>  {
      setSession(() => {
        return {
          label: "Focusing",
          timeRemaining: (current+5) * 60,
        }
      })
      
      return current+5
    })
  }

  const focusDecrease = event => {
    event.preventDefault();
    if(focusDuration -5 < 15) setFocusDuration(10)
    setFocusDuration(current => {
      setSession(() => {
        return {
          label: "Focusing",
          timeRemaining: (current-5) * 60,
        }
      })
      return current-5
    })
    
  }
  

  function barWidth(session) {
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

  const stopButtonFunction = event => {
    event.preventDefault()
    extraStuff = null;
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
           aria-valuenow={barWidth(session)} // TODO: Increase aria-valuenow as elapsed time increases
           style={{ width: `${barWidth(session)}%` }} // TODO: Increase width % as elapsed time increases
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
          aria-valuenow={barWidth(session)} // TODO: Increase aria-valuenow as elapsed time increases
          style={{ width: `${barWidth(session)}%` }} // TODO: Increase width % as elapsed time increases
        />
      </div>
    </div>
  </div>
</div>
 }
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
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={focusDecrease}
              >
                <span className="oi oi-minus" />
              </button>
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={focusIncrease}
              >
                <span className="oi oi-plus" />
              </button>
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={breakDecrease}
                >
                  <span className="oi oi-minus" />
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={breakIncrease}
                >
                  <span className="oi oi-plus" />
                </button>
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
      {extraStuff}
    </div>
    
  );
}

export default Pomodoro;
