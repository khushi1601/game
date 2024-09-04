import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import Vehicle from './Vehicle'
import FallingShapes from './FallingShapes'
import Ground from './Ground'

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const vehicleRef = useRef()

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (vehicleRef.current && gameStarted && !gameOver) {
        if (e.key === 'w') vehicleRef.current.moveForward()
        if (e.key === 's') vehicleRef.current.moveBackward()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, gameOver])

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const scoreInterval = setInterval(() => {
        setScore(prevScore => prevScore + 1)
      }, 1000)
      return () => clearInterval(scoreInterval)
    }
  }, [gameStarted, gameOver])

  const handleCollision = () => {
    if (!gameOver) {
      setGameOver(true)
      // Save score to Supabase here
    }
  }

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className="w-full h-screen">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Physics>
          {gameStarted && (
            <>
              <Vehicle ref={vehicleRef} onCollision={handleCollision} />
              <FallingShapes onCollision={handleCollision} />
            </>
          )}
          <Ground />
        </Physics>
      </Canvas>
      
      {!gameStarted && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      )}
      
      {gameStarted && (
        <div className="absolute top-0 left-0 p-4 text-white text-2xl">
          Score: {score}
        </div>
      )}
      
      {gameOver && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded">
            <h2 className="text-2xl font-bold">Game Over</h2>
            <p>Your score: {score}</p>
            <button 
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={startGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Game