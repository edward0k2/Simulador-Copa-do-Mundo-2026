const worldCupGroups = {
  A: ["México", "África do Sul", "Coreia do Sul", "República Tcheca"],
  B: ["Canadá", "Bósnia e Herzegovina", "Catar", "Suíça"],
  C: ["Brasil", "Marrocos", "Haiti", "Escócia"],
  D: ["Estados Unidos", "Paraguai", "Austrália", "Turquia"],
  E: ["Alemanha", "Curaçao", "Costa do Marfim", "Equador"],
  F: ["Holanda", "Japão", "Suécia", "Tunísia"],
  G: ["Bélgica", "Egito", "Irã", "Nova Zelândia"],
  H: ["Espanha", "Cabo Verde", "Arábia Saudita", "Uruguai"],
  I: ["França", "Senegal", "Iraque", "Noruega"],
  J: ["Argentina", "Argélia", "Áustria", "Jordânia"],
  K: ["Portugal", "Congo", "Uzbequistão", "Colômbia"],
  L: ["Inglaterra", "Croácia", "Gana", "Panamá"]
};

const countryCodes = {
    "México": "mx", "África do Sul": "za", "Coreia do Sul": "kr", "República Tcheca": "cz",
    "Canadá": "ca", "Bósnia e Herzegovina": "ba", "Catar": "qa", "Suíça": "ch",
    "Brasil": "br", "Marrocos": "ma", "Haiti": "ht", "Escócia": "gb-sct",
    "Estados Unidos": "us", "Paraguai": "py", "Austrália": "au", "Turquia": "tr",
    "Alemanha": "de", "Curaçao": "cw", "Costa do Marfim": "ci", "Equador": "ec",
    "Holanda": "nl", "Japão": "jp", "Suécia": "se", "Tunísia": "tn",
    "Bélgica": "be", "Egito": "eg", "Irã": "ir", "Nova Zelândia": "nz",
    "Espanha": "es", "Cabo Verde": "cv", "Arábia Saudita": "sa", "Uruguai": "uy",
    "França": "fr", "Senegal": "sn", "Iraque": "iq", "Noruega": "no",
    "Argentina": "ar", "Argélia": "dz", "Áustria": "at", "Jordânia": "jo",
    "Portugal": "pt", "Congo": "cd", "Uzbequistão": "uz", "Colômbia": "co",
    "Inglaterra": "gb-eng", "Croácia": "hr", "Gana": "gh", "Panamá": "pa"
};

const teamCodes = {
    "México": "MEX", "África do Sul": "RSA", "Coreia do Sul": "KOR", "República Tcheca": "CZE",
    "Canadá": "CAN", "Bósnia e Herzegovina": "BIH", "Catar": "QAT", "Suíça": "SUI",
    "Brasil": "BRA", "Marrocos": "MAR", "Haiti": "HAI", "Escócia": "SCO",
    "Estados Unidos": "USA", "Paraguai": "PAR", "Austrália": "AUS", "Turquia": "TUR",
    "Alemanha": "GER", "Curaçao": "CUW", "Costa do Marfim": "CIV", "Equador": "ECU",
    "Holanda": "NED", "Japão": "JPN", "Suécia": "SWE", "Tunísia": "TUN",
    "Bélgica": "BEL", "Egito": "EGY", "Irã": "IRN", "Nova Zelândia": "NZL",
    "Espanha": "ESP", "Cabo Verde": "CPV", "Arábia Saudita": "KSA", "Uruguai": "URU",
    "França": "FRA", "Senegal": "SEN", "Iraque": "IRQ", "Noruega": "NOR",
    "Argentina": "ARG", "Argélia": "ALG", "Áustria": "AUT", "Jordânia": "JOR",
    "Portugal": "POR", "Congo": "COD", "Uzbequistão": "UZB", "Colômbia": "COL",
    "Inglaterra": "ENG", "Croácia": "CRO", "Gana": "GHA", "Panamá": "PAN"
};

const teamRatings = {
    // Top 10 (Força Máxima - 95)
    "Argentina": 95, "França": 95, "Espanha": 95, "Inglaterra": 95, "Brasil": 95,
    "Bélgica": 95, "Holanda": 95, "Portugal": 95, "Alemanha": 95, "Croácia": 95,
    
    // Tier 2 (Fortes - 83)
    "México": 83, "Coreia do Sul": 83, "República Tcheca": 83, "Suíça": 83,
    "Marrocos": 83, "Estados Unidos": 83, "Austrália": 83, "Turquia": 83,
    "Equador": 83, "Japão": 83, "Suécia": 83, "Uruguai": 83, "Senegal": 83,
    "Noruega": 83, "Áustria": 83, "Colômbia": 83,
    
    // Tier 3 (Médias - 70)
    "Canadá": 70, "Bósnia e Herzegovina": 70, "Catar": 70, "Escócia": 70,
    "Paraguai": 70, "Costa do Marfim": 70, "Tunísia": 70, "Egito": 70,
    "Irã": 70, "Cabo Verde": 70, "Arábia Saudita": 70, "Iraque": 70,
    "Argélia": 70, "Uzbequistão": 70, "Gana": 70, "Panamá": 70,
    
    // Tier 4 (Azarões - 55)
    "África do Sul": 55, "Haiti": 55, "Curaçao": 55, "Nova Zelândia": 55,
    "Jordânia": 55, "Congo": 55
};

function getFlagURL(teamName) {
    const code = countryCodes[teamName];
    if (code) return `https://flagcdn.com/w40/${code}.png`;
    return '';
}

const groupsContainer = document.getElementById('groups-container');
const knockoutContainer = document.getElementById('knockout-container');
const bracketGrid = document.getElementById('bracket-grid');
const teamStatsModal = document.getElementById('team-stats-modal');

