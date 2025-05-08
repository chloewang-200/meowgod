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
import winningCat from '../assets/winning-cat.png';
import losingCat1 from '../assets/losing-cat1.png';
import losingCat2 from '../assets/losing-cat2.png';
import losingCat3 from '../assets/losing-cat3.png';
import { useAuth } from '../contexts/AuthContext';

const ICON_HEIGHT = 188;
const LOSER_IMAGES = [
    losingCat1,
    losingCat2,
    losingCat3,
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
    const multiplierRef = useRef(2);
    const startPositionRef = useRef(
        Math.floor(Math.random() * 9) * ICON_HEIGHT * -1
    );
    const speedRef = useRef(ICON_HEIGHT * multiplierRef.current);
    const [isStarted, setIsStarted] = useState(false);

    const reset = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        // Randomize starting position
        const randomStart = Math.floor(Math.random() * 9);
        startPositionRef.current = randomStart * ICON_HEIGHT * -1;
        
        // Only start spinning if isStarted is true
        if (isStarted) {
            // Randomize spin time between 1000ms and 2000ms
            const randomTimer = Math.floor(Math.random() * 1000) + 1000;
            setTimeRemaining(randomTimer);

            // Randomize speed between 2-3 multiples of ICON_HEIGHT
            multiplierRef.current = Math.floor(Math.random() * 2) + 2;
            speedRef.current = ICON_HEIGHT * multiplierRef.current;

            setPosition(startPositionRef.current);

            timerRef.current = setInterval(() => {
                tick();
            }, 100);
        } else {
            // Just set initial position without spinning
            setPosition(startPositionRef.current);
        }
    }, [isStarted]);

    // Add this function to start the spinner
    const start = useCallback(() => {
        setIsStarted(true);
        reset();
    }, [reset]);

    const tick = useCallback(() => {
        setTimeRemaining((prev) => {
            if (prev <= 0) {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                
                // Get current position
                const currentIndex = Math.abs(Math.round(position / ICON_HEIGHT)) % 9;
                
                // Skip the specific cat symbol (assuming it's at index 4)
                let finalIndex;
                do {
                    finalIndex = Math.floor(Math.random() * 9);
                } while (finalIndex === 4); // Replace 4 with whatever index you want to avoid
                
                const finalPosition = -(finalIndex * ICON_HEIGHT);
                setPosition(finalPosition);
                onFinish(finalPosition);
                return 0;
            }

            setPosition((prevPosition) => {
                const newPosition = prevPosition - speedRef.current;
                // Wrap around when reaching the bottom
                if (newPosition < -8 * ICON_HEIGHT) {
                    return newPosition % (9 * ICON_HEIGHT);
                }
                return newPosition;
            });
            return prev - 100;
        });
    }, [position, onFinish]);

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
            reset: start,
        }),
        [start]
    );

    return (
        <div
            style={{ backgroundPosition: `0px ${position}px` }}
            className="icons"
        />
    );
});

Spinner.displayName = "Spinner";

const ResultPopup = ({ winner, onClose }) => {
    const randomLosingImage = LOSER_IMAGES[Math.floor(Math.random() * LOSER_IMAGES.length)];
    
    return (
    <div className={`result-popup ${winner ? 'winner' : 'loser'}`}>
            <div className="popup-image-container">
                <img 
                    src={winner ? winningCat : randomLosingImage} 
                    alt={winner ? "Winning cat" : "Losing cat"} 
                    className="result-image"
                />
            </div>
        <button className="close-button" onClick={onClose}>Close</button>
    </div>
);
};

