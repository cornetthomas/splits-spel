'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';

const Confetti = ({ active }) => {
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            backgroundColor: ['#ffd700', '#ff0000', '#00ff00', '#0000ff', '#ff00ff'][Math.floor(Math.random() * 5)],
            width: '10px',
            height: '10px',
            transform: `rotate(${Math.random() * 360}deg)`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

const NumberSplittingGame = () => {
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const [topScores, setTopScores] = useState([]);

  // Update top scores
  const updateTopScores = (newScore) => {
    if(newScore > 0) {
    setTopScores(prevScores => {
      const newScores = [...prevScores, newScore];
      return newScores
        .sort((a, b) => b - a) // Sort in descending order
        .slice(0, 3); // Keep only top 5
    });
  }
  };
  const [targetNumber, setTargetNumber] = useState(null);
  const [firstNumber, setFirstNumber] = useState(null);
  const [secondNumber, setSecondNumber] = useState(null);

  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Bereken de tijd per vraag op basis van de score
  const getTimePerQuestion = useCallback(() => {
    const baseTime = 30;
    const reductionSteps = Math.floor(score / 10);
    const timeReduction = Math.min(reductionSteps * 5, 25); // Maximum reductie is 25 seconden (minimum 5 seconden over)
    return baseTime - timeReduction;
  }, [score]);

  // Audio elementen
  useEffect(() => {
    const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAiAAAgICAgICAgICAgICBAQEBAQEBAQEBAQGBgYGBgYGBgYGBgYICAgICAgICAgICAoKCgoKCgoKCgoKCgwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg//////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAWAAAAAAAAAIgA4MqUxAAAAAAAAAAAAAAAAAAAA//tQxAADwAABpAAAACAAADSAAAAEkGHgVG7UBRFtAUE4CcDWI0aNnKBU6hzkABmpJ5MwpF6IPMQF8ESwQEpfGT0FRN6X0RAJ4Mby8TzfwXvH3ny4PA8+Fw/i4+vP5fL8v/5fLh8/8TWbv/8TeK/cYxiZnEYg5bEiUV/+1LEBYPAAAGkAAAAIAAANIAAAAQXNPqZ4CGxCkv/EgWIAoFQkCwmBAEEAPB4PB39d/9QBBICDw+H3h84ee+HnuHB4eHh4eHh4eHh8OEYf///+oBA7lAILn///+pAIC/////5QCAICAgIKqqqqqqqqg==');
    audio.preload = 'auto';
    return () => audio.remove();
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning]);

  // Speel geluid af
  const playCorrectSound = useCallback(() => {
    const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAiAAAgICAgICAgICAgICBAQEBAQEBAQEBAQGBgYGBgYGBgYGBgYICAgICAgICAgICAoKCgoKCgoKCgoKCgwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg//////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAWAAAAAAAAAIgA4MqUxAAAAAAAAAAAAAAAAAAAA//tQxAADwAABpAAAACAAADSAAAAEkGHgVG7UBRFtAUE4CcDWI0aNnKBU6hzkABmpJ5MwpF6IPMQF8ESwQEpfGT0FRN6X0RAJ4Mby8TzfwXvH3ny4PA8+Fw/i4+vP5fL8v/5fLh8/8TWbv/8TeK/cYxiZnEYg5bEiUV/+1LEBYPAAAGkAAAAIAAANIAAAAQXNPqZ4CGxCkv/EgWIAoFQkCwmBAEEAPB4PB39d/9QBBICDw+H3h84ee+HnuHB4eHh4eHh4eHh8OEYf///+oBA7lAILn///+pAIC/////5QCAICAgIKqqqqqqqqg==');
    audio.play().catch(console.error);
  }, []);

  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  const handleTimeUp = () => {
    setIsTimerRunning(false);
    updateTopScores(score);
    if (isTopScore(score)) {
        setShowConfetti(true);
    }
    setShowTimeUpDialog(true);
  };

  const newGame = () => {
    setScore(0);
    generateNewNumbers();
  };

  // Genereer nieuwe getallen
  const generateNewNumbers = () => {
    const newTarget = Math.floor(Math.random() * 10) + 1;
    const newFirst = Math.floor(Math.random() * (newTarget + 1));
    setTargetNumber(newTarget);
    setFirstNumber(newFirst);
    setSecondNumber(null);
    setShowSuccess(false);
    setShowConfetti(false);
    setTimeLeft(getTimePerQuestion());
    setIsTimerRunning(true);
  };

  // Start het spel
  useEffect(() => {
    generateNewNumbers();
  }, []);

  const isTopScore = (score) => {

    // Get the highest score in the top 3
    const lowestTopScore = Math.max(...topScores);
  
    // If the new score is higher than the highest top score, it's a top score
    return score > lowestTopScore;
  };

  // Controleer of de splitsing correct is en ga door naar volgende vraag
  const checkSplit = (selectedNumber) => {
    setSecondNumber(selectedNumber);
    setIsTimerRunning(false);
    
    if (firstNumber + selectedNumber === targetNumber) {
      const newScore = score + 1;
      setScore(newScore);
      setShowSuccess(true);
      playCorrectSound();
      setTimeout(() => {
        generateNewNumbers();
      }, 1000);
    } else {
      setScore(Math.max(0, score - 1));
      setShowWrongAnswer(true);
      setTimeout(() => {
        setShowWrongAnswer(false);
        setIsTimerRunning(true);
      }, 500);
    }
  };

  // Genereer numerieke knoppen
  const renderNumberButtons = () => {
    const buttons = [];
    for (let i = 0; i <= 10; i++) {
      buttons.push(
        <Button
          key={i}
          onClick={() => checkSplit(i)}
          variant="outline"
          className="w-12 h-12 text-xl font-bold"
          disabled={!isTimerRunning}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6">
      <style jsx global>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        .animate-confetti {
          animation: confetti 5s ease-in-out forwards;
        }
        @keyframes wrongAnswer {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(239, 68, 68, 0.2); }
        }
        .wrong-answer {
          animation: wrongAnswer 0.5s ease-in-out;
        }

        @keyframes correctAnswer {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(34, 197, 94, 0.2); }
        }
        .correct-answer {
          animation: correctAnswer 0.5s ease-in-out;
        }
      `}</style>
    <Confetti active={showConfetti} />

      
      <Card className={`w-full max-w-md relative overflow-hidden ${showWrongAnswer ? 'wrong-answer' : ''} ${showSuccess ? 'correct-answer' : ''} mb-4`}>

        <CardContent className="p-6">

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Getallen Splitsen</h2>
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-1">Score</p>
              <p className="text-xl font-bold">{score}</p>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Tijd over:</span>
                <span>{timeLeft} seconden</span>
              </div>
              <Progress 
                value={(timeLeft / getTimePerQuestion()) * 100} 
                className="h-2"
              />
            </div>
          </div>

          {targetNumber && (
            <div className="text-center mb-6">
              <p className="text-xl font-bold mb-2">Splits het getal</p>
              <p className="text-6xl font-bold text-blue-600">{targetNumber}</p>
              <div className="flex justify-center items-center space-x-4 mt-4">
                <div className="w-16 h-16 flex items-center justify-center text-2xl font-bold border-2 border-gray-300 rounded">
                  {firstNumber}
                </div>
                <span className="text-2xl">+</span>
                <div className="w-16 h-16 flex items-center justify-center text-2xl font-bold border-2 border-gray-300 rounded">
                  {secondNumber !== null ? secondNumber : '?'}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2 mb-6">
            {renderNumberButtons()}
          </div>

    
        </CardContent>
      </Card>

      {/* Add this after your main game Card */}
<Card className="w-full max-w-md p-4">
  <h3 className="text-xl font-bold text-center mb-4 flex items-center justify-center">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-6 w-6 text-yellow-400 mr-2" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
    TopScores
  </h3>
  <div className="space-y-2">
    {topScores.length > 0 ? (
      topScores.map((score, index) => (
        <div 
          key={index}
          className={`flex items-center justify-between p-2 rounded ${
            index === 0 ? 'bg-yellow-100' :
            index === 1 ? 'bg-gray-100' :
            index === 2 ? 'bg-orange-100' :
            'bg-white'
          }`}
        >
          <div className="flex items-center">
            <span className="font-bold text-lg w-8">{index + 1}.</span>
            <span className="text-lg">{score} punten</span>
          </div>
          {index === 0 && <span className="text-yellow-600">🏆</span>}
          {index === 1 && <span>🥈</span>}
          {index === 2 && <span>🥉</span>}
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500">Nog geen scores</p>
    )}
  </div>
</Card>

      <AlertDialog open={showTimeUpDialog} onOpenChange={setShowTimeUpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isTopScore ? "Super! Nieuwe topscore!" : "Tijd is op!"}</AlertDialogTitle>
            <AlertDialogDescription>
              Wil je een nieuw spel starten?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stoppen</AlertDialogCancel>
            <AlertDialogAction onClick={newGame}>
              Nieuw Spel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NumberSplittingGame;