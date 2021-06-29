import { Component } from 'react';
import anime from 'animejs';

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

const multi = 50;

export default class sdBlow extends Component {
  componentDidMount() {
    const factor = 1;
    const speed = 50;
    var pass = 0;

    const shot = () => {
      const timeline = anime.timeline({
        autoplay: true,
        // loop: 1,
        easing: 'easeInOutQuad',
        duration: speed*multi*shape.length,
        // direction: 'alternate',
        complete: () => {
          pass++;
          setTimeout(shot)
        },
        delay: anime.stagger(speed, { grid: [multi, shape.length], from: 'center' })
      });

      timeline.add({
        targets: '.blow-bar',

        opacity: (el, id) => {
          var passedRate = (anime.random(30, 70) / 100);

          // over rate series

          return passedRate;
        },

        rotate: function () {
          return anime.random(-180, 180);
        },

        scale: function (el, i) {
          return anime.random(10, 150) / 100;
        },
        translateY: (el, id) => {
          const rect = el.getBoundingClientRect();
          if (rect.top > window.innerHeight) {
            return (anime.random(-window.innerHeight, 0))
          }
          return (anime.random(~(window.innerHeight), window.innerHeight))
        },
        translateX: (el, id) => {
          const rect = el.getBoundingClientRect();
          if (rect.left > window.innerWidth) {
            return (anime.random(-window.innerWidth, 0))
          }

          return (anime.random(~(window.innerWidth), window.innerWidth))
        },
 
      });

      timeline.add({
        targets: '.blow-bar',
        translateY: anime.random(~(window.innerHeight), window.innerHeight),
        translateX: anime.random(~(window.innerWidth), window.innerWidth),
        
      });


      // timeline.add({
      //   targets: '.blow-bar',
      //   translateY: [-500, window.innerHeight/2-150],
      //   easing: "easeInOutQuad",
      //   delay: speed
      // });

    }
 
    setTimeout(shot, 1000)
  }


  render() {

    return (
      <div className="blow">
        {shape.map((el, id) => (
          <>
            {[...Array(multi)].map((sub, id) => (
              <div style={{ backgroundColor: el.color }} className="blow-bar" />
            ))}
          </>
        ))}

      </div >
    )
  }
}
