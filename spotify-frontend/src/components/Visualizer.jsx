const AudioVisualizer = ({ audioRef }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audioRef.current);
    const analyser = audioContext.createAnalyser();

    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 64; // Small number for thick, clean bars

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      dataArray.forEach(item => {
        const barHeight = item / 2;
        ctx.fillStyle = `rgba(29, 185, 84, ${item / 255})`; // Spotify Green with dynamic opacity
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [audioRef]);

  return <canvas ref={canvasRef} width="300" height="50" style={{ borderRadius: '4px' }} />;
};