let guessesState = {}; // Os palpites manuais do usuário
let liveState = {};    // Os resultados em tempo real (oficial / simulado)
let currentMode = 'guesses'; // 'guesses' ou 'live'
let liveMatchInfo = {}; // Status de cada jogo ao vivo { matchId: { minute: 0, status: 'NOT_STARTED'|'LIVE'|'FINISHED' } }
let liveSimInterval = null;
let liveSimPhase = 'group-1'; // 'group-1', 'group-2', 'group-3', 'ko-0', 'ko-1', 'ko-2', 'ko-3', 'ko-4'
let liveSimTime = 0;
let isSimulating = false;

let state = guessesState; // Armazena os placares (aponta para o estado atual ativo)
let stateHistory = []; // Armazena o histórico de estados

// Verifica se o usuário preencheu pelo menos um placar no site
function isSimulationStarted() {
    for (let key in state) {
        const val = state[key];
        if (val && (val.home !== '' || val.away !== '')) {
            return true;
        }
    }
    return false;
}

function saveStateToHistory() {
    stateHistory.push(JSON.parse(JSON.stringify(state)));
    if (stateHistory.length > 50) stateHistory.shift(); // Limite de 50 passos
    updateActionButtons();
}

function updateActionButtons() {
    const btnUndo = document.getElementById('btn-undo');
    if (btnUndo) {
        btnUndo.disabled = stateHistory.length === 0;
    }
}

