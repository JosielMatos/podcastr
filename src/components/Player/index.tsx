import { useRef, useEffect, useState } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import Image from 'next/image'
import Slider from 'rc-slider'
import styles from './styles.module.scss'
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export function Player() {
    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setIsPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        clearPlayerState
    } = usePlayer()

    const episode = episodeList[currentEpisodeIndex]

    const audioRef = useRef<HTMLAudioElement>(null)

    const [progress, setProgress] = useState(0)

    //seting up audio progress
    function setupProgressListener() {
        audioRef.current.currentTime = 0
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    //handling the audio play/pause
    useEffect(()=>{
        if (!audioRef.current) { //.current is useRef property to access the reference value and properties
            return;
        }
        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover"/>
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                        <div className={styles.slider}>
                            { episode ? (
                                <Slider 
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{backgroundColor: '#04d361'}}
                                railStyle={{backgroundColor: '#9f75ff'}}
                                handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                                />
                            ) : (
                                <div className={styles.emptySlider} />
                            ) }
                        </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
                
                {episode && (
                    <audio src={episode.url} 
                    ref={audioRef} 
                    autoPlay
                    loop={isLooping}
                    onPlay={() => setIsPlayingState(true)}
                    onPause={() => setIsPlayingState(false)}
                    onLoadedMetadata={setupProgressListener}
                    onEnded={handleEpisodeEnded}
                     />
                )}

                <div className={styles.buttons}>
                    <button type="button" onClick={toggleShuffle} className={isShuffling ? styles.isActive: ''} disabled={!episode || episodeList.length === 1}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                        { isPlaying ? (
                            <img src="/pause.svg" alt="Pausar"/>
                        ) : (
                            <img src="/play.svg" alt="Tocar"/>
                        )}
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button type="button" onClick={toggleLoop} className={isLooping ? styles.isActive: ''} disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}