const SlotMachine = ({ onPlayAttempt, onWin, balance, getBalance }) => {
    const { currentUser } = useAuth();
    const [winner, setWinner] = useState(null);
    const [matches, setMatches] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState('');
    const [showInsufficientBalancePopup, setShowInsufficientBalancePopup] = useState(false);
    const spinnerRefs = useRef([null, null, null]);
    const PLAYING_COST = 10;

    const handleFinish = (value) => {
        setMatches((prev) => {
            const newMatches = [...prev, value];
            if (newMatches.length === 3) {
                const first = newMatches[0];
                const results = newMatches.every((match) => match === first);
                setWinner(results);
                if (results) {
                    onWin(); // Call onWin when player wins
                    getBalance(); // Refresh balance after winning
                }
                setTimeout(() => {
                    setShowPopup(true);
                }, 800);
            }
            return newMatches;
        });
    };

    const handleClick = async () => {
        if (!currentUser) {
            setError('Please log in to play');
            return;
        }

        if (balance < PLAYING_COST) {
            setShowInsufficientBalancePopup(true);
            return;
        }

        try {
            const success = await onPlayAttempt();
            if (!success) {
                setShowInsufficientBalancePopup(true);
                return;
            }

            getBalance(); // Refresh balance after deduction
            setWinner(null);
            setMatches([]);
            setShowPopup(false);
            spinnerRefs.current.forEach((spinner) => {
                if (spinner) spinner.reset();
            });
        } catch (err) {
            console.error('Error starting game:', err);
            setError('Failed to start game. Please try again.');
        }
    };

    return (
        <div>
            <img src={wheelHeader} alt="wheel-header" className="wheel-header-slot" />
            {winner && <WinningSound />}
            
            {showPopup && (
                <ResultPopup 
                    winner={winner}
                    onClose={() => setShowPopup(false)}
                />
            )}
            
            <div className="spinner-container">
                <Spinner
                    onFinish={handleFinish}
                    timer={1000 + Math.floor(Math.random() * 500)}
                    ref={(el) => { spinnerRefs.current[0] = el; }}
                />
                <Spinner
                    onFinish={handleFinish}
                    timer={1000 + Math.floor(Math.random() * 500)}
                    ref={(el) => { spinnerRefs.current[1] = el; }}
                />
                <Spinner
                    onFinish={handleFinish}
                    timer={1000 + Math.floor(Math.random() * 500)}
                    ref={(el) => { spinnerRefs.current[2] = el; }}
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

const SlotMachinePage = () => {
    const { currentUser } = useAuth();
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState('');
    const [showInsufficientBalancePopup, setShowInsufficientBalancePopup] = useState(false);
    const BACKEND_URL = 'https://meow-god-backend-717901323721.us-central1.run.app';
    const PLAYING_COST = 10;
    const WINNING_AMOUNT = 30;

    // Function to fetch balance - updated to match AltarPage implementation
    const getBalance = async () => {
        try {
            const idToken = await currentUser.getIdToken(true);
            
            const response = await fetch(`${BACKEND_URL}/balance`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include'
            });
            
            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(`Failed to fetch balance: ${response.status} ${responseText}`);
            }
            
            const responseText = await response.text();
            console.log('Get balance response text:', responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
                console.log('Get balance parsed data:', data);
            } catch (e) {
                console.error('Error parsing balance response:', e);
                throw new Error('Invalid response format');
            }
            
            if (data.balance !== undefined) {
                console.log('Setting balance to:', data.balance);
                setBalance(data.balance);
            } else {
                console.warn('Balance not found in response:', data);
            }
            
            setError('');
        } catch (err) {
            console.error('Error in getBalance:', err);
            setError(err.message);
        }
    };

    // Function to deduct balance - updated to match AltarPage implementation
    const deductBalance = async (amount) => {
        if (!currentUser) {
            setError('You must be logged in to play');
            return false;
        }

        try {
            const idToken = await currentUser.getIdToken();
            
            const response = await fetch(`${BACKEND_URL}/balance/deduct`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({ amount: amount })
            });
            
            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(`Failed to deduct balance: ${response.status} ${responseText}`);
            }
            
            const responseText = await response.text();
            console.log('Deduct balance response text:', responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
                console.log('Deduct balance parsed data:', data);
            } catch (e) {
                console.error('Error parsing deduct balance response:', e);
                throw new Error('Invalid response format');
            }
            
            // Check if the response contains the new balance in different formats
            if (data.new_balance !== undefined) {
                console.log('Setting balance to new_balance:', data.new_balance);
                setBalance(data.new_balance);
            } else if (data.balance !== undefined) {
                console.log('Setting balance to balance:', data.balance);
                setBalance(data.balance);
            } else {
                console.warn('Balance not found in response, refreshing:', data);
                getBalance();
            }
            
            setError('');
            return true;
        } catch (err) {
            console.error('Error in deductBalance:', err);
            setError(err.message);
            return false;
        }
    };

    // Function to add balance when winning - updated to match AltarPage style
    const addBalance = async (amount) => {
        if (!currentUser) {
            setError('You must be logged in to receive winnings');
            return false;
        }

        try {
            const idToken = await currentUser.getIdToken();
            
            const response = await fetch(`${BACKEND_URL}/balance/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({ amount: amount })
            });
            
            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(`Failed to add balance: ${response.status} ${responseText}`);
            }
            
            const responseText = await response.text();
            console.log('Add balance response text:', responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
                console.log('Add balance parsed data:', data);
            } catch (e) {
                console.error('Error parsing add balance response:', e);
                throw new Error('Invalid response format');
            }
            
            // Update balance from response
            if (data.new_balance !== undefined) {
                setBalance(data.new_balance);
            } else if (data.balance !== undefined) {
                setBalance(data.balance);
            } else {
                getBalance();
            }
            
            setError('');
            return true;
        } catch (err) {
            console.error('Error in addBalance:', err);
            setError(err.message);
            return false;
        }
    };

    // Update the useEffect to include currentUser dependency
    useEffect(() => {
        if (currentUser) {
            getBalance();
            // Refresh balance every 5 seconds
            const intervalId = setInterval(getBalance, 5000);
            return () => clearInterval(intervalId);
        }
    }, [currentUser]);

    const handlePlay = async () => {
        try {
            const success = await deductBalance(PLAYING_COST);
            if (success) {
                await getBalance(); // Refresh balance after deduction
            }
            return success;
        } catch (err) {
            setError('Failed to deduct balance');
            return false;
        }
    };

    const handleWin = async () => {
        try {
            const success = await addBalance(WINNING_AMOUNT);
            if (success) {
                await getBalance(); // Refresh balance after winning
            }
        } catch (err) {
            setError('Failed to add winning amount');
        }
    };

    return (
    <div className="slot-machine-page">
        <Link to="/NFT" className="back-button">
            ← Back
        </Link>
            
        <div className="balance-box">
            {currentUser ? (
                <h3>Balance: {balance !== null ? `${balance}` : 'Loading...'}</h3>
            ) : (
                <h3>Please log in to play</h3>
            )}
            {error && <p className="error-message">{error}</p>}
        </div>

        <SlotMachine 
            onPlayAttempt={handlePlay}
            onWin={handleWin}
            balance={balance}
            getBalance={getBalance}
        />

        {showInsufficientBalancePopup && (
            <InsufficientBalancePopup 
                onClose={() => setShowInsufficientBalancePopup(false)}
                balance={balance}
            />
        )}
    </div>
);
};

const InsufficientBalancePopup = ({ onClose, balance }) => (
    <div className="sacrifice-popup-overlay">
        <div className="sacrifice-popup">
            <h3>Insufficient Balance</h3>
            <p>You need at least 10 coins to play.</p>
            <p>Your current balance is {balance}.</p>
            <div className="popup-buttons">
                <button className="confirm-button" onClick={onClose}>OK</button>
            </div>
        </div>
    </div>
);

export default SlotMachinePage;
