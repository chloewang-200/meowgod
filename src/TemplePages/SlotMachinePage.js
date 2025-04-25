/* reference: https://codepen.io/antibland/pen/ypagZd */
import React, { 
    useState, 
    useEffect, 
    useRef, 
    useCallback, 
    forwardRef, 
    useImperativeHandle 
} from 'react';
import { Link } from 'react-router-dom';
import '../components/SlotPage.css';
import wheelHeader from '../assets/wheel-header.png';
import leftSlotCat from '../assets/left-slot-cat.png';
import rightSlotCat from '../assets/right-slot-cat.png';
import catdecor from '../assets/slot-cat-decor.png';



const ICON_HEIGHT = 188;
const LOSER_MESSAGES = [
    "Not quite",
    "Stop gambling",
    "Hey, you lost!",
    "Ouch! I felt that",
    "Don't beat yourself up",
    "There goes the college fund",
    "I have a cat. You have a loss",
    "You're awesome at losing",
    "Coding is hard",
    "Don't hate the coder",
];

const RepeatButton = ({ onClick, isFirstGame }) => (
    <button 
        aria-label="Play game" 
        id="repeatButton" 
        className="bttn-jelly"
        onClick={onClick}
    >
        {isFirstGame ? 'Play Game' : 'Play Game'}
    </button>
);

const WinningSound = () => (
    <audio autoPlay className="player" preload="none">
        <source src="https://andyhoffman.codes/random-assets/img/slots/winning_slot.wav" />
    </audio>
);

const Spinner = forwardRef(({ onFinish, timer }, ref) => {
    const [position, setPosition] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(timer);
    const timerRef = useRef();
    const multiplierRef = useRef(Math.floor(Math.random() * (4 - 1) + 1));
    const startPositionRef = useRef(
        Math.floor(Math.random() * 9) * ICON_HEIGHT * -1
    );
    const speedRef = useRef(ICON_HEIGHT * multiplierRef.current);

    const reset = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        startPositionRef.current = Math.floor(Math.random() * 9) * ICON_HEIGHT * -1;
        multiplierRef.current = Math.floor(Math.random() * (4 - 1) + 1);
        speedRef.current = ICON_HEIGHT * multiplierRef.current;

        setPosition(startPositionRef.current);
        setTimeRemaining(timer);

        timerRef.current = setInterval(() => {
            tick();
        }, 100);
    }, [timer]);

    const getSymbolFromPosition = useCallback(() => {
        const totalSymbols = 9;
        const maxPosition = ICON_HEIGHT * (totalSymbols - 1) * -1;
        const moved = (timer / 100) * multiplierRef.current;
        let currentPosition = startPositionRef.current;

        for (let i = 0; i < moved; i++) {
            currentPosition -= ICON_HEIGHT;
            if (currentPosition < maxPosition) {
                currentPosition = 0;
            }
        }

        onFinish(currentPosition);
    }, [timer, onFinish]);

    const tick = useCallback(() => {
        setTimeRemaining((prev) => {
            if (prev <= 0) {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                getSymbolFromPosition();
                return 0;
            }

            setPosition((prevPosition) => prevPosition - speedRef.current);
            return prev - 100;
        });
    }, [getSymbolFromPosition]);

    useEffect(() => {
        reset();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [reset]);

    useImperativeHandle(
        ref,
        () => ({
            reset,
        }),
        [reset]
    );

    return (
        <div
            style={{ backgroundPosition: `0px ${position}px` }}
            className="icons"
        />
    );
});

Spinner.displayName = "Spinner";

const ResultPopup = ({ winner, message, onClose }) => (
    <div className={`result-popup ${winner ? 'winner' : 'loser'}`}>
        <h2>{winner ? '🤑 Pure skill! 🤑' : message}</h2>
        <button className="close-button" onClick={onClose}>Close</button>
    </div>
);

const SlotMachine = () => {
    const [winner, setWinner] = useState(null);
    const [matches, setMatches] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const spinnerRefs = useRef([null, null, null]);

    const handleFinish = (value) => {
        setMatches((prev) => {
            const newMatches = [...prev, value];
            if (newMatches.length === 3) {
                const first = newMatches[0];
                const results = newMatches.every((match) => match === first);
                setWinner(results);
                setTimeout(() => {
                    setShowPopup(true);
                }, 800);
            }
            return newMatches;
        });
    };

    const handleClick = () => {
        setWinner(null);
        setMatches([]);
        setShowPopup(false);
        spinnerRefs.current.forEach((spinner) => spinner?.reset());
    };

    const getLoserMessage = () => {
        console.log(LOSER_MESSAGES[Math.floor(Math.random() * LOSER_MESSAGES.length)]);
        return LOSER_MESSAGES[Math.floor(Math.random() * LOSER_MESSAGES.length)];
    };

    return (
        <div>
            <img src={wheelHeader} alt="wheel-header" className="wheel-header-slot" />
            {winner && <WinningSound />}
            
            {showPopup && (
                <ResultPopup 
                    winner={winner}
                    message={getLoserMessage()}
                    onClose={() => setShowPopup(false)}
                />
            )}

            <div className="spinner-container">
                <Spinner
                    onFinish={handleFinish}
                    timer={1000}
                    ref={(el) => {
                        spinnerRefs.current[0] = el;
                    }}
                />
                <Spinner
                    onFinish={handleFinish}
                    timer={1400}
                    ref={(el) => {
                        spinnerRefs.current[1] = el;
                    }}
                />
                <Spinner
                    onFinish={handleFinish}
                    timer={2200}
                    ref={(el) => {
                        spinnerRefs.current[2] = el;
                    }}
                />
                <div className="gradient-fade" />
            </div>
            <div className="cat-slot-container left-cat-slot">
                <img src={leftSlotCat} alt="decoration" />
            </div>
            <div className="cat-slot-container right-cat-slot">
                <img src={rightSlotCat} alt="decoration" />
            </div>
            <div className="cat-decor-container left-cat-decor">
                <img src={catdecor} alt="decoration" />
            </div>
            <div className="cat-decor-container right-cat-decor">
                <img src={catdecor} alt="decoration" />
            </div>
            {(matches.length === 0 || winner !== null) && 
                <RepeatButton 
                    onClick={handleClick} 
                    isFirstGame={matches.length === 0}
                />
            }
        </div>
    );
};

// Replace the simple SlotMachinePage with one that uses the SlotMachine component
const SlotMachinePage = () => (
    <div className="slot-machine-page">
        <Link to="/NFT" className="back-button">
            ← Back
        </Link>
        <SlotMachine />
    </div>
);

export default SlotMachinePage;
