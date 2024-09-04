import React from 'react'
import { RigidBody } from '@react-three/rapier'
import { Plane } from '@react-three/drei'

const Ground = () => {
  return (
    <RigidBody type="fixed">
      <Plane args={[100, 100]} rotation-x={-Math.PI / 2}>
        <meshStandardMaterial color="green" />
      </Plane>
    </RigidBody>
  )
}

export default Ground