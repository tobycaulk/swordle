import { useEffect, useState, useRef } from 'react';
import { use100vh } from 'react-div-100vh';
import './App.css';

const MAX_WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const App = () => {
  const [words, setWords] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameBoardHeight, setGameBoardHeight] = useState(500);
  const [correctWord, setCorrectWord] = useState('');
  const gameBoardRef = useRef(null);

  const height = use100vh();
  
  const getWord = _ => {
    let word = words[currentRow];
    if(!word) {
      word = [];
    } else if(word.length >= MAX_WORD_LENGTH) {
      word = word.slice(0, MAX_WORD_LENGTH);
    }

    return word;
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

    word.push(letter);
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

  useEffect(() => {
    setGameBoardHeight(gameBoardRef.current.clientHeight);
  });

  useEffect(() => {
    fetch('https://9b57-98-27-159-174.ngrok.io/word')
      .then(res => res.json())
      .then(
        (result) => {
          setCorrectWord(result.word);
        },
        (error) => {
          console.error(error);
        })
  }, []);

  return (
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
          <KeyboardKey letter={'Q'} onClick={onKeyPress} />
          <KeyboardKey letter={'W'} onClick={onKeyPress} />
          <KeyboardKey letter={'E'} onClick={onKeyPress} />
          <KeyboardKey letter={'R'} onClick={onKeyPress} />
          <KeyboardKey letter={'T'} onClick={onKeyPress} />
          <KeyboardKey letter={'Y'} onClick={onKeyPress} />
          <KeyboardKey letter={'U'} onClick={onKeyPress} />
          <KeyboardKey letter={'I'} onClick={onKeyPress} />
          <KeyboardKey letter={'O'} onClick={onKeyPress} />
          <KeyboardKey letter={'P'} onClick={onKeyPress} />
          <KeyboardKey letter={'Å'} onClick={onKeyPress} />
        </KeyboardRow>
        <KeyboardRow>
          <KeyboardKey letter={'A'} onClick={onKeyPress} />
          <KeyboardKey letter={'S'} onClick={onKeyPress} />
          <KeyboardKey letter={'D'} onClick={onKeyPress} />
          <KeyboardKey letter={'F'} onClick={onKeyPress} />
          <KeyboardKey letter={'G'} onClick={onKeyPress} />
          <KeyboardKey letter={'H'} onClick={onKeyPress} />
          <KeyboardKey letter={'J'} onClick={onKeyPress} />
          <KeyboardKey letter={'K'} onClick={onKeyPress} />
          <KeyboardKey letter={'L'} onClick={onKeyPress} />
          <KeyboardKey letter={'Ö'} onClick={onKeyPress} />
          <KeyboardKey letter={'Ä'} onClick={onKeyPress} />
        </KeyboardRow>
        <KeyboardRow inset>
          <KeyboardKey letter={'↵'} double />
          <KeyboardKey letter={'Z'} onClick={onKeyPress} />
          <KeyboardKey letter={'X'} onClick={onKeyPress} />
          <KeyboardKey letter={'C'} onClick={onKeyPress} />
          <KeyboardKey letter={'V'} onClick={onKeyPress} />
          <KeyboardKey letter={'B'} onClick={onKeyPress} />
          <KeyboardKey letter={'N'} onClick={onKeyPress} />
          <KeyboardKey letter={'M'} onClick={onKeyPress} />
          <KeyboardKey letter={'⌫'} onClick={onDeletePress} double />
        </KeyboardRow>
      </div>
    </div>
  );
}

const isValidLetter = letter => {
  if(!letter || letter.length > 1) {
    return false;
  }

  return /[a-zA-ZöäåÖÄÅ]{1}/.test(letter)
};

const WordRow = ({ word = [], wordState = [], current }) => {
  return (
      <div className={'word-row'}>
        {[...Array(MAX_WORD_LENGTH)].map((_, i) => {
          return <Tile key={i} />
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
    <div style={{ flex: 0.65 }}></div>
  )
}

const KeyboardKey = ({ letter, double, noMargin, onClick }) => {
  return (
    <button className={`key`} style={{ flex: double ? 1.5 : 1, margin: noMargin ? 0 : '0 6px 0 0' }} onClick={_ => onClick && onClick(letter)}>
      {letter}
    </button>
  )
}

export default App;