// Gera a página de figurinhas para recortar e colar
function generateStickers() {
    const grid = document.getElementById('stickers-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    // Obter todas as seleções únicas
    const allTeams = Object.values(worldCupGroups).flat();
    
    allTeams.forEach(team => {
        // Gerar exatamente 5 figurinhas para cada seleção (são 5 jogos possíveis no mata-mata)
        for (let i = 0; i < 5; i++) {
            const item = document.createElement('div');
            item.className = 'sticker-item';
            
            const flag = document.createElement('img');
            flag.className = 'sticker-flag';
            flag.src = getFlagURL(team);
            flag.alt = team;
            
            item.appendChild(flag);
            grid.appendChild(item);
        }
    });
}

function setupTabListeners() {
    const tabGuesses = document.getElementById('tab-guesses');
    const tabLive = document.getElementById('tab-live');
    const btnStartSim = document.getElementById('btn-start-live-sim');
    const btnStopSim = document.getElementById('btn-stop-live-sim');
    
    if (tabGuesses) {
        tabGuesses.addEventListener('click', () => switchTab('guesses'));
    }
    
    if (tabLive) {
        tabLive.addEventListener('click', () => {
            switchTab('live');
            fetchRealTimeResults();
        });
    }
    
    if (btnStartSim) {
        btnStartSim.addEventListener('click', startLiveSimulation);
    }
    
    if (btnStopSim) {
        btnStopSim.addEventListener('click', stopLiveSimulation);
    }
}

function switchTab(tab) {
    if (tab === currentMode) return;
    
    // Parar simulação ao sair da aba de jogo ao vivo
    if (currentMode === 'live' && isSimulating) {
        stopLiveSimulation();
    }
    
    if (tab === 'guesses') {
        // Salva estado ao vivo se houver mudanças
        liveState = JSON.parse(JSON.stringify(state));
        // Restaura palpites manuais
        state = guessesState;
        currentMode = 'guesses';
    } else {
        // Salva palpites manuais
        guessesState = JSON.parse(JSON.stringify(state));
        // Restaura estado ao vivo
        state = liveState;
        currentMode = 'live';
    }
    
    // Atualiza classes das abas na UI
    const tabGuesses = document.getElementById('tab-guesses');
    const tabLive = document.getElementById('tab-live');
    if (tabGuesses) tabGuesses.classList.toggle('active', tab === 'guesses');
    if (tabLive) tabLive.classList.toggle('active', tab === 'live');
    
    // Exibe ou oculta o painel ao vivo
    const panel = document.getElementById('live-control-panel');
    if (panel) {
        if (tab === 'live') {
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    }
    
    // Zera o histórico ao trocar de aba para evitar desfazer estados cruzados
    stateHistory = [];
    updateActionButtons();
    
    // Re-renderiza a tela com o novo estado
    renderGroups();
    generateKnockoutBracket();
}

function startLiveSimulation() {
    if (isSimulating) return;
    isSimulating = true;
    
    // Esconde o botão de Iniciar e mostra o de Parar
    document.getElementById('btn-start-live-sim').classList.add('hidden');
    document.getElementById('btn-stop-live-sim').classList.remove('hidden');
    
    const statusEl = document.getElementById('live-connection-status');
    if (statusEl) {
        statusEl.className = 'status-live';
        statusEl.textContent = 'Simulação Ao Vivo Iniciada 🔴';
    }
    
    // Limpa placares de simulação anteriores
    for (let key in liveState) delete liveState[key];
    liveMatchInfo = {};
    liveSimPhase = 'group-1';
    liveSimTime = 0;
    
    renderGroups();
    generateKnockoutBracket();
    
    liveSimInterval = setInterval(() => {
        liveSimTime += 3; // 3 minutos simulados a cada segundo
        
        if (liveSimTime > 90) {
            finishPhase();
            return;
        }
        
        updateActiveMatches();
    }, 1000);
}

function stopLiveSimulation() {
    if (liveSimInterval) {
        clearInterval(liveSimInterval);
        liveSimInterval = null;
    }
    isSimulating = false;
    
    const btnStart = document.getElementById('btn-start-live-sim');
    const btnStop = document.getElementById('btn-stop-live-sim');
    if (btnStart) btnStart.classList.remove('hidden');
    if (btnStop) btnStop.classList.add('hidden');
    
    const statusEl = document.getElementById('live-connection-status');
    if (statusEl) {
        statusEl.className = 'status-connected';
        statusEl.textContent = 'Simulação Concluída / Pausada';
    }
}

function getTeamsForMatchId(matchId) {
    if (matchId.includes('-') && !matchId.startsWith('ko-')) {
        const parts = matchId.split('-');
        const groupName = parts[0];
        const index = parseInt(parts[1]);
        const teams = worldCupGroups[groupName];
        if (teams) {
            const matches = generateMatches(teams);
            const m = matches[index];
            if (m) return { home: m.home, away: m.away };
        }
    }
    
    const inputHome = document.querySelector(`input[data-match="${matchId}"][data-type="home"]`);
    const inputAway = document.querySelector(`input[data-match="${matchId}"][data-type="away"]`);
    if (inputHome && inputAway) {
        const rowHome = inputHome.closest('.knockout-team-row');
        const rowAway = inputAway.closest('.knockout-team-row');
        if (rowHome && rowAway) {
            const spanHome = rowHome.querySelector('.team-name');
            const spanAway = rowAway.querySelector('.team-name');
            if (spanHome && spanAway) {
                return {
                    home: spanHome.getAttribute('title') || 'TBD',
                    away: spanAway.getAttribute('title') || 'TBD'
                };
            }
        }
    }
    return { home: 'TBD', away: 'TBD' };
}

function updateActiveMatches() {
    const activeMatches = getActiveMatchesForPhase(liveSimPhase);
    const statusEl = document.getElementById('live-connection-status');
    
    if (statusEl) {
        const faseNomes = {
            'group-1': 'Fase de Grupos - Rodada 1',
            'group-2': 'Fase de Grupos - Rodada 2',
            'group-3': 'Fase de Grupos - Rodada 3',
            'ko-0': 'Mata-Mata - Dezesseis-avos',
            'ko-1': 'Mata-Mata - Oitavas de Final',
            'ko-2': 'Mata-Mata - Quartas de Final',
            'ko-3': 'Mata-Mata - Semifinais',
            'ko-4': 'Mata-Mata - Grande Final'
        };
        statusEl.textContent = `Ao Vivo: ${faseNomes[liveSimPhase]} (${liveSimTime}') 🔴`;
    }
    
    activeMatches.forEach(matchId => {
        if (!liveState[matchId]) {
            liveState[matchId] = { home: '0', away: '0' };
        }
        
        liveMatchInfo[matchId] = { minute: liveSimTime, status: 'LIVE' };
        
        // Peso dinâmico baseado no Ranking da FIFA
        const teams = getTeamsForMatchId(matchId);
        const ratingHome = teamRatings[teams.home] || 70;
        const ratingAway = teamRatings[teams.away] || 70;
        
        // Fator multiplicador baseado nas forças relativas
        const factorHome = ratingHome / ratingAway;
        const factorAway = ratingAway / ratingHome;
        
        // Probabilidades de gol ponderadas (base 4% ou 0.04)
        const probHome = 0.04 * factorHome;
        const probAway = 0.04 * factorAway;
        
        if (Math.random() < probHome) {
            liveState[matchId].home = (parseInt(liveState[matchId].home || 0) + 1).toString();
        }
        if (Math.random() < probAway) {
            liveState[matchId].away = (parseInt(liveState[matchId].away || 0) + 1).toString();
        }
    });
    
    renderGroups();
    generateKnockoutBracket();
}

function finishPhase() {
    const activeMatches = getActiveMatchesForPhase(liveSimPhase);
    
    activeMatches.forEach(matchId => {
        if (liveMatchInfo[matchId]) {
            liveMatchInfo[matchId].status = 'FINISHED';
        }
        
        // Garante que não haja empates no Mata-Mata
        if (matchId.startsWith('ko-') && liveState[matchId]) {
            if (liveState[matchId].home === liveState[matchId].away) {
                if (Math.random() < 0.5) {
                    liveState[matchId].home = (parseInt(liveState[matchId].home) + 1).toString();
                } else {
                    liveState[matchId].away = (parseInt(liveState[matchId].away) + 1).toString();
                }
            }
        }
    });
    
    // Transiciona para a próxima fase da Copa
    if (liveSimPhase === 'group-1') {
        liveSimPhase = 'group-2';
        liveSimTime = 0;
    } else if (liveSimPhase === 'group-2') {
        liveSimPhase = 'group-3';
        liveSimTime = 0;
    } else if (liveSimPhase === 'group-3') {
        liveSimPhase = 'ko-0';
        liveSimTime = 0;
    } else if (liveSimPhase === 'ko-0') {
        liveSimPhase = 'ko-1';
        liveSimTime = 0;
    } else if (liveSimPhase === 'ko-1') {
        liveSimPhase = 'ko-2';
        liveSimTime = 0;
    } else if (liveSimPhase === 'ko-2') {
        liveSimPhase = 'ko-3';
        liveSimTime = 0;
    } else if (liveSimPhase === 'ko-3') {
        liveSimPhase = 'ko-4';
        liveSimTime = 0;
    } else if (liveSimPhase === 'ko-4') {
        stopLiveSimulation();
        alert('🏆 Copa do Mundo de 2026 Concluída! Todos os resultados da simulação ao vivo foram gerados!');
        return;
    }
    
    renderGroups();
    generateKnockoutBracket();
}

function getActiveMatchesForPhase(phase) {
    let matches = [];
    if (phase === 'group-1') {
        for (const grp of Object.keys(worldCupGroups)) {
            matches.push(`${grp}-0`, `${grp}-1`);
        }
    } else if (phase === 'group-2') {
        for (const grp of Object.keys(worldCupGroups)) {
            matches.push(`${grp}-2`, `${grp}-3`);
        }
    } else if (phase === 'group-3') {
        for (const grp of Object.keys(worldCupGroups)) {
            matches.push(`${grp}-4`, `${grp}-5`);
        }
    } else if (phase === 'ko-0') {
        for (let i = 0; i < 16; i++) matches.push(`ko-0-${i}`);
    } else if (phase === 'ko-1') {
        for (let i = 0; i < 8; i++) matches.push(`ko-1-${i}`);
    } else if (phase === 'ko-2') {
        for (let i = 0; i < 4; i++) matches.push(`ko-2-${i}`);
    } else if (phase === 'ko-3') {
        for (let i = 0; i < 2; i++) matches.push(`ko-3-${i}`);
    } else if (phase === 'ko-4') {
        matches.push('ko-4-0');
    }
    return matches;
}

async function fetchRealTimeResults() {
    const statusEl = document.getElementById('live-connection-status');
    if (statusEl) {
        statusEl.textContent = 'Conectando ao servidor oficial...';
    }
    
    try {
        const response = await fetch('https://raw.githubusercontent.com/edward0k2/Simulador-Copa-do-Mundo-2026/main/live-results.json');
        if (response.ok) {
            const data = await response.json();
            for (let key in liveState) delete liveState[key];
            Object.assign(liveState, data.scores || {});
            liveMatchInfo = data.matchInfo || {};
            
            if (statusEl) {
                statusEl.className = 'status-connected';
                statusEl.textContent = 'Dados Reais Sincronizados';
            }
            
            renderGroups();
            generateKnockoutBracket();
        } else {
            throw new Error('Servidor indisponível');
        }
    } catch (e) {
        console.log("Aviso: Dados oficiais em tempo real indisponíveis. Pronto para simulação local.");
        if (statusEl) {
            statusEl.className = 'status-connected';
            statusEl.textContent = 'Pronto para Simulação Ao Vivo';
        }
    }
}

// Inicializa o estado e renderiza
function init() {
    loadStateFromURL();
    renderGroups();
    generateKnockoutBracket(); // Mostra o mata-mata desde o início
    setupListeners();
    setupTabListeners(); // Nova escuta de abas e simulador ao vivo
    generateStickers(); // Gera a página de figurinhas para recorte
}

function generateMatches(teams) {
    // Para 4 times: 1x2, 3x4 | 1x3, 2x4 | 1x4, 2x3
    return [
        { home: teams[0], away: teams[1] },
        { home: teams[2], away: teams[3] },
        { home: teams[0], away: teams[2] },
        { home: teams[1], away: teams[3] },
        { home: teams[0], away: teams[3] },
        { home: teams[1], away: teams[2] },
    ];
}

function calculateTable(groupName, teams) {
    let table = teams.map(team => ({
        name: team, p: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0
    }));

    const matches = generateMatches(teams);
    
    matches.forEach((match, index) => {
        const matchId = `${groupName}-${index}`;
        const scores = state[matchId];
        
        if (scores && scores.home !== "" && scores.away !== "") {
            const hScore = parseInt(scores.home);
            const aScore = parseInt(scores.away);
            
            let hTeam = table.find(t => t.name === match.home);
            let aTeam = table.find(t => t.name === match.away);

            hTeam.j++; aTeam.j++;
            hTeam.gp += hScore; hTeam.gc += aScore;
            aTeam.gp += aScore; aTeam.gc += hScore;
            
            if (hScore > aScore) {
                hTeam.p += 3; hTeam.v++;
                aTeam.d++;
            } else if (hScore < aScore) {
                aTeam.p += 3; aTeam.v++;
                hTeam.d++;
            } else {
                hTeam.p += 1; aTeam.p += 1;
                hTeam.e++; aTeam.e++;
            }
        }
    });

    table.forEach(t => t.sg = t.gp - t.gc);

    // Ordenação: Pontos > Saldo > Gols Pró
    table.sort((a, b) => {
        if (b.p !== a.p) return b.p - a.p;
        if (b.sg !== a.sg) return b.sg - a.sg;
        return b.gp - a.gp;
    });

    return table;
}

function updateGroupTables() {
    for (const [groupName, teams] of Object.entries(worldCupGroups)) {
        const tableData = calculateTable(groupName, teams);
        const tbody = document.getElementById(`table-body-${groupName}`);
        if (tbody) {
            tbody.innerHTML = tableData.map((t, i) => `
                <tr style="${i < 2 ? 'background: rgba(16, 185, 129, 0.2);' : ''}">
                    <td class="team-name" style="text-align: left;">
                        <div style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
                            <img src="${getFlagURL(t.name)}" class="group-flag" alt="${t.name}">
                            <span title="${t.name}" style="white-space: nowrap;">${teamCodes[t.name]}</span>
                        </div>
                    </td>
                    <td>${t.j > 0 ? t.p : '_'}</td><td>${t.j > 0 ? t.j : '_'}</td><td>${t.j > 0 ? t.v : '_'}</td>
                    <td>${t.j > 0 ? t.e : '_'}</td><td>${t.j > 0 ? t.d : '_'}</td><td>${t.j > 0 ? (t.sg > 0 ? '+' + t.sg : t.sg) : '_'}</td>
                </tr>
            `).join('');
        }
    }
}

function renderGroups() {
    groupsContainer.innerHTML = '';
    
    for (const [groupName, teams] of Object.entries(worldCupGroups)) {
        const tableData = calculateTable(groupName, teams);
        const matches = generateMatches(teams);

        const card = document.createElement('div');
        card.className = 'group-card';
        
        let tableHTML = `
            <h3 class="group-title">Grupo ${groupName}</h3>
            <table>
                <thead>
                    <tr>
                        <th style="text-align: left;">Seleção</th><th>P</th><th>J</th><th>V</th><th>E</th><th>D</th><th>SG</th>
                    </tr>
                </thead>
                <tbody id="table-body-${groupName}">
                    ${tableData.map((t, i) => `
                        <tr style="${i < 2 ? 'background: rgba(16, 185, 129, 0.2);' : ''}">
                            <td class="team-name" style="text-align: left;">
                                <div style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
                                    <img src="${getFlagURL(t.name)}" class="group-flag" alt="${t.name}">
                                    <span title="${t.name}" style="white-space: nowrap;">${teamCodes[t.name]}</span>
                                </div>
                            </td>
                            <td>${t.j > 0 ? t.p : '_'}</td><td>${t.j > 0 ? t.j : '_'}</td><td>${t.j > 0 ? t.v : '_'}</td>
                            <td>${t.j > 0 ? t.e : '_'}</td><td>${t.j > 0 ? t.d : '_'}</td><td>${t.j > 0 ? (t.sg > 0 ? '+' + t.sg : t.sg) : '_'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="match-list">
        `;

        matches.forEach((match, index) => {
            const matchId = `${groupName}-${index}`;
            const s = state[matchId] || { home: '', away: '' };
            const isReadOnly = currentMode === 'live' ? 'readonly' : '';
            
            // Exibe badge de status do jogo se estiver em modo tempo real e houver informações
            const info = liveMatchInfo[matchId];
            let vsDisplay = '<span class="vs-text">X</span>';
            if (currentMode === 'live' && info) {
                if (info.status === 'LIVE') {
                    vsDisplay = `<span class="match-status-badge live">${info.minute}'</span>`;
                } else if (info.status === 'FINISHED') {
                    vsDisplay = `<span class="match-status-badge finished">FIM</span>`;
                }
            }

            tableHTML += `
                <div class="match">
                    <div class="match-team home-team">
                        <img src="${getFlagURL(match.home)}" class="group-flag" alt="${match.home}">
                        <span class="team-name" title="${match.home}">${teamCodes[match.home]}</span>
                    </div>
                    <input type="number" min="0" class="score-input" data-match="${matchId}" data-type="home" value="${s.home}" ${isReadOnly}>
                    ${vsDisplay}
                    <input type="number" min="0" class="score-input" data-match="${matchId}" data-type="away" value="${s.away}" ${isReadOnly}>
                    <div class="match-team away-team">
                        <span class="team-name" title="${match.away}">${teamCodes[match.away]}</span>
                        <img src="${getFlagURL(match.away)}" class="group-flag" alt="${match.away}">
                    </div>
                </div>
            `;
        });

        tableHTML += `</div>`;
        card.innerHTML = tableHTML;
        groupsContainer.appendChild(card);
    }
}

