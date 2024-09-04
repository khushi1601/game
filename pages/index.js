import Head from 'next/head'
import Game from '../components/Game'

export default function Home() {
  return (
    <div>
      <Head>
        <title>3D Vehicle Game</title>
        <meta name="description" content="A 3D vehicle game built with React Three Fiber" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Game />
      </main>
    </div>
  )
}