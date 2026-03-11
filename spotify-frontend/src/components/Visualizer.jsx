import React, { useRef, useEffect } from 'react';

const Visualizer = ({ audioRef, isPlaying }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current || !isPlaying) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    // Initialize Audio Context on first play
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      analyserRef.current.fftSize = 64; // Number of bars
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Gradient for a premium look
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#1DB954'); // Spotify Green
        gradient.addColorStop(1, '#1ed760'); // Lighter Green

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#1DB954';
        
        // Rounded bar effect
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    };

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, audioRef]);

  return (
    <canvas 
      ref={canvasRef} 
      className="visualizer-canvas" 
      width="150" 
      height="40" 
    />
  );
};

export default Visualizer;
