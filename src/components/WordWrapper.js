import { useState } from 'react';
import RandomWord from './RandomWord';
import Axios from 'axios';
const data = require('../words_dictionary.json');


function WordWrapper(props) {
    const [word, getWord] = useState({word:Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)]});
    const insertIntoData = () => {
        const ranWord = document.getElementsByClassName("random-word")[0];
        const word = ranWord.textContent;
        let easy = 0, medium = 0, hard = 0, impossible = 0;
        console.log(word, props.name);
        if(props.name === 'easy') { easy++; }
        else if(props.name === 'medium') { medium++; }
        else if(props.name === 'hard') { hard++; }
        else { impossible++; }
        Axios.post('https://word-data-database.herokuapp.com/api/insert', {
            word: word, 
            easy: easy,
            medium: medium,
            hard: hard,
            impossible: impossible
        });
        newWord();
    }
    const newWord = () => {
        getWord({word:Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)]});
    };

    return (
        <div>
            <RandomWord word={word.word}/>
            <button className="EnterButton" style={{backgroundColor: 'green'}} onClick={insertIntoData}>
                easy
            </button>
            <div className='space'></div>
            <button className="EnterButton" style={{backgroundColor: 'yellow'}} onClick={insertIntoData}>
                medium
            </button>
            <div className='space'></div>
            <button className="EnterButton" style={{backgroundColor: '#ca6561'}} onClick={insertIntoData}>
                hard
            </button>
            <div className='space'></div>
            <button className="EnterButton" style={{backgroundColor: 'red'}} onClick={insertIntoData}>
                impossible
            </button>
        </div>
    );
}
/* <div className='space'></div>
<EnterButton wChanger={newWord} name="medium" style={{backgroundColor: 'yellow'}}/>
<div className='space'></div>
<EnterButton wChanger={newWord} name="hard" style={{backgroundColor: '#ca6561'}}/>
<div className='space'></div>
<EnterButton wChanger={newWord} name="impossible" style={{backgroundColor: 'Red'}}/> */

export default WordWrapper;