function setupListeners() {
    // Escuta de 'change' (perda de foco) para salvar o histórico sem spam
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('score-input')) {
            saveStateToHistory();
        }
    });

    // Delegação de eventos para inputs de placar e radio buttons (Mata-Mata)
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('score-input')) {
            const matchId = e.target.getAttribute('data-match');
            const type = e.target.getAttribute('data-type');
            
            if (!state[matchId]) state[matchId] = { home: '', away: '' };
            state[matchId][type] = e.target.value;
            
            if (matchId.includes('-') && !matchId.startsWith('ko-')) { 
                updateGroupTables();
                generateKnockoutBracket();
            } else {
                generateKnockoutBracket();
            }
            updateURL();
        }
    });

    // Ações dos novos botões
    document.getElementById('btn-undo').addEventListener('click', () => {
        if (stateHistory.length > 0) {
            const previous = stateHistory.pop();
            for (let key in state) delete state[key];
            Object.assign(state, previous);
            updateURL();
            renderGroups();
            generateKnockoutBracket();
            updateActionButtons();
        }
    });

    document.getElementById('btn-clear-ko').addEventListener('click', () => {
        if(confirm("Tem certeza que deseja limpar todo o mata-mata? Isso apagará todos os resultados eliminatórios.")) {
            saveStateToHistory();
            for (let key in state) {
                if (key.startsWith('ko-')) {
                    delete state[key];
                }
            }
            updateURL();
            generateKnockoutBracket();
        }
    });

    // Reset geral da simulação
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (confirm("Tem certeza que deseja resetar toda a simulação? Isso apagará todos os placares dos grupos e do mata-mata.")) {
                saveStateToHistory();
                for (let key in state) delete state[key];
                updateURL();
                renderGroups();
                generateKnockoutBracket();
            }
        });
    }

    // Share Link
    document.getElementById('btn-share-link').addEventListener('click', () => {
        const url = window.location.href;
        document.getElementById('share-url').value = url;
        document.getElementById('share-modal').classList.remove('hidden');
    });

    document.getElementById('btn-copy-link').addEventListener('click', () => {
        const input = document.getElementById('share-url');
        input.select();
        document.execCommand('copy');
        alert('Link copiado com sucesso!');
        document.getElementById('share-modal').classList.add('hidden');
    });

    document.getElementById('btn-close-modal').addEventListener('click', () => {
        document.getElementById('share-modal').classList.add('hidden');
    });

    // Share Print
    document.getElementById('btn-share-print').addEventListener('click', () => {
        const appElement = document.getElementById('app-container');
        html2canvas(appElement, {
            backgroundColor: '#0f172a',
            scale: 2,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'meu-simulador-copa2026.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    // Imprimir PDF (P&B)
    const btnPrintPdf = document.getElementById('btn-print-pdf');
    if (btnPrintPdf) {
        btnPrintPdf.addEventListener('click', () => {
            window.print();
        });
    }
    // Delegação de eventos para as seleções (abrir estatísticas)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('team-name')) {
            const team = e.target.textContent || e.target.title || e.target.alt;
            openTeamStats(team);
        }
    });

    // Fechar modal de estatísticas
    document.getElementById('btn-close-team-modal').addEventListener('click', () => {
        teamStatsModal.classList.add('hidden');
    });

    // --- Lógica de Políticas de Privacidade e Termos de Uso (AdSense) ---
    const btnOpenPrivacy = document.getElementById('btn-open-privacy');
    const btnOpenTerms = document.getElementById('btn-open-terms');
    const privacyTermsModal = document.getElementById('privacy-terms-modal');
    const policyModalTitle = document.getElementById('policy-modal-title');
    const policyModalContent = document.getElementById('policy-modal-content');
    const btnClosePolicyModal = document.getElementById('btn-close-policy-modal');

    if (btnOpenPrivacy && privacyTermsModal) {
        btnOpenPrivacy.addEventListener('click', (e) => {
            e.preventDefault();
            policyModalTitle.textContent = "Política de Privacidade";
            policyModalContent.innerHTML = PRIVACY_POLICY_HTML;
            privacyTermsModal.classList.remove('hidden');
        });
    }

    if (btnOpenTerms && privacyTermsModal) {
        btnOpenTerms.addEventListener('click', (e) => {
            e.preventDefault();
            policyModalTitle.textContent = "Termos de Uso";
            policyModalContent.innerHTML = TERMS_OF_USE_HTML;
            privacyTermsModal.classList.remove('hidden');
        });
    }

    if (btnClosePolicyModal && privacyTermsModal) {
        btnClosePolicyModal.addEventListener('click', () => {
            privacyTermsModal.classList.add('hidden');
        });
    }
}

