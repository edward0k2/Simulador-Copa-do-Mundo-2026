const worldCupGroups = {
  A: ["Estados Unidos", "Alemanha", "Japão", "Austrália"],
  B: ["México", "Holanda", "Senegal", "Coreia do Sul"],
  C: ["Canadá", "França", "Egito", "Nova Zelândia"],
  D: ["Brasil", "Croácia", "Nigéria", "Costa Rica"],
  E: ["Argentina", "Itália", "Camarões", "Irã"],
  F: ["Espanha", "Uruguai", "Marrocos", "Arábia Saudita"],
  G: ["Inglaterra", "Colômbia", "Costa do Marfim", "Catar"],
  H: ["Portugal", "Equador", "Gana", "Emirados Árabes"],
  I: ["Bélgica", "Chile", "Argélia", "Uzbequistão"],
  J: ["Suíça", "Peru", "Tunísia", "Iraque"],
  K: ["Dinamarca", "Suécia", "Mali", "Honduras"],
  L: ["Sérvia", "Polônia", "África do Sul", "Panamá"],
};

const countryCodes = {
    "Estados Unidos": "us", "Alemanha": "de", "Japão": "jp", "Austrália": "au",
    "México": "mx", "Holanda": "nl", "Senegal": "sn", "Coreia do Sul": "kr",
    "Canadá": "ca", "França": "fr", "Egito": "eg", "Nova Zelândia": "nz",
    "Brasil": "br", "Croácia": "hr", "Nigéria": "ng", "Costa Rica": "cr",
    "Argentina": "ar", "Itália": "it", "Camarões": "cm", "Irã": "ir",
    "Espanha": "es", "Uruguai": "uy", "Marrocos": "ma", "Arábia Saudita": "sa",
    "Inglaterra": "gb-eng", "Colômbia": "co", "Costa do Marfim": "ci", "Catar": "qa",
    "Portugal": "pt", "Equador": "ec", "Gana": "gh", "Emirados Árabes": "ae",
    "Bélgica": "be", "Chile": "cl", "Argélia": "dz", "Uzbequistão": "uz",
    "Suíça": "ch", "Peru": "pe", "Tunísia": "tn", "Iraque": "iq",
    "Dinamarca": "dk", "Suécia": "se", "Mali": "ml", "Honduras": "hn",
    "Sérvia": "rs", "Polônia": "pl", "África do Sul": "za", "Panamá": "pa"
};

const teamCodes = {
    "Estados Unidos": "USA", "Alemanha": "GER", "Japão": "JPN", "Austrália": "AUS",
    "México": "MEX", "Holanda": "NED", "Senegal": "SEN", "Coreia do Sul": "KOR",
    "Canadá": "CAN", "França": "FRA", "Egito": "EGY", "Nova Zelândia": "NZL",
    "Brasil": "BRA", "Croácia": "CRO", "Nigéria": "NGA", "Costa Rica": "CRC",
    "Argentina": "ARG", "Itália": "ITA", "Camarões": "CMR", "Irã": "IRN",
    "Espanha": "ESP", "Uruguai": "URU", "Marrocos": "MAR", "Arábia Saudita": "KSA",
    "Inglaterra": "ENG", "Colômbia": "COL", "Costa do Marfim": "CIV", "Catar": "QAT",
    "Portugal": "POR", "Equador": "ECU", "Gana": "GHA", "Emirados Árabes": "UAE",
    "Bélgica": "BEL", "Chile": "CHI", "Argélia": "ALG", "Uzbequistão": "UZB",
    "Suíça": "SUI", "Peru": "PER", "Tunísia": "TUN", "Iraque": "IRQ",
    "Dinamarca": "DEN", "Suécia": "SWE", "Mali": "MLI", "Honduras": "HON",
    "Sérvia": "SRB", "Polônia": "POL", "África do Sul": "RSA", "Panamá": "PAN"
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

let state = {}; // Armazena os placares
let stateHistory = []; // Armazena o histórico de estados

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

// Inicializa o estado e renderiza
function init() {
    loadStateFromURL();
    renderGroups();
    generateKnockoutBracket(); // Mostra o mata-mata desde o início
    setupListeners();
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
                    <td>${t.p}</td><td>${t.j}</td><td>${t.v}</td>
                    <td>${t.e}</td><td>${t.d}</td><td>${t.sg}</td>
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
                            <td>${t.p}</td><td>${t.j}</td><td>${t.v}</td>
                            <td>${t.e}</td><td>${t.d}</td><td>${t.sg}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="match-list">
        `;

        matches.forEach((match, index) => {
            const matchId = `${groupName}-${index}`;
            const s = state[matchId] || { home: '', away: '' };
            tableHTML += `
                <div class="match">
                    <div class="match-team home-team">
                        <img src="${getFlagURL(match.home)}" class="group-flag" alt="${match.home}">
                        <span class="team-name" title="${match.home}">${teamCodes[match.home]}</span>
                    </div>
                    <input type="number" min="0" class="score-input" data-match="${matchId}" data-type="home" value="${s.home}">
                    <span class="vs-text">X</span>
                    <input type="number" min="0" class="score-input" data-match="${matchId}" data-type="away" value="${s.away}">
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
            state = stateHistory.pop();
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
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'meu-simulador-copa2026.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
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
    bracketGrid.innerHTML = '';
    
    // Puxa as tabelas de todos os grupos
    let allGroupsResults = [];
    for (const [groupName, teams] of Object.entries(worldCupGroups)) {
        allGroupsResults.push({ group: groupName, table: calculateTable(groupName, teams) });
    }

    let qualified = [];
    let thirdPlaces = [];
    
    allGroupsResults.forEach(g => {
        qualified.push(g.table[0]);
        qualified.push(g.table[1]);
        thirdPlaces.push(g.table[2]);
    });

    thirdPlaces.sort((a, b) => {
        if (b.p !== a.p) return b.p - a.p;
        if (b.sg !== a.sg) return b.sg - a.sg;
        return b.gp - a.gp;
    });

    qualified = qualified.concat(thirdPlaces.slice(0, 8));

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

        return `
            <div class="knockout-match" tabindex="0">
                <div class="knockout-team-row">
                    ${flagA}
                    <span class="team-name" title="${teamA}">${teamA === 'TBD' ? '?' : teamCodes[teamA]}</span>
                    <input type="number" min="0" class="score-input" style="margin-left: auto;" data-match="${matchId}" data-type="home" value="${s.home || ''}" ${teamA === 'TBD' ? 'disabled' : ''}>
                </div>
                <div class="knockout-team-row">
                    ${flagB}
                    <span class="team-name" title="${teamB}">${teamB === 'TBD' ? '?' : teamCodes[teamB]}</span>
                    <input type="number" min="0" class="score-input" style="margin-left: auto;" data-match="${matchId}" data-type="away" value="${s.away || ''}" ${teamB === 'TBD' ? 'disabled' : ''}>
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
                teamA = qualified[i]?.name || "TBD";
                teamB = qualified[31 - i]?.name || "TBD";
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
            state = JSON.parse(atob(simData));
        } catch (e) {
            console.error("Erro ao ler o estado da URL", e);
        }
    }
}

// Inicia a aplicação
init();
