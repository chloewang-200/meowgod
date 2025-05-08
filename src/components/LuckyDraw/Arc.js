import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { arc } from 'd3';

class Arc extends Component {
  static propTypes = {
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    startAngle: PropTypes.number,
    endAngle: PropTypes.number,
    showInnerLabels: PropTypes.bool,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fill: PropTypes.string,
    stoke: PropTypes.number,
    fontColor: PropTypes.string,
    fontSize: PropTypes.string,
    writingModel: PropTypes.string,
    fontFamily: PropTypes.string
  };

  render() {
    const props = this.props;
    const innerRadius = props.innerRadius || 0;
    const outerRadius = props.outerRadius || 200;

    const arcGenerator = arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const centroid = arcGenerator.centroid({
      startAngle: props.startAngle,
      endAngle: props.endAngle
    });

    const path = arcGenerator({
      startAngle: props.startAngle,
      endAngle: props.endAngle
    });

    return (
      <g>
        <path
          d={path}
          fill="none"
          stroke="rgba(248, 239, 214, 0.2)"
          strokeWidth={(props.stoke || 3) + 2}
          filter="blur(2px)"
        />
        <path
          d={path}
          fill={props.fill}
          stroke="rgba(248, 239, 214, 0.4)"
          strokeWidth={props.stoke || 3}
          style={{
            filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))',
          }}
        />
        <path
          d={path}
          fill="none"
          stroke="rgba(248, 239, 214, 0.1)"
          strokeWidth={(props.stoke || 3) - 1}
          style={{
            filter: 'blur(1px)',
          }}
        />
        {props.showInnerLabels && (
          <text
            x={centroid[0]}
            y={centroid[1]}
            dy=".35em"
            style={{
              fill: props.fontColor,
              fontSize: props.fontSize,
              textAnchor: 'middle',
              fontWeight: 'bold',
              transform: 'rotate(0deg)',
              letterSpacing: '0.5px',
              dominantBaseline: 'middle',
              fontFamily: props.fontFamily
            }}
          >
            {props.text}
          </text>
        )}
      </g>
    );
  }
}

export default Arc;
