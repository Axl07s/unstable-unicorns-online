import { useState, useEffect } from 'react';
import styled from 'styled-components';
import ImageLoader from './assets/card/imageLoader';
import BG from './assets/ui/board-background.jpg';
import { Card } from './game/card';
import { UnstableUnicornsGame } from './game/game';
import { PlayerID } from './game/player';

type Props = {
    G: UnstableUnicornsGame,
    babyCards: Card[],
    playerID: PlayerID,
    moves: any,
};

const BoardGameBegin = (props: Props) => {
    const [playerName, setPlayerName] = useState<string>(() => localStorage.getItem('unstable-unicorns-player-name') || "Player");

    useEffect(() => {
        props.moves.changeName(props.playerID, playerName);
    }, [props.playerID, props.moves]);

    const mySelection = props.G.babyStarter.find(s => s.owner === props.playerID);
    const isReady = props.G.ready[props.playerID] === true;

    return (
        <Wrapper>
            <Container>
                <MainPanel>
                    <Title>Set Your Identity</Title>
                    <InputGroup>
                        <StyledInput 
                            type="text" 
                            name="name" 
                            value={playerName} 
                            placeholder="Enter your name..."
                            onChange={(evt) => {
                                const val = evt.target.value;
                                setPlayerName(val);
                                localStorage.setItem('unstable-unicorns-player-name', val);
                                props.moves.changeName(props.playerID, val);
                            }} 
                        />
                        <StyledButton onClick={() => props.moves.changeName(props.playerID, playerName)}>
                            Save Name
                        </StyledButton>
                    </InputGroup>

                    <Title style={{ marginTop: '0.5em' }}>Choose Your Baby Unicorn</Title>
                    <Subtitle>Select the unicorn that will start in your stable</Subtitle>

                    <CardGrid>
                        {props.babyCards.map(card => {
                            const t = props.G.babyStarter.find(f => f.cardID === card.id);
                            const selected = t !== undefined && t.owner === props.playerID;
                            const takenByOther = t !== undefined && t.owner !== props.playerID;
                            const ownerName = t !== undefined ? (props.G.players[parseInt(t.owner)]?.name || `Player ${t.owner}`) : "";

                            return (
                                <CardWrapper 
                                    key={card.id}
                                    $selected={selected}
                                    $takenByOther={takenByOther}
                                    $anySelected={mySelection !== undefined}
                                    onClick={() => {
                                        if (t !== undefined) return; // Already taken
                                        if (mySelection !== undefined) return; // Can only select one
                                        props.moves.selectBaby(props.playerID, card.id);
                                    }}
                                >
                                    {selected && <SelectionBadge>✓</SelectionBadge>}
                                    <CardImage src={ImageLoader.load(card.image)} alt={card.title} />
                                    {takenByOther && <TakenBadge>Chosen by {ownerName}</TakenBadge>}
                                </CardWrapper>
                            );
                        })}
                    </CardGrid>

                    {mySelection !== undefined && (
                        <ReadyButton 
                            $ready={isReady}
                            onClick={() => props.moves.ready(props.playerID)}
                            disabled={isReady}
                        >
                            {isReady ? "Waiting for other players..." : "Click here when ready!"}
                        </ReadyButton>
                    )}
                </MainPanel>
            </Container>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    background-image: url(${BG});
    background-size: cover;
    background-position: center;
    position: relative;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2em;
    box-sizing: border-box;
`;

const Container = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin: auto;
`;

const MainPanel = styled.div`
    background: rgba(30, 41, 59, 0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    max-width: 900px;
    padding: 3em;
    border-radius: 24px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const Title = styled.h1`
    font-family: 'Outfit', 'Inter', sans-serif;
    color: white;
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 0.5em 0;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const Subtitle = styled.p`
    font-family: 'Outfit', 'Inter', sans-serif;
    color: #94a3b8;
    font-size: 14px;
    margin: 0 0 1.5em 0;
`;

const InputGroup = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 2em;
    width: 100%;
    max-width: 450px;
`;

const StyledInput = styled.input`
    flex: 1;
    padding: 12px 20px;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    font-size: 16px;
    color: white;
    outline: none;
    transition: all 0.3s ease;
    font-family: inherit;

    &:focus {
        border-color: #ec4899;
        box-shadow: 0 0 10px rgba(236, 72, 153, 0.3);
        background: rgba(15, 23, 42, 0.8);
    }
`;

const StyledButton = styled.button`
    padding: 12px 24px;
    background: linear-gradient(135deg, #ec4899, #8b5cf6);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
    font-family: inherit;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
    }

    &:active {
        transform: translateY(0);
    }
`;

const CardGrid = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 1em;
    margin-bottom: 2.5em;
    width: 100%;
`;

const CardWrapper = styled.div<{ $selected: boolean; $takenByOther: boolean; $anySelected: boolean }>`
    position: relative;
    width: 90px;
    min-width: 90px;
    cursor: ${props => props.$takenByOther ? 'not-allowed' : 'pointer'};
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    border-radius: 16px;
    padding: 3px;
    background: ${props => 
        props.$selected ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent'
    };
    box-shadow: ${props => 
        props.$selected ? '0 0 20px rgba(236, 72, 153, 0.6)' : 'none'
    };
    opacity: ${props => 
        props.$takenByOther ? 0.35 : 
        (props.$anySelected && !props.$selected ? 0.5 : 1)
    };
    transform: ${props => props.$selected ? 'translateY(-6px)' : 'none'};

    &:hover {
        transform: ${props => props.$takenByOther ? 'none' : 'translateY(-8px) scale(1.08)'};
        box-shadow: ${props => 
            props.$takenByOther ? 'none' : 
            (props.$selected ? '0 0 25px rgba(236, 72, 153, 0.8)' : '0 10px 20px rgba(0, 0, 0, 0.3)')
        };
        opacity: 1;
    }
`;

const CardImage = styled.img`
    width: 100%;
    border-radius: 12px;
    display: block;
`;

const SelectionBadge = styled.div`
    position: absolute;
    top: -8px;
    right: -8px;
    background: #4ade80;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    border: 2px solid white;
    z-index: 10;
`;

const TakenBadge = styled.div`
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 23, 42, 0.95);
    color: #94a3b8;
    font-size: 8px;
    padding: 3px 8px;
    border-radius: 9999px;
    border: 1px solid rgba(255,255,255,0.1);
    white-space: nowrap;
    z-index: 10;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;

const ReadyButton = styled.button<{ $ready: boolean }>`
    width: 100%;
    max-width: 340px;
    padding: 16px;
    background: ${props => props.$ready 
        ? 'rgba(74, 222, 128, 0.15)' 
        : 'linear-gradient(135deg, #ec4899, #8b5cf6)'
    };
    border: 1px solid ${props => props.$ready ? '#4ade80' : 'transparent'};
    color: ${props => props.$ready ? '#4ade80' : 'white'};
    font-size: 16px;
    font-weight: 700;
    border-radius: 16px;
    cursor: ${props => props.$ready ? 'default' : 'pointer'};
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: ${props => props.$ready 
        ? 'none' 
        : '0 8px 24px rgba(236, 72, 153, 0.3)'
    };
    font-family: inherit;
    letter-spacing: 0.5px;

    &:hover {
        transform: ${props => props.$ready ? 'none' : 'translateY(-3px)'};
        box-shadow: ${props => props.$ready 
            ? 'none' 
            : '0 12px 30px rgba(236, 72, 153, 0.45)'
        };
    }

    &:active {
        transform: translateY(0);
    }
`;

export default BoardGameBegin;