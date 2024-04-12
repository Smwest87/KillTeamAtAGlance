import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import './App.css';

function FactionButtons() {
    const [factions, setFactions] = useState([]);
    const [killteams, setKillteams] = useState([]);
    const [selectedKillteam, setSelectedKillteam] = useState(null);
    const [currentFaction, setCurrentFaction] = useState(null);
    const [activeStep, setActiveStep] = useState(0);

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

    function fetchKillteamDetails(factionId, killteamId) {
        fetch(`https://ktdash.app/api/killteam.php?fa=${factionId}&kt=${killteamId}`)
            .then(response => response.json())
            .then(data => {
                setSelectedKillteam(data);
            });
    }

    function handleKillteamClick(killteam) {
        fetchKillteamDetails(currentFaction.factionid, killteam.killteamid);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }


    function handleNext(faction) {
        setCurrentFaction(faction);
        fetchKillteams(faction.factionid);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    function handleBack() {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

    return (
        <div>
            <Stepper activeStep={activeStep} orientation="vertical">
                <Step key="Select Faction">
                    <StepLabel>Select Faction</StepLabel>
                    <StepContent>
                        {factions.map(faction => (
                            <Button variant="contained" color="primary" key={faction.factionid} onClick={() => handleNext(faction)}>
                                {faction.factionname}
                            </Button>
                        ))}
                    </StepContent>
                </Step>
                <Step key="Select Killteam">
                    <StepLabel>Select Killteam</StepLabel>
                    <StepContent>
                        <h2>{currentFaction?.factionname}</h2>
                        <p>{currentFaction?.description}</p>
                        {killteams.map(killteam => (
                            <Button variant="contained" color="primary" key={killteam.killteamid} className="killteam-button" onClick={() => handleKillteamClick(killteam)}>
                                {killteam.killteamname}
                            </Button>
                        ))}
                        <Button variant="contained" color="secondary" onClick={handleBack}>Back</Button>
                    </StepContent>
                </Step>
                <Step key="Killteam Details">
                    <StepLabel>Killteam Details</StepLabel>
                    <StepContent>
                        <h2>{selectedKillteam?.killteamname}</h2>
                        <p>{selectedKillteam?.description}</p>
                        {selectedKillteam?.fireteams[0].operatives.map(operative => (
                            <Button variant="contained" color="primary" key={operative.operativeid}>
                                {operative.opname}
                            </Button>))}
                        <Button variant="contained" color="secondary" onClick={handleBack}>Back</Button>
                    </StepContent>
                </Step>
            </Stepper>
        </div>
    );
}

function sanitizeHTML(text) {
    const regex = /(<([^>]+)>)/ig;
    return text.replace(regex, '');
}

export default FactionButtons;