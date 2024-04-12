import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import './App.css';

Modal.setAppElement('#root'); // This line is needed for accessibility reasons

function FactionButtons() {
    const [factions, setFactions] = useState([]);
    const [killteams, setKillteams] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [currentFaction, setCurrentFaction] = useState(null);

    useEffect(() => {
        fetch('https://ktdash.app/api/faction.php')
            .then(response => response.json())
            .then(data => {
                const sanitizedData = data.map(faction => {
                    return {
                        ...faction,
                        description: sanitizeHTML(faction.description)
                    };
                });
                setFactions(sanitizedData);
            });
    }, []);

    function fetchKillteams(factionId) {
        fetch(`https://ktdash.app/api/faction.php?fa=${factionId}`)
            .then(response => response.json())
            .then(data => {
                setKillteams(data.killteams);
            });
    }

    function openModal(faction) {
        setCurrentFaction(faction);
        setIsOpen(true);
        fetchKillteams(faction.factionid);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div>
            {factions.map(faction => (
                <Button variant="contained" color="primary" key={faction.factionid} onClick={() => openModal(faction)}>
                    {faction.factionname}
                </Button>
            ))}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Faction Description"
                className="App-header"
            >
                <FactionModalContent currentFaction={currentFaction} killteams={killteams} closeModal={closeModal} />
            </Modal>
        </div>
    );
}

function FactionModalContent({ currentFaction, killteams, closeModal }) {
    return (
        <Container className={"modal-content"}>
            <h2>{currentFaction?.factionname}</h2>
            <p>{currentFaction?.description}</p>
            {killteams.map(killteam => (
                <Button variant="contained" color="primary" key={killteam.killteamid} className="killteam-button">
                    {killteam.killteamname}
                </Button>
            ))}
            <Button variant="contained" color="secondary" onClick={closeModal}>Close</Button>
        </Container>
    );
}

function sanitizeHTML(text) {
    const regex = /(<([^>]+)>)/ig;
    return text.replace(regex, '');
}

export default FactionButtons;