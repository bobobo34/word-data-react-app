import { useState, useEffect } from 'react';
import RandomWord from './RandomWord';
import Axios from 'axios';
import PercentBar from './PercentBar';
const data = require('../words_dictionary.json');

// Axios.defaults.withCredentials = true;
function WordWrapper() {
    const [word, getWord] = useState({word:Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)]});
    const [easyHeight, changeEasyHeight] = useState('0%');
    const [mediumHeight, changeMediumHeight] = useState('0%');
    const [hardHeight, changeHardHeight] = useState('0%');
    const [impossibleHeight, changeImpossibleHeight] = useState('0%');
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

        
        let data = undefined;

        while(data === undefined) {
            data = await getFromDatabase(word.word);
        }
        console.log(data);
        
        let total = data.easy + data.medium + data.hard + data.impossible;
        
        changeEasyHeight(`${data.easy / total * 100}%`);
        changeMediumHeight(`${data.medium / total * 100}%`);
        changeHardHeight(`${data.hard / total * 100}%`);
        changeImpossibleHeight(`${data.impossible / total * 100}%`);
        
        fadeBarsIn(total, data);

        //newWord();
    }
    const getFromDatabase = async (word) => {
        let results = await Axios.get('https://word-data-database.herokuapp.com/api/get', {
            params: {word: word} 
        });
        return results.data[0];
    }
    const fadeBarsIn = (total, data) => {
        console.log(total);
        const percentBars = document.querySelectorAll(".percentBarContainer");       
        percentBars.forEach(bar => bar.style.animation = "fadeIn 1s ease 0s forwards");
        const words = document.querySelectorAll(".percentage");
        words.forEach((word, index) => {
            console.log(word + ' ' + index);
            let pct = index === 0 ? data.easy / total * 100 : index === 1 ? data.medium / total * 100 : index === 2 ? data.hard / total * 100 : data.impossible / total * 100;
            word.textContent = `${Math.round(pct)}%`;
            word.style.animation = "fadeIn 0.75s ease 0s forwards";
        })
        const bars = document.querySelectorAll(".percentBar");
        bars.forEach(bar => bar.style.animation = "barUp 1s ease 0s forwards");
    }
    const fadeBarsOut = () => {
        const percentBars = document.querySelectorAll(".percentBarContainer");       
        percentBars.forEach(bar => bar.style.animation = "fadeIn 1s ease 0s forwards reverse");
        const words = document.querySelectorAll(".percentage");
        words.forEach(word => word.style.animation = "fadeIn 0.75s ease 0s forwards reverse");
        const bars = document.querySelectorAll(".percentBar");
        bars.forEach(bar => bar.style.animation = "barUp 1s ease 0s forwards reverse");
    }
    const newWord = async () => {
        async function delay(ms) {
            // return await for better async stack trace support in case of errors.
            return await new Promise(resolve => setTimeout(resolve, ms));
        }
        const rw = document.querySelector(".random-word")
        rw.style.opacity = '0%';
        
        getWord({word:Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)]});
        
        fadeBarsOut();

        await delay(1000);

        rw.style.opacity = '100%';
        
    };
    
    useEffect(() => {
        const rw = document.getElementsByClassName("random-word")[0];
        console.log(`word changed to ${rw.textContent}`);
        rw.style.width = `${rw.textContent.length}ch`;
    }, [word]);

    return (
        <div>        
            <div className='container'>
                <RandomWord word={word.word} />
                <p>Is this word easy, medium, hard, or impossible?</p>
            </div>
            <div className='lowerContainer'>
                <div className='buttonContainer'>
                    <button className="EnterButton" style={{backgroundColor: 'green'}} onClick={() => insertIntoData("easy")}>
                        easy
                    </button>
                    <p className='percentage' />
                    <PercentBar height={easyHeight}/>
                </div>
                <div className='buttonContainer'>    
                    <button className="EnterButton" style={{backgroundColor: 'yellow'}} onClick={() => insertIntoData("medium")}>
                        medium
                    </button>
                    <p className='percentage' />
                    <PercentBar height={mediumHeight}/>
                </div>
                <div className='buttonContainer'>      
                    <button className="EnterButton" style={{backgroundColor: '#ca6561'}} onClick={() => insertIntoData("hard")}>
                        hard
                    </button>
                    <p className='percentage' />
                    <PercentBar height={hardHeight}/>
                </div>
                <div className='buttonContainer'>
                    <button className="EnterButton" style={{backgroundColor: 'red'}} onClick={() => insertIntoData("impossible")}>
                        impossible
                    </button> 
                    <p className='percentage' />
                    <PercentBar height={impossibleHeight}/>              
                </div>            
            </div>
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