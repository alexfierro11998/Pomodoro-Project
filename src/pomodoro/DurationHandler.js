
import React from "react";



function DurationHandler({currentButton, setFocusDuration, focusDuration, setSession, setBreakDuration, breakDuration}){
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
  if(currentButton==="decrease focus"){
    return(
    <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={focusDecrease}
              >
                <span className="oi oi-minus" />
              </button>
  )}
  if(currentButton==="increase focus"){
    return <button
    type="button"
    className="btn btn-secondary"
    data-testid="increase-focus"
    onClick={focusIncrease}
  >
    <span className="oi oi-plus" />
  </button>
  }
  if(currentButton=== "decrease break"){
    return (<button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={breakDecrease}
                >
                  <span className="oi oi-minus" />
                </button>)
  }
  if(currentButton==="increase break"){
    return(
      <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={breakIncrease}
                >
                  <span className="oi oi-plus" />
                </button>
    )
  }
}

export default DurationHandler