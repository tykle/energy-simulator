import { Component } from 'react';
import 'antd/dist/antd.css';
import '../App.css';

import anime from 'animejs';

import {
  Layout,
  Form,
  Input,
  Switch,
  Select,
  DatePicker,
  Button,
  Progress,
  Space,
  Card,
  Avatar,
  Row,
  Col,
} from 'antd';


const { Meta } = Card;
const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;

export default class sdLogo extends Component {
  componentDidMount() {
    const targetDiv = document.getElementById('svg-target');
    const signderivaShape = document.getElementById('signderiva-path');

    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgNode.id = "anim"
    targetDiv.appendChild(svgNode);

    // svgNode.setAttributeNS(null, 'width', "100%");
    // svgNode.setAttributeNS(null, 'height', window.innerHeight);

    svgNode.setAttributeNS(null, 'width', 400);
    svgNode.setAttributeNS(null, 'height', 300);

    //svgNode.setAttributeNS(null, 'viewBox', '0 0 400 400');
    targetDiv.appendChild(svgNode);

    const shape = [
      {
        id: "stroke-red",
        color: "#da3931"
      }, {
        id: "stroke-orange",
        color: "#dd5d20"
      }, {
        id: "stroke-yellow",
        color: "#DCDC00"
      }, {
        id: "stroke-green",
        color: "#0b9444"
      }, {
        id: "stroke-blue-light",
        color: "#0099FF"
      }, {
        id: "stroke-blue",
        color: "#1f91ac"
      }, {
        id: "stroke-pink",
        color: "#DE097A"
      },
    ]

    const config = {
      strokeSize: 3,
      strokeSpace: 3,
      strokeDisplace: 0,
      topPadding: 20,
      moveDown: 10,
      height: 20,
      textTop: 30
    }

    config.stroke = config.strokeSize + config.strokeSpace;

    const rootRect = svgNode.getBoundingClientRect();

    const shapeWidth = shape.length * config.stroke + config.strokeDisplace;
    const shapeHeight = config.height;

    const shapeWidthPos = rootRect.width / 2 - shapeWidth / 2
    const shapeHeightPos = rootRect.height / 2 - shapeHeight / 2 - config.topPadding

    // bar
    const barGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    barGroup.id = "barGroup";

    //
    const signderivaShapeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    signderivaShapeGroup.appendChild(signderivaShape);
    svgNode.appendChild(signderivaShapeGroup);
    const signderivaShapeRect = signderivaShape.getBoundingClientRect()
    signderivaShapeGroup.setAttributeNS(null, "transform", `translate(${rootRect.width / 2 - signderivaShapeRect.width * 2 / 2}, ${rootRect.height / 2 - signderivaShapeRect.height * 2 / 2 + config.textTop}) scale(2)`);

    for (var a = 1; a <= shape.length; a++) {
      const pos = shape[a - 1];

      const node = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      node.id = pos.id;
      node.setAttributeNS(null, "class", "bar");
      node.setAttributeNS(null, 'd', `M ${shapeWidthPos + a * config.stroke} ${shapeHeightPos + shapeHeight} L${shapeWidthPos + config.strokeDisplace + a * config.stroke} ${shapeHeightPos - shapeHeight}`);
      node.setAttributeNS(null, 'style', `stroke:${pos.color};stroke-width:${config.strokeSize};stroke-opacity:1`);
      pos.node = node;

      barGroup.appendChild(node);
    }

    svgNode.appendChild(barGroup);

    function shotMove() {
      const factor = 20;
      const speed = 50;

      const timeline = anime.timeline({
        autoplay: true,
        //easing: 'easeOutExpo',
        duration: speed * shape.length,
        direction: 'alternate',

        // complete: () => {
        //   setTimeout(shotMove, 10000)
        // }
      });

      const round = Math.round(Math.random() * 2)

      timeline.add({
        targets: '#anim #signderiva-path',
        opacity: 0,
        easing: "easeInOutQuad",
        delay: speed
      });

      for (var z = 0; z < round; z++) {
        timeline.add({
          targets: '#anim .bar',
          // translateX: () => {
          //   return(anime.random(-factor, factor))
          // },
          // translateY: () => {
          //   return(anime.random(-factor, factor))
          // },

          translateX: anime.random(-factor, factor),
          translateY: anime.random(-factor, factor),

          // rotate: function () {
          //   return anime.random(-180, 180);
          // },
          //rotate: anime.stagger([~angle, angle]),
          //rotate: angle,



          // scale: [
          //   { value: .9, easing: 'easeOutSine', duration: 200 },
          //   { value: 2.5, easing: 'easeInOutQuad', duration: 400 }
          // ],

          // scale: function (el, i) {
          //   return Math.random() * 1.1 * i;
          // },

          scale: Math.random() * 1.1,

          // strokeWidth: {
          //   value: config.strokeSize + (Math.random() * 3),
          //   easing: 'linear',
          //   delay: function (el, i) {
          //     return i * speed;
          //   },
          // },

          transformOrigin: (el, i) => {
            return (`${shapeWidthPos + shapeWidth / 2}px ${shapeHeightPos + shapeHeight / 2}px`)
          },
          //delay: function(el, i) { return(50*i) },
          delay: anime.stagger(speed * 2)
        });

      }



    }


    var timeline = anime.timeline({
      autoplay: true,
      easing: 'easeOutExpo',
      //loop: true,
      //direction: 'alternate',
      //delay: function() { return anime.random(0, 1000); },
      duration: 100,
      // complete: () => {
      //   shotMove()
      // }
    });

    timeline.add({
      targets: '#anim .bar',
      strokeDashoffset: function (el) {
        var pathLength = el.getTotalLength();
        el.setAttribute('stroke-dasharray', pathLength);
        return [-pathLength, 0];
      },
      delay: function (el, i) { return (50 * i) },
    });

    timeline.add({
      targets: '#anim .bar',
      translateY: function (el, i) {
        var ret = null
        if (i === 1) ret = 20
        else if (i === 2) ret = 30
        else if (i === 3) ret = 10
        else if (i === 5) ret = 20
        else if (i === 6) ret = 30
        return (ret);
      },

      delay: function (el, i) { return (50 * i) },
    });

    timeline.add({
      targets: '#anim #barGroup',
      rotate: 50,
      transformOrigin: (el, i) => {
        return (`${shapeWidthPos + shapeWidth / 2}px ${shapeHeightPos + shapeHeight / 2}px`)
      },
      delay: function (el, i) { return (50 * i) },
    });

    timeline.add({
      targets: '#anim #signderiva-path',
      opacity: [0, 1],
      easing: "easeInOutQuad"
    });




    timeline.add({
      targets: '#anim .bar',
      strokeWidth: {
        value: config.strokeSize,
        easing: 'linear',
        delay: function (el, i) {
          return i * 40;
        },
      },
    });

  }


