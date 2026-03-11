import Visualizer from './Visualizer'; // Import the new component
import '../src/Player.css';         // Import the hover effects

const Player = () => {
  const audioRef = useRef(null);

  return (
    <div className="player-bar">
      {/* 1. The Visualizer (Pass the audio reference) */}
      <div className="visualizer-container">
        <Visualizer audioRef={audioRef} />
      </div>

      {/* 2. The Progress/Seek Bar (Add the smooth hover classes) */}
      <div className="progress-container">
         <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>

      {/* 3. The Volume Control (Add the unrolling slider wrapper) */}
      <div className="volume-control">
        <SpeakerIcon />
        <div className="volume-slider-wrapper">
           <input type="range" className="volume-slider" />
        </div>
      </div>
      
      <audio ref={audioRef} src={currentSong.url} />
    </div>
  );
};
