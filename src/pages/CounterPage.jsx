import React, { useState, useRef, useEffect } from 'react'

const CounterPage = () => {
    const [count, setCount] = useState(0)
    const intervalRef = useRef(null)

    const handleButton = (v) => {
      if (v === 'start') {
        if (intervalRef.current) return
        intervalRef.current = setInterval(() => {
          setCount(c => c + 1)
        }, 1000)
      }
      if (v === 'end') {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }
  return (
    <div className='container text-center'>
        <h4>{count}</h4>
        <button className='btn btn-primary' onClick={()=>handleButton('start')}>Start</button>
        <button className='btn btn-primary' onClick={()=>handleButton('end')}>Stop</button>
    </div>
  )
}

export default CounterPage
