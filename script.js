const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width, height;

class FloraAudio {
    constructor() { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    playPluck(freq) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + 0.8);
    }
}
const audio = new FloraAudio();

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function drawTree(x, y, len, angle, branchWidth, depth) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = `hsl(20, 40%, ${20 + depth * 5}%)`;
    ctx.lineWidth = branchWidth;
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    if (len < 8) {
        ctx.restore();
        return;
    }

    drawTree(0, -len, len * 0.78, angle - 22, branchWidth * 0.7, depth + 1);
    drawTree(0, -len, len * 0.78, angle + 22, branchWidth * 0.7, depth + 1);
    ctx.restore();
}

window.addEventListener('mousedown', (e) => {
    ctx.clearRect(0, 0, width, height);
    drawTree(e.clientX, height, 110, 0, 12, 0);
    audio.playPluck(200 + Math.random() * 300);
});
