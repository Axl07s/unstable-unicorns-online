import styled, { css } from 'styled-components';
import type { Player, PlayerID } from "../game/player";
import ImageLoader from '../assets/card/imageLoader';
import { _typeToColor } from './util';
import type { Card, CardID } from '../game/card';
import useDynamicRefs from 'use-dynamic-refs';
import React, { RefObject, useContext, useImperativeHandle, useState } from 'react';
import CardHover from './CardHover';
import { motion } from 'framer-motion';
import useSound from 'use-sound';
import { cardDescription } from '../BoardUtil';
import { LanguageContext } from '../LanguageContextProvider';
const HubMouseOverSound = require('../assets/sound/Hub_Mouseover.ogg').default;

type Props = {
    players: Player[];
    stable: { [key: string]: Card[] };
    highlightMode?: CardID[];
    upgradeDowngradeStable: { [key: string]: Card[] };
    currentPlayer: PlayerID;
    handCount: number[];
    onStableCardClick: (cardID: CardID) => void;
    onStableCardMouseEnter: (cardID: CardID) => void;
    onStableCardMouseLeave: (cardID: CardID) => void;
    onPlayerClick: (playerID: PlayerID) => void;
    onHandClick: (playerID: PlayerID) => void;
}

export type PlayerFieldHandle = {
    getStableItemRef: (cardID: CardID) => RefObject<HTMLDivElement>; 
}

const PlayerField = React.forwardRef<PlayerFieldHandle, Props>((props, ref) => {
    const [getItemRefs, setItemRefs] = useDynamicRefs();
    const [showHover, setShowHover] = useState<undefined | CardID>(undefined);
    const [playHubMouseOverSound] = useSound(HubMouseOverSound, {
        volume: 0.2,
    });
    const context = useContext(LanguageContext)

    useImperativeHandle(ref, () => ({
        getStableItemRef: (cardID: CardID) => {
            return getItemRefs(`${cardID}`) as any;
        }
    }));

    return (
        <Wrapper>
            {props.players.map((pl, idx) => {
                return (
                    <PlayerBox key={pl.id} current={pl.id === props.currentPlayer}>
                        <InnerBox current={pl.id === props.currentPlayer} onClick={() => props.onPlayerClick(pl.id)}>
                            <Title>
                                <div>
                                    {pl.name}
                                </div>
                                <div style={{ position: "absolute", right: "0.6em", backgroundColor: "rgba(255,255,255,0.2)", width: "23px", height: "30px", borderRadius: "4px", transform: "rotate(14deg) translate(3px,0)" }}>

                                </div>
                                <div style={{ position: "absolute", right: "0.6em", backgroundColor: "rgba(255,255,255,0.1)", width: "23px", height: "30px", borderRadius: "4px", transform: "rotate(23deg) translate(6px,0)" }}>

                                </div>
                                <CardCounter onClick={() => props.onHandClick(pl.id)}>
                                    {props.handCount[parseInt(pl.id)]}
                                </CardCounter>
                            </Title>
                            <UpgradeDowngradeStable>
                                {props.upgradeDowngradeStable[pl.id].map(c => {
                                    return (
                                        <div 
                                            key={c.id}
                                            ref={setItemRefs(`${c.id}`) as any} 
                                            style={{ position: "relative" }} onMouseEnter={() => {
                                                playHubMouseOverSound();
                                                setShowHover(c.id);
                                            }}
                                            onMouseLeave={() => {
                                                setShowHover(undefined);
                                            }}>
                                            <UpgradeDowngradeImage key={c.id} isTranslucent={props.highlightMode ? !props.highlightMode.includes(c.id) : false} image={ImageLoader.load(c.image)} onClick={() => props.onStableCardClick(c.id)} />
                                            {showHover === c.id &&
                                                <CardHover title={c.title} position={"top"} offset={{ x: 40, y: 0 }} color={_typeToColor(c.type)} text={cardDescription(c, context!.language)} />
                                            }
                                        </div>
                                    );
                                })}
                            </UpgradeDowngradeStable>
                            <Stable>
                                {props.stable[pl.id].map(c => {
                                    return (
                                        <div 
                                            key={c.id} 
                                            ref={setItemRefs(`${c.id}`) as any} 
                                            style={{ position: "relative" }} 
                                            onMouseEnter={() => {
                                                playHubMouseOverSound();
                                                setShowHover(c.id);
                                            }}
                                            onMouseLeave={() => {
                                                setShowHover(undefined);
                                            }}>
                                            <UnicornImage layoutId={`${c.id}`}isTranslucent={props.highlightMode ? !props.highlightMode.includes(c.id) : false} image={ImageLoader.load(c.image)} onClick={() => props.onStableCardClick(c.id)} 
                                                onMouseEnter={() => props.onStableCardMouseEnter(c.id)}
                                                onMouseLeave={() => props.onStableCardMouseLeave(c.id)}
                                            />
                                            {showHover === c.id &&
                                                <CardHover title={c.title} position={"top"} offset={{ x: 64, y: 0 }} color={_typeToColor(c.type)} text={cardDescription(c, context!.language)} />
                                            }
                                        </div>
                                    );
                                })}
                                {props.stable[pl.id].length === 0 &&
                                    <p style={{ opacity: 0.7 }}>Stable is empty</p>
                                }
                            </Stable>
                        </InnerBox>
                    </PlayerBox>
                );
            })}
        </Wrapper>
    );
});

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PlayerBox = styled.div<{ current: boolean }>`
    width: 180px;
    height: 220px;
    border-radius: 16px;
    margin: 0.6em;
    padding: 0.5em;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    ${props => props.current && css`
        transform: translateY(-4px);
    `}
`;

