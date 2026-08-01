import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useHistory } from 'react-router-dom';
import BG from './assets/ui/board-background.jpg';

// Random funny room names generator
const ADJECTIVES = ['magic', 'cosmic', 'stable', 'sparkly', 'unstable', 'swift', 'glowing', 'shadow', 'golden', 'hyper'];
const NOUNS = ['unicorn', 'narwhal', 'foal', 'pegasus', 'horn', 'rainbow', 'nursery', 'neigh', 'mane', 'herd'];

const generateRoomCode = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}-${noun}-${num}`;
};

const MainMenu = () => {
  const history = useHistory();
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('unstable-unicorns-player-name') || '');
  const [numPlayers, setNumPlayers] = useState(2);
  const [roomCode, setRoomCode] = useState('');
  const [created, setCreated] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate a random room code on mount
  useEffect(() => {
    setRoomCode(generateRoomCode());
  }, []);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    localStorage.setItem('unstable-unicorns-player-name', playerName.trim());
    setCreated(true);
  };

  const getJoinUrl = (slot: number) => {
    return `${window.location.origin}/${roomCode}/${numPlayers}/${slot}`;
  };

  const handleCopyLink = (slot: number) => {
    const url = getJoinUrl(slot);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedIndex(slot);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <Container>
      {/* Load Google Fonts directly in the component style */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        * {
          font-family: 'Outfit', sans-serif;
        }
      `}</style>
      
      <GlassCard>
        {!created ? (
          <Form onSubmit={handleCreateRoom}>
            <Title>Unstable Unicorns <Subtitle>Online Lobby</Subtitle></Title>
            
            <FormGroup>
              <Label htmlFor="name">Your Name</Label>
              <Input
                type="text"
                id="name"
                required
                maxLength={15}
                placeholder="Enter your magical name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Number of Players</Label>
              <PlayerSelectContainer>
                {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <PlayerChip
                    key={num}
                    type="button"
                    active={numPlayers === num}
                    onClick={() => setNumPlayers(num)}
                  >
                    {num}
                  </PlayerChip>
                ))}
              </PlayerSelectContainer>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="room">Room Code</Label>
              <Input
                type="text"
                id="room"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="Custom room code..."
              />
            </FormGroup>

            <SubmitBtn type="submit" disabled={!playerName.trim()}>
              Create Room
            </SubmitBtn>
          </Form>
        ) : (
          <InviteSection>
            <Title>Stable Created! <Subtitle>Invite your herd</Subtitle></Title>
            
            <HelperText>
              Copy and send the links below to other players. Each player needs their own link.
            </HelperText>

            <LinksContainer>
              {/* Host link */}
              <LinkRow isHost>
                <LinkInfo>
                  <SlotLabel>Player 1 (Host / You)</SlotLabel>
                  <UrlText>{getJoinUrl(0)}</UrlText>
                </LinkInfo>
                <ActionButtons>
                  <ActionBtn
                    primary
                    type="button"
                    onClick={() => history.push(`/${roomCode}/${numPlayers}/0`)}
                  >
                    Enter Game
                  </ActionBtn>
                </ActionButtons>
              </LinkRow>

              {/* Girlfriend / Player 2 link highlighted */}
              <LinkRow isGF={numPlayers === 2}>
                <LinkInfo>
                  <SlotLabel>
                    Player 2 {numPlayers === 2 ? '❤️ (Girlfriend / Guest)' : ''}
                  </SlotLabel>
                  <UrlText>{getJoinUrl(1)}</UrlText>
                </LinkInfo>
                <ActionButtons>
                  <ActionBtn
                    type="button"
                    onClick={() => handleCopyLink(1)}
                  >
                    {copiedIndex === 1 ? 'Copied! ✨' : 'Copy Link'}
                  </ActionBtn>
                </ActionButtons>
              </LinkRow>

              {/* Other links */}
              {Array.from({ length: numPlayers - 2 }).map((_, i) => {
                const slot = i + 2;
                return (
                  <LinkRow key={slot}>
                    <LinkInfo>
                      <SlotLabel>Player {slot + 1}</SlotLabel>
                      <UrlText>{getJoinUrl(slot)}</UrlText>
                    </LinkInfo>
                    <ActionButtons>
                      <ActionBtn
                        type="button"
                        onClick={() => handleCopyLink(slot)}
                      >
                        {copiedIndex === slot ? 'Copied! ✨' : 'Copy Link'}
                      </ActionBtn>
                    </ActionButtons>
                  </LinkRow>
                );
              })}
            </LinksContainer>

            <BackBtn type="button" onClick={() => setCreated(false)}>
              ← Back to settings
            </BackBtn>
          </InviteSection>
        )}
      </GlassCard>
    </Container>
  );
};

// --- Styled Components ---

const gradientBg = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.98)), url(${BG});
  background-size: cover;
  background-position: center;
  overflow: hidden;
  padding: 1rem;
  box-sizing: border-box;
`;

const GlassCard = styled.div`
  width: 100%;
  max-width: 580px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 
    0 4px 30px rgba(0, 0, 0, 0.4),
    0 1px 3px rgba(255, 255, 255, 0.05) inset;
  box-sizing: border-box;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InviteSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  text-align: center;
  letter-spacing: -0.025em;
  background: linear-gradient(to right, #ffffff, #f472b6, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.span`
  display: block;
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.25rem;
  -webkit-text-fill-color: rgba(255, 255, 255, 0.5);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const Input = styled.input`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.9rem 1.2rem;
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) inset;

  &:focus {
    border-color: #f472b6;
    background: rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }
`;

const PlayerSelectContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

const PlayerChip = styled.button<{ active: boolean }>`
  flex: 1;
  background: ${props => props.active ? 'linear-gradient(135deg, #f472b6, #a855f7)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.active ? '#f472b6' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 12px;
  padding: 0.8rem;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: ${props => props.active ? '0 4px 12px rgba(244, 114, 182, 0.3)' : 'none'};

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #f472b6, #a855f7)' : 'rgba(255, 255, 255, 0.08)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const SubmitBtn = styled.button`
  background: linear-gradient(to right, #f472b6, #a855f7);
  border: none;
  border-radius: 14px;
  padding: 1.1rem;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const HelperText = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin: 0;
  line-height: 1.5;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.25rem;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
`;

const LinkRow = styled.div<{ isHost?: boolean; isGF?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => 
    props.isHost 
      ? 'rgba(168, 85, 247, 0.1)' 
      : props.isGF 
        ? 'rgba(244, 114, 182, 0.12)' 
        : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => 
    props.isHost 
      ? 'rgba(168, 85, 247, 0.2)' 
      : props.isGF 
        ? 'rgba(244, 114, 182, 0.3)' 
        : 'rgba(255, 255, 255, 0.06)'};
  border-radius: 14px;
  padding: 0.9rem 1.2rem;
  gap: 1rem;
`;

const LinkInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0; /* allows text-overflow to work */
  flex: 1;
`;

const SlotLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
`;

const UrlText = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ActionButtons = styled.div`
  display: flex;
`;

const ActionBtn = styled.button<{ primary?: boolean }>`
  background: ${props => props.primary ? 'linear-gradient(135deg, #f472b6, #a855f7)' : 'rgba(255, 255, 255, 0.06)'};
  border: 1px solid ${props => props.primary ? '#f472b6' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 0.5rem 0.9rem;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  white-space: nowrap;

  &:hover {
    background: ${props => props.primary ? 'linear-gradient(135deg, #f57fb9, #b56bfb)' : 'rgba(255, 255, 255, 0.12)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.96);
  }
`;

const BackBtn = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  align-self: center;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

export default MainMenu;