  render() {

    return (

      <>
        <div id="svg-target"></div>

        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" style={{display: "none"}}>
          <path id="signderiva-path" d="M98.48,12.58H97.5l3.62-7.38h0.76l3.66,7.38h-1c-1.81-3.58-1.16-2.35-3.04-6.12
C99.95,9.59,99.88,9.74,98.48,12.58 M90.7,12.58h-0.58L86.57,5.2h1l2.85,5.91l2.85-5.91h1.02L90.7,12.58z M81.22,12.58V5.16h0.93
v7.42H81.22z M68.99,12.58V5.2h4.23c0.72,0,1.29,0.19,1.7,0.55c0.4,0.36,0.61,0.87,0.61,1.51c0,0.53-0.16,1-0.48,1.37
C74.74,9,74.31,9.24,73.79,9.34l1.84,3.24h-1.01l-1.85-3.23h-2.86v3.23H68.99z M69.91,8.49h3.26c0.46,0,0.81-0.1,1.05-0.31
c0.24-0.21,0.36-0.5,0.36-0.9c0-0.39-0.12-0.69-0.36-0.9c-0.23-0.21-0.58-0.32-1.01-0.32h-3.3V8.49z M57.56,6.05V5.2h5.9v0.85
C61.35,6.05,59.67,6.05,57.56,6.05z M57.56,9.22V8.37c2.11,0,3.79,0,5.9,0v0.85L57.56,9.22z M57.56,12.58v-0.85c2.11,0,3.79,0,5.9,0
v0.85H57.56z M48.07,5.2c1.16,0,2.1,0.34,2.81,1.03c0.71,0.69,1.07,1.58,1.07,2.68c0,1.11-0.35,2-1.05,2.67c-0.7,0.67-1.64,1-2.83,1
H44.9V5.2H48.07z M48.07,6.05h-2.25v5.68h2.25c0.91,0,1.63-0.26,2.15-0.76C50.73,10.46,51,9.77,51,8.9c0-0.85-0.27-1.54-0.8-2.06
C49.67,6.31,48.95,6.05,48.07,6.05z M32.51,12.58V5.2h0.48l4.79,5.52V5.2h0.92v7.38h-0.47l-4.8-5.51v5.51H32.51z M25.7,10.58V9.5
h-2.01V8.65h2.93v2.22c-0.36,0.61-0.82,1.09-1.39,1.41c-0.57,0.32-1.22,0.49-1.95,0.49c-1.1,0-2.02-0.37-2.74-1.09
c-0.71-0.72-1.08-1.65-1.08-2.77c0-1.12,0.37-2.06,1.08-2.78c0.72-0.72,1.63-1.09,2.73-1.09c0.68,0,1.31,0.15,1.87,0.45
c0.56,0.3,1.02,0.73,1.37,1.28l-0.77,0.55c-0.23-0.44-0.57-0.79-1-1.04c-0.43-0.24-0.92-0.37-1.46-0.37c-0.83,0-1.52,0.29-2.06,0.85
c-0.54,0.56-0.81,1.29-0.81,2.15c0,0.87,0.27,1.59,0.81,2.15c0.54,0.56,1.23,0.85,2.06,0.85c0.52,0,0.98-0.11,1.38-0.33
C25.05,11.36,25.41,11.02,25.7,10.58z M12.89,12.58V5.16h0.93v7.42H12.89z M0,11.47l0.53-0.79c0.52,0.4,1.08,0.73,1.63,0.93
c0.55,0.2,1.12,0.32,1.67,0.32c0.68,0,1.25-0.16,1.66-0.43c0.41-0.28,0.64-0.66,0.64-1.12c0-0.36-0.16-0.66-0.46-0.89
C5.38,9.26,4.95,9.1,4.41,9.07C4.3,9.06,4.09,9.04,3.85,9.03C2.64,8.95,1.8,8.79,1.37,8.6C1.04,8.45,0.75,8.21,0.59,7.96
C0.42,7.71,0.32,7.41,0.32,7.08c0-0.59,0.28-1.09,0.8-1.47c0.52-0.37,1.22-0.58,2.07-0.58c0.62,0,1.24,0.11,1.82,0.3
c0.59,0.19,1.17,0.5,1.71,0.9L6.18,7.01C5.72,6.64,5.24,6.35,4.74,6.18C4.25,6,3.73,5.9,3.2,5.9c-0.56,0-1.03,0.12-1.38,0.33
c-0.35,0.2-0.54,0.49-0.54,0.82c0,0.13,0.04,0.26,0.09,0.35c0.05,0.09,0.15,0.22,0.27,0.3C1.93,7.92,2.6,8.09,3.6,8.13
C4.05,8.15,4.44,8.2,4.68,8.22c0.74,0.07,1.35,0.33,1.78,0.72c0.42,0.39,0.65,0.88,0.65,1.46c0,0.69-0.31,1.27-0.9,1.7
c-0.59,0.43-1.39,0.67-2.36,0.67c-0.73,0-1.43-0.12-2.05-0.32C1.18,12.25,0.57,11.91,0,11.47z"/>
        </svg>
      </>
    )
  }
}
