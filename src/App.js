import { useState } from "react"
import styles from './App.module.css';
import { Observable, interval } from 'rxjs';
import clock from "./img/clock.png"

function App() {
  const [time, setTime] = useState(0)
  const [subscription, setSubscription] = useState()
  const [isTicking, setIsTicking] = useState(false)
  const [doubleClick, setDoubleClick] = useState(0)
  const [calculatedIntervals, setCalculatedIntervals] = useState([])

  const observable = new Observable((observer) => {
    interval(10)
      .subscribe(val => {
        observer.next(val)
      })
  })

  const subscribe = () => {
    return observable.subscribe({
      next(x) {
        setTime(x => x + 10)
      }
    })
  }

  const handleStart = () => {
    setIsTicking(true)
    setSubscription(subscribe())
  }

  const handleWait = () => {
    let diff = new Date() - doubleClick
    if (doubleClick === 0 || diff > 300) {
      setDoubleClick(new Date())
    } else {
      subscription.unsubscribe()
      setIsTicking(false)
      setDoubleClick(0)
    }
  }

  const handleStop = () => {
    setIsTicking(false)
    setCalculatedIntervals(calculatedIntervals.concat(time))
    setTime(0)
    subscription.unsubscribe()
  }

  const handleReset = () => {
    setTime(0)
    if (subscription.closed || subscription.isStopped) {
      handleStart()
    }
  }

  const calculateTime = (seconds) => {
    return new Date(seconds).toISOString().slice(14, 22).replace(".", ":")
  }

  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <div className={styles.header}>
          Timer
        </div>
        <div className={styles.timer}>
          <img src={clock} alt={clock} className={styles.clockImage} />
          {calculateTime(time)}

        </div>
        <div className={styles.buttonsBlock}>
          {isTicking ?
            <button type="button" onClick={handleStop} className={styles.taskButton}>
              Stop
            </button> :
            <button type="button" onClick={handleStart} className={styles.taskButton}>
              Start
            </button>
          }
          <button type="button" onClick={handleWait} className={styles.taskButton}>
            Wait
          </button>
          <button type="button" onClick={handleReset} className={styles.taskButton}>
            Reset
          </button>
        </div>
      </div>
      <div className={styles.timesContainer}>
        <div className={styles.timesHeader}>
          Calculated Times
          <div className={styles.timesBlock}>
            {
              calculatedIntervals.map((item, index) => {
                return (<div key={item}>
                  {index + 1}: {calculateTime(item)}
                </div>)
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
