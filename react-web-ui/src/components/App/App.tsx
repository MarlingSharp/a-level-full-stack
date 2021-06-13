import React from 'react';
import usePlayers from '../../api/usePlayers';

const App: React.FunctionComponent = () => {
  const { players } = usePlayers();

  return (
    <div>
      <h1>Full Stack Demo App</h1>
      {players.map(({ name, favouriteGame }) => <div>
        <p>{name}</p>
        <p>{favouriteGame}</p>
      </div>)}
    </div>
  );
}

export default App;
