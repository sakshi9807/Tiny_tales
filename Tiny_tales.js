import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function WordFrequencyCounter() {
  const [words, setWords] = useState([]);
  const [histogramData, setHistogramData] = useState([]);

  const fetchText = async () => {
    const response = await fetch('https://www.terriblytinytales.com/test.txt');
    const text = await response.text();
    return text;
  }

  const countWords = (text) => {
    const wordsArray = text.toLowerCase().match(/[a-z]+/g);
    const wordsCount = {};
    wordsArray.forEach((word) => {
      if (wordsCount[word]) {
        wordsCount[word]++;
      } else {
        wordsCount[word] = 1;
      }
    });
    const sortedWords = Object.keys(wordsCount).sort((a, b) => wordsCount[b] - wordsCount[a]);
    const top20Words = sortedWords.slice(0, 20).map((word) => ({ word: word, count: wordsCount[word] }));
    setWords(top20Words);
    setHistogramData(top20Words);
  }

  const handleButtonClick = async () => {
    const text = await fetchText();
    countWords(text);
  }

  const handleExportClick = () => {
    const csvData = "data:text/csv;charset=utf-8," + words.map((word) => `${word.word},${word.count}`).join("\n");
    const encodedUri = encodeURI(csvData);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "word_frequency.csv");
    document.body.appendChild(link);
    link.click();
  }

  return (
    <div>
      <button onClick={handleButtonClick}>Submit</button>
      {words.length > 0 &&
        <div>
          <BarChart width={600} height={400} data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
          <button onClick={handleExportClick}>Export</button>
        </div>
      }
    </div>
  );
}

export default WordFrequencyCounter;