// ---- Lógica de Estatísticas (Simulação) ----
function openTeamStats(team) {
    document.getElementById('team-modal-name').textContent = team;
    document.getElementById('team-modal-formation').textContent = "Carregando...";
    document.getElementById('team-modal-stats').innerHTML = "<li>Buscando dados no servidor...</li>";
    teamStatsModal.classList.remove('hidden');

    // Simulando um "fetch" de dados externos (mock)
    setTimeout(() => {
        // Formações fictícias baseadas num padrão
        const formations = ["4-3-3 Ofensivo", "4-4-2 Tradicional", "3-5-2 Equilibrado", "4-2-3-1 Controle"];
        const randomFormation = formations[Math.floor(Math.random() * formations.length)];
        
        // Estatísticas fictícias
        const winRate = Math.floor(Math.random() * 40) + 40; // 40 a 80%
        const goalsAvg = (Math.random() * 2 + 0.5).toFixed(1);

        document.getElementById('team-modal-formation').textContent = randomFormation;
        document.getElementById('team-modal-stats').innerHTML = `
            <li><strong>Média de Gols (Últimos 10 jogos):</strong> ${goalsAvg} gols/jogo</li>
            <li><strong>Taxa de Vitória:</strong> ${winRate}%</li>
            <li><strong>Posse de Bola Média:</strong> ${Math.floor(Math.random() * 20 + 40)}%</li>
            <li><strong>Chutes ao Gol:</strong> ${Math.floor(Math.random() * 10 + 5)} por partida</li>
        `;
    }, 800);
}

