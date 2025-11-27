// Data for challenges (Dummy Data)
const challengesData = [
    { id: 1, title: "Network Sniffer", category: "Network", points: 100, desc: "A suspicious packet was intercepted. Find the flag!", flag: "CTF{network_packet_1}" },
    { id: 2, title: "Admin Login", category: "Web", points: 200, desc: "Bypass the login to access the admin panel.", flag: "CTF{sql_injection_master}" },
    { id: 3, title: "Hidden Base64", category: "Cryptography", points: 50, desc: "Decode the hidden message: Q1RGe2hlbGxvX3dvcmxkfQ==", flag: "CTF{hello_world}" }
];

// Data for scoreboard (Dummy Data)
const scoreboardData = [
    { name: "Ghost_Root", score: 1500 },
    { name: "Mr.Robot", score: 1250 },
    { name: "ZeroCool", score: 900 }
];


document.addEventListener('DOMContentLoaded', () => {
    // RUN CHALLENGES AND SCOREBOARD IMMEDIATELY
    renderChallenges();
    renderScoreboard(); 
    
    const loginWrapper = document.getElementById('ctf-login-wrapper');
    
    // 1. Logic for showing/hiding the Login Panel
    document.getElementById('ctf-login-nav-btn').addEventListener('click', () => {
        // Toggles the visibility of the login/signup panel
        loginWrapper.style.display = loginWrapper.style.display === 'block' ? 'none' : 'block';
    });

    // 2. Form Submission (Simulated Login/Signup)
    document.getElementById('ctf-submit-auth').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('ctf-auth-message').textContent = 'Simulated Success! Access Granted.';
        // loginWrapper.style.display = 'none'; // Optional: hide panel on success
    });

    // 3. Toggle between Login and Signup forms
    document.getElementById('ctf-toggle-auth').addEventListener('click', (e) => {
        const fields = document.getElementById('ctf-register-fields');
        const btn = document.getElementById('ctf-submit-auth');
        const isHidden = fields.style.display === 'none';
        
        fields.style.display = isHidden ? 'block' : 'none';
        btn.textContent = isHidden ? 'SIGN UP' : 'LOGIN';
        document.getElementById('ctf-toggle-auth').textContent = isHidden ? 'Already have an account? Login' : 'Need an account? Sign Up';
    });
});


// 4. Challenge Rendering (Creates card with two flag inputs)
function renderChallenges() {
    const grid = document.getElementById('ctf-challenges-grid');
    grid.innerHTML = ''; 

    challengesData.forEach(challenge => {
        const card = document.createElement('div');
        card.className = 'ctf-glass-panel ctf-challenge-card'; 
        
        card.innerHTML = 
            `<div style="display:flex; justify-content:space-between; align-items:center;">
                <h3>${challenge.title}</h3>
                <span class="ctf-status-badge ctf-unsolved">${challenge.points} pts</span>
            </div>
            <p style="color:#aaa; font-size:0.9em;">[${challenge.category}]</p>
            <p>${challenge.desc}</p>
            
            <div class="ctf-flag-inputs">
                <input type="text" class="ctf-input-field" id="flag-1-${challenge.id}" placeholder="Flag Part 1 (Optional)">
                <input type="text" class="ctf-input-field" id="flag-2-${challenge.id}" placeholder="Flag Part 2 (Optional)">
                
                <button class="ctf-btn-action" onclick="checkFlag(${challenge.id})">Submit Flags</button>
            </div>
            <p id="msg-${challenge.id}" style="font-size:0.8em; margin-top:5px;"></p>`
        ;
        
        grid.appendChild(card);
    });
}

// 5. Flag Check Function (Checks two potential inputs)
window.checkFlag = function(id) {
    const input1 = document.getElementById(`flag-1-${id}`).value;
    const input2 = document.getElementById(`flag-2-${id}`).value;
    const msg = document.getElementById(`msg-${id}`);
    const challenge = challengesData.find(c => c.id === id);

// Simple check: Correct if either input matches the flag. 
    // You can adjust the logic here for combined flags if needed.
    const isCorrect = (input1 === challenge.flag) || (input2 === challenge.flag);

    if (isCorrect) {
        msg.style.color = "#00ff00";
        msg.textContent = "ACCESS GRANTED ✅";
    } else {
        msg.style.color = "red";
        msg.textContent = "ACCESS DENIED ❌";
    }
}

// 6. Scoreboard Rendering
function renderScoreboard() {
    const tbody = document.querySelector('#ctf-scoreboard-table tbody');
    tbody.innerHTML = ''; 
    scoreboardData.forEach((user, index) => {
        tbody.innerHTML += <tr>
            <td>#${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.score}</td>
        </tr>;
    });
}

// 7. Tab Switching Logic
window.switchTab = function(tabName) {
    const challengesSection = document.getElementById('ctf-challenges-section');
    const scoreboardSection = document.getElementById('ctf-scoreboard-section');
    
    // Update active link style
    document.querySelectorAll('.ctf-nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector([onclick="switchTab('${tabName}')"]).classList.add('active');

    if (tabName === 'challenges') {
        challengesSection.style.display = 'block';
        scoreboardSection.style.display = 'none';
    } else {
        challengesSection.style.display = 'none';
        scoreboardSection.style.display = 'block';
    }
};