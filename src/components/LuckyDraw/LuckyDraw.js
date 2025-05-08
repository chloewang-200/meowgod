/* reference: https://github.com/Gemerz/react-luckydraw */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Wheel from './Wheel';
import './LuckyDraw.css';

class LuckyDraw extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    range: PropTypes.number.isRequired,
    wheelSize: PropTypes.number,
    turns: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    stoke: PropTypes.number,
    showInnerLabels: PropTypes.bool,
    drawLimitSwitch: PropTypes.bool,
    drawLimit: PropTypes.number,
    textArray: PropTypes.array,
    fontColor: PropTypes.string,
    fontSize: PropTypes.string,
    writingModel: PropTypes.string,
    drawButtonLabel: PropTypes.string,
    ArabicLabel: PropTypes.bool,
    onSuccessDrawReturn: PropTypes.func,
    onOutLimitAlert: PropTypes.func,
    rotateSecond: PropTypes.number,
    onBeforeDraw: PropTypes.func
  };
  static defaultProps = {
    width: 500,
    height: 350,
    stoke: 5,
    range: 20,
    turns: 3,
    rotateSecond: 5,
    drawLimit: 3,
    drawLimitSwitch: false,
    fontColor: '#000',
    fontSize: '18px',
    writingModel: 'tb',
    drawButtonLabel: 'Start',
    ArabicLabel: false,
    textArray: []
  };

  constructor(props) {
    super(props);
    this.state = {
      startDraw: false,
      drawTimes: 1,
      randomNumber: null,
      rolling: false,
      wheelSize: props.wheelSize || props.width * 2,
      rotationDegrees: 0
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     return true
  // }

  _processRandomNumber(min, max) {
    // Remove the reversal, just return the direct random number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _processDrawAngle(range, turns, drawTimes, drawNumber) {
    const peer = 360 / range;
    // Adjust angle calculation to match the prize order
    // Add 180 degrees to start from the bottom
    const totalAngle = -(360 * turns * drawTimes + (drawNumber * peer) + 180);
    return totalAngle;
  }

  async _processDrawing(e) {
    e.preventDefault();
    if (!this.state.rolling) {
      let drawTime = this.state.drawTimes;
      if (!this.props.drawLimitSwitch || drawTime <= this.props.drawLimit) {
        // Check with onBeforeDraw first
        if (this.props.onBeforeDraw) {
          const canProceed = await this.props.onBeforeDraw();
          if (!canProceed) {
            return; // Don't proceed if onBeforeDraw returns false
          }
        }

        // Get the random number directly
        const randomNumber = this._processRandomNumber(0, this.props.range - 1);
        
        this.setState({
          startDraw: true,
          rolling: true,
          randomNumber,
          drawTimes: this.state.drawTimes + 1
        });

        setTimeout(
          () => {
            this.setState({ rolling: false });
            if (this.props.onSuccessDrawReturn) {
              // Pass the actual prize number
              this.props.onSuccessDrawReturn(randomNumber);
            }
          },
          this.props.rotateSecond * 1000
        );
      } else if (this.props.onOutLimitAlert) {
        this.props.onOutLimitAlert(true);
      }
    }
  }

  render() {
    const state = this.state;
    const props = this.props;
    let transformRotate = state.startDraw
      ? this._processDrawAngle(
          props.range,
          props.turns,
          state.drawTimes,
          state.randomNumber
        )
      : 0;
    
    return (
      <div
        className="react_luckyDraw"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <div className="compass__container">
          <div className="control__panel">
            <div
              className="compass__spin"
              style={{
                width: '500px',  // Fixed width
                height: '500px', // Fixed height
                position: 'relative',
                transform: `rotate(${transformRotate}deg)`,
                transitionDuration: `${props.rotateSecond}s`
              }}
            >
              <Wheel 
                {...props} 
                wheelSize={500} // Ensure wheelSize matches container
              />
            </div>
            <div className="compass__arrow" />
          </div>
          <div className="compass__btn">
            <button
              className="bttn-jelly bttn-md bttn-danger"
              onClick={e => this._processDrawing(e)}
              disabled={state.rolling}
            >
              {state.rolling ? 'Spinning...' : props.drawButtonLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LuckyDraw;
