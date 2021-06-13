import React from 'react';
import Player from 'shared/dist/Player';
import axios from 'axios';

interface AddPlayerAction {
    type: 'add',
    player: Player
}

interface SetPlayersAction {
    type: 'set',
    players: Player[]
}

type PlayerAction = AddPlayerAction | SetPlayersAction;

const playerReducer = (players: Player[], playerAction: PlayerAction): Player[] => {
    switch (playerAction.type) {
        case 'set':
            return playerAction.players;
        case 'add':
            return [playerAction.player, ...players];
    }
}

interface UsePlayers {
    players: Player[];

    addPlayer: (name: string, favouriteGame: string) => void;
}

const usePlayers = (): UsePlayers => {
    const [players, dispatch] = React.useReducer(playerReducer, []);

    const setPlayers = React.useCallback((players: Player[]) => dispatch({ type: 'set', players }), []);

    const addPlayer = React.useCallback((name: string, favouriteGame: string) => {
        dispatch({ type: 'add', player: { name, favouriteGame } })
    }, []);

    React.useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_HOST}/players`).then(({ data }) => {
            console.log('Data Received', data);
            setPlayers(data);
        })
    }, [])

    return {
        players,
        addPlayer
    }
}

export default usePlayers;