const InnerBox = styled.div<{ current?: boolean }>`
    height: 100%;
    width: 100%;
    border-radius: 12px;
    background: ${props => props.current 
      ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.18), rgba(168, 85, 247, 0.18))' 
      : 'rgba(188, 71, 71, 0.15)'};
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid ${props => props.current 
      ? 'rgba(236, 72, 153, 0.4)' 
      : 'rgba(255, 255, 255, 0.08)'};
    box-shadow: ${props => props.current 
      ? '0 8px 24px rgba(168, 85, 247, 0.25), inset 0 1px 2px rgba(255,255,255,0.1)' 
      : '0 4px 12px rgba(0,0,0,0.2)'};
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    
    &:hover {
        border-color: ${props => props.current ? 'rgba(236, 72, 153, 0.6)' : 'rgba(255,255,255,0.2)'};
        box-shadow: ${props => props.current 
          ? '0 12px 30px rgba(168, 85, 247, 0.35), inset 0 1px 2px rgba(255,255,255,0.15)' 
          : '0 8px 20px rgba(0,0,0,0.3)'};
        background: ${props => props.current 
          ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.22), rgba(168, 85, 247, 0.22))' 
          : 'rgba(188, 71, 71, 0.2)'};
    }
`;

const Title = styled.div`
    color: white;
    font-family: 'Outfit', 'Open Sans', sans-serif;
    padding: 0.5em 0.5em 0 0.5em;
    font-size: 1.15em;
    font-weight: 600;
    display: flex;
    position: relative;
    letter-spacing: -0.01em;
`;

const UpgradeDowngradeStable = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: no-wrap;
    align-items: center;
    margin: 0.5em 0.5em;
`;

const UpgradeDowngradeImage = styled.img<{ image: string, isTranslucent: boolean }>`
    background-image: url(${props => props.image});
    background-size: cover;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    margin: 0 0.1em;
    opacity: ${props => !props.isTranslucent ? 1 : 0.5};
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
    }
`;

const Stable = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    position: relative;
`;

const UnicornImage = styled(motion.div)<{ image: string, isTranslucent: boolean }>`
    background-image: url(${props => props.image});
    background-size: cover;
    min-width: 50px;
    height: 60px;
    border-radius: 8px;
    margin: 0.2em;
    opacity: ${props => !props.isTranslucent ? 1 : 0.5};
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);

    &:hover {
        transform: translateY(-4px) scale(1.08);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        z-index: 5;
    }
`;

const CardCounter = styled.div`
    position: absolute;
    right: 0.6em;
    background: linear-gradient(135deg, #f472b6, #a855f7);
    color: white;
    font-size: 0.75em;
    font-weight: 700;
    padding: 0.2em 0.5em;
    border-radius: 20px;
    box-shadow: 0 2px 6px rgba(168, 85, 247, 0.3);
    transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
    
    &:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 10px rgba(168, 85, 247, 0.45);
    }
`;

export default PlayerField;