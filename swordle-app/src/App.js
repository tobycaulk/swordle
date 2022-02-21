import React, { useEffect, useState, useRef } from 'react';
import { use100vh } from 'react-div-100vh';
import moment from 'moment';
import './App.css';
import allWords from './word-list.json';

const MAX_WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const FIRST_DATE = moment("2022-02-14");
const NOTIFICATION_DELAY = 3000;
const NOTIFICATION_FADEOUT = 100;

const letterState = {
  default: 'default',
  present: 'present',
  absent: 'absent',
  correct: 'correct'
}

const notificationMessage = {
  invalidWord: 'Inte en giltig ord'
}

const App = () => {
  const [words, setWords] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameBoardHeight, setGameBoardHeight] = useState(500);
  const [correctWord, setCorrectWord] = useState('');
  const [notification, setNotification] = useState({});

  const gameBoardRef = useRef(null);
  const height = use100vh();

  const getKeyState = letter => {
    const usedLetter = usedLetters.filter(ul => ul.letter === letter.toLowerCase())[0];
    if(!usedLetter) {
      return letterState.default;
    }

    return usedLetter.state;
  }

  const getConstructedWord = word => {
    return word.reduce((prev, curr, _) => prev += curr.letter, [])
  }

  const getWordFromRow = row => {
    let word = words[row];
    if(!word) {
      word = [];
    } else if(word.length >= MAX_WORD_LENGTH) {
      word = word.slice(0, MAX_WORD_LENGTH);
    }

    return word;
  }

  const getWord = _ => {
    return getWordFromRow(currentRow);
  }

  const updateWord = word => {
    let updatedWords = words;
    updatedWords[currentRow] = word;
    setWords([...updatedWords]);
  }

  const addLetterToWord = letter => {
    let word = getWord();
    if(word.length >= MAX_WORD_LENGTH) {
      return;
    }

    word.push({ letter: letter, state: letterState.default });
    updateWord(word);
  }

  const onKeyPress = letter => {
    if(!isValidLetter(letter)) {
      return;
    }

    addLetterToWord(letter);
  }

  const onDeletePress = _ => {
    const word = getWord();
    word.pop();
    updateWord(word);
  }

  const onEnterPress = _ => {
    const word = getWord();
    if(!word || word.length != MAX_WORD_LENGTH) {
      return;
    }
    
    const constructedWord = getConstructedWord(word);
    if(!constructedWord || constructedWord.length != 5) {
      setNotification({ message: notificationMessage.invalidWord });
      return;
    }
     
    if(!allWords.includes(constructedWord.toLowerCase())) {
      setNotification({ message: notificationMessage.invalidWord });
      return;
    }

    const updatedWord = word;
    const updatedUsedLetters = usedLetters;
    for(let i = 0; i < word.length; i++) {
      const letter = updatedWord[i].letter.toLowerCase();
      const letterState = scoreLetter(letter, correctWord.toLowerCase(), i);
      updatedWord[i].state = letterState;
      const usedLetter = usedLetters.filter(ul => ul.letter === letter)[0];
      if(!usedLetter) {
        updatedUsedLetters.push({ letter: letter, state: letterState });
      }
    }

    setUsedLetters([...updatedUsedLetters]);
    updateWord(updatedWord);
    setCurrentRow(currentRow + 1);
  }

  useEffect(() => {
    setGameBoardHeight(gameBoardRef.current.clientHeight);
  });

  useEffect(() => {
    const today = moment();
    const elapsed = today.diff(FIRST_DATE, "days");
    setCorrectWord(allWords[elapsed]);
  }, []);

  return (
    <>
      <InfoWindow>
        Hello World
      </InfoWindow>
      {
        (notification && notification.hasOwnProperty('message')) && (
          <Notification 
            message={notification.message} 
            delay={NOTIFICATION_DELAY}
            onTimeout={() => {
              setNotification({});
            }}
          /> 
        )
      }
      <div className={'window-container'} style={{ height: height }}>
        <div className={'header'}>
          Swordle
        </div>
        <div className={'board-container'} ref={gameBoardRef}>
          <div className={'game-container'} style={{ width: gameBoardHeight * 0.80 }}>
            {[...Array(MAX_GUESSES)].map((_, i) => {
              return <WordRow key={i} word={words[i]} current={currentRow === i} />
            })}
          </div>
        </div>
        <div className={'keyboard-container'}>
          <KeyboardRow>
            <KeyboardKey letter={'Q'} state={getKeyState('Q')} onClick={onKeyPress} />
            <KeyboardKey letter={'W'} state={getKeyState('W')} onClick={onKeyPress} />
            <KeyboardKey letter={'E'} state={getKeyState('E')} onClick={onKeyPress} />
            <KeyboardKey letter={'R'} state={getKeyState('R')} onClick={onKeyPress} />
            <KeyboardKey letter={'T'} state={getKeyState('T')} onClick={onKeyPress} />
            <KeyboardKey letter={'Y'} state={getKeyState('Y')} onClick={onKeyPress} />
            <KeyboardKey letter={'U'} state={getKeyState('U')} onClick={onKeyPress} />
            <KeyboardKey letter={'I'} state={getKeyState('I')} onClick={onKeyPress} />
            <KeyboardKey letter={'O'} state={getKeyState('O')} onClick={onKeyPress} />
            <KeyboardKey letter={'P'} state={getKeyState('P')} onClick={onKeyPress} />
            <KeyboardKey letter={'Å'} state={getKeyState('Å')} onClick={onKeyPress} />
          </KeyboardRow>
          <KeyboardRow>
            <KeyboardKey letter={'A'} state={getKeyState('A')} onClick={onKeyPress} />
            <KeyboardKey letter={'S'} state={getKeyState('S')} onClick={onKeyPress} />
            <KeyboardKey letter={'D'} state={getKeyState('D')} onClick={onKeyPress} />
            <KeyboardKey letter={'F'} state={getKeyState('F')} onClick={onKeyPress} />
            <KeyboardKey letter={'G'} state={getKeyState('G')} onClick={onKeyPress} />
            <KeyboardKey letter={'H'} state={getKeyState('H')} onClick={onKeyPress} />
            <KeyboardKey letter={'J'} state={getKeyState('J')} onClick={onKeyPress} />
            <KeyboardKey letter={'K'} state={getKeyState('K')} onClick={onKeyPress} />
            <KeyboardKey letter={'L'} state={getKeyState('L')} onClick={onKeyPress} />
            <KeyboardKey letter={'Ö'} state={getKeyState('Ö')} onClick={onKeyPress} />
            <KeyboardKey letter={'Ä'} state={getKeyState('Ä')} onClick={onKeyPress} />
          </KeyboardRow>
          <KeyboardRow inset>
            <KeyboardKey letter={'↵'} state={letterState.default} onClick={onEnterPress} double />
            <KeyboardKey letter={'Z'} state={getKeyState('Z')} onClick={onKeyPress} />
            <KeyboardKey letter={'X'} state={getKeyState('X')} onClick={onKeyPress} />
            <KeyboardKey letter={'C'} state={getKeyState('C')} onClick={onKeyPress} />
            <KeyboardKey letter={'V'} state={getKeyState('V')} onClick={onKeyPress} />
            <KeyboardKey letter={'B'} state={getKeyState('B')} onClick={onKeyPress} />
            <KeyboardKey letter={'N'} state={getKeyState('N')} onClick={onKeyPress} />
            <KeyboardKey letter={'M'} state={getKeyState('M')} onClick={onKeyPress} />
            <KeyboardKey letter={'⌫'} state={letterState.default} onClick={onDeletePress} double />
          </KeyboardRow>
        </div>
      </div>
    </>
  );
}

