/**
 * Slug = Parametro no final da URL. 
 * Ex.: http://example.com/episode/teste-123 => O Slug é teste-123
 */
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '../../contexts/PlayerContexts';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';

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

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();
  return (
    <div className={styles.episode}>
      <Head>
        <title> {episode.title} | Podcastr </title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button" >
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image width="700" height="160" objectFit="cover" src={episode.thumbnail} />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar Episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }} //USADO para inserir o texto em HTML
      />

    </div>
  )
}

/**
 * Explicado no começo da aula 04. Fica atento!
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  });

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24, //Refresh 24 horas
  }
}


//CODIGO AULA 03
/**
 * //
 * //Slug = Parametro no final da URL.
 * //Ex.: http://example.com/episode/teste-123 => O Slug é teste-123
 *
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';


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

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button" >
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image width="700" height="160" objectFit="cover" src={episode.thumbnail} />
        <button type="button">
          <img src="/play.svg" alt="Tocar Episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }} //USADO para inserir o texto em HTML
      />

    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24, //Refresh 24 horas
  }
}
 */