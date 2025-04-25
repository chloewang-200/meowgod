import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pie } from 'd3';
import Arc from './Arc';
import tigerCenter from '../../assets/tiger-center.png';

class Wheel extends Component {
  static propTypes = {
    wheelSize: PropTypes.number.isRequired,
    range: PropTypes.number.isRequired,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    stoke: PropTypes.number,
    showInnerLabels: PropTypes.bool,
    textArray: PropTypes.array,
    fontColor: PropTypes.string,
    fontSize: PropTypes.string,
    writingModel: PropTypes.string
  };
  
  static defaultProps = {};

  _processData(range) {
    let array = [];
    for (var i = 0; i < range; i++) {
      array.push(100 / range);
    }
    return array;
  }

  render() {
    const props = this.props;
    const transform = `translate(${props.wheelSize / 2},${props.wheelSize / 2})`;
    const data = this._processData(props.range);
    const arcs = pie()(data).sort();
    
    // Custom color palette with pink, purple, and yellow
    const colors = [
      '#950000', // Red
      '#FF5D1E', // Orange
      '#FFDD71', // Yellow
      '#55AB97', // Green
      '#950000', // Red
      '#FFDD71', // Yellow
      '#FF5D1E', // Orange
      '#55AB97'  // Green
    ];

    const Pie = arcs.map((i, idx) => {
      let colorIdx = idx % colors.length;
      const textLabel = !props.ArabicLabel
        ? props.textArray[idx] ? props.textArray[idx] : idx + 1
        : idx + 1;

      return (
        <Arc
          key={idx}
          innerRadius={props.innerRadius}
          outerRadius={props.outerRadius}
          startAngle={i.startAngle}
          endAngle={i.endAngle}
          showInnerLabels={props.showInnerLabels}
          text={textLabel}
          fill={colors[colorIdx]}
          stoke={props.stoke}
          fontColor={props.fontColor}
          fontSize={props.fontSize}
          writingModel={props.writingModel}
        />
      );
    });

    // Calculate center image size
    const imageSize = props.wheelSize * 0.3;
    
    return (
      <svg width={props.wheelSize} height={props.wheelSize}>
        <g transform={transform}>
          {Pie}
        </g>
        <image
          x={props.wheelSize / 2 - imageSize / 2}
          y={props.wheelSize / 2 - imageSize / 2}
          width={imageSize}
          height={imageSize}
          href={tigerCenter}
          preserveAspectRatio="xMidYMid meet"
          style={{
            transformOrigin: 'center',
            transform: 'rotate(0deg)' // Remove the rotation offset
          }}
        />
      </svg>
    );
  }
}

export default Wheel;