const isValidLetter = letter => {
  if(!letter || letter.length > 1) {
    return false;
  }

  return /[a-zA-ZöäåÖÄÅ]{1}/.test(letter)
}

const scoreLetter = (letter, correctWord, index) => {
  if(letter === correctWord[index]) {
    return letterState.correct;
  } else if(correctWord.includes(letter)) {
    return letterState.present;
  } else {
    return letterState.absent;
  }
}

const WordRow = ({ word = [], current }) => {
  return (
      <div className={'word-row'}>
        {[...Array(MAX_WORD_LENGTH)].map((_, i) => {
          return <Tile key={i} letter={word[i] && word[i].letter} state={word[i] && word[i].state} />
        })}
      </div>
  );
}

const Tile = ({ letter, state }) => {
  return (
    <div className={`tile ${state ? state : ''}`}>
      {letter}
    </div>
  )
}

const KeyboardRow = ({ inset, children }) => {
  return (
    <div className={'keyboard-row'}>
      {inset ? (<KeyboardKeySpace />) : undefined}
      {children}
      {inset ? (<KeyboardKeySpace />) : undefined}
    </div>
  )
}

const KeyboardKeySpace = _ => {
  return (
    <div style={{ flex: 0.7 }}></div>
  )
}

const KeyboardKey = ({ letter, state, double, noMargin, onClick }) => {
  return (
    <button 
      className={`key ${state}`}
      style={{ flex: double ? 1.5 : 1, margin: noMargin ? 0 : '0 2px 0 2px' }} 
      onClick={_ => onClick && onClick(letter)}
    >
      {letter}
    </button>
  )
}

const Notification = ({ message, delay, onTimeout }) => {
  const [visible, setVisible] = useState(true);
  const [fadeClassName, setFadeClassName] = useState('fade-in');

  useEffect(() => {
    setTimeout(() => {
      setFadeClassName('fade-out');
      setTimeout(() => {
        setVisible(false);
        onTimeout();
      }, NOTIFICATION_FADEOUT)
    }, delay);
  }, [delay]);

  return visible ? (<div className={`notification ${fadeClassName}`}>{message}</div>) : null;
}

const InfoWindow = ({ children }) => {
  return (
    <div className={'info-window'}>
      <div className={'info-window-top-bar'}>
        &#10006;
      </div>
      <div className={'info-window-inner'}>
        {children}
      </div>
    </div>
  )
}

export default App;