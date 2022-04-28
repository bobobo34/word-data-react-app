import { useState, useEffect } from 'react';
import RandomWord from './RandomWord';
import Axios from 'axios';
const data = require('../words_dictionary.json');

// Axios.defaults.withCredentials = true;
function WordWrapper() {
    const [word, getWord] = useState({word:Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)]});
    const insertIntoData = async (type) => {
        let easy = 0, medium = 0, hard = 0, impossible = 0;
        console.log(word.word, type);
        if(type === 'easy') { easy++; }
        else if(type === 'medium') { medium++; }
        else if(type === 'hard') { hard++; }
        else { impossible++; }
        console.log(easy + " " + medium + " " + hard + " " + impossible);
        
        Axios.post('https://word-data-database.herokuapp.com/api/insert', {
            word: word.word, 
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
    useEffect(() => {
        const rw = document.getElementsByClassName("random-word")[0];

        console.log("word changed" + " " + rw);
    }, [word]);
    const test = async () => {
        let results = await Axios.get('https://word-data-database.herokuapp.com/api/get', {
            params: {word: word.word} 
        }); 
        console.log(results); 
        console.log(results.data);
        console.log(results.data.length == 0);
    }
    return (
        <div className='container'> 
            <button onClick={test}>test</button>        
            <RandomWord word={word.word}/>
            <button className="EnterButton" style={{backgroundColor: 'green'}} onClick={() => insertIntoData("easy")}>
                easy
            </button>
            <div className='space'></div>
            <button className="EnterButton" style={{backgroundColor: 'yellow'}} onClick={() => insertIntoData("medium")}>
                medium
            </button>
            <div className='space'></div>
            <button className="EnterButton" style={{backgroundColor: '#ca6561'}} onClick={() => insertIntoData("hard")}>
                hard
            </button>
            <div className='space'></div>
            <button className="EnterButton" style={{backgroundColor: 'red'}} onClick={() => insertIntoData("impossible")}>
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