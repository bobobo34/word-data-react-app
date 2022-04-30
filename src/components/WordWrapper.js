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
        
        await Axios.post('https://word-data-database.herokuapp.com/api/insert', {
            word: word.word, 
            easy: easy,
            medium: medium,
            hard: hard,
            impossible: impossible
        }); 

        let results = await Axios.get('https://word-data-database.herokuapp.com/api/get', {
            params: {word: word.word} 
        }); 
        console.log(results.data.length === 0 ? console.log("new data") : console.log("data found"));
        
        
        newWord();
    }
    const newWord = async () => {
        async function delay(ms) {
            // return await for better async stack trace support in case of errors.
            return await new Promise(resolve => setTimeout(resolve, ms));
        }
        switchOpacity();
        await delay(700);
        getWord({word:Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)]});
        switchOpacity();
        await delay(700);
    };
    const switchOpacity = async () => {
        const rw = document.querySelector(".random-word");
        function setOpacity(callback, delay, repetitions) {
            var x = 0;
            var intervalID = window.setInterval(function () {
        
               callback();
               if (++x === repetitions) {
                   window.clearInterval(intervalID);
               }
            }, delay);
        }
        var op = parseInt(window.getComputedStyle(rw).getPropertyValue("opacity"));
        console.log(`opacity: ${op}`);
        switch(op) {
            case 1: {
                setOpacity(function(){
                    op -= 0.01;
                    rw.style.opacity = op.toString();
                    //console.log(parseInt(window.getComputedStyle(rw).getPropertyValue("opacity")));
                }, 0.1, 100);
                break;
            }
            case 0: {
                setOpacity(function(){
                    op += 0.01;
                    rw.style.opacity = op.toString();
                    //.log(parseInt(window.getComputedStyle(rw).getPropertyValue("opacity")));
                }, 0.1, 100);
                break;
            }
            default: {
                console.log("error in swithc");
                break;
            }
        }
        console.log(window.getComputedStyle(rw).getPropertyValue("opacity"));

    }
    useEffect(() => {
        const rw = document.getElementsByClassName("random-word")[0];
        console.log(`word changed to ${rw.textContent}`);
        rw.style.width = `${rw.textContent.length}ch`;
    }, [word]);

    return (
        <div>        
            <div className='container'>
                <RandomWord word={word.word} />
            </div>
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