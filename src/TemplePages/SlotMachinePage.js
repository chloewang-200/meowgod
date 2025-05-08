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

    const reset = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        // Randomize starting position
        const randomStart = Math.floor(Math.random() * 9);
        startPositionRef.current = randomStart * ICON_HEIGHT * -1;
        
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
    }, []);

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

const SlotMachine = ({ onPlayAttempt, onWin }) => {
    const { currentUser } = useAuth();
    const [winner, setWinner] = useState(null);
    const [matches, setMatches] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const spinnerRefs = useRef([null, null, null]);
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState('');
    const BACKEND_URL = 'https://flask-api-717901323721.us-central1.run.app';

    // Function to fetch balance
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
                throw new Error(`Failed to fetch balance`);
            }

            const data = await response.json();
            setBalance(data.balance);
            setError('');
        } catch (err) {
            console.error('Error fetching balance:', err);
            setError('Failed to load balance');
        }
    };

    // Function to deduct balance when playing
    const deductBalance = async (amount) => {
        try {
            // Force refresh the token to ensure it's not expired
            const idToken = await currentUser.getIdToken(true);
            console.log('Making deduct request with token:', idToken.substring(0, 20) + '...'); // Log token for debugging

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

            // Log the response for debugging
            console.log('Deduct response status:', response.status);
            const responseText = await response.text();
            console.log('Deduct response text:', responseText);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please try logging in again.');
                }
                throw new Error(`Failed to deduct balance: ${responseText}`);
            }

            const data = JSON.parse(responseText);
            getBalance(); // Refresh balance after deduction
            return true;
        } catch (err) {
            console.error('Error deducting balance:', err);
            setError(err.message || 'Failed to deduct balance');
            return false;
        }
    };

    // Function to add balance when winning
    const addBalance = async (amount) => {
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
                throw new Error(`Failed to add balance`);
            }

            await response.json();
            getBalance(); // Refresh balance after addition
        } catch (err) {
            console.error('Error adding balance:', err);
            setError('Failed to add balance');
        }
    };

    // Fetch balance when component mounts
    useEffect(() => {
        getBalance();
    }, []);

    // Modify the SlotMachine component to handle balance
    const handlePlay = async () => {
        const playingCost = 10; // Set your desired cost to play
        try {
            await deductBalance(playingCost);
            return true; // Return true if deduction successful
        } catch (err) {
            setError('Insufficient balance');
            return false;
        }
    };

    const handleWin = async () => {
        const winningAmount = 30; // Set your desired winning amount
        await addBalance(winningAmount);
    };

    const handleFinish = (value) => {
        setMatches((prev) => {
            const newMatches = [...prev, value];
            if (newMatches.length === 3) {
                const first = newMatches[0];
                const results = newMatches.every((match) => match === first);
                setWinner(results);
                if (results) {
                    onWin(); // Call onWin when player wins
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

        try {
            // Check if player can afford to play
            const canPlay = await handlePlay();
            if (!canPlay) {
                return; // Don't start the game if player can't afford it
            }

            setWinner(null);
            setMatches([]);
            setShowPopup(false);
            spinnerRefs.current.forEach((spinner) => spinner?.reset());
        } catch (err) {
            console.error('Error starting game:', err);
            setError('Failed to start game. Please try again.');
        }
    };

    useEffect(() => {
        console.log('Current user:', currentUser);
        if (currentUser) {
            console.log('User ID:', currentUser.uid);
            currentUser.getIdToken().then(token => {
                console.log('Token available:', !!token);
            });
        }
    }, [currentUser]);

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

// Replace the simple SlotMachinePage with one that uses the SlotMachine component
const SlotMachinePage = () => {
    const { currentUser } = useAuth();
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState('');
    const BACKEND_URL = 'https://flask-api-717901323721.us-central1.run.app';

    // Function to fetch balance
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
                throw new Error(`Failed to fetch balance`);
            }

            const data = await response.json();
            setBalance(data.balance);
            setError('');
        } catch (err) {
            console.error('Error fetching balance:', err);
            setError('Failed to load balance');
        }
    };

    // Function to deduct balance when playing
    const deductBalance = async (amount) => {
        try {
            // Force refresh the token to ensure it's not expired
            const idToken = await currentUser.getIdToken(true);
            console.log('Making deduct request with token:', idToken.substring(0, 20) + '...'); // Log token for debugging

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

            // Log the response for debugging
            console.log('Deduct response status:', response.status);
            const responseText = await response.text();
            console.log('Deduct response text:', responseText);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please try logging in again.');
                }
                throw new Error(`Failed to deduct balance: ${responseText}`);
            }

            const data = JSON.parse(responseText);
            getBalance(); // Refresh balance after deduction
            return true;
        } catch (err) {
            console.error('Error deducting balance:', err);
            setError(err.message || 'Failed to deduct balance');
            return false;
        }
    };

    // Function to add balance when winning
    const addBalance = async (amount) => {
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
                throw new Error(`Failed to add balance`);
            }

            await response.json();
            getBalance(); // Refresh balance after addition
        } catch (err) {
            console.error('Error adding balance:', err);
            setError('Failed to add balance');
        }
    };

    // Fetch balance when component mounts
    useEffect(() => {
        if (currentUser) {
            getBalance();
        } else {
            setError('Please log in to view balance');
        }
    }, [currentUser]);

    // Modify the SlotMachine component to handle balance
    const handlePlay = async () => {
        const playingCost = 10; // Set your desired cost to play
        try {
            await deductBalance(playingCost);
            return true; // Return true if deduction successful
        } catch (err) {
            setError('Insufficient balance');
            return false;
        }
    };

    const handleWin = async () => {
        const winningAmount = 30; // Set your desired winning amount
        await addBalance(winningAmount);
    };

    return (
        <div className="slot-machine-page">
            <Link to="/NFT" className="back-button">
                ← Back
            </Link>
            
            {/* Add balance display */}
            <div className="balance-container">
                {currentUser ? (
                    <h3>Balance: {balance !== null ? `${balance} coins` : 'Loading...'}</h3>
                ) : (
                    <h3>Please log in to play</h3>
                )}
                {error && <p className="error-message">{error}</p>}
            </div>

            {/* Pass balance handling to SlotMachine */}
            <SlotMachine 
                onPlayAttempt={handlePlay}
                onWin={handleWin}
            />
        </div>
    );
};

export default SlotMachinePage;
