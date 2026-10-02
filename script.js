const GOAL = [1,2,3,4,5,6,7,8,0];
let state = [...GOAL];
let moveCount = 0;
let solving = false;

const boardEl = document.getElementById('board');
const moveCountEl = document.getElementById('moveCount');
const statusEl = document.getElementById('statusText');
const msgEl = document.getElementById('msg');
const shuffleBtn = document.getElementById('shuffleBtn');
const hintBtn = document.getElementById('hintBtn');
const solveBtn = document.getElementById('solveBtn');

// Render
function render(hintIndex){
    boardEl.innerHTML = '';
    state.forEach((val, i) => {
        const div = document.createElement('div');
        div.className = 'tile' + (val === 0 ? ' empty' : '') + (i === hintIndex ? ' hint' : '');
        div.textContent = val === 0 ? '' : val;
        div.addEventListener('click', () => tryMove(i));
        boardEl.appendChild(div);
    });
    moveCountEl.textContent = moveCount;
}

// Puzzle Logic
function isSolved(s){
    return s.every((v,i) => v === GOAL[i]);
}

function neighborsOf(blankIdx){
    const r = Math.floor(blankIdx/3), c = blankIdx%3;
    const moves = [];
    if (r>0) moves.push(blankIdx-3);
    if (r<2) moves.push(blankIdx+3);
    if (c>0) moves.push(blankIdx-1);
    if (c<2) moves.push(blankIdx+1);
    return moves;
}

function tryMove(idx, silent){
    const blank = state.indexOf(0);
    if (!neighborsOf(blank).includes(idx)) return false;
    [state[blank], state[idx]] = [state[idx], state[blank]];
    moveCount++;
    render();
    if (isSolved(state)){
        statusEl.textContent = 'Finished!';
        msgEl.textContent = 'Puzzle solved in ' + moveCount + ' step';
        msgEl.classList.add('solved');
    } else if (!silent){
        msgEl.textContent = '';
        msgEl.classList.remove('solved');
    }
    return true;
}

function shuffle(){
    if (solving) return;
    state = [...GOAL];
    moveCount = 0;
    msgEl.textContent = '';
    msgEl.classList.remove('solved');
    let lastBlank = -1;
    const shuffleDepth = 14 + Math.floor(Math.random()*3); // 14-16 moves, optimal solve stays under 20
    for (let i=0; i<shuffleDepth; i++){
        const blank = state.indexOf(0);
        const options = neighborsOf(blank).filter(n => n !== lastBlank);
        const pick = options[Math.floor(Math.random()*options.length)];
        [state[blank], state[pick]] = [state[pick], state[blank]];
        lastBlank = blank;
    }
    moveCount = 0;
    statusEl.textContent = 'Solve the puzzle';
    render();
}


// A* solver (bot hint)
function manhattan(s){
    let dist = 0;
    for (let i=0;i<9;i++){
        const v = s[i];
        if (v === 0) continue;
        const goalIdx = v - 1;
        const r1 = Math.floor(i/3), c1 = i%3;
        const r2 = Math.floor(goalIdx/3), c2 = goalIdx%3;
        dist += Math.abs(r1-r2) + Math.abs(c1-c2);
    }
    return dist;
}

class MinHeap{
    constructor(){ this.items = []; }
    push(item){
        this.items.push(item);
        let i = this.items.length - 1;
        while (i > 0){
            const p = (i-1)>>1;
            if (this.items[p].f <= this.items[i].f) break;
            [this.items[p], this.items[i]] = [this.items[i], this.items[p]];
            i = p;
        }
    }
    pop(){
        const top = this.items[0];
        const last = this.items.pop();
        if (this.items.length){
            this.items[0] = last;
            let i = 0;
            while (true){
                const l = 2*i+1, r = 2*i+2;
                let smallest = i;
                if (l < this.items.length && this.items[l].f < this.items[smallest].f) smallest = l;
                if (r < this.items.length && this.items[r].f < this.items[smallest].f) smallest = r;
                if (smallest === i) break;
                [this.items[smallest], this.items[i]] = [this.items[i], this.items[smallest]];
                i = smallest;
            }
        }
        return top;
    }
    get size(){ 
        return this.items.length; 
    }
}

function solveAStar(start){
    if (isSolved(start)) return [];
    const startKey = start.join(',');
    const gScore = { [startKey]: 0 };
    const cameFrom = {};
    const heap = new MinHeap();
    heap.push({ f: manhattan(start), state: start, key: startKey });
    const visited = new Set();

    while (heap.size){
        const cur = heap.pop();
        if (visited.has(cur.key)) continue;
        visited.add(cur.key);
        if (isSolved(cur.state)){
            // reconstruct path of moved-tile indices
            const path = [];
            let k = cur.key;
            while (cameFrom[k]){
                path.push(cameFrom[k].movedIdx);
                k = cameFrom[k].prevKey;
            }
            return path.reverse();
        }
        const blank = cur.state.indexOf(0);
        for (const n of neighborsOf(blank)){
            const next = [...cur.state];
            [next[blank], next[n]] = [next[n], next[blank]];
            const nextKey = next.join(',');
            const tentativeG = gScore[cur.key] + 1;
            if (gScore[nextKey] === undefined || tentativeG < gScore[nextKey]){
                gScore[nextKey] = tentativeG;
                cameFrom[nextKey] = { prevKey: cur.key, movedIdx: n };
                heap.push({ f: tentativeG + manhattan(next), state: next, key: nextKey });
            }
        }
    }
    return null; // unsolvable (harusnya ga kejadian buat shuffle yang valid)
}

// Button action
function showHint(){
    if (solving || isSolved(state)) return;
    hintBtn.disabled = true;
    statusEl.textContent = 'Counting...';
    setTimeout(() => {
        const path = solveAStar(state);
        hintBtn.disabled = false;
        if (!path || path.length === 0){
            statusEl.textContent = 'Solve the puzzle';
            return;
        }
        const moveIdx = path[0];
        render(moveIdx);
        statusEl.textContent = 'Optimal Solution: ' + path.length + ' step';
        msgEl.textContent = 'Slide the number ' + state[moveIdx] + ' (highlighted in blue)';
        msgEl.classList.remove('solved');
    }, 20);
}

function solveAll(){
    if (solving || isSolved(state)) return;
    solving = true;
    hintBtn.disabled = true;
    solveBtn.disabled = true;
    shuffleBtn.disabled = true;
    statusEl.textContent = 'Counting solution...';
    setTimeout(() => {
        const path = solveAStar(state);
        if (!path){
            statusEl.textContent = 'No solution';
            solving = false;
            hintBtn.disabled = false;
            solveBtn.disabled = false;
            shuffleBtn.disabled = false;
            return;
        }
        statusEl.textContent = 'Execute ' + path.length + ' steps...';
        let i = 0;
        const step = () => {
            if (i >= path.length){
                solving = false;
                hintBtn.disabled = false;
                solveBtn.disabled = false;
                shuffleBtn.disabled = false;
                return;
            }
            tryMove(path[i], true);
            i++;
            setTimeout(step, 260);
        };
        step();
    }, 20);
}

shuffleBtn.addEventListener('click', shuffle);
hintBtn.addEventListener('click', showHint);
solveBtn.addEventListener('click', solveAll);

render();