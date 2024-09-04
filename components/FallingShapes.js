import React, { useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { Box, Sphere } from '@react-three/drei'

const shapes = [
  { Component: Box, args: [1, 1, 1] },
  { Component: Sphere, args: [0.5] },
  { Component: Box, args: [1, 1, 1] } // Using Box for pyramid, we'll rotate it
]

const FallingShapes = () => {
  const [fallingShapes, setFallingShapes] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newShape = {
        type: Math.floor(Math.random() * 3),
        position: [Math.random() * 10 - 5, 10, Math.random() * 10 - 5],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: Math.random() * 0.5 + 0.5,
      }
      setFallingShapes((prevShapes) => [...prevShapes, newShape])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {fallingShapes.map((shape, index) => {
        const { Component, args } = shapes[shape.type]
        return (
          <RigidBody key={index} position={shape.position}>
            <Component args={args} scale={shape.scale} rotation={shape.rotation}>
              <meshStandardMaterial color="red" />
            </Component>
          </RigidBody>
        )
      })}
    </>
  )
}

export default FallingShapes