// ---- Lógica do Mata-Mata ----
function generateKnockoutBracket() {
    if(!knockoutContainer) return;
    
    // Salvar foco antes de reconstruir para evitar perda de clique/pulos na tela
    const activeEl = document.activeElement;
    let activeMatchId = null;
    let activeType = null;
    let selStart = null;
    let selEnd = null;
    
    if (activeEl && activeEl.classList.contains('score-input')) {
        activeMatchId = activeEl.getAttribute('data-match');
        activeType = activeEl.getAttribute('data-type');
        selStart = activeEl.selectionStart;
        selEnd = activeEl.selectionEnd;
    }

    bracketGrid.innerHTML = '';
    
    // Puxa as tabelas de todos os grupos e separa os terceiros colocados
    let groups = {};
    let thirdPlaces = [];
    
    for (const [groupName, teams] of Object.entries(worldCupGroups)) {
        const table = calculateTable(groupName, teams);
        groups[groupName] = table;
        thirdPlaces.push(table[2]);
    }

    // Ordena os terceiros colocados para pegar os 8 melhores
    thirdPlaces.sort((a, b) => {
        if (b.p !== a.p) return b.p - a.p;
        if (b.sg !== a.sg) return b.sg - a.sg;
        return b.gp - a.gp;
    });

    const bestThirds = thirdPlaces.slice(0, 8);
    let thirdIndex = 0;

    // Chaveamento EXATO oficial (Lado Esquerdo e Lado Direito)
    const matchups = [
        // Lado Esquerdo
        ["1E", "3s"], ["1I", "3s"], ["2A", "2B"], ["1F", "2C"],
        ["2K", "2L"], ["1H", "2J"], ["1D", "3s"], ["1G", "3s"],
        // Lado Direito
        ["1C", "2F"], ["2E", "2I"], ["1A", "3s"], ["1L", "3s"],
        ["1J", "2H"], ["2D", "2G"], ["1B", "3s"], ["1K", "3s"]
    ];

    function getTeamByCode(code) {
        if (!isSimulationStarted()) return "TBD";
        if (code === "3s") {
            const team = bestThirds[thirdIndex++];
            return team ? team.name : "TBD";
        }
        const pos = parseInt(code[0]) - 1;
        const grp = code[1];
        return groups[grp][pos]?.name || "TBD";
    }

    // O Bracket tem 5 Fases (Tiers)
    const rounds = [
        { name: "Dezesseis-avos", matchesCount: 16, tier: 0 },
        { name: "Oitavas", matchesCount: 8, tier: 1 },
        { name: "Quartas", matchesCount: 4, tier: 2 },
        { name: "Semifinal", matchesCount: 2, tier: 3 }
    ];

    const leftSide = document.createElement('div');
    leftSide.className = 'bracket-side left-side';

    const rightSide = document.createElement('div');
    rightSide.className = 'bracket-side right-side';

    const center = document.createElement('div');
    center.className = 'bracket-center';

    let winners = {};

    function getWinner(matchId, teamA, teamB) {
        const s = state[matchId];
        if (s && s.home !== '' && s.away !== '') {
            const h = parseInt(s.home);
            const a = parseInt(s.away);
            if (h > a) return teamA;
            if (a > h) return teamB;
        }
        return "TBD";
    }

    function createMatchHTML(matchId, teamA, teamB) {
        const s = state[matchId] || {};
        winners[matchId] = getWinner(matchId, teamA, teamB);
        
        const flagA = teamA === 'TBD' ? `<div class="team-flag placeholder-flag">?</div>` : `<img src="${getFlagURL(teamA)}" alt="${teamA}" title="${teamA}" class="team-flag team-name" />`;
        const flagB = teamB === 'TBD' ? `<div class="team-flag placeholder-flag">?</div>` : `<img src="${getFlagURL(teamB)}" alt="${teamB}" title="${teamB}" class="team-flag team-name" />`;

        const isReadOnly = currentMode === 'live' ? 'readonly' : '';
        const disabledA = teamA === 'TBD' ? 'disabled' : '';
        const disabledB = teamB === 'TBD' ? 'disabled' : '';

        // Badge de tempo real para o Mata-Mata
        const info = liveMatchInfo[matchId];
        let badgeHTML = '';
        if (currentMode === 'live' && info) {
            if (info.status === 'LIVE') {
                badgeHTML = `<div style="position: absolute; top: -10px; background: #ea4335; color: white; font-size: 0.65rem; font-weight: bold; padding: 2px 6px; border-radius: 10px; border: 1px solid var(--border-color); animation: liveTextPulse 1.5s infinite ease-in-out; z-index: 10;">AO VIVO ${info.minute}'</div>`;
            } else if (info.status === 'FINISHED') {
                badgeHTML = `<div style="position: absolute; top: -10px; background: #10b981; color: white; font-size: 0.65rem; font-weight: bold; padding: 2px 6px; border-radius: 10px; border: 1px solid var(--border-color); z-index: 10;">FIM</div>`;
            }
        }

        return `
            <div class="knockout-match" tabindex="0">
                ${badgeHTML}
                <div class="knockout-team-row">
                    ${flagA}
                    <span class="team-name" title="${teamA}">${teamA === 'TBD' ? '?' : teamCodes[teamA]}</span>
                    <input type="number" min="0" class="score-input" style="margin-left: auto;" data-match="${matchId}" data-type="home" value="${s.home || ''}" ${disabledA} ${isReadOnly}>
                </div>
                <div class="knockout-team-row">
                    ${flagB}
                    <span class="team-name" title="${teamB}">${teamB === 'TBD' ? '?' : teamCodes[teamB]}</span>
                    <input type="number" min="0" class="score-input" style="margin-left: auto;" data-match="${matchId}" data-type="away" value="${s.away || ''}" ${disabledB} ${isReadOnly}>
                </div>
            </div>
        `;
    }

    // Gerar Lados Esquerdo e Direito (Tiers 0 a 3)
    rounds.forEach((round) => {
        const leftCol = document.createElement('div');
        leftCol.className = 'bracket-col';
        const rightCol = document.createElement('div');
        rightCol.className = 'bracket-col';

        for(let i = 0; i < round.matchesCount; i++) {
            let teamA = "TBD";
            let teamB = "TBD";

            if (round.tier === 0) {
                const matchDef = matchups[i];
                teamA = getTeamByCode(matchDef[0]);
                teamB = getTeamByCode(matchDef[1]);
            } else {
                const prevMatchA = `ko-${round.tier - 1}-${i * 2}`;
                const prevMatchB = `ko-${round.tier - 1}-${i * 2 + 1}`;
                teamA = winners[prevMatchA] || "TBD";
                teamB = winners[prevMatchB] || "TBD";
            }
            
            const matchId = `ko-${round.tier}-${i}`;
            const html = createMatchHTML(matchId, teamA, teamB);
            
            // Divide na metade: primeira metade pra esquerda, segunda metade pra direita
            if (i < round.matchesCount / 2) {
                leftCol.innerHTML += html;
            } else {
                rightCol.innerHTML += html;
            }
        }
        
        leftSide.appendChild(leftCol);
        rightSide.appendChild(rightCol);
    });

    // Gerar Final (Tier 4) no Centro
    const finalTier = 4;
    const prevA = `ko-3-0`; // Vencedor da Semifinal 1 (Esquerda)
    const prevB = `ko-3-1`; // Vencedor da Semifinal 2 (Direita)
    let teamAFinal = winners[prevA] || "TBD";
    let teamBFinal = winners[prevB] || "TBD";
    const finalMatchId = `ko-4-0`;

    center.style.position = 'relative';
    center.innerHTML = ''; // Limpa para evitar text nodes fantasma
    
    // Adiciona o título de forma absoluta
    const finalTitle = document.createElement('h3');
    finalTitle.textContent = 'FINAL';
    finalTitle.style.color = 'var(--primary)';
    finalTitle.style.position = 'absolute';
    finalTitle.style.top = '50%';
    finalTitle.style.transform = 'translateY(-80px)';
    finalTitle.style.margin = '0';
    center.appendChild(finalTitle);

    // Adiciona o match diretamente
    const finalHTML = createMatchHTML(finalMatchId, teamAFinal, teamBFinal).replace('class="knockout-match"', 'class="knockout-match final-match"');
    const finalMatchWrapper = document.createElement('div');
    finalMatchWrapper.innerHTML = finalHTML;
    center.appendChild(finalMatchWrapper.firstElementChild);

    // Montar o grid final
    bracketGrid.appendChild(leftSide);
    bracketGrid.appendChild(center);
    bracketGrid.appendChild(rightSide);

    // Restaurar foco e cursor do mouse de forma síncrona
    if (activeMatchId && activeType) {
        const targetInput = bracketGrid.querySelector(`input[data-match="${activeMatchId}"][data-type="${activeType}"]`);
        if (targetInput) {
            targetInput.focus();
            try {
                targetInput.setSelectionRange(selStart, selEnd);
            } catch (err) {}
        }
    }
}

