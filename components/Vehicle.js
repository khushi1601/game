/* eslint-disable react/display-name */

import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, useRapier } from '@react-three/rapier'
import { Box, Cylinder, Sphere } from '@react-three/drei'
import * as THREE from 'three'

const Vehicle = forwardRef(({ onCollision }, ref) => {
  const bodyRef = useRef()
  const { camera } = useThree()
  const { rapier, world } = useRapier()
  const rayOrigin = useRef(new THREE.Vector3())
  const rayDir = useRef(new THREE.Vector3())

  useImperativeHandle(ref, () => ({
    moveForward: () => applyForce([0, 0, -10]),
    moveBackward: () => applyForce([0, 0, 10]),
  }))

  const applyForce = (force) => {
    if (bodyRef.current) {
      bodyRef.current.applyImpulse({ x: force[0], y: force[1], z: force[2] }, true)
    }
  }

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.setEnabledRotations(false, true, false)
    }
  }, [])

  useFrame((state) => {
    if (bodyRef.current) {
      const position = bodyRef.current.translation()
      const rotation = bodyRef.current.rotation()

      // Update camera position
      camera.position.x = position.x
      camera.position.y = position.y + 5
      camera.position.z = position.z + 10
      camera.rotation.y = rotation.y

      // Ray casting for ground detection
      rayOrigin.current.set(position.x, position.y, position.z)
      rayDir.current.set(0, -1, 0)
      const ray = new rapier.Ray(rayOrigin.current, rayDir.current)
      const hit = world.castRay(ray, 10, true)

      if (hit && hit.toi > 0.2) {
        bodyRef.current.applyImpulse({ x: 0, y: -9.82 * bodyRef.current.mass(), z: 0 }, true)
      }

      // Limit max speed
      const velocity = bodyRef.current.linvel()
      const maxSpeed = 20
      const currentSpeed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2)
      if (currentSpeed > maxSpeed) {
        const scale = maxSpeed / currentSpeed
        bodyRef.current.setLinvel({ x: velocity.x * scale, y: velocity.y * scale, z: velocity.z * scale })
      }
    }
  })

  return (
    <RigidBody 
      ref={bodyRef} 
      colliders="cuboid" 
      mass={1} 
      linearDamping={0.5} 
      angularDamping={0.5} 
      onCollisionEnter={onCollision}
    >
      <group>
        <Box args={[2, 1, 3]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="blue" />
        </Box>
        <Sphere args={[0.5]} position={[0, 0.5, -1.5]}>
          <meshStandardMaterial color="black" />
        </Sphere>
        <Cylinder args={[0.3, 0.3, 0.2]} position={[-1, 0.3, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="black" />
        </Cylinder>
        <Cylinder args={[0.3, 0.3, 0.2]} position={[1, 0.3, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="black" />
        </Cylinder>
      </group>
    </RigidBody>
  )
})

export default Vehicle
