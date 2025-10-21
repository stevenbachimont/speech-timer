class TimerManager {
    constructor() {
        this.timers = [];
        this.activeTimerId = null;
        this.intervalId = null;
        this.currentTimerForOptions = null;
        this.fullscreenWindow = null;
        this.fullscreenOptions = {
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            timerSize: 'medium',
            participantMessage: '',
            showMessage: false,
            selectedParticipantId: null
        };
        this.initializeEventListeners();
        this.loadTimersFromStorage();
        this.loadFullscreenOptions();
    }

    initializeEventListeners() {
        // Bouton d'ajout de timer
        document.getElementById('addTimerBtn').addEventListener('click', () => {
            this.showAddTimerModal();
        });

        // Bouton d'aide
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showHelpModal();
        });

        // Modal d'ajout de timer
        const modal = document.getElementById('addTimerModal');
        const form = document.getElementById('addTimerForm');
        const cancelBtn = document.getElementById('cancelAddTimer');
        const closeBtn = document.querySelector('.close');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTimer();
        });

        cancelBtn.addEventListener('click', () => {
            this.hideAddTimerModal();
        });

        // Bouton toggle pour le décompte négatif
        const negativeToggleBtn = document.getElementById('allowNegativeTimeGlobal');
        negativeToggleBtn.addEventListener('click', () => {
            negativeToggleBtn.classList.toggle('active');
        });

        closeBtn.addEventListener('click', () => {
            this.hideAddTimerModal();
        });

        // Modal des participants
        const participantsModal = document.getElementById('participantsModal');
        const closeParticipantsBtn = document.getElementById('closeParticipantsBtn');
        const closeParticipantsModal = document.getElementById('closeParticipantsModal');
        const addParticipantBtn = document.getElementById('addParticipantBtn');

        closeParticipantsBtn.addEventListener('click', () => {
            this.hideParticipantsModal();
        });

        closeParticipantsModal.addEventListener('click', () => {
            this.hideParticipantsModal();
        });

        addParticipantBtn.addEventListener('click', () => {
            this.addParticipant();
        });

        // Fermer les modals en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideAddTimerModal();
            }
        });

        participantsModal.addEventListener('click', (e) => {
            if (e.target === participantsModal) {
                this.hideParticipantsModal();
            }
        });

        // Raccourci clavier pour ajouter un participant
        document.getElementById('participantName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addParticipant();
            }
        });

        // Boutons d'export et d'import
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportTimers();
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importTimers(e.target.files[0]);
        });

        // Options plein écran
        document.getElementById('closeFullscreenOptionsModal').addEventListener('click', () => {
            this.hideFullscreenOptionsModal();
        });

        document.getElementById('closeFullscreenOptionsBtn').addEventListener('click', () => {
            this.hideFullscreenOptionsModal();
        });

        document.getElementById('applyFullscreenOptions').addEventListener('click', () => {
            this.applyFullscreenOptions();
        });

        // Gestion des couleurs
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.updateFullscreenOptionsRealtime();
            });
        });

        // Mise à jour en temps réel des options
        document.getElementById('timerSize').addEventListener('change', () => {
            this.updateFullscreenOptionsRealtime();
        });

        document.getElementById('participantMessage').addEventListener('input', () => {
            // Mettre à jour le message du participant sélectionné
            const timer = this.timers.find(t => t.id === this.currentTimerForOptions);
            const selectedId = document.getElementById('participantSelect').value;
            if (timer && selectedId) {
                const p = timer.participants.find(pp => String(pp.id) === String(selectedId));
                if (p) {
                    p.message = document.getElementById('participantMessage').value;
                    this.saveTimersToStorage();
                    // Mettre à jour le plein écran si ouvert (en envoyant les données du timer)
                    this.syncFullscreen();
                }
            }
            this.updateFullscreenOptionsRealtime();
        });
        
        document.getElementById('showMessage').addEventListener('change', () => {
            this.updateFullscreenOptionsRealtime();
        });
        
        document.getElementById('participantSelect').addEventListener('change', () => {
            // Charger le message du participant sélectionné dans la zone de texte
            const timer = this.timers.find(t => t.id === this.currentTimerForOptions);
            const selectedId = document.getElementById('participantSelect').value;
            if (timer && selectedId) {
                const p = timer.participants.find(pp => String(pp.id) === String(selectedId));
                document.getElementById('participantMessage').value = p ? (p.message || '') : '';
                this.fullscreenOptions.selectedParticipantId = selectedId;
            } else {
                document.getElementById('participantMessage').value = '';
                this.fullscreenOptions.selectedParticipantId = '';
            }
            this.updateFullscreenOptionsRealtime();
        });
        
        document.getElementById('pushMessageBtn').addEventListener('click', () => {
            this.pushMessageToParticipant();
        });

        // Fermer le modal en cliquant à l'extérieur
        document.getElementById('fullscreenOptionsModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('fullscreenOptionsModal')) {
                this.hideFullscreenOptionsModal();
            }
        });

        // Modal d'aide
        document.getElementById('closeHelpModal').addEventListener('click', () => {
            this.hideHelpModal();
        });

        document.getElementById('closeHelpBtn').addEventListener('click', () => {
            this.hideHelpModal();
        });

        // Fermer le modal d'aide en cliquant à l'extérieur
        document.getElementById('helpModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('helpModal')) {
                this.hideHelpModal();
            }
        });
    }

    showAddTimerModal() {
        document.getElementById('addTimerModal').style.display = 'block';
        document.getElementById('timerName').focus();
    }

    hideAddTimerModal() {
        document.getElementById('addTimerModal').style.display = 'none';
        document.getElementById('addTimerForm').reset();
        document.getElementById('allowNegativeTimeGlobal').classList.remove('active');
    }

    showParticipantsModal(timerId) {
        this.currentTimerId = timerId;
        document.getElementById('participantsModal').style.display = 'block';
        this.renderParticipants();
        document.getElementById('participantName').focus();
    }

    hideParticipantsModal() {
        document.getElementById('participantsModal').style.display = 'none';
        document.getElementById('participantName').value = '';
        document.getElementById('participantTime').value = '5';
    }

    addTimer() {
        const name = document.getElementById('timerName').value.trim();
        const allowNegative = document.getElementById('allowNegativeTimeGlobal').classList.contains('active');

        if (!name) {
            alert('Veuillez saisir un nom pour le timer');
            return;
        }

        const timer = {
            id: Date.now(),
            name: name,
            isRunning: false,
            isPaused: false,
            isFinished: false,
            participants: [],
            currentParticipantIndex: 0,
            autoRotation: false,
            totalTimeElapsed: 0, // Temps total écoulé depuis le début
            allowNegative: allowNegative // Option globale de décompte négatif
        };

        this.timers.push(timer);
        this.renderTimers();
        this.saveTimersToStorage();
        this.hideAddTimerModal();
    }

    addParticipant() {
        const name = document.getElementById('participantName').value.trim();
        const time = parseInt(document.getElementById('participantTime').value);

        if (!name || !time) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        const timer = this.timers.find(t => t.id === this.currentTimerId);
        if (!timer) return;

        const participant = {
            id: Date.now(),
            name: name,
            time: time * 60, // Convertir en secondes
            remainingTime: time * 60,
            isFinished: false,
            isPaused: true, // Par défaut en pause
            timeElapsed: 0, // Temps écoulé depuis le début
            message: ''
        };

        timer.participants.push(participant);
        this.renderParticipants();
        this.renderTimers();
        this.saveTimersToStorage();

        // Vider les champs
        document.getElementById('participantName').value = '';
        document.getElementById('participantTime').value = '5';
        document.getElementById('participantName').focus();
    }

    removeParticipant(timerId, participantId) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer) return;

        timer.participants = timer.participants.filter(p => p.id !== participantId);
        
        // Ajuster l'index du participant actuel si nécessaire
        if (timer.currentParticipantIndex >= timer.participants.length) {
            timer.currentParticipantIndex = Math.max(0, timer.participants.length - 1);
        }

        this.renderParticipants();
        this.renderTimers();
        this.saveTimersToStorage();
    }

    updateParticipantTime(timerId, participantId) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer) return;

        const participant = timer.participants.find(p => p.id === participantId);
        if (!participant) return;

        const input = document.getElementById('editTime-' + participantId);
        if (!input) return;

        const newMinutes = parseInt(input.value);
        if (isNaN(newMinutes) || newMinutes < 0) {
            alert('Veuillez saisir un nombre de minutes valide.');
            return;
        }

        const newTotalSeconds = newMinutes * 60;

        // Recalculer remainingTime proportionnellement si le participant est en cours
        const elapsed = participant.time - participant.remainingTime;
        participant.time = newTotalSeconds;
        participant.remainingTime = Math.max(0, newTotalSeconds - elapsed);

        // Ajuster les indicateurs si nécessaire
        if (participant.remainingTime === 0) {
            participant.isFinished = true;
            participant.isPaused = true;
        } else if (participant.isFinished) {
            participant.isFinished = false;
        }

        // Recalcul visuels & sauvegardes
        this.renderParticipants();
        this.renderTimers();
        this.saveTimersToStorage();
        this.syncFullscreen();
    }

    renderParticipants() {
        const timer = this.timers.find(t => t.id === this.currentTimerId);
        if (!timer) return;

        const container = document.getElementById('participantsList');
        container.innerHTML = '';

        if (timer.participants.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Aucun participant ajouté</p>';
            return;
        }

        timer.participants.forEach((participant, index) => {
            const participantDiv = document.createElement('div');
            participantDiv.className = 'participant-item' + (index === timer.currentParticipantIndex ? ' current' : '') + (participant.isFinished ? ' finished' : '');
            
            const progress = ((participant.time - participant.remainingTime) / participant.time) * 100;

            const statusIcon = participant.isFinished ? '✅' : (participant.isPaused ? '⏸️' : '▶️');
            const statusText = participant.isFinished ? 'Terminé' : (participant.isPaused ? 'En pause' : 'En cours');
            
            participantDiv.innerHTML = `
                <div class="participant-info" style="display:flex; flex-direction: column; gap:8px;">
                    <div style="display:flex; align-items:center; justify-content: space-between; gap:10px;">
                        <div class="participant-name" style="font-weight:600;">${statusIcon} ${participant.name}</div>
                        <div style="opacity:0.8; font-size:0.85rem;">${statusText}</div>
                    </div>
                    <div style="display:flex; align-items:center; justify-content: space-between; gap:10px; flex-wrap:wrap;">
                        <div class="participant-time" style="font-size:0.9rem;">
                            Alloué: ${this.formatTime(participant.time)} &nbsp;|&nbsp; Écoulé: ${this.formatTime(participant.timeElapsed)}
                        </div>
                        <div class="participant-remaining" style="font-size:0.95rem; font-weight:600;">Restant: ${this.formatTime(participant.remainingTime)}</div>
                    </div>
                    <div class="participant-progress">
                        <div class="participant-progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                <div class="participant-controls" style="display:flex; align-items:center; justify-content: space-between; gap:12px; flex-wrap:wrap; margin-top:8px;">
                    <div class="edit-time" style="display:flex; align-items:center; gap:8px; flex-wrap: wrap;">
                        <label for="editTime-${participant.id}" style="font-size:0.85rem; opacity:0.8;">Temps (min):</label>
                        <input type="number" id="editTime-${participant.id}" min="0" value="${Math.round(participant.time / 60)}" style="width:70px; padding:4px 6px; font-size:0.85rem;">
                        <button class="btn btn-primary" style="padding:4px 8px; font-size:0.8rem; line-height:1.1;" onclick="timerManager.updateParticipantTime(${timer.id}, ${participant.id})">Mettre à jour</button>
                    </div>
                    <button class="btn btn-danger" style="padding:4px 8px; font-size:0.8rem; line-height:1.1;" onclick="timerManager.removeParticipant(${timer.id}, ${participant.id})">Supprimer</button>
                </div>
            `;

            container.appendChild(participantDiv);
        });
    }

    renderTimers() {
        const container = document.getElementById('timersContainer');
        container.innerHTML = '';

        this.timers.forEach(timer => {
            const timerCard = this.createTimerCard(timer);
            container.appendChild(timerCard);
        });
    }

    createTimerCard(timer) {
        const card = document.createElement('div');
        card.id = 'timer-' + timer.id;

        const currentParticipant = timer.participants[timer.currentParticipantIndex];
        
        // Vérifier l'état du timer selon le pourcentage de temps restant
        const isHalfTime = currentParticipant && currentParticipant.isHalfTime && !currentParticipant.isFinished;
        const isRedTime = currentParticipant && currentParticipant.isRedTime && !currentParticipant.isFinished;
        const isRedBlinkTime = currentParticipant && currentParticipant.isRedBlinkTime && !currentParticipant.isFinished;
        const isNegative = currentParticipant && currentParticipant.isNegative;
        
        let timerStateClass = '';
        if (isNegative) {
            timerStateClass = ' timer-red-blink';
        } else if (isRedBlinkTime) {
            timerStateClass = ' timer-red-blink';
        } else if (isRedTime) {
            timerStateClass = ' timer-red';
        } else if (isHalfTime) {
            timerStateClass = ' timer-orange';
        }
        
        card.className = 'timer-card' + (timer.isRunning ? ' active' : '') + (timer.isFinished ? ' timer-finished' : '') + timerStateClass;
        const participantsSummary = this.getParticipantsSummary(timer);
        
        // Calculer le temps total alloué et le temps écoulé
        const totalAllocatedTime = timer.participants.reduce((sum, p) => sum + p.time, 0);
        const totalElapsedTime = timer.participants.reduce((sum, p) => sum + (p.time - p.remainingTime), 0);
        const progress = totalAllocatedTime > 0 ? (totalElapsedTime / totalAllocatedTime) * 100 : 0;

        // Afficher le temps du participant actuel ou le temps total écoulé
        let displayTime, displayLabel;
        if (currentParticipant && !currentParticipant.isFinished) {
            displayTime = this.formatTime(currentParticipant.remainingTime);
            const statusIcon = currentParticipant.isPaused ? '⏸️' : '▶️';
            displayLabel = statusIcon + ' Temps restant - ' + currentParticipant.name;
        } else if (timer.participants.length > 0) {
            displayTime = this.formatTime(totalElapsedTime);
            displayLabel = 'Temps total écoulé';
        } else {
            displayTime = '00:00';
            displayLabel = 'Aucun participant';
        }

        card.innerHTML = `
            <div class="timer-header">
                <div class="timer-name-container">
                    <div class="timer-name" id="timer-name-${timer.id}">${timer.name}</div>
                    <button class="btn-rename" onclick="timerManager.startRenameTimer(${timer.id})" title="Renommer">✏️</button>
                </div>
                <div class="timer-controls">
                    <button class="btn btn-primary" onclick="timerManager.showParticipantsModal(${timer.id})">Gérer participants</button>
                    <button class="btn btn-secondary" onclick="timerManager.exportSingleTimer(${timer.id})">📤 Export</button>
                    <button class="btn btn-secondary" onclick="timerManager.showImportSingleModal(${timer.id})">📥 Import</button>
                    <button class="btn btn-danger" onclick="timerManager.deleteTimer(${timer.id})">Supprimer</button>
                </div>
            </div>
            <div class="timer-display">
                <div class="time">${displayTime}</div>
                <div class="time-label">${displayLabel}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            ${timer.participants.length > 0 ? `
                <div class="timer-participants">
                    <h4>Participants (${participantsSummary.total}/${participantsSummary.finished})</h4>
                    <div class="participants-grid">
                        ${timer.participants.map((participant, index) => {
                            const isActive = index === timer.currentParticipantIndex;
                            const statusIcon = participant.isFinished ? '✅' : (participant.isPaused ? '⏸️' : '▶️');
                            const progress = ((participant.time - participant.remainingTime) / participant.time) * 100;
                            
                            return `
                                <div class="participant-card ${isActive ? 'active' : ''} ${participant.isFinished ? 'finished' : ''}" 
                                     onclick="timerManager.selectParticipant(${timer.id}, ${index})">
                                    <div class="participant-card-header">
                                        <div class="participant-icon">${statusIcon}</div>
                                        <div class="participant-name">${participant.name}</div>
                                    </div>
                                    <div class="participant-time">
                                        <div class="time-remaining">${this.formatTime(participant.remainingTime)}</div>
                                        <div class="time-elapsed">Écoulé: ${this.formatTime(participant.timeElapsed)}</div>
                                    </div>
                                    <div class="participant-progress">
                                        <div class="progress-fill" style="width: ${progress}%"></div>
                                    </div>
                                    <div class="participant-time-controls">
                                        <button class="btn-time-control" onclick="timerManager.adjustParticipantTime(${timer.id}, ${participant.id}, 10, 'subtract')">-</button>
                                        <button class="btn-time-control" onclick="timerManager.adjustParticipantTime(${timer.id}, ${participant.id}, 10, 'add')">+</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="auto-rotation">
                        <div class="auto-rotation-info">
                            <span>Rotation automatique</span>
                        </div>
                        <div class="auto-rotation-toggle">
                            <span>OFF</span>
                            <div class="toggle-switch ${timer.autoRotation ? 'active' : ''}" onclick="timerManager.toggleAutoRotation(${timer.id})"></div>
                            <span>ON</span>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="timer-participants">
                    <p style="text-align: center; color: #666; padding: 20px;">
                        Aucun participant ajouté. Cliquez sur "Gérer participants" pour en ajouter.
                    </p>
                </div>
            `}
            <div class="timer-actions">
                <button class="btn ${timer.isRunning ? 'btn-warning' : 'btn-success'}" 
                        onclick="timerManager.toggleTimer(${timer.id})">
                    ${timer.isRunning ? 'Pause' : 'Démarrer'}
                </button>
                <button class="btn btn-secondary" onclick="timerManager.resetTimer(${timer.id})">
                    Reset
                </button>
                <button class="btn btn-fullscreen" onclick="timerManager.openFullscreen(${timer.id})">
                    Plein écran
                </button>
                <button class="btn btn-secondary" onclick="timerManager.showFullscreenOptions(${timer.id})">
                    ⚙️ Options
                </button>
            </div>
        `;

        return card;
    }

    getParticipantsSummary(timer) {
        const total = timer.participants.length;
        const finished = timer.participants.filter(p => p.isFinished).length;
        return { total, finished };
    }

    toggleAutoRotation(timerId) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer) return;

        timer.autoRotation = !timer.autoRotation;
        this.renderTimers();
        this.saveTimersToStorage();
    }

    nextParticipant(timerId) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer || timer.participants.length === 0) return;

        // Mettre en pause le participant actuel
        if (timer.currentParticipantIndex < timer.participants.length) {
            timer.participants[timer.currentParticipantIndex].isPaused = true;
        }

        // Passer au suivant
        timer.currentParticipantIndex = (timer.currentParticipantIndex + 1) % timer.participants.length;
        
        // Reprendre le nouveau participant actuel
        if (timer.currentParticipantIndex < timer.participants.length) {
            const nextParticipant = timer.participants[timer.currentParticipantIndex];
            if (!nextParticipant.isFinished) {
                nextParticipant.isPaused = false;
            }
        }
        
        // Si tous les participants sont terminés, arrêter le timer
        if (timer.participants.every(p => p.isFinished)) {
            timer.isFinished = true;
            timer.isRunning = false;
            this.activeTimerId = null;
        }

        this.renderTimers();
        this.saveTimersToStorage();
    }

    selectParticipant(timerId, participantIndex) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer || timer.participants.length === 0 || participantIndex >= timer.participants.length) return;

        // Mettre en pause le participant actuel
        if (timer.currentParticipantIndex < timer.participants.length) {
            timer.participants[timer.currentParticipantIndex].isPaused = true;
        }

        // Sélectionner le nouveau participant
        timer.currentParticipantIndex = participantIndex;
        
        // Reprendre le nouveau participant actuel s'il n'est pas terminé
        const selectedParticipant = timer.participants[participantIndex];
        if (!selectedParticipant.isFinished) {
            selectedParticipant.isPaused = false;
        }

        this.renderTimers();
        this.saveTimersToStorage();
    }

    previousParticipant(timerId) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer || timer.participants.length === 0) return;

        // Mettre en pause le participant actuel
        if (timer.currentParticipantIndex < timer.participants.length) {
            timer.participants[timer.currentParticipantIndex].isPaused = true;
        }

        // Passer au précédent
        timer.currentParticipantIndex = (timer.currentParticipantIndex - 1 + timer.participants.length) % timer.participants.length;
        
        // Reprendre le nouveau participant actuel
        if (timer.currentParticipantIndex < timer.participants.length) {
            const previousParticipant = timer.participants[timer.currentParticipantIndex];
            if (!previousParticipant.isFinished) {
                previousParticipant.isPaused = false;
            }
        }

        this.renderTimers();
        this.saveTimersToStorage();
    }

    toggleTimer(timerId) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer) return;

        // Si un autre timer est en cours, le mettre en pause
        if (this.activeTimerId && this.activeTimerId !== timerId) {
            this.pauseActiveTimer();
        }

        if (timer.isRunning) {
            this.pauseTimer(timerId);
        } else {
            this.startTimer(timerId);
        }
    }

    startTimer(timerId) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer || timer.isFinished) return;

        timer.isRunning = true;
        timer.isPaused = false;
        this.activeTimerId = timerId;

        // Démarrer le participant actuel s'il y en a un
        if (timer.participants.length > 0 && timer.currentParticipantIndex < timer.participants.length) {
            const currentParticipant = timer.participants[timer.currentParticipantIndex];
            if (!currentParticipant.isFinished) {
                currentParticipant.isPaused = false;
            }
        }

        // Démarrer l'intervalle si ce n'est pas déjà fait
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.updateActiveTimer();
            }, 1000);
        }

        this.renderTimers();
        
        // Synchroniser immédiatement avec le plein écran
        this.syncFullscreen();
    }

    pauseTimer(timerId) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer) return;

        timer.isRunning = false;
        timer.isPaused = true;

        // Mettre en pause le participant actuel
        if (timer.participants.length > 0 && timer.currentParticipantIndex < timer.participants.length) {
            timer.participants[timer.currentParticipantIndex].isPaused = true;
        }

        if (this.activeTimerId === timerId) {
            this.activeTimerId = null;
        }

        this.renderTimers();
        
        // Synchroniser immédiatement avec le plein écran
        this.syncFullscreen();
    }

    pauseActiveTimer() {
        if (this.activeTimerId) {
            this.pauseTimer(this.activeTimerId);
        }
    }

    updateActiveTimer() {
        if (!this.activeTimerId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            return;
        }

        const timer = this.timers.find(t => t.id === this.activeTimerId);
        if (!timer || !timer.isRunning) return;

        // Mettre à jour le temps total écoulé
        timer.totalTimeElapsed++;

        // Mettre à jour le participant actuel (seul celui qui n'est pas en pause)
        if (timer.participants.length > 0 && timer.currentParticipantIndex < timer.participants.length) {
            const currentParticipant = timer.participants[timer.currentParticipantIndex];
            if (!currentParticipant.isFinished && !currentParticipant.isPaused) {
                currentParticipant.remainingTime--;
                currentParticipant.timeElapsed++;
                
                // Vérifier si on arrive à la moitié du temps (flash à la moitié)
                const halfTime = Math.floor(currentParticipant.time / 2);
                if (currentParticipant.timeElapsed === halfTime && !currentParticipant.halfTimeFlashTriggered) {
                    this.flashScreen();
                    currentParticipant.halfTimeFlashTriggered = true;
                }
                
                // Marquer le participant comme étant à la moitié du temps
                currentParticipant.isHalfTime = currentParticipant.timeElapsed >= halfTime;
                
                // Marquer le participant selon le pourcentage de temps restant
                const timeRemaining = currentParticipant.remainingTime;
                const totalTime = currentParticipant.time;
                const percentageRemaining = (timeRemaining / totalTime) * 100;
                
                currentParticipant.isRedTime = percentageRemaining <= 20 && percentageRemaining > 10;
                currentParticipant.isRedBlinkTime = percentageRemaining <= 10;
                
                // Si le temps du participant est écoulé
                if (currentParticipant.remainingTime <= 0) {
                    if (timer.allowNegative) {
                        // Si le décompte négatif est autorisé globalement, continuer le décompte
                        currentParticipant.isNegative = true;
                    } else {
                        // Si le décompte négatif n'est pas autorisé, arrêter à 0
                        currentParticipant.remainingTime = 0;
                        currentParticipant.isFinished = true;
                        currentParticipant.isPaused = true;
                        
                        // Rotation automatique si activée
                        if (timer.autoRotation) {
                            this.nextParticipant(timer.id);
                        } else {
                            // Si pas de rotation automatique, arrêter le timer
                            timer.isRunning = false;
                            this.activeTimerId = null;
                            this.playNotificationSound();
                        }
                    }
                }
            }
        } else if (timer.participants.length === 0) {
            // Si aucun participant, arrêter le timer
            timer.isRunning = false;
            this.activeTimerId = null;
        }

        this.renderTimers();
        this.saveTimersToStorage();
    }

    resetTimer(timerId) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer) return;

        timer.isRunning = false;
        timer.isPaused = false;
        timer.isFinished = false;
        timer.currentParticipantIndex = 0;
        timer.totalTimeElapsed = 0;

        // Reset tous les participants
        timer.participants.forEach(participant => {
            participant.remainingTime = participant.time;
            participant.isFinished = false;
            participant.isPaused = true; // Par défaut en pause
            participant.timeElapsed = 0;
            participant.halfTimeFlashTriggered = false; // Reset du flag de flash
            participant.isNegative = false; // Reset de l'état négatif
            
            // Recalculer les états de couleur
            const totalTime = participant.time;
            const timeRemaining = participant.remainingTime;
            const percentageRemaining = (timeRemaining / totalTime) * 100;
            
            participant.isHalfTime = false;
            participant.isRedTime = percentageRemaining <= 20 && percentageRemaining > 10;
            participant.isRedBlinkTime = percentageRemaining <= 10;
        });

        if (this.activeTimerId === timerId) {
            this.activeTimerId = null;
        }

        this.renderTimers();
        this.saveTimersToStorage();
        
        // Synchroniser immédiatement avec le plein écran
        this.syncFullscreen();
    }

    adjustParticipantTime(timerId, participantId, seconds, operation) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer) return;

        const participant = timer.participants.find(p => p.id === participantId);
        if (!participant) return;

        if (operation === 'add') {
            // Ajouter du temps
            participant.time += seconds;
            participant.remainingTime += seconds;
            
            // Réinitialiser les états de couleur si le temps redevient positif
            if (participant.remainingTime > 0) {
                participant.isNegative = false;
                participant.isFinished = false;
                participant.isPaused = false;
                
                // Recalculer les états de couleur
                const totalTime = participant.time;
                const timeRemaining = participant.remainingTime;
                const percentageRemaining = (timeRemaining / totalTime) * 100;
                
                participant.isHalfTime = participant.timeElapsed >= Math.floor(totalTime / 2);
                participant.isRedTime = percentageRemaining <= 20 && percentageRemaining > 10;
                participant.isRedBlinkTime = percentageRemaining <= 10;
            }
        } else if (operation === 'subtract') {
            // Enlever du temps (mais pas plus que le temps restant)
            const maxToSubtract = Math.min(seconds, participant.remainingTime);
            participant.time -= maxToSubtract;
            participant.remainingTime -= maxToSubtract;
            
            // Si le temps restant devient 0, marquer comme terminé
            if (participant.remainingTime <= 0) {
                participant.remainingTime = 0;
                participant.isFinished = true;
                participant.isPaused = true;
            }
        }

        this.renderTimers();
        this.saveTimersToStorage();
        
        // Synchroniser avec le plein écran
        this.syncFullscreen();
    }

    deleteTimer(timerId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce timer ?')) {
            this.timers = this.timers.filter(t => t.id !== timerId);
            
            if (this.activeTimerId === timerId) {
                this.activeTimerId = null;
            }

            this.renderTimers();
            this.saveTimersToStorage();
        }
    }

    openFullscreen(timerId) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer) return;

        // Récupérer la préférence utilisateur pour le mode plein écran
        const fullscreenMode = document.getElementById('fullscreenMode').value;
        
        // Déterminer le mode d'ouverture selon la préférence
        let windowFeatures;
        if (fullscreenMode === 'window') {
            // Toujours en fenêtre d'abord
            windowFeatures = 'width=1200,height=800,left=100,top=100,resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no';
        } else if (fullscreenMode === 'fullscreen') {
            // Toujours directement plein écran
            windowFeatures = 'fullscreen=yes';
        } else {
            // Mode automatique : détecter Windows
            const isWindows = navigator.platform.toLowerCase().includes('win') || 
                             navigator.userAgent.toLowerCase().includes('windows');
            windowFeatures = isWindows ? 
                'width=1200,height=800,left=100,top=100,resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no' :
                'fullscreen=yes';
        }
        
        this.fullscreenWindow = window.open('', '_blank', windowFeatures);
        
        if (this.fullscreenWindow) {
            const currentParticipant = timer.participants[timer.currentParticipantIndex];
            const participantsHtml = timer.participants.length > 0 ? `
                <div class="participants-info">
                    <h3>Participants</h3>
                    <div class="participants-list">
                        ${timer.participants.map((p, index) => {
                            const isActive = index === timer.currentParticipantIndex;
                            const statusIcon = p.isFinished ? '✅' : (p.isPaused ? '⏸️' : '▶️');
                            const progress = ((p.time - p.remainingTime) / p.time) * 100;
                            
                            return `
                                <div class="participant-item ${isActive ? 'current' : ''} ${p.isFinished ? 'finished' : ''}">
                                    <div class="participant-header">
                                        <span class="participant-icon">${statusIcon}</span>
                                        <span class="participant-name">${p.name}</span>
                                    </div>
                                    <div class="participant-times">
                                        <div class="time-remaining">Restant: ${this.formatTime(p.remainingTime)}</div>
                                        <div class="time-elapsed">Écoulé: ${this.formatTime(p.timeElapsed)}</div>
                                    </div>
                                    <div class="participant-progress">
                                        <div class="progress-fill" style="width: ${progress}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : '';

            // Calculer le temps à afficher
            const totalAllocatedTime = timer.participants.reduce((sum, p) => sum + p.time, 0);
            const totalElapsedTime = timer.participants.reduce((sum, p) => sum + (p.time - p.remainingTime), 0);
            const progress = totalAllocatedTime > 0 ? (totalElapsedTime / totalAllocatedTime) * 100 : 0;
            
            let displayTime, displayLabel;
            if (currentParticipant && !currentParticipant.isFinished) {
                displayTime = this.formatTime(currentParticipant.remainingTime);
                const statusIcon = currentParticipant.isPaused ? '⏸️' : '▶️';
                displayLabel = statusIcon + ' Temps restant - ' + currentParticipant.name;
            } else if (timer.participants.length > 0) {
                displayTime = this.formatTime(totalElapsedTime);
                displayLabel = 'Temps total écoulé';
            } else {
                displayTime = '00:00';
                displayLabel = 'Aucun participant';
            }

            const timerJson = JSON.stringify(timer);
            const isRunningJson = timer.isRunning;
            const backgroundColor = this.fullscreenOptions.backgroundColor;
            const timerSize = this.getTimerSize();
            
            // Ajouter des boutons de contrôle selon le mode
            const showControls = fullscreenMode === 'window' || (fullscreenMode === 'auto' && 
                (navigator.platform.toLowerCase().includes('win') || navigator.userAgent.toLowerCase().includes('windows')));
            
            const fullscreenButton = showControls ? `
                <div class="fullscreen-controls">
                    <button id="enterFullscreenBtn" class="btn btn-primary">📺 Passer en plein écran</button>
                    <button id="closeWindowBtn" class="btn btn-secondary">❌ Fermer</button>
                </div>
            ` : '';

            this.fullscreenWindow.document.write(`
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Timer - ${timer.name}</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background: ${backgroundColor};
                            height: 100vh;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            color: white;
                            overflow: hidden;
                        }
                        
                        .current-participant-title {
                            font-size: 4rem;
                            margin-bottom: 20px;
                            font-weight: 300;
                            text-align: center;
                            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                        }
                        
                        .current-participant-time {
                            font-size: ${timerSize};
                            font-weight: 300;
                            margin: 30px 0;
                            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                            text-align: center;
                            font-family: 'Courier New', monospace;
                            transition: color 0.3s ease;
                        }
                        
                        /* Timer orange quand à la moitié du temps */
                        .timer-orange .current-participant-time {
                            color: #ff8c00;
                            text-shadow: 0 0 20px rgba(255, 140, 0, 0.5);
                        }
                        
                        /* Timer rouge quand il reste 20% du temps */
                        .timer-red .current-participant-time {
                            color: #dc2626;
                            text-shadow: 0 0 25px rgba(220, 38, 38, 0.6);
                        }
                        
                        /* Timer rouge clignotant dans les 10 derniers pourcents */
                        .timer-red-blink .current-participant-time {
                            color: #dc2626;
                            text-shadow: 0 0 30px rgba(220, 38, 38, 0.8);
                            animation: blink-red-fullscreen 0.5s infinite alternate;
                        }
                        
                        @keyframes blink-red-fullscreen {
                            0% {
                                opacity: 1;
                                transform: scale(1);
                            }
                            100% {
                                opacity: 0.7;
                                transform: scale(1.05);
                            }
                        }
                        
                        .participant-message {
                            font-size: 1.5rem;
                            margin: 20px 0;
                            padding: 15px 30px;
                            text-align: center;
                            max-width: 100%;
                        }
                        
                        .fullscreen-timer .progress-bar {
                            width: 80%;
                            max-width: 600px;
                            height: 12px;
                            background: rgba(255, 255, 255, 0.3);
                            border-radius: 6px;
                            margin: 30px 0;
                            overflow: hidden;
                        }
                        
                        .fullscreen-timer .progress-fill {
                            height: 100%;
                            background: linear-gradient(45deg, #51cf66, #40c057);
                            border-radius: 6px;
                            transition: width 0.3s ease;
                            box-shadow: 0 0 20px rgba(81, 207, 102, 0.5);
                        }
                        
                        .timer-finished {
                            /* Pas d'animation de pulsation */
                        }
                        
                        .participants-info {
                            margin-top: 30px;
                            text-align: center;
                        }
                        
                        .participants-info h3 {
                            font-size: 1.5rem;
                            margin-bottom: 20px;
                        }
                        
                        .participants-list {
                            display: flex;
                            gap: 20px;
                            justify-content: center;
                            flex-wrap: wrap;
                        }
                        
                        .participant-item {
                            background: rgba(255, 255, 255, 0.1);
                            padding: 15px;
                            border-radius: 10px;
                            backdrop-filter: blur(10px);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            min-width: 200px;
                            text-align: center;
                        }
                        
                        .participant-item.current {
                            background: rgba(81, 207, 102, 0.3);
                            border-color: #51cf66;
                        }
                        
                        .participant-item.finished {
                            opacity: 0.5;
                        }
                        
                        .participant-header {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            margin-bottom: 10px;
                        }
                        
                        .participant-icon {
                            font-size: 1.2rem;
                        }
                        
                        .participant-name {
                            font-weight: 600;
                            font-size: 1.1rem;
                        }
                        
                        .participant-times {
                            margin-bottom: 10px;
                        }
                        
                        .time-remaining {
                            font-size: 1.2rem;
                            font-weight: 600;
                            margin-bottom: 5px;
                            font-family: 'Courier New', monospace;
                        }
                        
                        .time-elapsed {
                            font-size: 0.9rem;
                            opacity: 0.8;
                        }
                        
                        .participant-progress {
                            width: 100%;
                            height: 6px;
                            background: rgba(255, 255, 255, 0.3);
                            border-radius: 3px;
                            overflow: hidden;
                        }
                        
                        .participant-progress .progress-fill {
                            height: 100%;
                            background: linear-gradient(45deg, #51cf66, #40c057);
                            border-radius: 3px;
                            transition: width 0.3s ease;
                        }
                        
                        .fullscreen-controls {
                            display: flex;
                            gap: 20px;
                            margin-top: 30px;
                            justify-content: center;
                        }
                        
                        .fullscreen-controls .btn {
                            padding: 15px 30px;
                            font-size: 1.2rem;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        }
                        
                        .btn-primary {
                            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                            color: white;
                            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
                        }
                        
                        .btn-primary:hover {
                            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
                            transform: translateY(-2px);
                        }
                        
                        .btn-secondary {
                            background: #6c757d;
                            color: white;
                        }
                        
                        .btn-secondary:hover {
                            background: #5a6268;
                            transform: translateY(-2px);
                        }
                        
                        @media (max-width: 768px) {
                            .current-participant-title {
                                font-size: 2.5rem;
                            }
                            
                            .current-participant-time {
                                font-size: 4rem;
                            }
                            
                            .participants-list {
                                flex-direction: column;
                                align-items: center;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="fullscreen-timer ${timer.isFinished ? 'timer-finished' : ''} ${currentParticipant && currentParticipant.isRedBlinkTime && !currentParticipant.isFinished ? 'timer-red-blink' : currentParticipant && currentParticipant.isRedTime && !currentParticipant.isFinished ? 'timer-red' : currentParticipant && currentParticipant.isHalfTime && !currentParticipant.isFinished ? 'timer-orange' : ''}">
                        <h1 class="current-participant-title">
                            ${currentParticipant ? currentParticipant.name : 'Aucun participant'}
                        </h1>
                        <div class="current-participant-time">
                            ${currentParticipant ? this.formatTime(currentParticipant.remainingTime) : '00:00'}
                        </div>
                         <div class="participant-message" style="display: none;"></div>
                        ${participantsHtml}
                        ${fullscreenButton}
                    </div>
                    
                    <script>
                        let timerData = ${timerJson};
                        let isRunning = ${isRunningJson};
                        let intervalId = null;
                        let fullscreenOptions = {
                            backgroundColor: '${backgroundColor}',
                            timerSize: 'medium',
                            participantMessage: '',
                            showMessage: false,
                            selectedParticipantId: null
                        };
                        
                        function formatTime(seconds) {
                            const isNegative = seconds < 0;
                            const absSeconds = Math.abs(seconds);
                            const hours = Math.floor(absSeconds / 3600);
                            const minutes = Math.floor((absSeconds % 3600) / 60);
                            const secs = absSeconds % 60;
                            
                            let timeString;
                            if (hours > 0) {
                                timeString = hours.toString().padStart(2, '0') + ':' + 
                                           minutes.toString().padStart(2, '0') + ':' + 
                                           secs.toString().padStart(2, '0');
                            } else {
                                timeString = minutes.toString().padStart(2, '0') + ':' + 
                                           secs.toString().padStart(2, '0');
                            }
                            
                            return isNegative ? '-' + timeString : timeString;
                        }
                        
                        function updateDisplay() {
                            const currentParticipant = timerData.participants[timerData.currentParticipantIndex];
                            
                            // Mettre à jour le titre et le temps du participant actuel
                            document.querySelector('.current-participant-title').textContent = 
                                currentParticipant ? currentParticipant.name : 'Aucun participant';
                            document.querySelector('.current-participant-time').textContent = 
                                currentParticipant ? formatTime(currentParticipant.remainingTime) : '00:00';
                            
                            // Mettre à jour la classe de couleur pour le timer plein écran
                            const fullscreenTimer = document.querySelector('.fullscreen-timer');
                            if (fullscreenTimer) {
                                // Supprimer toutes les classes de couleur
                                fullscreenTimer.classList.remove('timer-orange', 'timer-red', 'timer-red-blink', 'timer-negative');
                                
                                // Ajouter la classe appropriée selon l'état
                                if (currentParticipant && !currentParticipant.isFinished) {
                                    if (currentParticipant.isNegative) {
                                        fullscreenTimer.classList.add('timer-red-blink');
                                    } else if (currentParticipant.isRedBlinkTime) {
                                        fullscreenTimer.classList.add('timer-red-blink');
                                    } else if (currentParticipant.isRedTime) {
                                        fullscreenTimer.classList.add('timer-red');
                                    } else if (currentParticipant.isHalfTime) {
                                        fullscreenTimer.classList.add('timer-orange');
                                    }
                                }
                            }
                            
                            // Mettre à jour tous les participants dans la liste
                            const participantItems = document.querySelectorAll('.participant-item');
                            participantItems.forEach((item, index) => {
                                if (timerData.participants[index]) {
                                    const participant = timerData.participants[index];
                                    const isActive = index === timerData.currentParticipantIndex;
                                    const statusIcon = participant.isFinished ? '✅' : (participant.isPaused ? '⏸️' : '▶️');
                                    const progress = ((participant.time - participant.remainingTime) / participant.time) * 100;
                                    
                                    // Mettre à jour les classes
                                    item.className = 'participant-item' + (isActive ? ' current' : '') + (participant.isFinished ? ' finished' : '');
                                    
                                    // Mettre à jour le contenu
                                    const header = item.querySelector('.participant-header');
                                    const times = item.querySelector('.participant-times');
                                    const progressBar = item.querySelector('.participant-progress .progress-fill');
                                    
                                    if (header) {
                                        header.innerHTML = 
                                            '<span class="participant-icon">' + statusIcon + '</span>' +
                                            '<span class="participant-name">' + participant.name + '</span>';
                                    }
                                    
                                    if (times) {
                                        times.innerHTML = 
                                            '<div class="time-remaining">Restant: ' + formatTime(participant.remainingTime) + '</div>' +
                                            '<div class="time-elapsed">Écoulé: ' + formatTime(participant.timeElapsed) + '</div>';
                                    }
                                    
                                    if (progressBar) {
                                        progressBar.style.width = progress + '%';
                                    }
                                }
                            });
                            
                            // Vérifier si tous les participants sont terminés
                            if (timerData.participants.length > 0 && timerData.participants.every(p => p.isFinished)) {
                                document.body.classList.add('timer-finished');
                            }
                            
                            // Mettre à jour le message en fonction du participant courant (affiche dès qu'il existe)
                            const messageElement = document.querySelector('.participant-message');
                            if (messageElement) {
                                const text = currentParticipant ? (currentParticipant.message || '').trim() : '';
                                if (text) {
                                    messageElement.textContent = text;
                                    messageElement.style.display = 'block';
                                } else {
                                    messageElement.style.display = 'none';
                                }
                            }
                        }
                        
                        // Synchroniser avec la fenêtre parent
                        setInterval(() => {
                            if (window.opener && !window.opener.closed) {
                                const parentTimer = window.opener.timerManager.timers.find(t => t.id === timerData.id);
                                if (parentTimer) {
                                    timerData.isRunning = parentTimer.isRunning;
                                    timerData.isFinished = parentTimer.isFinished;
                                    timerData.currentParticipantIndex = parentTimer.currentParticipantIndex;
                                    timerData.participants = parentTimer.participants;
                                    timerData.totalTimeElapsed = parentTimer.totalTimeElapsed;
                                    updateDisplay();
                                }
                            }
                        }, 200);
                        
                        // Écouter les mises à jour d'options et la synchronisation
                        window.addEventListener('message', (event) => {
                            if (event.data.type === 'updateOptions') {
                                updateFullscreenOptions(event.data.options);
                            } else if (event.data.type === 'syncTimer') {
                                timerData = event.data.timer;
                                updateDisplay();
                            } else if (event.data.type === 'flashScreen') {
                                flashFullscreenScreen();
                            }
                        });
                        
                        // Gérer les boutons de contrôle pour Windows
                        const enterFullscreenBtn = document.getElementById('enterFullscreenBtn');
                        const closeWindowBtn = document.getElementById('closeWindowBtn');
                        
                        if (enterFullscreenBtn) {
                            enterFullscreenBtn.addEventListener('click', () => {
                                // Passer en plein écran
                                if (document.documentElement.requestFullscreen) {
                                    document.documentElement.requestFullscreen();
                                } else if (document.documentElement.webkitRequestFullscreen) {
                                    document.documentElement.webkitRequestFullscreen();
                                } else if (document.documentElement.msRequestFullscreen) {
                                    document.documentElement.msRequestFullscreen();
                                }
                            });
                        }
                        
                        if (closeWindowBtn) {
                            closeWindowBtn.addEventListener('click', () => {
                                window.close();
                            });
                        }
                        
                        function flashFullscreenScreen() {
                            const flash = document.createElement('div');
                            flash.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; z-index: 9999; pointer-events: none; opacity: 0; transition: opacity 0.1s ease;';
                            document.body.appendChild(flash);
                            requestAnimationFrame(() => {
                                flash.style.opacity = '0.8';
                                setTimeout(() => {
                                    flash.style.opacity = '0';
                                    setTimeout(() => {
                                        document.body.removeChild(flash);
                                    }, 100);
                                }, 200);
                            });
                        }
                        
                        function updateFullscreenOptions(options) {
                            fullscreenOptions = options;
                            document.body.style.background = options.backgroundColor;
                            const timerElement = document.querySelector('.current-participant-time');
                            if (timerElement) {
                                const sizes = {
                                    'small': '6rem',
                                    'medium': '8rem',
                                    'large': '10rem',
                                    'xlarge': '12rem'
                                };
                                timerElement.style.fontSize = sizes[options.timerSize] || '8rem';
                            }
                        }
                    </script>
                </body>
                </html>
            `);
            this.fullscreenWindow.document.close();
        }
    }

    formatTime(seconds) {
        const isNegative = seconds < 0;
        const absSeconds = Math.abs(seconds);
        const hours = Math.floor(absSeconds / 3600);
        const minutes = Math.floor((absSeconds % 3600) / 60);
        const secs = absSeconds % 60;
        
        let timeString;
        if (hours > 0) {
            timeString = hours.toString().padStart(2, '0') + ':' + 
                        minutes.toString().padStart(2, '0') + ':' + 
                        secs.toString().padStart(2, '0');
        } else {
            timeString = minutes.toString().padStart(2, '0') + ':' + 
                        secs.toString().padStart(2, '0');
        }
        
        return isNegative ? '-' + timeString : timeString;
    }

    playNotificationSound() {
        // Créer un son de notification simple
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    flashScreen() {
        // Créer un flash blanc sur toute la fenêtre
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: white;
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.1s ease;
        `;
        
        document.body.appendChild(flash);
        
        // Animation du flash
        requestAnimationFrame(() => {
            flash.style.opacity = '0.8';
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(flash);
                }, 100);
            }, 200);
        });
        
        // Flash aussi dans la fenêtre plein écran si elle est ouverte
        if (this.fullscreenWindow && !this.fullscreenWindow.closed) {
            this.fullscreenWindow.postMessage({
                type: 'flashScreen'
            }, '*');
        }
    }

    saveTimersToStorage() {
        localStorage.setItem('speechTimers', JSON.stringify(this.timers));
    }

    loadTimersFromStorage() {
        const saved = localStorage.getItem('speechTimers');
        if (saved) {
            this.timers = JSON.parse(saved);
            this.renderTimers();
        }
    }

    exportTimers() {
        if (this.timers.length === 0) {
            alert('Aucun timer à exporter');
            return;
        }

        try {
            // Créer le XML avec métadonnées
            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            xml += '<speechTimers version="2.0" exportDate="' + new Date().toISOString() + '">\n';
            
            // Métadonnées d'export
            xml += '  <exportInfo>\n';
            xml += '    <version>2.0</version>\n';
            xml += '    <exportDate>' + new Date().toISOString() + '</exportDate>\n';
            xml += '    <totalTimers>' + this.timers.length + '</totalTimers>\n';
            xml += '    <totalParticipants>' + this.timers.reduce((sum, t) => sum + t.participants.length, 0) + '</totalParticipants>\n';
            xml += '  </exportInfo>\n';
            
            this.timers.forEach(timer => {
                xml += '  <timer>\n';
                xml += '    <id>' + timer.id + '</id>\n';
                xml += '    <name>' + this.escapeXml(timer.name) + '</name>\n';
                xml += '    <isRunning>' + timer.isRunning + '</isRunning>\n';
                xml += '    <isPaused>' + timer.isPaused + '</isPaused>\n';
                xml += '    <isFinished>' + timer.isFinished + '</isFinished>\n';
                xml += '    <currentParticipantIndex>' + timer.currentParticipantIndex + '</currentParticipantIndex>\n';
                xml += '    <autoRotation>' + timer.autoRotation + '</autoRotation>\n';
                xml += '    <allowNegative>' + (timer.allowNegative || false) + '</allowNegative>\n';
                xml += '    <totalTimeElapsed>' + timer.totalTimeElapsed + '</totalTimeElapsed>\n';
                xml += '    <participantCount>' + timer.participants.length + '</participantCount>\n';
                
                xml += '    <participants>\n';
                timer.participants.forEach((participant, index) => {
                    xml += '      <participant index="' + index + '">\n';
                    xml += '        <id>' + participant.id + '</id>\n';
                    xml += '        <name>' + this.escapeXml(participant.name) + '</name>\n';
                    xml += '        <time>' + participant.time + '</time>\n';
                    xml += '        <remainingTime>' + participant.remainingTime + '</remainingTime>\n';
                    xml += '        <isFinished>' + participant.isFinished + '</isFinished>\n';
                    xml += '        <isPaused>' + participant.isPaused + '</isPaused>\n';
                    xml += '        <timeElapsed>' + participant.timeElapsed + '</timeElapsed>\n';
                    xml += '        <message>' + this.escapeXml(participant.message || '') + '</message>\n';
                    xml += '        <progress>' + Math.round(((participant.time - participant.remainingTime) / participant.time) * 100) + '</progress>\n';
                    xml += '      </participant>\n';
                });
                xml += '    </participants>\n';
                
                xml += '  </timer>\n';
            });
            
            // Options plein écran avec validation
            xml += '  <fullscreenOptions>\n';
            xml += '    <backgroundColor>' + this.escapeXml(this.fullscreenOptions.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)') + '</backgroundColor>\n';
            xml += '    <timerSize>' + this.escapeXml(this.fullscreenOptions.timerSize || 'medium') + '</timerSize>\n';
            xml += '    <participantMessage>' + this.escapeXml(this.fullscreenOptions.participantMessage || '') + '</participantMessage>\n';
            xml += '    <showMessage>' + (this.fullscreenOptions.showMessage || false) + '</showMessage>\n';
            xml += '    <selectedParticipantId>' + this.escapeXml(this.fullscreenOptions.selectedParticipantId || '') + '</selectedParticipantId>\n';
            xml += '  </fullscreenOptions>\n';
            xml += '</speechTimers>';

            // Créer et télécharger le fichier
            const blob = new Blob([xml], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Nom de fichier avec date et heure complètes
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
            const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
            a.download = 'speech-timers-v2-' + dateStr + '-' + timeStr + '.xml';
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('Export réussi:', this.timers.length + ' timer(s) exporté(s)');
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
            alert('Erreur lors de l\'export: ' + error.message);
        }
    }

    importTimers(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const xmlText = e.target.result;
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
                
                // Vérifier si le XML est valide
                if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
                    const errorText = xmlDoc.getElementsByTagName('parsererror')[0].textContent;
                    console.error('Erreur XML:', errorText);
                    alert('Erreur: Le fichier XML n\'est pas valide. Détails: ' + errorText);
                    return;
                }
                
                // Vérifier la structure de base (support des deux formats)
                const speechTimers = xmlDoc.getElementsByTagName('speechTimers');
                const speechTimer = xmlDoc.getElementsByTagName('speechTimer');
                
                if (speechTimers.length === 0 && speechTimer.length === 0) {
                    alert('Erreur: Le fichier ne contient pas de structure speechTimers ou speechTimer valide');
                    return;
                }

                // Déterminer le format et récupérer les métadonnées
                let version = '1.0';
                let exportInfo = null;
                let timers = null;
                
                if (speechTimers.length > 0) {
                    // Format multiple timers
                    version = speechTimers[0].getAttribute('version') || '1.0';
                    exportInfo = xmlDoc.getElementsByTagName('exportInfo')[0];
                    timers = xmlDoc.getElementsByTagName('timer');
                } else if (speechTimer.length > 0) {
                    // Format single timer
                    version = speechTimer[0].getAttribute('version') || '1.0';
                    exportInfo = xmlDoc.getElementsByTagName('exportInfo')[0];
                    timers = xmlDoc.getElementsByTagName('timer');
                }
                
                let importStats = { timers: 0, participants: 0, version: version };

                if (exportInfo) {
                    importStats.timers = parseInt(this.getXmlText(exportInfo, 'totalTimers')) || timers.length;
                    importStats.participants = parseInt(this.getXmlText(exportInfo, 'totalParticipants')) || 0;
                    console.log('Import depuis version:', version, 'avec', importStats.timers, 'timer(s) et', importStats.participants, 'participant(s)');
                }
                const importedTimers = [];

                for (let i = 0; i < timers.length; i++) {
                    const timer = timers[i];
                    const newTimer = {
                        id: Date.now() + i, // Nouvel ID pour éviter les conflits
                        name: this.getXmlText(timer, 'name') || 'Timer sans nom',
                        isRunning: false, // Toujours arrêté à l'import
                        isPaused: false,
                        isFinished: false,
                        currentParticipantIndex: parseInt(this.getXmlText(timer, 'currentParticipantIndex')) || 0,
                        autoRotation: this.getXmlText(timer, 'autoRotation') === 'true',
                        allowNegative: this.getXmlText(timer, 'allowNegative') === 'true',
                        totalTimeElapsed: 0, // Reset à l'import
                        participants: []
                    };

                    // Importer les participants avec validation
                    const participants = timer.getElementsByTagName('participant');
                    for (let j = 0; j < participants.length; j++) {
                        const participant = participants[j];
                            const participantData = {
                            id: Date.now() + i * 1000 + j, // Nouvel ID
                            name: this.getXmlText(participant, 'name') || 'Participant sans nom',
                            time: Math.max(0, parseInt(this.getXmlText(participant, 'time')) || 0),
                            remainingTime: Math.max(0, parseInt(this.getXmlText(participant, 'remainingTime')) || 0),
                            isFinished: this.getXmlText(participant, 'isFinished') === 'true',
                            isPaused: true, // Toujours en pause à l'import
                                timeElapsed: Math.max(0, parseInt(this.getXmlText(participant, 'timeElapsed')) || 0),
                                message: this.getXmlText(participant, 'message') || ''
                        };

                        // Validation des données du participant
                        if (participantData.time <= 0) {
                            console.warn('Participant avec temps invalide ignoré:', participantData.name);
                            continue;
                        }

                        // Ajuster le temps restant si nécessaire
                        if (participantData.remainingTime > participantData.time) {
                            participantData.remainingTime = participantData.time;
                        }

                        newTimer.participants.push(participantData);
                    }

                    // Validation du timer
                    if (newTimer.name.trim() === '') {
                        newTimer.name = 'Timer ' + (i + 1);
                    }

                    importedTimers.push(newTimer);
                }

                // Importer les options plein écran avec validation améliorée
                const fullscreenOptionsElement = xmlDoc.getElementsByTagName('fullscreenOptions')[0];
                if (fullscreenOptionsElement) {
                    try {
                        const importedOptions = {
                            backgroundColor: this.getXmlText(fullscreenOptionsElement, 'backgroundColor') || this.fullscreenOptions.backgroundColor,
                            timerSize: this.getXmlText(fullscreenOptionsElement, 'timerSize') || this.fullscreenOptions.timerSize,
                            participantMessage: this.getXmlText(fullscreenOptionsElement, 'participantMessage') || '',
                            showMessage: this.getXmlText(fullscreenOptionsElement, 'showMessage') === 'true',
                            selectedParticipantId: this.getXmlText(fullscreenOptionsElement, 'selectedParticipantId') || null
                        };

                        // Validation des options
                        const validSizes = ['small', 'medium', 'large', 'xlarge'];
                        if (!validSizes.includes(importedOptions.timerSize)) {
                            importedOptions.timerSize = 'medium';
                        }

                        this.fullscreenOptions = { ...this.fullscreenOptions, ...importedOptions };
                        this.saveFullscreenOptions();
                        console.log('Options plein écran importées:', importedOptions);
                    } catch (optionsError) {
                        console.warn('Erreur lors de l\'import des options plein écran:', optionsError);
                        // Continuer même si les options ne peuvent pas être importées
                    }
                }

                // Ajouter les timers importés
                this.timers = this.timers.concat(importedTimers);
                this.renderTimers();
                this.saveTimersToStorage();
                
                // Message de succès détaillé
                const successMessage = `Import réussi !\n` +
                    `• ${importedTimers.length} timer(s) importé(s)\n` +
                    `• ${importedTimers.reduce((sum, t) => sum + t.participants.length, 0)} participant(s) importé(s)\n` +
                    `• Version du fichier: ${version}`;
                
                alert(successMessage);
                console.log('Import terminé avec succès:', importedTimers);
            } catch (error) {
                console.error('Erreur lors de l\'import:', error);
                alert('Erreur lors de l\'import: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    exportSingleTimer(timerId) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer) {
            alert('Timer introuvable');
            return;
        }

        try {
            // Créer le XML pour un seul timer
            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            xml += '<speechTimer version="2.0" exportDate="' + new Date().toISOString() + '">\n';
            
            // Métadonnées d'export
            xml += '  <exportInfo>\n';
            xml += '    <version>2.0</version>\n';
            xml += '    <exportDate>' + new Date().toISOString() + '</exportDate>\n';
            xml += '    <timerName>' + this.escapeXml(timer.name) + '</timerName>\n';
            xml += '    <participantCount>' + timer.participants.length + '</participantCount>\n';
            xml += '  </exportInfo>\n';
            
            // Données du timer
            xml += '  <timer>\n';
            xml += '    <id>' + timer.id + '</id>\n';
            xml += '    <name>' + this.escapeXml(timer.name) + '</name>\n';
            xml += '    <isRunning>' + timer.isRunning + '</isRunning>\n';
            xml += '    <isPaused>' + timer.isPaused + '</isPaused>\n';
            xml += '    <isFinished>' + timer.isFinished + '</isFinished>\n';
            xml += '    <currentParticipantIndex>' + timer.currentParticipantIndex + '</currentParticipantIndex>\n';
            xml += '    <autoRotation>' + timer.autoRotation + '</autoRotation>\n';
            xml += '    <totalTimeElapsed>' + timer.totalTimeElapsed + '</totalTimeElapsed>\n';
            xml += '    <participantCount>' + timer.participants.length + '</participantCount>\n';
            
            xml += '    <participants>\n';
            timer.participants.forEach((participant, index) => {
                xml += '      <participant index="' + index + '">\n';
                xml += '        <id>' + participant.id + '</id>\n';
                xml += '        <name>' + this.escapeXml(participant.name) + '</name>\n';
                xml += '        <time>' + participant.time + '</time>\n';
                xml += '        <remainingTime>' + participant.remainingTime + '</remainingTime>\n';
                xml += '        <isFinished>' + participant.isFinished + '</isFinished>\n';
                xml += '        <isPaused>' + participant.isPaused + '</isPaused>\n';
                xml += '        <timeElapsed>' + participant.timeElapsed + '</timeElapsed>\n';
                xml += '        <message>' + this.escapeXml(participant.message || '') + '</message>\n';
                xml += '        <progress>' + Math.round(((participant.time - participant.remainingTime) / participant.time) * 100) + '</progress>\n';
                xml += '      </participant>\n';
            });
            xml += '    </participants>\n';
            xml += '  </timer>\n';
            
            // Ajouter les options plein écran
            xml += '  <fullscreenOptions>\n';
            xml += '    <backgroundColor>' + this.escapeXml(this.fullscreenOptions.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)') + '</backgroundColor>\n';
            xml += '    <timerSize>' + this.escapeXml(this.fullscreenOptions.timerSize || 'medium') + '</timerSize>\n';
            xml += '    <participantMessage>' + this.escapeXml(this.fullscreenOptions.participantMessage || '') + '</participantMessage>\n';
            xml += '    <showMessage>' + (this.fullscreenOptions.showMessage || false) + '</showMessage>\n';
            xml += '    <selectedParticipantId>' + this.escapeXml(this.fullscreenOptions.selectedParticipantId || '') + '</selectedParticipantId>\n';
            xml += '  </fullscreenOptions>\n';
            xml += '</speechTimer>';

            // Créer et télécharger le fichier
            const blob = new Blob([xml], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Nom de fichier avec titre du timer, date et heure
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
            const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
            const timerName = this.escapeXml(timer.name).replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
            a.download = timerName + '-' + dateStr + '-' + timeStr + '.xml';
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('Export individuel réussi:', timer.name);
        } catch (error) {
            console.error('Erreur lors de l\'export individuel:', error);
            alert('Erreur lors de l\'export: ' + error.message);
        }
    }

    showImportSingleModal(timerId) {
        this.currentTimerForImport = timerId;
        
        // Créer un input file temporaire
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xml';
        input.style.display = 'none';
        
        input.addEventListener('change', (e) => {
            this.importSingleTimer(e.target.files[0], timerId);
            document.body.removeChild(input);
        });
        
        document.body.appendChild(input);
        input.click();
    }

    importSingleTimer(file, targetTimerId) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const xmlText = e.target.result;
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
                
                // Vérifier si le XML est valide
                if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
                    const errorText = xmlDoc.getElementsByTagName('parsererror')[0].textContent;
                    console.error('Erreur XML:', errorText);
                    alert('Erreur: Le fichier XML n\'est pas valide. Détails: ' + errorText);
                    return;
                }
                
                // Vérifier la structure (speechTimer pour un seul timer, speechTimers pour plusieurs)
                const speechTimer = xmlDoc.getElementsByTagName('speechTimer')[0];
                const speechTimers = xmlDoc.getElementsByTagName('speechTimers')[0];
                
                let timerElement;
                if (speechTimer) {
                    timerElement = speechTimer.getElementsByTagName('timer')[0];
                } else if (speechTimers) {
                    timerElement = speechTimers.getElementsByTagName('timer')[0];
                } else {
                    alert('Erreur: Le fichier ne contient pas de structure timer valide');
                    return;
                }

                if (!timerElement) {
                    alert('Erreur: Aucun timer trouvé dans le fichier');
                    return;
                }

                // Trouver le timer cible
                const targetTimer = this.timers.find(t => t.id === targetTimerId);
                if (!targetTimer) {
                    alert('Timer cible introuvable');
                    return;
                }

                // Demander confirmation
                const timerName = this.getXmlText(timerElement, 'name');
                if (!confirm(`Remplacer le timer "${targetTimer.name}" par "${timerName}" ?\n\nCette action va écraser tous les participants actuels.`)) {
                    return;
                }

                // Créer le nouveau timer
                const newTimer = {
                    id: targetTimerId, // Garder le même ID
                    name: this.getXmlText(timerElement, 'name') || 'Timer importé',
                    isRunning: false, // Toujours arrêté à l'import
                    isPaused: false,
                    isFinished: false,
                    currentParticipantIndex: parseInt(this.getXmlText(timerElement, 'currentParticipantIndex')) || 0,
                    autoRotation: this.getXmlText(timerElement, 'autoRotation') === 'true',
                    totalTimeElapsed: 0, // Reset à l'import
                    participants: []
                };

                // Importer les participants
                const participants = timerElement.getElementsByTagName('participant');
                for (let j = 0; j < participants.length; j++) {
                    const participant = participants[j];
                    const participantData = {
                        id: Date.now() + j, // Nouvel ID
                        name: this.getXmlText(participant, 'name') || 'Participant sans nom',
                        time: Math.max(0, parseInt(this.getXmlText(participant, 'time')) || 0),
                        remainingTime: Math.max(0, parseInt(this.getXmlText(participant, 'remainingTime')) || 0),
                        isFinished: this.getXmlText(participant, 'isFinished') === 'true',
                        isPaused: true, // Toujours en pause à l'import
                        timeElapsed: Math.max(0, parseInt(this.getXmlText(participant, 'timeElapsed')) || 0)
                    };

                    // Validation des données du participant
                    if (participantData.time <= 0) {
                        console.warn('Participant avec temps invalide ignoré:', participantData.name);
                        continue;
                    }

                    // Ajuster le temps restant si nécessaire
                    if (participantData.remainingTime > participantData.time) {
                        participantData.remainingTime = participantData.time;
                    }

                    newTimer.participants.push(participantData);
                }

                // Importer les options plein écran si présentes
                const fullscreenOptionsElement = timerElement.parentElement.getElementsByTagName('fullscreenOptions')[0];
                if (fullscreenOptionsElement) {
                    try {
                        const importedOptions = {
                            backgroundColor: this.getXmlText(fullscreenOptionsElement, 'backgroundColor') || this.fullscreenOptions.backgroundColor,
                            timerSize: this.getXmlText(fullscreenOptionsElement, 'timerSize') || this.fullscreenOptions.timerSize,
                            participantMessage: this.getXmlText(fullscreenOptionsElement, 'participantMessage') || '',
                            showMessage: this.getXmlText(fullscreenOptionsElement, 'showMessage') === 'true',
                            selectedParticipantId: this.getXmlText(fullscreenOptionsElement, 'selectedParticipantId') || null
                        };

                        // Validation des options
                        const validSizes = ['small', 'medium', 'large', 'xlarge'];
                        if (!validSizes.includes(importedOptions.timerSize)) {
                            importedOptions.timerSize = 'medium';
                        }

                        this.fullscreenOptions = { ...this.fullscreenOptions, ...importedOptions };
                        this.saveFullscreenOptions();
                        console.log('Options plein écran importées:', importedOptions);
                    } catch (optionsError) {
                        console.warn('Erreur lors de l\'import des options plein écran:', optionsError);
                    }
                }

                // Remplacer le timer
                const timerIndex = this.timers.findIndex(t => t.id === targetTimerId);
                this.timers[timerIndex] = newTimer;

                this.renderTimers();
                this.saveTimersToStorage();
                
                alert(`Import réussi !\n• Timer: "${newTimer.name}"\n• ${newTimer.participants.length} participant(s) importé(s)`);
                console.log('Import individuel terminé:', newTimer);
            } catch (error) {
                console.error('Erreur lors de l\'import individuel:', error);
                alert('Erreur lors de l\'import: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    startRenameTimer(timerId) {
        const timer = this.timers.find(t => t.id === timerId);
        if (!timer) return;

        const nameElement = document.getElementById(`timer-name-${timerId}`);
        if (!nameElement) return;

        // Créer un input pour l'édition
        const input = document.createElement('input');
        input.type = 'text';
        input.value = timer.name;
        input.className = 'timer-name-input';
        input.style.cssText = `
            background: transparent;
            border: 2px solid #339af0;
            border-radius: 5px;
            padding: 5px 10px;
            font-size: 1.2rem;
            font-weight: 600;
            color: #333;
            width: 100%;
            outline: none;
        `;

        // Remplacer le nom par l'input
        nameElement.style.display = 'none';
        nameElement.parentNode.insertBefore(input, nameElement);
        input.focus();
        input.select();

        // Fonction pour sauvegarder
        const saveRename = () => {
            const newName = input.value.trim();
            if (newName && newName !== timer.name) {
                timer.name = newName;
                nameElement.textContent = newName;
                this.saveTimersToStorage();
                this.syncFullscreen();
            }
            nameElement.style.display = 'block';
            input.remove();
        };

        // Fonction pour annuler
        const cancelRename = () => {
            nameElement.style.display = 'block';
            input.remove();
        };

        // Événements
        input.addEventListener('blur', saveRename);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveRename();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelRename();
            }
        });
    }

    escapeXml(text) {
        if (!text) return '';
        return String(text).replace(/&/g, '&amp;')
                           .replace(/</g, '&lt;')
                           .replace(/>/g, '&gt;')
                           .replace(/"/g, '&quot;')
                           .replace(/'/g, '&#39;');
    }

    getXmlText(parent, tagName) {
        const element = parent.getElementsByTagName(tagName)[0];
        return element ? element.textContent : '';
    }

    showFullscreenOptions(timerId) {
        this.currentTimerForOptions = timerId;
        document.getElementById('fullscreenOptionsModal').style.display = 'block';
        
        // Charger les options actuelles
        document.getElementById('timerSize').value = this.fullscreenOptions.timerSize;
        document.getElementById('participantMessage').value = this.fullscreenOptions.participantMessage;
        document.getElementById('showMessage').checked = this.fullscreenOptions.showMessage;
        
        // Remplir la liste des participants
        this.populateParticipantSelect(timerId);
        
        // Sélectionner la couleur actuelle
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.color === this.fullscreenOptions.backgroundColor) {
                option.classList.add('selected');
            }
        });
    }

    populateParticipantSelect(timerId) {
        const timer = this.timers.find(t => t.id === timerId);
        const select = document.getElementById('participantSelect');
        
        // Vider la liste
        select.innerHTML = '<option value="">Sélectionner un participant...</option>';
        
        if (timer && timer.participants) {
            timer.participants.forEach(participant => {
                const option = document.createElement('option');
                option.value = participant.id;
                option.textContent = participant.name;
                select.appendChild(option);
            });
        }
        
        // Sélectionner le participant actuel si défini
        if (this.fullscreenOptions.selectedParticipantId) {
            select.value = this.fullscreenOptions.selectedParticipantId;
        }
    }

    pushMessageToParticipant() {
        const selectedParticipantId = document.getElementById('participantSelect').value;
        const message = document.getElementById('participantMessage').value;
        
        if (!selectedParticipantId || !message) {
            alert('Veuillez sélectionner un participant et saisir un message.');
            return;
        }
        
        // Persister sur le participant ciblé
        const timer = this.timers.find(t => t.id === this.currentTimerForOptions);
        if (timer) {
            const p = timer.participants.find(pp => String(pp.id) === String(selectedParticipantId));
            if (p) {
                p.message = message;
                this.saveTimersToStorage();
            }
        }
        // Mettre à jour les options d'affichage (toujours coller au participant sélectionné)
        this.fullscreenOptions.selectedParticipantId = selectedParticipantId;
        this.fullscreenOptions.participantMessage = message;
        this.fullscreenOptions.showMessage = true;
        
        // Cocher la case d'affichage
        document.getElementById('showMessage').checked = true;
        
        // Envoyer les données du timer et options au plein écran
        this.syncFullscreen();
        this.updateFullscreenIfOpen();
        
        // Fermer le modal
        this.hideFullscreenOptionsModal();
    }

    hideFullscreenOptionsModal() {
        document.getElementById('fullscreenOptionsModal').style.display = 'none';
    }

    showHelpModal() {
        document.getElementById('helpModal').style.display = 'block';
    }

    hideHelpModal() {
        document.getElementById('helpModal').style.display = 'none';
    }

    applyFullscreenOptions() {
        // Récupérer les options
        const selectedColor = document.querySelector('.color-option.selected');
        this.fullscreenOptions.backgroundColor = selectedColor ? selectedColor.dataset.color : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        this.fullscreenOptions.timerSize = document.getElementById('timerSize').value;
        this.fullscreenOptions.participantMessage = document.getElementById('participantMessage').value;
        this.fullscreenOptions.showMessage = document.getElementById('showMessage').checked;
        this.fullscreenOptions.selectedParticipantId = document.getElementById('participantSelect').value;
        
        // Sauvegarder les options
        this.saveFullscreenOptions();
        
        // Mettre à jour le plein écran s'il est ouvert
        this.updateFullscreenIfOpen();
        
        // Fermer le modal
        this.hideFullscreenOptionsModal();
    }

    saveFullscreenOptions() {
        localStorage.setItem('fullscreenOptions', JSON.stringify(this.fullscreenOptions));
    }

    loadFullscreenOptions() {
        const saved = localStorage.getItem('fullscreenOptions');
        if (saved) {
            this.fullscreenOptions = { ...this.fullscreenOptions, ...JSON.parse(saved) };
        }
    }

    getTimerSize() {
        const sizes = {
            'small': '6rem',
            'medium': '8rem',
            'large': '10rem',
            'xlarge': '12rem'
        };
        return sizes[this.fullscreenOptions.timerSize] || '8rem';
    }

    updateFullscreenIfOpen() {
        if (this.fullscreenWindow && !this.fullscreenWindow.closed) {
            // Envoyer les nouvelles options à la fenêtre plein écran
            this.fullscreenWindow.postMessage({
                type: 'updateOptions',
                options: this.fullscreenOptions
            }, '*');
        }
    }

    updateFullscreenOptionsRealtime() {
        if (this.fullscreenWindow && !this.fullscreenWindow.closed) {
            // Récupérer les options actuelles du formulaire
            const selectedColor = document.querySelector('.color-option.selected');
            const currentOptions = {
                backgroundColor: selectedColor ? selectedColor.dataset.color : this.fullscreenOptions.backgroundColor,
                timerSize: document.getElementById('timerSize').value,
                participantMessage: document.getElementById('participantMessage').value,
                showMessage: document.getElementById('showMessage').checked,
                selectedParticipantId: document.getElementById('participantSelect').value
            };
            
            // Mettre à jour les options locales pour éviter la perte de couleur
            this.fullscreenOptions = { ...this.fullscreenOptions, ...currentOptions };
            
            // Envoyer les options en temps réel
            this.fullscreenWindow.postMessage({
                type: 'updateOptions',
                options: currentOptions
            }, '*');
        }
    }

    syncFullscreen() {
        if (this.fullscreenWindow && !this.fullscreenWindow.closed) {
            // Envoyer les données du timer actuel immédiatement
            const activeTimer = this.timers.find(t => t.id === this.activeTimerId);
            if (activeTimer) {
                this.fullscreenWindow.postMessage({
                    type: 'syncTimer',
                    timer: activeTimer
                }, '*');
            }
        }
    }
}

// Initialiser l'application après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    const timerManager = new TimerManager();
    
    // Rendre timerManager global pour les fonctions onclick
    window.timerManager = timerManager;

    // Gérer les raccourcis clavier
    document.addEventListener('keydown', (e) => {
        // Espace pour démarrer/pause le timer actif
        if (e.code === 'Space' && window.timerManager.activeTimerId) {
            e.preventDefault();
            window.timerManager.toggleTimer(window.timerManager.activeTimerId);
        }
        
        // Échap pour fermer les modals
        if (e.code === 'Escape') {
            window.timerManager.hideAddTimerModal();
            window.timerManager.hideParticipantsModal();
            window.timerManager.hideFullscreenOptionsModal();
            window.timerManager.hideHelpModal();
        }
    });

    // Gérer la fermeture de la page
    window.addEventListener('beforeunload', () => {
        window.timerManager.saveTimersToStorage();
    });
});