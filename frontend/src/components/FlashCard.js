import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import "../flashcard.css";

const Flashcard = ({ front, back, onDelete, onEdit, category }) => {
  const [flipped, setFlipped] = useState(false);

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  const handleFlip = () => setFlipped(!flipped);

  return (
    <div className="flashcard-container mx-2 card">
      <div className="row justify-content-center px-4" onClick={handleFlip}>
        {/* Front Side */}
        <animated.div
          className="flashcard front card"
          style={{ opacity: opacity.to((o) => 1 - o), transform }}
        >
          {front}
          <span className="badge bg-success my-4">{category}</span>
        </animated.div>

        {/* Back Side */}
        <animated.div
          className="flashcard back card"
          style={{
            opacity,
            transform: transform.to((t) => `${t} rotateY(180deg)`),
          }}
        >
          {back}

          <span className="badge bg-danger my-4">{category}</span>
        </animated.div>
      </div>

      <div className="flashcard-controls d-flex">
        <button className="btn btn-primary mx-1" onClick={onEdit}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
