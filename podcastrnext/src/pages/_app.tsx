import { useState } from 'react';

import { Header } from '../components/Header';
import { Player } from '../components/Player';

import { PlayerContext, PlayerContextProvider } from '../contexts/PlayerContexts';

//Este arquivo é um arquivo que é global
/**
 * Sempre que a rota é mudada, e este arquivo é recalculado/recriado
 * Neste caso, não é muito bom, deixar o import das fontes aqui
 * **Explicação aula 02 - minuto 35**
 * 
 * 
 */
import styles from '../styles/app.module.scss';
import '../styles/global.scss';

function MyApp({ Component, pageProps }) {

  return (
    <PlayerContextProvider >
      <div className={styles.wrapper}>
        <main >
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
