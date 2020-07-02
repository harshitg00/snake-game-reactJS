import React, { Component } from 'react';
import './App.css';
import Snake from './components/Snake';
import Food from './components/Food';
import { Provider } from './context';
import LeaderBoard from './components/LeaderBoard';

const box = 32;
// a function that gives food at a random space
const randomFood = () => {
  const min = 3,
    max = 17;
  const x = Math.floor(Math.random() * (max - min + 1) + min) * box;
  const y = Math.floor(Math.random() * (max - min + 1) + min) * box;
  return [x, y];
};

// this is the initial state of the snake
const initialState = {
  food: randomFood(),
  direction: 'RIGHT',
  speed: 200,
  snakeDots: [
    [4 * box, 10 * box],
    [5 * box, 10 * box],
    [6 * box, 10 * box],
  ],
  last: null,
  score: 0,
  sound: null,
};

class App extends Component {
  state = initialState;

  // this runs after the document is ready
  componentDidMount() {
    setInterval(this.snakeMovement, this.state.speed);
    document.onkeydown = this.onDirection;
  }
  // this runs if there is a change in state
  componentDidUpdate() {
    this.collapseCheck();
    this.borderCheck();
    this.eatCheck();
  }
  // this triggers when an event on keyboard occurs
  onDirection = (e) => {
    e = e || window.event;
    let key = e.keyCode;
    if (
      key === 65 &&
      this.state.last !== 'RIGHT' &&
      this.state.last !== 'LEFT'
    ) {
      this.setState({ direction: 'LEFT' });
      this.sound = document.getElementsByClassName('left')[0];
      this.sound.play();
      this.setState({ last: 'LEFT' });
    } else if (
      key === 87 &&
      this.state.last !== 'DOWN' &&
      this.state.last !== 'UP'
    ) {
      this.setState({ direction: 'UP' });
      this.sound = document.getElementsByClassName('up')[0];
      this.sound.play();
      this.setState({ last: 'UP' });
    } else if (
      key === 68 &&
      this.state.last !== 'LEFT' &&
      this.state.last !== 'RIGHT'
    ) {
      this.setState({ direction: 'RIGHT' });
      this.sound = document.getElementsByClassName('right')[0];
      this.sound.play();
      this.setState({ last: 'RIGHT' });
    } else if (
      key === 83 &&
      this.state.last !== 'UP' &&
      this.state.last !== 'DOWN'
    ) {
      this.setState({ direction: 'DOWN' });
      this.sound = document.getElementsByClassName('down')[0];
      this.sound.play();
      this.setState({ last: 'DOWN' });
    }
  };

  //tells the snake to move in a particular directin
  snakeMovement = () => {
    let dots = [...this.state.snakeDots];
    let newhead = dots[dots.length - 1];
    switch (this.state.direction) {
      case 'RIGHT':
        newhead = [newhead[0] + box, newhead[1]];
        break;
      case 'LEFT':
        newhead = [newhead[0] - box, newhead[1]];
        break;
      case 'UP':
        newhead = [newhead[0], newhead[1] - box];
        break;
      case 'DOWN':
        newhead = [newhead[0], newhead[1] + box];
        break;
      default:
        break;
    }
    dots.push(newhead);
    dots.shift();
    this.setState({
      snakeDots: dots,
    });
  };
  // to enlarge snake
  enlarge() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([]);
    this.setState({
      snakeDots: newSnake,
    });
  }
  // to speedup snake after eating/ enlarging
  speedUpSnake() {
    if (this.state.speed > 10) {
      this.setState({
        speed: this.state.speed - 10,
      });
    }
  }
  eatCheck() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    const food = this.state.food;
    if (head[0] === food[0] && head[1] === food[1]) {
      document.getElementsByClassName('eat')[0].play();
      this.setState({
        food: randomFood(),
        score: this.state.score + 1,
      });
      this.enlarge();
      this.speedUpSnake();
    }
  }
  //if snake encounters itself
  collapseCheck() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    
    console.log(snake , head);
    snake.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        this.gameOver();
      }
    });
  }
  //if snake encounters borders
  borderCheck() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (
      head[0] > 17 * box ||
      head[1] < 3 * box ||
      head[0] < box ||
      head[1] > 17 * box
    ) {
      document.getElementsByClassName('dead')[0].play();
      this.gameOver();
    }
  }
  gameOver() {
    alert(`Game Over! Score :${this.state.score}`);
    this.setState(initialState);
  }
  render() {
    const { snakeDots, food, score } = this.state;
    return (
      <Provider>
        <React.Fragment>
          <div className="display-4 text-center">Snake Game</div>
          <div className="playground">
            <div className="ground">
              <h5 className="score">Score: {score}</h5>
              <div className="snake-playground">
                <img
                  src={require('./img/ground.png')}
                  alt="img"
                  className="background"
                ></img>
                <Snake snakeDots={snakeDots}></Snake>
                <Food food={food}></Food>
              </div>
            </div>
            <LeaderBoard></LeaderBoard>
          </div>
          <audio className="left">
            <source src={require('./audio/left.mp3')} type="audio/mp3"></source>
          </audio>
          <audio className="right">
            <source
              src={require('./audio/right.mp3')}
              type="audio/mp3"
            ></source>
          </audio>
          <audio className="up">
            <source src={require('./audio/up.mp3')} type="audio/mp3"></source>
          </audio>
          <audio className="down">
            <source src={require('./audio/down.mp3')} type="audio/mp3"></source>
          </audio>
          <audio className="dead">
            <source src={require('./audio/dead.mp3')} type="audio/mp3"></source>
          </audio>
          <audio className="eat">
            <source src={require('./audio/eat.mp3')} type="audio/mp3"></source>
          </audio>
        </React.Fragment>
      </Provider>
    );
  }
}

export default App;
