"use client"
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState, useCallback, KeyboardEvent } from 'react';
import { QuailProfile, quailsDB } from '../../data/quailData';
import QuailProfileModal from '../../components/QuailProfileModal';
import styles from '../../styles/QuailInvestigation.module.css';

const NUM_DISPLAY_QUAILS = 12;
const IMPOSTER_IMAGE_PATH = '/images/quail_fat.png';
const GAME_DURATION_SECONDS = 60; // Max time for the game

// Define types for the units displayed in the grid
interface BaseUnit {
  id: string;
  name: string;
}
interface GameQuailUnit extends QuailProfile, BaseUnit {
  isImposter: false;
  type: 'quail';
}
interface GameImposterUnit extends BaseUnit {
  src: string;
  isImposter: true;
  type: 'imposter';
}
type DisplayableUnit = GameQuailUnit | GameImposterUnit;

export default function QuailInvestigationPage(): JSX.Element {
  const [displayUnits, setDisplayUnits] = useState<DisplayableUnit[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION_SECONDS);
  const [timerActive, setTimerActive] = useState<boolean>(false); // Will be set to true on mount
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(''); // Initially empty
  const [startTime, setStartTime] = useState<number | null>(null);
  const [foundImposter, setFoundImposter] = useState<boolean>(false);

  const [selectedQuail, setSelectedQuail] = useState<GameQuailUnit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  const setupInvestigation = useCallback((): void => {
    // Reset core game states, units will be set up here
    setGameOver(false);
    setFoundImposter(false);
    setMessage('');
    setTimeLeft(GAME_DURATION_SECONDS); // Reset timer duration for this setup
    // Timer active and start time will be set after this in the mount effect
    setIsModalOpen(false);
    setSelectedQuail(null);

    const shuffledQuailsFromDB: QuailProfile[] = shuffleArray([...quailsDB]);
    const currentFlockProfiles: QuailProfile[] = shuffledQuailsFromDB.slice(0, NUM_DISPLAY_QUAILS);

    const unitsForDisplay: GameQuailUnit[] = currentFlockProfiles.map((profile) => ({
      ...profile,
      isImposter: false,
      type: 'quail',
    }));

    const imposterUnit: GameImposterUnit = {
      id: 'imposter-' + Date.now(),
      src: IMPOSTER_IMAGE_PATH,
      isImposter: true,
      type: 'imposter',
      name: 'Anomalous Unit', // More subtle name
    };

    const allUnits: DisplayableUnit[] = shuffleArray([...unitsForDisplay, imposterUnit]);
    setDisplayUnits(allUnits);
  }, [shuffleArray]);

  // Effect to setup and start the game on mount
  useEffect(() => {
    setupInvestigation();
    setTimerActive(true);   // Start the timer immediately
    setStartTime(Date.now()); // Record start time
  }, [setupInvestigation]); // setupInvestigation is memoized

  // Effect for the game timer logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0 && !gameOver) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver && timerActive) {
      // Time ran out before imposter was found
      setGameOver(true);
      setTimerActive(false);
      setMessage("System scan complete. Anomaly location flagged.");
      // Optionally, you could automatically "select" or highlight the imposter here
      // For example, by finding it in displayUnits and setting a specific class or state
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerActive, timeLeft, gameOver]);

  const handleUnitClick = (unit: DisplayableUnit): void => {
    if (gameOver) return; // Game already ended (either by finding or timeout)

    // Note: Timer starts on page load, so no need to start it here.

    if (unit.isImposter) {
      setGameOver(true);
      setTimerActive(false); // Stop the timer
      setFoundImposter(true);
      const timeTaken = ((Date.now() - (startTime ?? Date.now())) / 1000);
      setMessage(`Anomaly detected. Analysis duration: ${timeTaken.toFixed(2)}s.`);
      setIsModalOpen(false);
    } else {
      // It's a regular quail
      setSelectedQuail(unit as GameQuailUnit);
      setIsModalOpen(true);
    }
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedQuail(null);
  };

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>Flock Observation Log</title> {/* More subtle title */}
        <meta name="description" content="Routine observation of the flock." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Observation Deck</h1>
          <p className={styles.pageSubtitle}>
            Monitoring standard flock behavior. All units appear nominal at first glance.
          </p>
        </header>

        {/* The message area will now display the outcome */}
        {message && (
          <div className={styles.statusBar}> {/* Re-purpose or use feedbackMessage style */}
            <p className={`${styles.feedbackMessage} ${foundImposter ? styles.found : styles.missed}`}>
              {message}
            </p>
          </div>
        )}


        {displayUnits.length === 0 && <p>Initializing observation feed...</p>}

        <div className={styles.unitGrid}>
          {displayUnits.map((unit) => {
            let unitContainerClasses = styles.unitContainer;
            // Highlight imposter if game is over (found or time up)
            if (gameOver && unit.isImposter) {
              unitContainerClasses += ` ${foundImposter ? styles.foundImposter : styles.missedImposter}`;
            }

            return (
              <div
                key={unit.id}
                className={unitContainerClasses}
                onClick={() => !gameOver && handleUnitClick(unit)} // Prevent clicks after game over
                onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                  if (!gameOver && (e.key === 'Enter' || e.key === ' ')) handleUnitClick(unit);
                }}
                tabIndex={gameOver ? -1 : 0} // Remove from tab order if game over
                role="button"
                aria-pressed={selectedQuail?.id === unit.id && isModalOpen}
                aria-label={`Observe ${unit.name}`}
                title={`Observe ${unit.name}`} // Keep title for individual units
                style={{ cursor: gameOver ? 'default' : 'pointer' }}
              >
                <Image
                  src={unit.type === 'quail' ? unit.imageSrc : unit.src}
                  alt={unit.name}
                  layout="fill"
                  objectFit="cover"
                  priority={displayUnits.indexOf(unit) < NUM_DISPLAY_QUAILS + 1}
                  className={styles.unitImage}
                />
              </div>
            );
          })}
        </div>

        {/* "Start New Observation" button is removed */}

      </main>

      {isModalOpen && selectedQuail && !gameOver && (
        <QuailProfileModal quail={selectedQuail} onClose={closeModal} styles={styles} />
      )}
    </div>
  );
}
