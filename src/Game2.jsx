import React from 'react';
import ReactDOM from 'react-dom';


class Node {
    constructor(parent, squares) {
        this.squares = squares;
        this.children = [];
        this.parent = parent;
        this.value = 0;
        this.chance = 0;
        this.move;
    }
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }

    calculateWinner() {
        var squares = this.squares;
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] === 'X' && squares[a] === squares[b] && squares[a] === squares[c]) {
                return -1;
            }
            if (squares[a] === 'O' && squares[a] === squares[b] && squares[a] === squares[c]) {
                return 1;
            }
        }
        return 0;
    }

    determinateNext() {
        let x = this.squares.filter((value, index) => { return value === "X" }).length;
        let y = this.squares.filter((value, index) => { return value === "O" }).length;
        if (x === y)
            return "X";
        return "O"
    }

    generateMoves() {
        this.value = this.calculateWinner();
        if (this.value !== 0){
            return;
        }
        let next = this.determinateNext();
        for (let i = 0; i < this.squares.length; i++) {
            if (this.squares[i] === null) {
                let squares = this.squares.slice();
                squares[i] = next;
                let node = new Node(this, squares);
                node.move = i;
                this.addChild(node);
                node.generateMoves();
            }
        }
    }


    generateChance() {
        if (this.children.length === 0) {
            this.chance = this.value;
            return;
        }
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].generateChance();
        }
        let min = null;
        let max = null;
        for (let i = 0; i < this.children.length; i++){
            if(this.children[i].chance < min || min === null)
                min = this.children[i].chance;
            if(this.children[i].chance > max || max === null)
                max = this.children[i].chance;
        }
        if(this.determinateNext()==='O'){
            this.chance = max;
            return;
        }
        else{
            this.chance = min;
            return;
        }
    }

    getNextIndex() {
        let chance = null;
        let move = null;
        for(let i = 0;i<this.children.length;i++)
            if(this.children[i].chance > chance || chance === null){
                chance = this.children[i].chance;
                move = this.children[i].move;
            }
        return move;
    }
}

window.test = ["O", "X", "O", null, "X", null, null, null, "X"]
window.a = new Node(null,window.test);
window.a.generateMoves();
window.a.generateChance();


function Square(props) {
    return (
        <div className="square" onClick={props.onClick} style={{height:"30px",width:"30px", border:"2px solid black", float:"left"}}>
            {props.value}
        </div>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        console.log(calculateWinner(squares));
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = 'X';
        console.log(calculateWinner(squares));
        if (calculateWinner(squares)) {
            this.setState({
                squares: squares
            });
        }
        else{
            console.log(squares);
            let ai = new Node(null, squares);
            ai.generateMoves();
            ai.generateChance();
            let index = ai.getNextIndex();
            squares[index] = 'O';
            console.log(squares);
            this.setState({
                squares: squares
            });
        }
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            if(winner==='-')
                status = 'Egalitate';
            else
                status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game2 extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game2 />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    let ok = true;
    for(let i = 0; i<squares.length;i++)
        if(!squares[i])
            ok = false;
    if(ok) 
        return '-';
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

export default Game2;