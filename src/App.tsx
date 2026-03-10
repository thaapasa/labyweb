import { useEffect, useState, type FC } from 'react';
import { Size } from './data/types';
import { LabyrinthRenderer } from './LabyrinthRenderer';

const getWindowSize = (): Size => ({
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: window.devicePixelRatio || 1,
});

const App: FC = () => {
  const [size, setSize] = useState<Size>(getWindowSize());
  useEffect(() => {
    const listener = () => setSize(getWindowSize());
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, []);
  return (
    <div className="container">
      <LabyrinthRenderer {...size} />
      <div className="size-display">
        {size.width * size.pixelRatio} x {size.height * size.pixelRatio}
      </div>
    </div>
  );
};

export default App;
