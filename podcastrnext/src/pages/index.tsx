import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { usePlayer } from '../contexts/PlayerContexts';
import styles from '../pages/home.module.scss';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: Date;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodesList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr </title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos para você</h2>
        <ul>
          {
            latestEpisodes.map((episode, index) => {
              return (
                <li key={episode.id} >
                  <Image width={192} height={192} src={episode.thumbnail} alt="Thumbnail do episódio" objectFit="cover" />
                  <div className={styles.episodeDetails}>
                    <Link href={`episodes/${episode.id}`}>
                      <a> {episode.title} </a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>
                  <button type="button" onClick={() => playList(episodesList, index)}>
                    <img src="/play-green.svg" alt="Tocar este episódio" />
                  </button>
                </li>
              )
            })
          }
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 100 }}>
                      <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
                    </td>
                    <td>
                      <Link href={`episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td> {episode.members}</td>
                    <td style={{ width: 100 }}> {episode.publishedAt}</td>
                    <td> {episode.durationAsString}</td>
                    <td>
                      <button type="button" onClick={() => playList(episodesList, index + latestEpisodes.length)}>
                        <img src="/play-green.svg" alt="Tocar este episódio" />
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  //desestruturação do objeto response, pegando somente a propriedade data
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, //60 segundo * 60 = 1hora * 8 = 8 horas = 3 renderizações por dia
  }
}


//----------------------------------------------------------------
/**
 * useEffect => Usado para controlar efeitos colaterais, efeitos não esperados.
 * Ela dispara sempre que algo muda na aplicação.
 * 2 parâmetros:  1 param: '() => {}' o que eu quero executar
 *                2 param: '[]' Quando eu quero executar
 * É possível executar consultas deste modo.
 * No segundo param, se eu passar um array vazio, será executado somente uma vez,
 * se eu passar uma variável dentro do array, toda vez que essa variável mudar,
 * será disparada a função.
 *
 * SPA = Single Page Application
```JS React
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    fetch('http://localhost:3333/episodes')
      .then((response) => response.json())
      .then(data => console.log(data));
  }, [])
  return (
    <h1>
      Index
    </h1>
  )
}
```
 * O problema desta maneira, é que a requisição não é indexada pelos buscadores
 * fazendo com que ela não seja a melhor prática para alguns tipos de aplicação,
 * visto que a requisição acontece do lado do client-side, e não do server side.
 * Explicando melhor: Se as informações da requisição precisam estar disponíveis
 * assim que a página é carregada, ela não estará, visto que a requisição ocorre
 * após a página aparecer para o usuário.
 *
 * SSR => Server Side Rendering
 * Para realizar a requisição por SSR, é necessário exportar uma função com o nome
 * 'getServerSideProps()' o next já entende que é necessário executar essa função
 * ANTES de renderizar a página para o usuário.
 * Ficando assim a nossa classe.
 ```JS
 export default function Home(props) {
  console.log(props.episodes);

  return (
    <>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    }
  }
}
```
 * Nota: Lembre-se sempre do conceito de props, usado nesse método.
 *
 * SSG => Static Side Generation
 * Nesta maneira, assim que a primeira requisição for feita, será gerada uma página
 * estática para que TODO MUNDO QUE ACESSA ELA, a receba. Através da prop "revalidate"
 * no retorno do método getStaticProps é gerada outra página.
 * Revalidate: é o tempo em segundos para ser gerada uma nova página estática.
 * O arquivo fica assim:
```JS
export default function Home(props) {
  console.log(props.episodes);

  return (
    <>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8, //60 segundo * 60 = 1hora * 8 = 8 horas = 3 renderizações por dia
  }
}
```
 *
 * Qual a diferença entre SSG e SSR:
 * A SSG é usada para aplicações que não precisam de estar em "tempo real", adicionando
 * uma propriedade "revalidate" para que ela seja renderizada nesse tempo em segundos
 * SSG só funciona em produção.
 * No projeto, 'yarn build' e 'yarn start'
 *
 */

