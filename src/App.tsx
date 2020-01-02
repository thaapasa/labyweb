import React from 'react';
import styled from 'styled-components';
import { Size } from './data/types';
import { LabyrinthRenderer } from './LabyrinthRenderer';

const getWindowSize = (): Size => ({
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: window.devicePixelRatio || 1,
});

const App: React.FC = () => {
  const [size, setSize] = React.useState<Size>(getWindowSize());
  React.useEffect(() => {
    const listener = () => setSize(getWindowSize());
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, []);
  return (
    <Container data-testid="container">
      <LabyrinthRenderer {...size} />
      <SizeContainer>
        {size.width * size.pixelRatio} x {size.height * size.pixelRatio}
      </SizeContainer>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
`;

const SizeContainer = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 35px #fff,
    0 0 40px #fff, 0 0 45px #fff;
  z-index: 1;
`;

export default App;