function updateURL() {
    const jsonState = JSON.stringify(state);
    const encoded = btoa(jsonState);
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?sim=' + encoded;
    window.history.replaceState({path: newUrl}, '', newUrl);
}

function loadStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    const simData = params.get('sim');
    if (simData) {
        try {
            const parsed = JSON.parse(atob(simData));
            for (let key in guessesState) delete guessesState[key];
            Object.assign(guessesState, parsed);
        } catch (e) {
            console.error("Erro ao ler o estado da URL", e);
        }
    }
}

// --- Textos de Privacidade e Termos (Necessários para aprovação Google AdSense) ---
const PRIVACY_POLICY_HTML = `
    <p>A sua privacidade é de extrema importância para nós. Esta política de privacidade descreve quais tipos de informações são recebidos e coletados pelo <strong>Simulador da Copa do Mundo 2026</strong> e como essas informações são utilizadas.</p>
    
    <h3 style="margin-top:20px; color:var(--primary); font-size:1.15rem;">1. Coleta de Informações</h3>
    <p>Este site não coleta informações de identificação pessoal (como nome, e-mail ou telefone). O simulador funciona inteiramente de forma local no seu próprio navegador utilizando recursos modernos como o <strong>localStorage</strong> para salvar o progresso dos seus palpites.</p>
    <p>As simulações compartilhadas são codificadas na própria URL (link) que você gera. Não armazenamos seus palpites em bancos de dados externos.</p>
    
    <h3 style="margin-top:20px; color:var(--primary); font-size:1.15rem;">2. Cookies e Web Beacons</h3>
    <p>Nós utilizamos cookies para guardar informações sobre as preferências dos visitantes e registrar informações específicas sobre quais páginas o usuário acessa ou visita, de forma a personalizar o conteúdo da página do navegador.</p>
    
    <h3 style="margin-top:20px; color:var(--primary); font-size:1.15rem;">3. Google AdSense e Cookies de Terceiros</h3>
    <p>Como fornecedor terceirizado, o <strong>Google</strong> utiliza cookies para exibir anúncios neste site. O uso do cookie DoubleClick pelo Google permite que ele exiba anúncios com base nas visitas que você faz a este e a outros sites na internet.</p>
    <p>Os usuários podem desativar o uso do cookie DoubleClick visitando a Política de Privacidade da rede de anúncios e conteúdo do Google.</p>
    <p>Nós não temos controle sobre os cookies que são utilizados por anunciantes terceiros.</p>
    
    <h3 style="margin-top:20px; color:var(--primary); font-size:1.15rem;">4. Consentimento e LGPD</h3>
    <p>Ao utilizar o nosso site, você consente com a nossa política de privacidade. O site está em conformidade com as diretrizes da Lei Geral de Proteção de Dados (LGPD) do Brasil.</p>
`;

const TERMS_OF_USE_HTML = `
    <p>Ao acessar o site <strong>Simulador da Copa do Mundo 2026</strong>, você concorda em cumprir estes termos de uso, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>
    
    <h3 style="margin-top:20px; color:var(--primary); font-size:1.15rem;">1. Uso de Licença</h3>
    <p>O Simulador da Copa do Mundo 2026 é uma ferramenta gratuita de entretenimento para uso pessoal e não comercial. É concedida permissão para simular os jogos, baixar as imagens dos palpites gerados e compartilhar os links criados pelo site.</p>
    <p>Esta licença não permite a modificação, revenda ou distribuição do código-fonte ou dos elementos gráficos proprietários sem a devida autorização.</p>
    
    <h3 style="margin-top:20px; color:var(--primary); font-size:1.15rem;">2. Isenção de Responsabilidade</h3>
    <p>Os materiais no site são fornecidos "como estão". O simulador não oferece garantias, expressas ou implícitas, e por este meio isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual.</p>
    <p>As estatísticas das seleções no modal de informações são baseadas em dados simulados e estimativas, servindo apenas para entretenimento.</p>
    
    <h3 style="margin-top:20px; color:var(--primary); font-size:1.15rem;">3. Limitações</h3>
    <p>Em nenhum caso o Simulador ou seus desenvolvedores serão responsáveis por quaisquer danos decorrentes do uso ou da incapacidade de usar as simulações no site.</p>
`;

// Inicia a aplicação
init();
